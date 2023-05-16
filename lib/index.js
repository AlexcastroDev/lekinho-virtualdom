function createElement(tag, props, children, key) {
    return {
      tag,
      props,
      children,
      key
    };
  }

  function telinha(element, container) {
    if (typeof element === 'string') {
      const textNode = document.createTextNode(element);
      container.appendChild(textNode);
      return;
    }
    const { tag, props, children } = element;
    const domElement = document.createElement(tag);
  
    for (let propName in props) {
      domElement[propName] = props[propName];
    }
  
    if (Array.isArray(children)) {
      children.forEach(child => telinha(child, domElement));
    }

    if (!Array.isArray(children)) {
      domElement['innerHTML'] = children || '';
    }
  
    container.appendChild(domElement);
  }
  
  function diff(oldElement, newElement) {
    if (oldElement.tag !== newElement.tag) {
      return true;
    }
  
    const oldProps = oldElement.props;
    const newProps = newElement.props;
  
    // Check if any prop value has changed
    for (let propName in newProps) {
      if (oldProps[propName] !== newProps[propName]) {
        return true;
      }
    }
  
    // Check if any prop has been removed
    for (let propName in oldProps) {
      if (!(propName in newProps)) {
        return true;
      }
    }
  
    // Check if the number of children has changed
    if (oldElement.children.length !== newElement.children.length) {
      return true;
    }
  
    // Check if any child element has changed
    for (let i = 0; i < newElement.children.length; i++) {
      if (diff(oldElement.children[i], newElement.children[i])) {
        return true;
      }
    }
  
    return false;
  }

  function update(element, newElement, container) {
    if (!element) {
      // If no previous element, simply render the new element
      telinha(newElement, container);
    } else if (!newElement) {
      // If no new element, remove the previous element from the DOM
      container.removeChild(element);
    } else if (diff(element, newElement)) {
      // If there are differences, update the element in the DOM
      container.removeChild(element);
      telinha(newElement, container);
    }
  }
  