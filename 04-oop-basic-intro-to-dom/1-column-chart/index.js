export default class ColumnChart {
  chartHeight = 50;

  constructor({data = [], label = '', link = '', value = '', formatHeading = data => `${data}`} = {}) {
    this.data = data;
    this.label = label;
    this.link = link;
    this.value = value;
    this.formatHeading = formatHeading;
    this.render();
  }

  getColumns() {
    const maxValue = Math.max(...this.data);
    const scale = this.chartHeight / maxValue;

    return this.data.map(item => {
      const value = String(Math.floor(item * scale));
      const percent = (item / maxValue * 100).toFixed(0) + '%';
      const columnProps = `style="--value: ${value}" data-tooltip="${percent}"`;
      return `<div ${columnProps}></div>`;
    }).join('');
  }
  checkDataLength() {
    if (this.data.length === 0) {
      return `column-chart_loading`;
    } else {
      return '';
    }
  }
  getTemplate() {

      return `<div class="column-chart ${this.checkDataLength()}" style="--chart-height: ${this.chartHeight}">
                <div class="column-chart__title">
                   ${this.label}
                <a href="${this.link}" class="column-chart__link">View all</a>
               </div>
              <div class="column-chart__container">
                <div data-element="header" class="column-chart__header">${this.formatHeading(this.value)}</div>
                <div data-element="body" class="column-chart__chart">
                  ${this.getColumns()}
                </div>
              </div>
            </div>`;
  }

  render() {
    const element = document.createElement("div"); // (*)
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;
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
  }
}
