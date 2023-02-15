import { Component } from "../core/core";
import aboutStore from '../store/about'

export default class TheFooter extends Component {
  constructor(){
    super({
      tagName: 'footer'
    })
  }
  render() {
    const { blog, repository } = aboutStore.state
    this.el.innerHTML = /* html */`
      <div>
        <a href="${repository}">GitHub Repository</a>
      </div>
      <div>
        <a href="${blog}">
          ${new Date().getFullYear()}
          DogKaeBi
        </a>
      </div>
    `
  }
}