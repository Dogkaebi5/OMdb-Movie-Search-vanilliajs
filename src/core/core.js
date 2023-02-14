// Component
export class Component {
  constructor(payload = {}) {
    const { 
      tagName = 'div', //상속자 태그
      state = {}, //상속자 상태
      props = {} //상속자 데이터
    } = payload
    this.el = document.createElement( tagName ) //태그 선택자
    this.state = state
    this.props = props
    this.render()
  }
  render() {
  }
}


// Router
function routeRender(routes) {
  if (!location.hash) {                   //주소 해시 없을 시 자동으로 
    history.replaceState(null, '', '/#/')   //홈페이지 이동 및 히스토리(뒤로가기) 생성하지 않음
  } 

  const routerView = document.querySelector('router-view')
  const [hash, queryString = ''] = location.hash.split('?') //링크 쿼리 분리

  const query = queryString
    .split('&')
    .reduce((acc, cur) => {
      const [key, value] = cur.split('=')
      acc[key] = value
      return acc
    }, {})
  history.replaceState(query, '') //(상태, 제목)

  const currentRoute = routes.find(route => new RegExp(`${route.path}/?$`).test(hash))
  routerView.innerHTML = ''
  routerView.append(new currentRoute.component().el)
  console.log(currentRoute)

  window.scrollTo(0, 0)
}

export function createRouter(routes) {
  return function () {
    window.addEventListener('popstate', () => {
      routeRender(routes)
    })
    routeRender(routes)
  }
}

// Store
export class Store {
  constructor(state) {
    this.state = {} 
    this.observers = {}
    for (const key in state) {//state객체, key키값, state[key]값
      // console.log(state[key])
      // console.log(this.observers)
      Object.defineProperty(this.state, key, {
        get: () => state[key],
        set: val => {
          state[key] = val
          if (Array.isArray(this.observers[key])) {
            this.observers[key].forEach(observer => observer(val))
          }
        }
      })
    }
  }

  subscribe(key, cb) {
    Array.isArray(this.observers[key])
      ? this.observers[key].push(cb)
      : this.observers[key] = [cb]
  }
}