// Component
interface ComponentPayload {
  tagName?: string
  props?: {
    [key: string]: unknown
  }
  state?: {
    [key: string]: unknown
  }
}

export class Component {
  public el
  public props
  public state
  constructor(payload:ComponentPayload = {}) {
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
interface Route {
  path: string
  component: typeof Component
}
type Routes = Route[]

function routeRender(routes: Routes) {
  if (!location.hash) {                   //주소 해시 없을 시 자동으로 
    history.replaceState(null, '', '/#/')   //홈페이지 이동 및 히스토리(뒤로가기) 생성하지 않음
  } 

  const routerView = document.querySelector('router-view')
  const [hash, queryString = ''] = location.hash.split('?') //링크 쿼리 분리

  interface Query{
    [key: string]:string
  }
  const query = queryString
    .split('&')
    .reduce((acc, cur) => {
      const [key, value] = cur.split('=')
      acc[key] = value
      return acc
    }, {} as Query)
  history.replaceState(query, '') //(상태, 제목)

  const currentRoute = routes
  .find(route => new RegExp(`${route.path}/?$`).test(hash))
  if(routerView){
    routerView.innerHTML = ''
    currentRoute && routerView.append(new currentRoute.component().el)
  }
  // console.log(currentRoute)

  window.scrollTo(0, 0)
}

export function createRouter(routes: Routes) {
  return function () {
    window.addEventListener('popstate', () => {
      routeRender(routes)
    })
    routeRender(routes)
  }
}

// Store
interface StoreObservers{
  [key: string]: SubscribeCallback[]
}
interface SubscribeCallback{
  (arg: unknown): void
}

export class Store<S> {
  public state = {} as S
  private observers = {} as StoreObservers
  constructor(state: S) {
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

  subscribe(key: string, cb: SubscribeCallback) {
    Array.isArray(this.observers[key])
      ? this.observers[key].push(cb)
      : this.observers[key] = [cb]
  }
}