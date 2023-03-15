export default class SortableTable {
  subElements = {};

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.sortedData = data.slice();
    this.render();
  }

  createHeaderCells() {
    return this.headerConfig.map(item => {
      return `
      <div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}">
      ${item.title}</div>`;
    });
  }

  createHeader() {
    return `
      <div data-element="header" class="sortable-table__header sortable-table__row">
      ${this.createHeaderCells().join('')}</div>`;
  }

  createBodyRows() {
    let content = '';
    const rowHTML = this.sortedData.map(row => {
      const cellsHTML = this.headerConfig.map(cell => {
        content = cell.template ? cell.template(row[cell.id]) : row[cell.id];
        return `<div class="sortable-table__cell">${content}</div>`;
      }).join('');
      return `<a href="/${row.id}" class="sortable-table__row">${cellsHTML}</a>`;
    }).join('');

    return `
      <div data-element="body" class="sortable-table__body">
        ${rowHTML}
      </div>`;

  }

  createBody() {
    return this.createBodyRows();
  }

  createProductsContainer() {
    return `
      <div data-element="productsContainer" class="products-list__container">
      <div class="sortable-table">
      ${this.createHeader()}
      ${this.createBody()}
      </div>
      </div>
    `;
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.createProductsContainer();

    this.element = element.firstElementChild;
  }

  getSubElements() {
    const subElements = {};
    const elements = document.querySelectorAll("[data-element]");
    for (const element of elements) {
      const name = element.dataset.element;
      subElements[name] = element;
    }
    return subElements;
  }

  sort(fieldValue = '', orderValue = 1) {
    const wrapper = document.createElement('div');
    if (this.subElements) {
      this.subElements = this.getSubElements();
    }
    this.sortedData = [...this.sortedData].sort(this.compareFields(fieldValue, orderValue));
    wrapper.innerHTML = this.createBody();
    this.subElements.body.innerHTML = wrapper.firstElementChild.innerHTML;
  }

  compareFields(fieldValue = '', orderValue = 'asc') {
    const directions = {
      asc: 1,
      desc: -1
    }
    const direction = directions[orderValue];
    return (a, b) => {
      const valueA = a[fieldValue];
      const valueB = b[fieldValue];
      if (typeof valueA === 'number' && !isNaN(valueA)) {
        return (valueA - valueB) * direction;
      } else {
        return direction * valueA.localeCompare(valueB,
          ['ru-Ru','en-En'],
          { caseFirst: 'upper' }
        );
      }
    }
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    // NOTE: удаляем обработчики событий, если они есть
  }

}

