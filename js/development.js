'use strict';

(function() {
  class EditableList extends HTMLElement {
    constructor() {
      // Always call super first in constructor to establish prototype chain
      super()

      // attaches shadow tree and returns shadow root reference
      // https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow
      const shadow = this.attachShadow({ mode: 'open' })

      // creating a container for the editable-list component
      const editableListContainer = document.createElement('div')

      // get attribute values from getters
      const heading = this.heading
      const addItemText = this.addItemText
      const listItems = this.items

      // adding a class to our container for the sake of clarity
      editableListContainer.classList.add('todoComponentWrapper', 'hello')

      // creating the inner HTML of the editable list element
      editableListContainer.innerHTML = `
        <style>
          :host {
            // border: 10px solid red;
          }

          .todoHeading {
            color: var(--listHeadingCol);
          }

          .todoListWrapper {
            padding: var(--listWrapperPadding);
            margin: var(--listWrapperMargin);
            border: var(--listWrapperBorder);
            border-radius: var(--listWrapperRadius);
            box-shadow: var(--listWrapperShadow);
            background: var(--listWrapperBg);

          }

          .todoListItem {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 5px;

            & + .todoListItem {
              border-top: 1px solid red;
            }
          }

          .todoListItemBtn {
            font-size: var(--listIconSize);
            cursor: pointer;
            background-color: var(--listIconBgCol);
            border: var(--listIconBorder);
          }
        </style>

        <h3 class="todoHeading">${heading}</h3>
        <ul class="todoListWrapper">
          ${listItems.map(item => `
            <li class="todoListItem">${item}
              <button class="todoListItemBtnRemove todoListItemBtn">&ominus;</button>
            </li>
          `).join('')}
        </ul>
        <slot></slot>
        <div class="todoListItem tdlAddInputWrapper">
          <label>${addItemText}</label>
          <input class="todoListItemAddInput" type="text">
          <button class="todoListItemBtnAdd todoListItemBtn">&oplus;</button>
        </div>
      `;



      // binding methods
      this.addListItem = this.addListItem.bind(this)
      this.handleRemoveItemListeners = this.handleRemoveItemListeners.bind(this)
      this.removeListItem = this.removeListItem.bind(this)

      // appending the container to the shadow DOM
      shadow.appendChild(editableListContainer)
    }

    // add items to the list
    addListItem(e) {
      const textInput = this.shadowRoot.querySelector('.todoListItemAddInput')

      if (textInput.value) {
        const listItem = document.createElement('li')
        listItem.classList.add('todoListItem');
        const button = document.createElement('button')
        const childrenLength = this.itemList.children.length

        listItem.textContent = textInput.value
        button.classList.add('todoListItemBtnRemove', 'todoListItemBtn')
        button.innerHTML = '&ominus;'

        this.itemList.appendChild(listItem)
        this.itemList.children[childrenLength].appendChild(button)

        this.handleRemoveItemListeners([button])

        textInput.value = ''
      }
    }

    // fires after the element has been attached to the DOM
    connectedCallback() {
      const removeElementButtons = [...this.shadowRoot.querySelectorAll('.todoListItemBtnRemove')]
      const addElementButton = this.shadowRoot.querySelector('.todoListItemBtnAdd')

      this.itemList = this.shadowRoot.querySelector('.todoListWrapper')

      this.handleRemoveItemListeners(removeElementButtons)
      addElementButton.addEventListener('click', this.addListItem, false)
    }

    // gathering data from element attributes
    get heading() {
      return this.getAttribute('heading') || ''
    }

    get items() {
      const items = [];

      [...this.attributes].forEach(attr => {
        if (attr.name.includes('list-item')) {
          items.push(attr.value)
        }
      })

      return items
    }

    get addItemText() {
      return this.getAttribute('add-item-text') || ''
    }

    handleRemoveItemListeners(arrayOfElements) {
      arrayOfElements.forEach(element => {
        element.addEventListener('click', this.removeListItem, false)
      })
    }

    removeListItem(e) {
      e.target.parentNode.remove()
    }
  }

  // let the browser know about the custom element
  customElements.define('editable-list', EditableList)
})()