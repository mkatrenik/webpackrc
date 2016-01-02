declare function require(path: string): Object;

const styles = require('./styles.css')

class PrinterService {
  protected app:Element;

  constructor(private msg:string) {
    this.app = document.querySelector('#app')
  }

  log() {
    this.app.textContent = this.msg
    console.log('>>>', styles)
    this.app.className = styles['red']
  }
}

(new PrinterService('foo')).log()
