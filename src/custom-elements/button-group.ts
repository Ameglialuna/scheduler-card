import { LitElement, html, customElement, css, property } from 'lit-element';
import { PrettyPrintIcon, PrettyPrintName } from '../helpers';

type ButtonItem = {
  id?: string | number,
  name: string,
  icon?: string
}

@customElement('button-group')
export class VariableSlider extends LitElement {

  @property({ type: Array })
  items: (ButtonItem | string | number)[] = [];

  @property()
  value?: string | number | null | (string | number)[];

  @property({ type: Number })
  min?: number;

  @property({ type: Boolean })
  optional?: boolean;

  render() {
    if (!this.items.length) {
      return html`
        <div class="text-field">
          <slot></slot>
        </div>
      `;
    }

    return this.items.map(e => this.createButton(e));
  }

  createButton(item: (ButtonItem | string | number)) {
    let selection = Array.isArray(this.value) ? this.value : [this.value];
    if (typeof item != "object") item = { name: String(item) };
    let value = item.id !== undefined ? item.id : item.name;

    return html`
      <mwc-button class="${selection.includes(value) ? "active" : ""}" @click="${() => this.selectItem(value)}">
        ${item.icon ? html`<ha-icon icon="${PrettyPrintIcon(item.icon)}" class="padded-right"></ha-icon>` : ''}
        ${PrettyPrintName(item.name)}
      </mwc-button>
    `;
  }

  selectItem(val: string | number) {
    if (!Array.isArray(this.value)) {
      if (val == this.value) {
        if (this.optional) this.value = null;
        else return;
      }
      else this.value = val;
    }
    else {
      let value: (string | number)[] = Array.isArray(this.value) ? this.value : [];
      if (value.includes(val)) {
        if (this.min !== undefined && value.length <= this.min) return;
        value = value.filter(e => e != val);
      }
      else value.push(val);
      this.value = value;
    }
    let myEvent = new CustomEvent("change");
    this.dispatchEvent(myEvent);
  }

  static styles = css`

      div.text-field {
        color: var(--disabled-text-color);
      }

      mwc-button {
        margin: 2px 0px;
      }

      mwc-button.active {
        background: var(--primary-color);
        --mdc-theme-primary: var(--text-primary-color);
        border-radius: 4px;
      }
      
      mwc-button ha-icon {
        margin-right: 11px;
      }
      

  `;
}
