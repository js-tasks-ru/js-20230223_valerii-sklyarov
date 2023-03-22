class Tooltip {
  element;
  tooltipText = '';

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }
    Tooltip.instance = this;
    this.createElement();
    this.showTooltip = this.showTooltip.bind(this);
    this.hideTooltip = this.hideTooltip.bind(this);
  }

  getTemplate() {
    return `<div class="tooltip">${this.tooltipText}</div>`;
  }

  createElement() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTemplate();
    this.element = wrapper.firstElementChild;
  }

  render(text) {
    this.element.textContent = text;
    document.body.appendChild(this.element);

  }
  moveTooltip = (event) => {
    this.element.style.left = `${Math.round(event.clientX + 50)}px`;
    this.element.style.top = `${Math.round(event.clientY + 10)}px`;
  }
  showTooltip(event) {
    if (!event.target.dataset.tooltip) {
      return;
    }
    this.initialize();
    this.render(event.target.dataset.tooltip);
    this.element.style.left = `${Math.round(event.clientX + 50)}px`;
    this.element.style.top = `${Math.round(event.clientY + 10)}px`;
    document.addEventListener('pointermove', this.moveTooltip);

  }

  hideTooltip() {
    this.remove();
  }

  initialize() {
    document.addEventListener('pointerover', this.showTooltip);
    document.addEventListener('pointerout', this.hideTooltip);
  }

  removeEventListeners() {
    document.removeEventListener('pointermove', this.moveTooltip);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.removeEventListeners();
    this.remove();
  }
}

export default Tooltip;
