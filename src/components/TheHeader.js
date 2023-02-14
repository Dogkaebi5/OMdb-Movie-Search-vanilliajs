import { Component } from "../core/core";

export default class TheHeader extends Component{
  constructor(){
    super({
      tagName: 'header',
      state: {
        menus: [
          {
            name:'Search',
            href:'#/'
          },
          {
            name:'Movie',
            href:'#/movie?id='
          },
          {
            name:'About',
            href:'#/about'
          }
        ]
      }
    })
    window.addEventListener('popstate', () => {
      this.render()
    })
  }

  render() {
    this.el.innerHTML = /* html */ `
      <a href="#/" class="logo"><span>OMdbAPI</span>.com</a>
      <nav>
        <ul>
          ${this.state.menus.map(menu => {
            const href = menu.href.split('?')[0]
            const hash = location.hash.split('?')[0]
            const isActive = href === hash
            return /* html */`
              <li><a class="${isActive ? 'active' : ''}" href="${menu.href}">${menu.name}</a></li>`
          }).join('')}
        </ul>
      </nav>
      <a href="#/about" class="user"><img alt="User" src="https://lh3.googleusercontent.com/ogw/AAEL6shyzmVgX820oq1OJIXY6SOZ-45Eq77Vc8Xi-X_Usg=s32-c-mo"/></a>
    `
  }
}