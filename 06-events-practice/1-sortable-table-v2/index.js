export default class SortableTable {
  constructor(headersConfig = [], {
    data = [],
    sorted = {}
  } = {}) {
    this.headersConfig = headersConfig;
    this.data = data;
    this.sortedData = data.slice();
    this.sorted = sorted;

    this.render();
  }

  createHeaderCells() {
    return [...this.headersConfig].map(item => {
      const order = this.sorted.id === item.id ? this.sorted.order : 'asc';
      return `
      <div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}" data-order="${order}">
      <span>${item.title}</span>
      ${this.getHeaderSortingArrow(item.id)}
      </div>`;
    });
  }

  getHeaderSortingArrow(id) {
    const isOrderExist = this.sorted.id === id ? this.sorted.order : '';

    return isOrderExist
      ? `<span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>`
      : ``;
  }

  createHeader() {
    return `
      <div data-element="header" class="sortable-table__header sortable-table__row">
      ${this.createHeaderCells().join('')}</div>`;
  }

  createBodyRows() {
    let content = '';
    const rowHTML = [...this.sortedData].map(row => {
      const cellsHTML = this.headersConfig.map(cell => {
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

  onClickSort = (event) => {
    const column = event.target.closest('[data-sortable="true"]');

    const toggleOrder = order => {
      const orders = {
        asc: 'desc',
        desc: 'asc'
      };
      return orders[order];
    };

    if (column) {
      const {id, order} = column.dataset;
      const newOrder = toggleOrder(order);
      this.sort(id, newOrder);
      const arrow = column.querySelector('.sortable-table__sort-arrow');
      column.dataset.order = newOrder;

      if(!arrow) {
        column.append(this.subElements.arrow);
      }
    }
  };

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.createProductsContainer();

    this.element = element.firstElementChild;
      this.subElements = this.getSubElements();
    this.initEventListeners();
  }
  initEventListeners() {
    this.subElements.header.addEventListener('pointerdown', this.onClickSort);
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

  sort(fieldValue = '', orderValue = 'asc') {
    const wrapper = document.createElement('div');
    this.sortedData = [...this.sortedData].sort(this.compareFields(fieldValue, orderValue));
    wrapper.innerHTML = this.createBody();
    this.subElements.body.innerHTML = wrapper.firstElementChild.innerHTML;
  }

  compareFields(fieldValue = '', orderValue = 'asc') {
    const directions = {
      asc: 1,
      desc: -1
    };
    const direction = directions[orderValue];
    return (a, b) => {
      const valueA = a[fieldValue];
      const valueB = b[fieldValue];
      if (typeof valueA === 'number' && !isNaN(valueA)) {
        return (valueA - valueB) * direction;
      } else {
        return direction * valueA.localeCompare(valueB,
          ['ru-Ru', 'en-En'],
          {caseFirst: 'upper'}
        );
      }
    };
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    // NOTE: удаляем обработчики событий, если они есть
  }

}
