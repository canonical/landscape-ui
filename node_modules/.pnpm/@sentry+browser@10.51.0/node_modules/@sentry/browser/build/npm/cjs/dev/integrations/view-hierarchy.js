Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const core = require('@sentry/core');
const helpers = require('../helpers.js');

/**
 * An integration to include a view hierarchy attachment which contains the DOM.
 */
const viewHierarchyIntegration = core.defineIntegration((options = {}) => {
  const skipHtmlTags = ['script'];

  /** Walk an element */
  function walk(element, windows, depth = 0) {
    if (!element) {
      return;
    }

    // With Web Components, we need to walk into shadow DOMs
    const children = 'shadowRoot' in element && element.shadowRoot ? element.shadowRoot.children : element.children;

    for (const child of children) {
      if (!(child instanceof HTMLElement)) {
        continue;
      }

      const componentName = core.getComponentName(child, 1) || undefined;
      const tagName = child.tagName.toLowerCase();

      if (skipHtmlTags.includes(tagName)) {
        continue;
      }

      const result = options.onElement?.({ element: child, componentName, tagName, depth }) || {};

      if (result === 'skip') {
        continue;
      }

      // Skip this element but include its children
      if (result === 'children') {
        walk(child, windows, depth + 1);
        continue;
      }

      const { x, y, width, height } = child.getBoundingClientRect();

      const window = {
        identifier: (child.id || undefined) ,
        type: componentName || tagName,
        visible: true,
        alpha: 1,
        height,
        width,
        x,
        y,
        ...result,
      };

      const children = [];
      window.children = children;

      // Recursively walk the children
      walk(child, window.children, depth + 1);

      windows.push(window);
    }
  }

  return {
    name: 'ViewHierarchy',
    processEvent: (event, hint) => {
      // only capture for error events
      if (event.type !== undefined || options.shouldAttach?.(event, hint) === false) {
        return event;
      }

      const root = {
        rendering_system: 'DOM',
        positioning: 'absolute',
        windows: [],
      };

      walk(options.rootElement?.() || helpers.WINDOW.document.body, root.windows);

      const attachment = {
        filename: 'view-hierarchy.json',
        attachmentType: 'event.view_hierarchy',
        contentType: 'application/json',
        data: JSON.stringify(root),
      };

      hint.attachments = hint.attachments || [];
      hint.attachments.push(attachment);

      return event;
    },
  };
});

exports.viewHierarchyIntegration = viewHierarchyIntegration;
//# sourceMappingURL=view-hierarchy.js.map
