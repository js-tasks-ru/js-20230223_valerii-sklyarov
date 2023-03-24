import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
  chartHeight = 50;
  subElements;

  constructor({
    data = [],
    label = '',
    link = '',
    value = '',
    formatHeading = data => `${data}`,
    url = '',
    range = {
      from: new Date(),
      to: new Date()
    }
  } = {}) {
    this.data = data;
    this.label = label;
    this.link = link;
    this.value = value;
    this.url = new URL(url, BACKEND_URL);
    this.range = range;
    this.formatHeading = formatHeading;
    this.render();
    this.update(this.range.from, this.range.to);
  }

  async loadData(from, to) {
    this.url.searchParams.set('from', from)
    this.url.searchParams.set('to', to)
    const response = await fetchJson(this.url);
    this.data = Object.values(response);

    return response;
  }

  getColumns(data = this.data) {
    data = Object.values(data);
    const maxValue = Math.max(...data);
    const scale = this.chartHeight / maxValue;

    return this.data.map(item => {
      const value = String(Math.floor(item * scale));
      const percent = (item / maxValue * 100).toFixed(0) + '%';
      const columnProps = `style="--value: ${value}" data-tooltip="${percent}"`;
      return `<div ${columnProps}></div>`;
    }).join('');
  }

  checkDataLength(data = this.data) {
    if (data.length === 0) {
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

  getSubElements() {
    const subElements = {};
    const elements = this.element.querySelectorAll("[data-element]");
    for (const element of elements) {
      const name = element.dataset.element;
      subElements[name] = element;
    }
    return subElements;
  }

  render() {
    const element = document.createElement("div"); // (*)
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;
    if (!this.subElements) {
      this.subElements = this.getSubElements();
    }
  }


  async update(from, to) {
    const data = await this.loadData(from.toISOString(), to.toISOString());
    if (!this.checkDataLength(Object.values(data))) {
      this.element.classList.remove('column-chart_loading')
    }
    this.subElements.body.innerHTML = this.getColumns(data);
    return data;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
