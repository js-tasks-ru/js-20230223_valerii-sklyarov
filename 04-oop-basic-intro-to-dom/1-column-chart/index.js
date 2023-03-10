export default class ColumnChart {
  constructor({data = [], label = '', link, value,formatHeading = data => `${data}`} = {}) {
    this.chartHeight = 50;
    this.data = data;
    this.label = label;
    this.link = link;
    this.value = value;
    this.formatHeading = formatHeading;
    this.render();
    this.initEventListeners();
    this.test();
  }

  getTemplate() {
    if (this.data.length === 0) {
      return `<div class="column-chart column-chart_loading" style="--chart-height: 50">
      <div class="column-chart__title">
        ${this.label}
        <a class="column-chart__link" href="#">View all</a>
      </div>
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">${this.formatHeading(this.value)}</div>
        <div data-element="body" class="column-chart__chart">
        </div>
      </div>
    </div>`;
    }

    const maxValue = Math.max(...this.data);
    const scale = this.chartHeight / maxValue;

    const columns = this.data.map(item => {
      const value = String(Math.floor(item * scale));
      const percent = (item / maxValue * 100).toFixed(0) + '%';
      const columnProps = `style="--value: ${value}" data-tooltip="${percent}"`;
      return `<div ${columnProps}></div>`;
    }).join('');

    return `<div class="column-chart" style="--chart-height: 50">
    <div class="column-chart__title">
      ${this.label}
      <a href="${this.link}" class="column-chart__link">View all</a>
    </div>
    <div class="column-chart__container">
      <div data-element="header" class="column-chart__header">${this.formatHeading(this.value)}</div>
      <div data-element="body" class="column-chart__chart">
        ${columns}
      </div>
    </div>
  </div>`;
  }

  render() {
    const element = document.createElement("div"); // (*)
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;
  }

  initEventListeners() {
    // NOTE: в данном методе добавляем обработчики событий, если они есть
  }
  update(newData) {
    this.data = newData;
    this.render();
  }
  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    // NOTE: удаляем обработчики событий, если они есть
  }


  test() {
    const chart = this.element.querySelector('.column-chart__chart');

    // console.log(chart.children[1])
    // console.log(window.getComputedStyle(chart))
    // console.log(window.getComputedStyle(chart.children[1]))
    // console.log(window.getComputedStyle(chart.children[1]).getPropertyValue('--value'))
  }
}
