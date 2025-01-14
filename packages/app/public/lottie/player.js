!(function (t, e) {
  'object' == typeof exports && 'undefined' != typeof module
    ? e(exports)
    : 'function' == typeof define && define.amd
      ? define(['exports'], e)
      : e(
          ((t = 'undefined' != typeof globalThis ? globalThis : t || self)[
            'dotlottie-player'
          ] = {})
        );
})(this, function (exports) {
  'use strict';
  function _taggedTemplateLiteral(t, e) {
    return (
      (e = e || t.slice(0)),
      Object.freeze(
        Object.defineProperties(t, { raw: { value: Object.freeze(e) } })
      )
    );
  }
  function __decorate(t, e, r, i) {
    var s,
      n = arguments.length,
      a =
        n < 3
          ? e
          : null === i
            ? (i = Object.getOwnPropertyDescriptor(e, r))
            : i;
    if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
      a = Reflect.decorate(t, e, r, i);
    else
      for (var o = t.length - 1; 0 <= o; o--)
        (s = t[o]) && (a = (n < 3 ? s(a) : 3 < n ? s(e, r, a) : s(e, r)) || a);
    return 3 < n && a && Object.defineProperty(e, r, a), a;
  }
  const isCEPolyfill =
      'undefined' != typeof window &&
      null != window.customElements &&
      void 0 !== window.customElements.polyfillWrapFlushCallback,
    removeNodes = (t, e, r = null) => {
      for (; e !== r; ) {
        const r = e.nextSibling;
        t.removeChild(e), (e = r);
      }
    },
    marker = `{{lit-${String(Math.random()).slice(2)}}}`,
    nodeMarker = `<!--${marker}-->`,
    markerRegex = new RegExp(marker + '|' + nodeMarker),
    boundAttributeSuffix = '$lit$';
  class Template {
    constructor(i, r) {
      (this.parts = []), (this.element = r);
      const s = [],
        n = [],
        a = document.createTreeWalker(r.content, 133, null, !1);
      let t = 0,
        o = -1,
        h = 0;
      for (
        var {
          strings: l,
          values: { length: e },
        } = i;
        h < e;

      ) {
        const i = a.nextNode();
        if (null !== i) {
          if ((o++, 1 === i.nodeType)) {
            if (i.hasAttributes()) {
              const r = i.attributes,
                s = r['length'];
              let e = 0;
              for (let t = 0; t < s; t++)
                endsWith(r[t].name, boundAttributeSuffix) && e++;
              for (; 0 < e--; ) {
                const r = l[h],
                  s = lastAttributeNameRegex.exec(r)[2],
                  n = s.toLowerCase() + boundAttributeSuffix,
                  a = i.getAttribute(n),
                  t = (i.removeAttribute(n), a.split(markerRegex));
                this.parts.push({
                  type: 'attribute',
                  index: o,
                  name: s,
                  strings: t,
                }),
                  (h += t.length - 1);
              }
            }
            'TEMPLATE' === i.tagName &&
              (n.push(i), (a.currentNode = i.content));
          } else if (3 === i.nodeType) {
            const r = i.data;
            if (0 <= r.indexOf(marker)) {
              const n = i.parentNode,
                a = r.split(markerRegex),
                t = a.length - 1;
              for (let r = 0; r < t; r++) {
                let t,
                  e = a[r];
                if ('' === e) t = createMarker();
                else {
                  const i = lastAttributeNameRegex.exec(e);
                  null !== i &&
                    endsWith(i[2], boundAttributeSuffix) &&
                    (e =
                      e.slice(0, i.index) +
                      i[1] +
                      i[2].slice(0, -boundAttributeSuffix.length) +
                      i[3]),
                    (t = document.createTextNode(e));
                }
                n.insertBefore(t, i),
                  this.parts.push({ type: 'node', index: ++o });
              }
              '' === a[t]
                ? (n.insertBefore(createMarker(), i), s.push(i))
                : (i.data = a[t]),
                (h += t);
            }
          } else if (8 === i.nodeType)
            if (i.data === marker) {
              const r = i.parentNode;
              (null !== i.previousSibling && o !== t) ||
                (o++, r.insertBefore(createMarker(), i)),
                (t = o),
                this.parts.push({ type: 'node', index: o }),
                null === i.nextSibling ? (i.data = '') : (s.push(i), o--),
                h++;
            } else {
              let t = -1;
              for (; -1 !== (t = i.data.indexOf(marker, t + 1)); )
                this.parts.push({ type: 'node', index: -1 }), h++;
            }
        } else a.currentNode = n.pop();
      }
      for (const i of s) i.parentNode.removeChild(i);
    }
  }
  const endsWith = (t, e) => {
      var r = t.length - e.length;
      return 0 <= r && t.slice(r) === e;
    },
    isTemplatePartActive = (t) => -1 !== t.index,
    createMarker = () => document.createComment(''),
    lastAttributeNameRegex =
      /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/,
    walkerNodeFilter = 133;
  function removeNodesFromTemplate(t, e) {
    var {
        element: { content: t },
        parts: r,
      } = t,
      i = document.createTreeWalker(t, walkerNodeFilter, null, !1);
    let s = nextActiveIndexInTemplateParts(r),
      n = r[s],
      a = -1,
      o = 0;
    var h = [];
    let l = null;
    for (; i.nextNode(); ) {
      a++;
      const t = i.currentNode;
      for (
        t.previousSibling === l && (l = null),
          null !== (l = e.has(t) && (h.push(t), null === l) ? t : l) && o++;
        void 0 !== n && n.index === a;

      )
        (n.index = null !== l ? -1 : n.index - o),
          (s = nextActiveIndexInTemplateParts(r, s)),
          (n = r[s]);
    }
    h.forEach((t) => t.parentNode.removeChild(t));
  }
  const countNodes = (t) => {
      let e = 11 === t.nodeType ? 0 : 1;
      for (
        var r = document.createTreeWalker(t, walkerNodeFilter, null, !1);
        r.nextNode();

      )
        e++;
      return e;
    },
    nextActiveIndexInTemplateParts = (e, r = -1) => {
      for (let t = r + 1; t < e.length; t++) {
        const r = e[t];
        if (isTemplatePartActive(r)) return t;
      }
      return -1;
    };
  function insertNodeIntoTemplate(t, e, r = null) {
    var {
      element: { content: t },
      parts: i,
    } = t;
    if (null == r) return t.appendChild(e);
    var s = document.createTreeWalker(t, walkerNodeFilter, null, !1);
    let n = nextActiveIndexInTemplateParts(i),
      a = 0,
      o = -1;
    for (; s.nextNode(); )
      for (
        o++,
          s.currentNode === r &&
            ((a = countNodes(e)), r.parentNode.insertBefore(e, r));
        -1 !== n && i[n].index === o;

      ) {
        if (0 < a) {
          for (; -1 !== n; )
            (i[n].index += a), (n = nextActiveIndexInTemplateParts(i, n));
          return;
        }
        n = nextActiveIndexInTemplateParts(i, n);
      }
  }
  const directives = new WeakMap(),
    isDirective = (t) => 'function' == typeof t && directives.has(t),
    noChange = {},
    nothing = {};
  class TemplateInstance {
    constructor(t, e, r) {
      (this.__parts = []),
        (this.template = t),
        (this.processor = e),
        (this.options = r);
    }
    update(t) {
      let e = 0;
      for (const r of this.__parts) void 0 !== r && r.setValue(t[e]), e++;
      for (const t of this.__parts) void 0 !== t && t.commit();
    }
    _clone() {
      const t = isCEPolyfill
          ? this.template.element.content.cloneNode(!0)
          : document.importNode(this.template.element.content, !0),
        e = [],
        r = this.template.parts,
        i = document.createTreeWalker(t, 133, null, !1);
      let s,
        n = 0,
        a = 0,
        o = i.nextNode();
      for (; n < r.length; ) {
        if (((s = r[n]), isTemplatePartActive(s))) {
          for (; a < s.index; )
            a++,
              'TEMPLATE' === o.nodeName &&
                (e.push(o), (i.currentNode = o.content)),
              null === (o = i.nextNode()) &&
                ((i.currentNode = e.pop()), (o = i.nextNode()));
          if ('node' === s.type) {
            const t = this.processor.handleTextExpression(this.options);
            t.insertAfterNode(o.previousSibling), this.__parts.push(t);
          } else
            this.__parts.push(
              ...this.processor.handleAttributeExpressions(
                o,
                s.name,
                s.strings,
                this.options
              )
            );
        } else this.__parts.push(void 0);
        n++;
      }
      return (
        isCEPolyfill && (document.adoptNode(t), customElements.upgrade(t)), t
      );
    }
  }
  const commentMarker = ` ${marker} `;
  class TemplateResult {
    constructor(t, e, r, i) {
      (this.strings = t),
        (this.values = e),
        (this.type = r),
        (this.processor = i);
    }
    getHTML() {
      const e = this.strings.length - 1;
      let r = '',
        i = !1;
      for (let t = 0; t < e; t++) {
        const e = this.strings[t],
          n = e.lastIndexOf('\x3c!--');
        i = (-1 < n || i) && -1 === e.indexOf('--\x3e', n + 1);
        var s = lastAttributeNameRegex.exec(e);
        r +=
          null === s
            ? e + (i ? commentMarker : nodeMarker)
            : e.substr(0, s.index) +
              s[1] +
              s[2] +
              boundAttributeSuffix +
              s[3] +
              marker;
      }
      return (r += this.strings[e]);
    }
    getTemplateElement() {
      var t = document.createElement('template');
      return (t.innerHTML = this.getHTML()), t;
    }
  }
  const isPrimitive = (t) =>
      null === t || !('object' == typeof t || 'function' == typeof t),
    isIterable = (t) => Array.isArray(t) || !(!t || !t[Symbol.iterator]);
  class AttributeCommitter {
    constructor(t, e, r) {
      (this.dirty = !0),
        (this.element = t),
        (this.name = e),
        (this.strings = r),
        (this.parts = []);
      for (let t = 0; t < r.length - 1; t++) this.parts[t] = this._createPart();
    }
    _createPart() {
      return new AttributePart(this);
    }
    _getValue() {
      const e = this.strings,
        r = e.length - 1;
      let i = '';
      for (let t = 0; t < r; t++) {
        i += e[t];
        const r = this.parts[t];
        if (void 0 !== r) {
          const e = r.value;
          if (isPrimitive(e) || !isIterable(e))
            i += 'string' == typeof e ? e : String(e);
          else for (const r of e) i += 'string' == typeof r ? r : String(r);
        }
      }
      return (i += e[r]);
    }
    commit() {
      this.dirty &&
        ((this.dirty = !1),
        this.element.setAttribute(this.name, this._getValue()));
    }
  }
  class AttributePart {
    constructor(t) {
      (this.value = void 0), (this.committer = t);
    }
    setValue(t) {
      t === noChange ||
        (isPrimitive(t) && t === this.value) ||
        ((this.value = t), isDirective(t)) ||
        (this.committer.dirty = !0);
    }
    commit() {
      for (; isDirective(this.value); ) {
        var t = this.value;
        (this.value = noChange), t(this);
      }
      this.value !== noChange && this.committer.commit();
    }
  }
  class NodePart {
    constructor(t) {
      (this.value = void 0), (this.__pendingValue = void 0), (this.options = t);
    }
    appendInto(t) {
      (this.startNode = t.appendChild(createMarker())),
        (this.endNode = t.appendChild(createMarker()));
    }
    insertAfterNode(t) {
      (this.startNode = t), (this.endNode = t.nextSibling);
    }
    appendIntoPart(t) {
      t.__insert((this.startNode = createMarker())),
        t.__insert((this.endNode = createMarker()));
    }
    insertAfterPart(t) {
      t.__insert((this.startNode = createMarker())),
        (this.endNode = t.endNode),
        (t.endNode = this.startNode);
    }
    setValue(t) {
      this.__pendingValue = t;
    }
    commit() {
      if (null !== this.startNode.parentNode) {
        for (; isDirective(this.__pendingValue); ) {
          const t = this.__pendingValue;
          (this.__pendingValue = noChange), t(this);
        }
        const t = this.__pendingValue;
        t !== noChange &&
          (isPrimitive(t)
            ? t !== this.value && this.__commitText(t)
            : t instanceof TemplateResult
              ? this.__commitTemplateResult(t)
              : t instanceof Node
                ? this.__commitNode(t)
                : isIterable(t)
                  ? this.__commitIterable(t)
                  : t === nothing
                    ? ((this.value = nothing), this.clear())
                    : this.__commitText(t));
      }
    }
    __insert(t) {
      this.endNode.parentNode.insertBefore(t, this.endNode);
    }
    __commitNode(t) {
      this.value !== t && (this.clear(), this.__insert(t), (this.value = t));
    }
    __commitText(t) {
      var e = this.startNode.nextSibling,
        r = 'string' == typeof (t = null == t ? '' : t) ? t : String(t);
      e === this.endNode.previousSibling && 3 === e.nodeType
        ? (e.data = r)
        : this.__commitNode(document.createTextNode(r)),
        (this.value = t);
    }
    __commitTemplateResult(t) {
      var e,
        r = this.options.templateFactory(t);
      this.value instanceof TemplateInstance && this.value.template === r
        ? this.value.update(t.values)
        : ((e = (r = new TemplateInstance(
            r,
            t.processor,
            this.options
          ))._clone()),
          r.update(t.values),
          this.__commitNode(e),
          (this.value = r));
    }
    __commitIterable(t) {
      Array.isArray(this.value) || ((this.value = []), this.clear());
      var e = this.value;
      let r,
        i = 0;
      for (const s of t)
        (r = e[i]),
          void 0 === r &&
            ((r = new NodePart(this.options)),
            e.push(r),
            0 === i ? r.appendIntoPart(this) : r.insertAfterPart(e[i - 1])),
          r.setValue(s),
          r.commit(),
          i++;
      i < e.length && ((e.length = i), this.clear(r && r.endNode));
    }
    clear(t = this.startNode) {
      removeNodes(this.startNode.parentNode, t.nextSibling, this.endNode);
    }
  }
  class BooleanAttributePart {
    constructor(t, e, r) {
      if (
        ((this.value = void 0),
        (this.__pendingValue = void 0),
        2 !== r.length || '' !== r[0] || '' !== r[1])
      )
        throw new Error(
          'Boolean attributes can only contain a single expression'
        );
      (this.element = t), (this.name = e), (this.strings = r);
    }
    setValue(t) {
      this.__pendingValue = t;
    }
    commit() {
      for (; isDirective(this.__pendingValue); ) {
        const t = this.__pendingValue;
        (this.__pendingValue = noChange), t(this);
      }
      if (this.__pendingValue !== noChange) {
        const t = !!this.__pendingValue;
        this.value !== t &&
          (t
            ? this.element.setAttribute(this.name, '')
            : this.element.removeAttribute(this.name),
          (this.value = t)),
          (this.__pendingValue = noChange);
      }
    }
  }
  class PropertyCommitter extends AttributeCommitter {
    constructor(t, e, r) {
      super(t, e, r),
        (this.single = 2 === r.length && '' === r[0] && '' === r[1]);
    }
    _createPart() {
      return new PropertyPart(this);
    }
    _getValue() {
      return this.single ? this.parts[0].value : super._getValue();
    }
    commit() {
      this.dirty &&
        ((this.dirty = !1), (this.element[this.name] = this._getValue()));
    }
  }
  class PropertyPart extends AttributePart {}
  let eventOptionsSupported = !1;
  (() => {
    try {
      var t = {
        get capture() {
          return !(eventOptionsSupported = !0);
        },
      };
      window.addEventListener('test', t, t),
        window.removeEventListener('test', t, t);
    } catch (t) {}
  })();
  class EventPart {
    constructor(t, e, r) {
      (this.value = void 0),
        (this.__pendingValue = void 0),
        (this.element = t),
        (this.eventName = e),
        (this.eventContext = r),
        (this.__boundHandleEvent = (t) => this.handleEvent(t));
    }
    setValue(t) {
      this.__pendingValue = t;
    }
    commit() {
      for (; isDirective(this.__pendingValue); ) {
        const t = this.__pendingValue;
        (this.__pendingValue = noChange), t(this);
      }
      if (this.__pendingValue !== noChange) {
        const t = this.__pendingValue,
          e = this.value,
          r =
            null == t ||
            (null != e &&
              (t.capture !== e.capture ||
                t.once !== e.once ||
                t.passive !== e.passive)),
          i = null != t && (null == e || r);
        r &&
          this.element.removeEventListener(
            this.eventName,
            this.__boundHandleEvent,
            this.__options
          ),
          i &&
            ((this.__options = getOptions(t)),
            this.element.addEventListener(
              this.eventName,
              this.__boundHandleEvent,
              this.__options
            )),
          (this.value = t),
          (this.__pendingValue = noChange);
      }
    }
    handleEvent(t) {
      'function' == typeof this.value
        ? this.value.call(this.eventContext || this.element, t)
        : this.value.handleEvent(t);
    }
  }
  const getOptions = (t) =>
    t &&
    (eventOptionsSupported
      ? { capture: t.capture, passive: t.passive, once: t.once }
      : t.capture);
  function templateFactory(t) {
    let e = templateCaches.get(t.type),
      r =
        (void 0 === e &&
          ((e = { stringsArray: new WeakMap(), keyString: new Map() }),
          templateCaches.set(t.type, e)),
        e.stringsArray.get(t.strings));
    var i;
    return (
      void 0 === r &&
        ((i = t.strings.join(marker)),
        void 0 === (r = e.keyString.get(i)) &&
          ((r = new Template(t, t.getTemplateElement())),
          e.keyString.set(i, r)),
        e.stringsArray.set(t.strings, r)),
      r
    );
  }
  const templateCaches = new Map(),
    parts = new WeakMap(),
    render = (t, e, r) => {
      let i = parts.get(e);
      void 0 === i &&
        (removeNodes(e, e.firstChild),
        parts.set(
          e,
          (i = new NodePart(
            Object.assign({ templateFactory: templateFactory }, r)
          ))
        ),
        i.appendInto(e)),
        i.setValue(t),
        i.commit();
    };
  class DefaultTemplateProcessor {
    handleAttributeExpressions(t, e, r, i) {
      var s = e[0];
      return '.' === s
        ? new PropertyCommitter(t, e.slice(1), r).parts
        : '@' === s
          ? [new EventPart(t, e.slice(1), i.eventContext)]
          : '?' === s
            ? [new BooleanAttributePart(t, e.slice(1), r)]
            : new AttributeCommitter(t, e, r).parts;
    }
    handleTextExpression(t) {
      return new NodePart(t);
    }
  }
  const defaultTemplateProcessor = new DefaultTemplateProcessor(),
    html =
      ('undefined' != typeof window &&
        (window.litHtmlVersions || (window.litHtmlVersions = [])).push('1.2.1'),
      (t, ...e) => new TemplateResult(t, e, 'html', defaultTemplateProcessor)),
    getTemplateCacheKey = (t, e) => t + '--' + e;
  let compatibleShadyCSSVersion = !0;
  void 0 === window.ShadyCSS
    ? (compatibleShadyCSSVersion = !1)
    : void 0 === window.ShadyCSS.prepareTemplateDom &&
      (console.warn(
        'Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1.'
      ),
      (compatibleShadyCSSVersion = !1));
  const shadyTemplateFactory = (n) => (t) => {
      const e = getTemplateCacheKey(t.type, n);
      let r = templateCaches.get(e),
        i =
          (void 0 === r &&
            ((r = { stringsArray: new WeakMap(), keyString: new Map() }),
            templateCaches.set(e, r)),
          r.stringsArray.get(t.strings));
      if (void 0 === i) {
        var s = t.strings.join(marker);
        if (void 0 === (i = r.keyString.get(s))) {
          const e = t.getTemplateElement();
          compatibleShadyCSSVersion && window.ShadyCSS.prepareTemplateDom(e, n),
            (i = new Template(t, e)),
            r.keyString.set(s, i);
        }
        r.stringsArray.set(t.strings, i);
      }
      return i;
    },
    TEMPLATE_TYPES = ['html', 'svg'],
    removeStylesFromLitTemplates = (e) => {
      TEMPLATE_TYPES.forEach((t) => {
        t = templateCaches.get(getTemplateCacheKey(t, e));
        void 0 !== t &&
          t.keyString.forEach((t) => {
            const { content: e } = t['element'],
              r = new Set();
            Array.from(e.querySelectorAll('style')).forEach((t) => {
              r.add(t);
            }),
              removeNodesFromTemplate(t, r);
          });
      });
    },
    shadyRenderSet = new Set(),
    prepareTemplateStyles = (t, e, r) => {
      shadyRenderSet.add(t);
      var i = r ? r.element : document.createElement('template'),
        s = e.querySelectorAll('style'),
        n = s['length'];
      if (0 === n) window.ShadyCSS.prepareTemplateStyles(i, t);
      else {
        var a = document.createElement('style');
        for (let t = 0; t < n; t++) {
          const e = s[t];
          e.parentNode.removeChild(e), (a.textContent += e.textContent);
        }
        removeStylesFromLitTemplates(t);
        var o = i.content,
          i =
            (r
              ? insertNodeIntoTemplate(r, a, o.firstChild)
              : o.insertBefore(a, o.firstChild),
            window.ShadyCSS.prepareTemplateStyles(i, t),
            o.querySelector('style'));
        if (window.ShadyCSS.nativeShadow && null !== i)
          e.insertBefore(i.cloneNode(!0), e.firstChild);
        else if (r) {
          o.insertBefore(a, o.firstChild);
          const t = new Set();
          t.add(a), removeNodesFromTemplate(r, t);
        }
      }
    },
    render$1 = (t, e, r) => {
      if (!r || 'object' != typeof r || !r.scopeName)
        throw new Error('The `scopeName` option is required.');
      var i = r.scopeName,
        s = parts.has(e),
        n = compatibleShadyCSSVersion && 11 === e.nodeType && !!e.host,
        a = n && !shadyRenderSet.has(i),
        o = a ? document.createDocumentFragment() : e;
      if (
        (render(
          t,
          o,
          Object.assign({ templateFactory: shadyTemplateFactory(i) }, r)
        ),
        a)
      ) {
        const t = parts.get(o),
          r =
            (parts.delete(o),
            t.value instanceof TemplateInstance ? t.value.template : void 0);
        prepareTemplateStyles(i, o, r),
          removeNodes(e, e.firstChild),
          e.appendChild(o),
          parts.set(e, t);
      }
      !s && n && window.ShadyCSS.styleElement(e.host);
    };
  var _a;
  window.JSCompiler_renameProperty = (t, e) => t;
  const defaultConverter = {
      toAttribute(t, e) {
        switch (e) {
          case Boolean:
            return t ? '' : null;
          case Object:
          case Array:
            return null == t ? t : JSON.stringify(t);
        }
        return t;
      },
      fromAttribute(t, e) {
        switch (e) {
          case Boolean:
            return null !== t;
          case Number:
            return null === t ? null : Number(t);
          case Object:
          case Array:
            return JSON.parse(t);
        }
        return t;
      },
    },
    notEqual = (t, e) => e !== t && (e == e || t == t),
    defaultPropertyDeclaration = {
      attribute: !0,
      type: String,
      converter: defaultConverter,
      reflect: !1,
      hasChanged: notEqual,
    },
    STATE_HAS_UPDATED = 1,
    STATE_UPDATE_REQUESTED = 4,
    STATE_IS_REFLECTING_TO_ATTRIBUTE = 8,
    STATE_IS_REFLECTING_TO_PROPERTY = 16,
    finalized = 'finalized';
  class UpdatingElement extends HTMLElement {
    constructor() {
      super(),
        (this._updateState = 0),
        (this._instanceProperties = void 0),
        (this._updatePromise = new Promise(
          (t) => (this._enableUpdatingResolver = t)
        )),
        (this._changedProperties = new Map()),
        (this._reflectingProperties = void 0),
        this.initialize();
    }
    static get observedAttributes() {
      this.finalize();
      const r = [];
      return (
        this._classProperties.forEach((t, e) => {
          t = this._attributeNameForProperty(e, t);
          void 0 !== t && (this._attributeToPropertyMap.set(t, e), r.push(t));
        }),
        r
      );
    }
    static _ensureClassProperties() {
      var t;
      this.hasOwnProperty(
        JSCompiler_renameProperty('_classProperties', this)
      ) ||
        ((this._classProperties = new Map()),
        void 0 !== (t = Object.getPrototypeOf(this)._classProperties) &&
          t.forEach((t, e) => this._classProperties.set(e, t)));
    }
    static createProperty(t, e = defaultPropertyDeclaration) {
      var r;
      this._ensureClassProperties(),
        this._classProperties.set(t, e),
        e.noAccessor ||
          this.prototype.hasOwnProperty(t) ||
          ((r = 'symbol' == typeof t ? Symbol() : '__' + t),
          void 0 !== (r = this.getPropertyDescriptor(t, r, e)) &&
            Object.defineProperty(this.prototype, t, r));
    }
    static getPropertyDescriptor(r, i, t) {
      return {
        get() {
          return this[i];
        },
        set(t) {
          var e = this[r];
          (this[i] = t), this._requestUpdate(r, e);
        },
        configurable: !0,
        enumerable: !0,
      };
    }
    static getPropertyOptions(t) {
      return (
        (this._classProperties && this._classProperties.get(t)) ||
        defaultPropertyDeclaration
      );
    }
    static finalize() {
      const t = Object.getPrototypeOf(this);
      if (
        (t.hasOwnProperty(finalized) || t.finalize(),
        (this[finalized] = !0),
        this._ensureClassProperties(),
        (this._attributeToPropertyMap = new Map()),
        this.hasOwnProperty(JSCompiler_renameProperty('properties', this)))
      ) {
        const t = this.properties,
          e = [
            ...Object.getOwnPropertyNames(t),
            ...('function' == typeof Object.getOwnPropertySymbols
              ? Object.getOwnPropertySymbols(t)
              : []),
          ];
        for (const r of e) this.createProperty(r, t[r]);
      }
    }
    static _attributeNameForProperty(t, e) {
      e = e.attribute;
      return !1 === e
        ? void 0
        : 'string' == typeof e
          ? e
          : 'string' == typeof t
            ? t.toLowerCase()
            : void 0;
    }
    static _valueHasChanged(t, e, r = notEqual) {
      return r(t, e);
    }
    static _propertyValueFromAttribute(t, e) {
      var r = e.type,
        e = e.converter || defaultConverter,
        e = 'function' == typeof e ? e : e.fromAttribute;
      return e ? e(t, r) : t;
    }
    static _propertyValueToAttribute(t, e) {
      var r;
      if (void 0 !== e.reflect)
        return (
          (r = e.type),
          (
            ((e = e.converter) && e.toAttribute) ||
            defaultConverter.toAttribute
          )(t, r)
        );
    }
    initialize() {
      this._saveInstanceProperties(), this._requestUpdate();
    }
    _saveInstanceProperties() {
      this.constructor._classProperties.forEach((t, e) => {
        if (this.hasOwnProperty(e)) {
          const t = this[e];
          delete this[e],
            this._instanceProperties || (this._instanceProperties = new Map()),
            this._instanceProperties.set(e, t);
        }
      });
    }
    _applyInstanceProperties() {
      this._instanceProperties.forEach((t, e) => (this[e] = t)),
        (this._instanceProperties = void 0);
    }
    connectedCallback() {
      this.enableUpdating();
    }
    enableUpdating() {
      void 0 !== this._enableUpdatingResolver &&
        (this._enableUpdatingResolver(),
        (this._enableUpdatingResolver = void 0));
    }
    disconnectedCallback() {}
    attributeChangedCallback(t, e, r) {
      e !== r && this._attributeToProperty(t, r);
    }
    _propertyToAttribute(t, e, r = defaultPropertyDeclaration) {
      var i = this.constructor,
        s = i._attributeNameForProperty(t, r);
      if (void 0 !== s) {
        const t = i._propertyValueToAttribute(e, r);
        void 0 !== t &&
          ((this._updateState =
            this._updateState | STATE_IS_REFLECTING_TO_ATTRIBUTE),
          null == t ? this.removeAttribute(s) : this.setAttribute(s, t),
          (this._updateState =
            this._updateState & ~STATE_IS_REFLECTING_TO_ATTRIBUTE));
      }
    }
    _attributeToProperty(t, e) {
      if (!(this._updateState & STATE_IS_REFLECTING_TO_ATTRIBUTE)) {
        var r = this.constructor,
          i = r._attributeToPropertyMap.get(t);
        if (void 0 !== i) {
          const t = r.getPropertyOptions(i);
          (this._updateState =
            this._updateState | STATE_IS_REFLECTING_TO_PROPERTY),
            (this[i] = r._propertyValueFromAttribute(e, t)),
            (this._updateState =
              this._updateState & ~STATE_IS_REFLECTING_TO_PROPERTY);
        }
      }
    }
    _requestUpdate(t, e) {
      let r = !0;
      var i, s;
      void 0 !== t &&
        ((s = (i = this.constructor).getPropertyOptions(t)),
        i._valueHasChanged(this[t], e, s.hasChanged)
          ? (this._changedProperties.has(t) ||
              this._changedProperties.set(t, e),
            !0 !== s.reflect ||
              this._updateState & STATE_IS_REFLECTING_TO_PROPERTY ||
              (void 0 === this._reflectingProperties &&
                (this._reflectingProperties = new Map()),
              this._reflectingProperties.set(t, s)))
          : (r = !1)),
        !this._hasRequestedUpdate &&
          r &&
          (this._updatePromise = this._enqueueUpdate());
    }
    requestUpdate(t, e) {
      return this._requestUpdate(t, e), this.updateComplete;
    }
    async _enqueueUpdate() {
      this._updateState = this._updateState | STATE_UPDATE_REQUESTED;
      try {
        await this._updatePromise;
      } catch (t) {}
      var t = this.performUpdate();
      return null != t && (await t), !this._hasRequestedUpdate;
    }
    get _hasRequestedUpdate() {
      return this._updateState & STATE_UPDATE_REQUESTED;
    }
    get hasUpdated() {
      return this._updateState & STATE_HAS_UPDATED;
    }
    performUpdate() {
      this._instanceProperties && this._applyInstanceProperties();
      let t = !1;
      var e = this._changedProperties;
      try {
        (t = this.shouldUpdate(e)) ? this.update(e) : this._markUpdated();
      } catch (e) {
        throw ((t = !1), this._markUpdated(), e);
      }
      t &&
        (this._updateState & STATE_HAS_UPDATED ||
          ((this._updateState = this._updateState | STATE_HAS_UPDATED),
          this.firstUpdated(e)),
        this.updated(e));
    }
    _markUpdated() {
      (this._changedProperties = new Map()),
        (this._updateState = this._updateState & ~STATE_UPDATE_REQUESTED);
    }
    get updateComplete() {
      return this._getUpdateComplete();
    }
    _getUpdateComplete() {
      return this._updatePromise;
    }
    shouldUpdate(t) {
      return !0;
    }
    update(t) {
      void 0 !== this._reflectingProperties &&
        0 < this._reflectingProperties.size &&
        (this._reflectingProperties.forEach((t, e) =>
          this._propertyToAttribute(e, this[e], t)
        ),
        (this._reflectingProperties = void 0)),
        this._markUpdated();
    }
    updated(t) {}
    firstUpdated(t) {}
  }
  (_a = finalized), (UpdatingElement[_a] = !0);
  const legacyCustomElement = (t, e) => (window.customElements.define(t, e), e),
    standardCustomElement = (e, t) => {
      var { kind: t, elements: r } = t;
      return {
        kind: t,
        elements: r,
        finisher(t) {
          window.customElements.define(e, t);
        },
      };
    },
    customElement = (e) => (t) =>
      ('function' == typeof t ? legacyCustomElement : standardCustomElement)(
        e,
        t
      ),
    standardProperty = (e, r) =>
      'method' !== r.kind || !r.descriptor || 'value' in r.descriptor
        ? {
            kind: 'field',
            key: Symbol(),
            placement: 'own',
            descriptor: {},
            initializer() {
              'function' == typeof r.initializer &&
                (this[r.key] = r.initializer.call(this));
            },
            finisher(t) {
              t.createProperty(r.key, e);
            },
          }
        : Object.assign(Object.assign({}, r), {
            finisher(t) {
              t.createProperty(r.key, e);
            },
          }),
    legacyProperty = (t, e, r) => {
      e.constructor.createProperty(r, t);
    };
  function property(r) {
    return (t, e) =>
      void 0 !== e ? legacyProperty(r, t, e) : standardProperty(r, t);
  }
  function query(i) {
    return (t, e) => {
      var r = {
        get() {
          return this.renderRoot.querySelector(i);
        },
        enumerable: !0,
        configurable: !0,
      };
      return void 0 !== e ? legacyQuery(r, t, e) : standardQuery(r, t);
    };
  }
  const legacyQuery = (t, e, r) => {
      Object.defineProperty(e, r, t);
    },
    standardQuery = (t, e) => ({
      kind: 'method',
      placement: 'prototype',
      key: e.key,
      descriptor: t,
    }),
    supportsAdoptingStyleSheets =
      'adoptedStyleSheets' in Document.prototype &&
      'replace' in CSSStyleSheet.prototype,
    constructionToken = Symbol();
  class CSSResult {
    constructor(t, e) {
      if (e !== constructionToken)
        throw new Error(
          'CSSResult is not constructable. Use `unsafeCSS` or `css` instead.'
        );
      this.cssText = t;
    }
    get styleSheet() {
      return (
        void 0 === this._styleSheet &&
          (supportsAdoptingStyleSheets
            ? ((this._styleSheet = new CSSStyleSheet()),
              this._styleSheet.replaceSync(this.cssText))
            : (this._styleSheet = null)),
        this._styleSheet
      );
    }
    toString() {
      return this.cssText;
    }
  }
  const textFromCSSResult = (t) => {
      if (t instanceof CSSResult) return t.cssText;
      if ('number' == typeof t) return t;
      throw new Error(`Value passed to 'css' function must be a 'css' function result: ${t}. Use 'unsafeCSS' to pass non-literal values, but
            take care to ensure page security.`);
    },
    css = (i, ...t) => {
      t = t.reduce((t, e, r) => t + textFromCSSResult(e) + i[r + 1], i[0]);
      return new CSSResult(t, constructionToken);
    },
    renderNotImplemented =
      ((window.litElementVersions || (window.litElementVersions = [])).push(
        '2.3.1'
      ),
      {});
  class LitElement extends UpdatingElement {
    static getStyles() {
      return this.styles;
    }
    static _getUniqueStyles() {
      if (!this.hasOwnProperty(JSCompiler_renameProperty('_styles', this))) {
        var t = this.getStyles();
        if (void 0 === t) this._styles = [];
        else if (Array.isArray(t)) {
          const r = (t, e) =>
              t.reduceRight(
                (t, e) => (Array.isArray(e) ? r(e, t) : (t.add(e), t)),
                e
              ),
            e = r(t, new Set()),
            i = [];
          e.forEach((t) => i.unshift(t)), (this._styles = i);
        } else this._styles = [t];
      }
    }
    initialize() {
      super.initialize(),
        this.constructor._getUniqueStyles(),
        (this.renderRoot = this.createRenderRoot()),
        window.ShadowRoot &&
          this.renderRoot instanceof window.ShadowRoot &&
          this.adoptStyles();
    }
    createRenderRoot() {
      return this.attachShadow({ mode: 'open' });
    }
    adoptStyles() {
      var t = this.constructor._styles;
      0 !== t.length &&
        (void 0 === window.ShadyCSS || window.ShadyCSS.nativeShadow
          ? supportsAdoptingStyleSheets
            ? (this.renderRoot.adoptedStyleSheets = t.map((t) => t.styleSheet))
            : (this._needsShimAdoptedStyleSheets = !0)
          : window.ShadyCSS.ScopingShim.prepareAdoptedCssText(
              t.map((t) => t.cssText),
              this.localName
            ));
    }
    connectedCallback() {
      super.connectedCallback(),
        this.hasUpdated &&
          void 0 !== window.ShadyCSS &&
          window.ShadyCSS.styleElement(this);
    }
    update(t) {
      var e = this.render();
      super.update(t),
        e !== renderNotImplemented &&
          this.constructor.render(e, this.renderRoot, {
            scopeName: this.localName,
            eventContext: this,
          }),
        this._needsShimAdoptedStyleSheets &&
          ((this._needsShimAdoptedStyleSheets = !1),
          this.constructor._styles.forEach((t) => {
            var e = document.createElement('style');
            (e.textContent = t.cssText), this.renderRoot.appendChild(e);
          }));
    }
    render() {
      return renderNotImplemented;
    }
  }
  (LitElement.finalized = !0), (LitElement.render = render$1);
  var commonjsGlobal =
    'undefined' != typeof globalThis
      ? globalThis
      : 'undefined' != typeof window
        ? window
        : 'undefined' != typeof global
          ? global
          : 'undefined' != typeof self
            ? self
            : {};
  function createCommonjsModule(t, e, r) {
    return (
      t(
        (r = {
          path: e,
          exports: {},
          require: function (t, e) {
            return commonjsRequire(t, null == e ? r.path : e);
          },
        }),
        r.exports
      ),
      r.exports
    );
  }
  function commonjsRequire() {
    throw new Error(
      'Dynamic requires are not currently supported by @rollup/plugin-commonjs'
    );
  }
  var lottie_svg = createCommonjsModule(function (module) {
      'undefined' != typeof navigator &&
        (function (t, e) {
          module.exports
            ? (module.exports = e(t))
            : ((t.lottie = e(t)), (t.bodymovin = t.lottie));
        })(window || {}, function (window) {
          var svgNS = 'http://www.w3.org/2000/svg',
            locationHref = '',
            initialDefaultFrame = -999999,
            subframeEnabled = !0,
            expressionsPlugin,
            isSafari = /^((?!chrome|android).)*safari/i.test(
              navigator.userAgent
            ),
            bm_pow = Math.pow,
            bm_sqrt = Math.sqrt,
            bm_floor = Math.floor,
            bm_min = Math.min,
            BMMath = {};
          function ProjectInterface() {
            return {};
          }
          !(function () {
            for (
              var t = [
                  'abs',
                  'acos',
                  'acosh',
                  'asin',
                  'asinh',
                  'atan',
                  'atanh',
                  'atan2',
                  'ceil',
                  'cbrt',
                  'expm1',
                  'clz32',
                  'cos',
                  'cosh',
                  'exp',
                  'floor',
                  'fround',
                  'hypot',
                  'imul',
                  'log',
                  'log1p',
                  'log2',
                  'log10',
                  'max',
                  'min',
                  'pow',
                  'random',
                  'round',
                  'sign',
                  'sin',
                  'sinh',
                  'sqrt',
                  'tan',
                  'tanh',
                  'trunc',
                  'E',
                  'LN10',
                  'LN2',
                  'LOG10E',
                  'LOG2E',
                  'PI',
                  'SQRT1_2',
                  'SQRT2',
                ],
                e = t.length,
                r = 0;
              r < e;
              r += 1
            )
              BMMath[t[r]] = Math[t[r]];
          })(),
            (BMMath.random = Math.random),
            (BMMath.abs = function (t) {
              if ('object' == typeof t && t.length) {
                for (
                  var e = createSizedArray(t.length), r = t.length, i = 0;
                  i < r;
                  i += 1
                )
                  e[i] = Math.abs(t[i]);
                return e;
              }
              return Math.abs(t);
            });
          var defaultCurveSegments = 150,
            degToRads = Math.PI / 180,
            roundCorner = 0.5519;
          function BMEnterFrameEvent(t, e, r, i) {
            (this.type = t),
              (this.currentTime = e),
              (this.totalTime = r),
              (this.direction = i < 0 ? -1 : 1);
          }
          function BMCompleteEvent(t, e) {
            (this.type = t), (this.direction = e < 0 ? -1 : 1);
          }
          function BMCompleteLoopEvent(t, e, r, i) {
            (this.type = t),
              (this.currentLoop = r),
              (this.totalLoops = e),
              (this.direction = i < 0 ? -1 : 1);
          }
          function BMSegmentStartEvent(t, e, r) {
            (this.type = t), (this.firstFrame = e), (this.totalFrames = r);
          }
          function BMDestroyEvent(t, e) {
            (this.type = t), (this.target = e);
          }
          function BMRenderFrameErrorEvent(t, e) {
            (this.type = 'renderFrameError'),
              (this.nativeError = t),
              (this.currentTime = e);
          }
          function BMConfigErrorEvent(t) {
            (this.type = 'configError'), (this.nativeError = t);
          }
          var createElementID =
              ((_count = 0),
              function () {
                return '__lottie_element_' + ++_count;
              }),
            _count;
          function HSVtoRGB(t, e, r) {
            var i,
              s,
              n,
              a,
              o = r * (1 - e),
              h = r * (1 - (a = 6 * t - (t = Math.floor(6 * t))) * e),
              l = r * (1 - (1 - a) * e);
            switch (t % 6) {
              case 0:
                (i = r), (s = l), (n = o);
                break;
              case 1:
                (i = h), (s = r), (n = o);
                break;
              case 2:
                (i = o), (s = r), (n = l);
                break;
              case 3:
                (i = o), (s = h), (n = r);
                break;
              case 4:
                (i = l), (s = o), (n = r);
                break;
              case 5:
                (i = r), (s = o), (n = h);
            }
            return [i, s, n];
          }
          function RGBtoHSV(t, e, r) {
            var i,
              s = Math.max(t, e, r),
              n = Math.min(t, e, r),
              a = s - n,
              o = 0 === s ? 0 : a / s,
              h = s / 255;
            switch (s) {
              case n:
                i = 0;
                break;
              case t:
                (i = e - r + a * (e < r ? 6 : 0)), (i /= 6 * a);
                break;
              case e:
                (i = r - t + 2 * a), (i /= 6 * a);
                break;
              case r:
                (i = t - e + 4 * a), (i /= 6 * a);
            }
            return [i, o, h];
          }
          function addSaturationToRGB(t, e) {
            t = RGBtoHSV(255 * t[0], 255 * t[1], 255 * t[2]);
            return (
              (t[1] += e),
              1 < t[1] ? (t[1] = 1) : t[1] <= 0 && (t[1] = 0),
              HSVtoRGB(t[0], t[1], t[2])
            );
          }
          function addBrightnessToRGB(t, e) {
            t = RGBtoHSV(255 * t[0], 255 * t[1], 255 * t[2]);
            return (
              (t[2] += e),
              1 < t[2] ? (t[2] = 1) : t[2] < 0 && (t[2] = 0),
              HSVtoRGB(t[0], t[1], t[2])
            );
          }
          function addHueToRGB(t, e) {
            t = RGBtoHSV(255 * t[0], 255 * t[1], 255 * t[2]);
            return (
              (t[0] += e / 360),
              1 < t[0] ? --t[0] : t[0] < 0 && (t[0] += 1),
              HSVtoRGB(t[0], t[1], t[2])
            );
          }
          var rgbToHex = (function () {
            for (var t, i = [], e = 0; e < 256; e += 1)
              (t = e.toString(16)), (i[e] = 1 == t.length ? '0' + t : t);
            return function (t, e, r) {
              return (
                '#' +
                i[(t = t < 0 ? 0 : t)] +
                i[(e = e < 0 ? 0 : e)] +
                i[(r = r < 0 ? 0 : r)]
              );
            };
          })();
          function BaseEvent() {}
          BaseEvent.prototype = {
            triggerEvent: function (t, e) {
              if (this._cbs[t])
                for (var r = this._cbs[t].length, i = 0; i < r; i++)
                  this._cbs[t][i](e);
            },
            addEventListener: function (t, e) {
              return (
                this._cbs[t] || (this._cbs[t] = []),
                this._cbs[t].push(e),
                function () {
                  this.removeEventListener(t, e);
                }.bind(this)
              );
            },
            removeEventListener: function (t, e) {
              if (e) {
                if (this._cbs[t]) {
                  for (var r = 0, i = this._cbs[t].length; r < i; )
                    this._cbs[t][r] === e &&
                      (this._cbs[t].splice(r, 1), --r, --i),
                      (r += 1);
                  this._cbs[t].length || (this._cbs[t] = null);
                }
              } else this._cbs[t] = null;
            },
          };
          var createTypedArray =
            'function' == typeof Uint8ClampedArray &&
            'function' == typeof Float32Array
              ? function (t, e) {
                  return 'float32' === t
                    ? new Float32Array(e)
                    : 'int16' === t
                      ? new Int16Array(e)
                      : 'uint8c' === t
                        ? new Uint8ClampedArray(e)
                        : void 0;
                }
              : function (t, e) {
                  var r,
                    i = 0,
                    s = [];
                  switch (t) {
                    case 'int16':
                    case 'uint8c':
                      r = 1;
                      break;
                    default:
                      r = 1.1;
                  }
                  for (i = 0; i < e; i += 1) s.push(r);
                  return s;
                };
          function createSizedArray(t) {
            return Array.apply(null, { length: t });
          }
          function createNS(t) {
            return document.createElementNS(svgNS, t);
          }
          function createTag(t) {
            return document.createElement(t);
          }
          function DynamicPropertyContainer() {}
          DynamicPropertyContainer.prototype = {
            addDynamicProperty: function (t) {
              -1 === this.dynamicProperties.indexOf(t) &&
                (this.dynamicProperties.push(t),
                this.container.addDynamicProperty(this),
                (this._isAnimated = !0));
            },
            iterateDynamicProperties: function () {
              this._mdf = !1;
              for (var t = this.dynamicProperties.length, e = 0; e < t; e += 1)
                this.dynamicProperties[e].getValue(),
                  this.dynamicProperties[e]._mdf && (this._mdf = !0);
            },
            initDynamicPropertyContainer: function (t) {
              (this.container = t),
                (this.dynamicProperties = []),
                (this._mdf = !1),
                (this._isAnimated = !1);
            },
          };
          var getBlendMode =
              ((blendModeEnums = {
                0: 'source-over',
                1: 'multiply',
                2: 'screen',
                3: 'overlay',
                4: 'darken',
                5: 'lighten',
                6: 'color-dodge',
                7: 'color-burn',
                8: 'hard-light',
                9: 'soft-light',
                10: 'difference',
                11: 'exclusion',
                12: 'hue',
                13: 'saturation',
                14: 'color',
                15: 'luminosity',
              }),
              function (t) {
                return blendModeEnums[t] || '';
              }),
            blendModeEnums,
            Matrix = (function () {
              var i = Math.cos,
                s = Math.sin,
                n = Math.tan,
                a = Math.round;
              function t() {
                return (
                  (this.props[0] = 1),
                  (this.props[1] = 0),
                  (this.props[2] = 0),
                  (this.props[3] = 0),
                  (this.props[4] = 0),
                  (this.props[5] = 1),
                  (this.props[6] = 0),
                  (this.props[7] = 0),
                  (this.props[8] = 0),
                  (this.props[9] = 0),
                  (this.props[10] = 1),
                  (this.props[11] = 0),
                  (this.props[12] = 0),
                  (this.props[13] = 0),
                  (this.props[14] = 0),
                  (this.props[15] = 1),
                  this
                );
              }
              function e(t) {
                var e;
                return 0 === t
                  ? this
                  : ((e = i(t)),
                    (t = s(t)),
                    this._t(e, -t, 0, 0, t, e, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1));
              }
              function r(t) {
                var e;
                return 0 === t
                  ? this
                  : ((e = i(t)),
                    (t = s(t)),
                    this._t(1, 0, 0, 0, 0, e, -t, 0, 0, t, e, 0, 0, 0, 0, 1));
              }
              function o(t) {
                var e;
                return 0 === t
                  ? this
                  : ((e = i(t)),
                    (t = s(t)),
                    this._t(e, 0, t, 0, 0, 1, 0, 0, -t, 0, e, 0, 0, 0, 0, 1));
              }
              function h(t) {
                var e;
                return 0 === t
                  ? this
                  : ((e = i(t)),
                    (t = s(t)),
                    this._t(e, -t, 0, 0, t, e, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1));
              }
              function l(t, e) {
                return this._t(1, e, t, 1, 0, 0);
              }
              function p(t, e) {
                return this.shear(n(t), n(e));
              }
              function c(t, e) {
                var r = i(e),
                  e = s(e);
                return this._t(r, e, 0, 0, -e, r, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
                  ._t(1, 0, 0, 0, n(t), 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
                  ._t(r, -e, 0, 0, e, r, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
              }
              function f(t, e, r) {
                return (
                  r || 0 === r || (r = 1),
                  1 === t && 1 === e && 1 === r
                    ? this
                    : this._t(t, 0, 0, 0, 0, e, 0, 0, 0, 0, r, 0, 0, 0, 0, 1)
                );
              }
              function d(t, e, r, i, s, n, a, o, h, l, p, c, f, d, u, m) {
                return (
                  (this.props[0] = t),
                  (this.props[1] = e),
                  (this.props[2] = r),
                  (this.props[3] = i),
                  (this.props[4] = s),
                  (this.props[5] = n),
                  (this.props[6] = a),
                  (this.props[7] = o),
                  (this.props[8] = h),
                  (this.props[9] = l),
                  (this.props[10] = p),
                  (this.props[11] = c),
                  (this.props[12] = f),
                  (this.props[13] = d),
                  (this.props[14] = u),
                  (this.props[15] = m),
                  this
                );
              }
              function u(t, e, r) {
                return (
                  (r = r || 0),
                  0 !== t || 0 !== e || 0 !== r
                    ? this._t(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, t, e, r, 1)
                    : this
                );
              }
              function m(t, e, r, i, s, n, a, o, h, l, p, c, f, d, u, m) {
                var y,
                  g,
                  v,
                  _,
                  b,
                  S,
                  P,
                  x,
                  k,
                  E,
                  w,
                  A,
                  T,
                  C,
                  I,
                  F,
                  M = this.props;
                return (
                  1 === t &&
                  0 === e &&
                  0 === r &&
                  0 === i &&
                  0 === s &&
                  1 === n &&
                  0 === a &&
                  0 === o &&
                  0 === h &&
                  0 === l &&
                  1 === p &&
                  0 === c
                    ? ((M[12] = M[12] * t + M[15] * f),
                      (M[13] = M[13] * n + M[15] * d),
                      (M[14] = M[14] * p + M[15] * u),
                      (M[15] = M[15] * m),
                      (this._identityCalculated = !1))
                    : ((y = M[0]),
                      (g = M[1]),
                      (v = M[2]),
                      (_ = M[3]),
                      (b = M[4]),
                      (S = M[5]),
                      (P = M[6]),
                      (x = M[7]),
                      (k = M[8]),
                      (E = M[9]),
                      (w = M[10]),
                      (A = M[11]),
                      (T = M[12]),
                      (C = M[13]),
                      (I = M[14]),
                      (F = M[15]),
                      (M[0] = y * t + g * s + v * h + _ * f),
                      (M[1] = y * e + g * n + v * l + _ * d),
                      (M[2] = y * r + g * a + v * p + _ * u),
                      (M[3] = y * i + g * o + v * c + _ * m),
                      (M[4] = b * t + S * s + P * h + x * f),
                      (M[5] = b * e + S * n + P * l + x * d),
                      (M[6] = b * r + S * a + P * p + x * u),
                      (M[7] = b * i + S * o + P * c + x * m),
                      (M[8] = k * t + E * s + w * h + A * f),
                      (M[9] = k * e + E * n + w * l + A * d),
                      (M[10] = k * r + E * a + w * p + A * u),
                      (M[11] = k * i + E * o + w * c + A * m),
                      (M[12] = T * t + C * s + I * h + F * f),
                      (M[13] = T * e + C * n + I * l + F * d),
                      (M[14] = T * r + C * a + I * p + F * u),
                      (M[15] = T * i + C * o + I * c + F * m),
                      (this._identityCalculated = !1)),
                  this
                );
              }
              function y() {
                return (
                  this._identityCalculated ||
                    ((this._identity = !(
                      1 !== this.props[0] ||
                      0 !== this.props[1] ||
                      0 !== this.props[2] ||
                      0 !== this.props[3] ||
                      0 !== this.props[4] ||
                      1 !== this.props[5] ||
                      0 !== this.props[6] ||
                      0 !== this.props[7] ||
                      0 !== this.props[8] ||
                      0 !== this.props[9] ||
                      1 !== this.props[10] ||
                      0 !== this.props[11] ||
                      0 !== this.props[12] ||
                      0 !== this.props[13] ||
                      0 !== this.props[14] ||
                      1 !== this.props[15]
                    )),
                    (this._identityCalculated = !0)),
                  this._identity
                );
              }
              function g(t) {
                for (var e = 0; e < 16; ) {
                  if (t.props[e] !== this.props[e]) return !1;
                  e += 1;
                }
                return !0;
              }
              function v(t) {
                for (var e = 0; e < 16; e += 1) t.props[e] = this.props[e];
              }
              function _(t) {
                for (var e = 0; e < 16; e += 1) this.props[e] = t[e];
              }
              function b(t, e, r) {
                return {
                  x:
                    t * this.props[0] +
                    e * this.props[4] +
                    r * this.props[8] +
                    this.props[12],
                  y:
                    t * this.props[1] +
                    e * this.props[5] +
                    r * this.props[9] +
                    this.props[13],
                  z:
                    t * this.props[2] +
                    e * this.props[6] +
                    r * this.props[10] +
                    this.props[14],
                };
              }
              function S(t, e, r) {
                return (
                  t * this.props[0] +
                  e * this.props[4] +
                  r * this.props[8] +
                  this.props[12]
                );
              }
              function P(t, e, r) {
                return (
                  t * this.props[1] +
                  e * this.props[5] +
                  r * this.props[9] +
                  this.props[13]
                );
              }
              function x(t, e, r) {
                return (
                  t * this.props[2] +
                  e * this.props[6] +
                  r * this.props[10] +
                  this.props[14]
                );
              }
              function k() {
                var t =
                    this.props[0] * this.props[5] -
                    this.props[1] * this.props[4],
                  e = this.props[5] / t,
                  r = -this.props[1] / t,
                  i = -this.props[4] / t,
                  s = this.props[0] / t,
                  n =
                    (this.props[4] * this.props[13] -
                      this.props[5] * this.props[12]) /
                    t,
                  t =
                    -(
                      this.props[0] * this.props[13] -
                      this.props[1] * this.props[12]
                    ) / t,
                  a = new Matrix();
                return (
                  (a.props[0] = e),
                  (a.props[1] = r),
                  (a.props[4] = i),
                  (a.props[5] = s),
                  (a.props[12] = n),
                  (a.props[13] = t),
                  a
                );
              }
              function E(t) {
                return this.getInverseMatrix().applyToPointArray(
                  t[0],
                  t[1],
                  t[2] || 0
                );
              }
              function w(t) {
                for (var e = t.length, r = [], i = 0; i < e; i += 1)
                  r[i] = E(t[i]);
                return r;
              }
              function A(t, e, r) {
                var i,
                  s,
                  n,
                  a,
                  o,
                  h,
                  l = createTypedArray('float32', 6);
                return (
                  this.isIdentity()
                    ? ((l[0] = t[0]),
                      (l[1] = t[1]),
                      (l[2] = e[0]),
                      (l[3] = e[1]),
                      (l[4] = r[0]),
                      (l[5] = r[1]))
                    : ((i = this.props[0]),
                      (s = this.props[1]),
                      (n = this.props[4]),
                      (a = this.props[5]),
                      (o = this.props[12]),
                      (h = this.props[13]),
                      (l[0] = t[0] * i + t[1] * n + o),
                      (l[1] = t[0] * s + t[1] * a + h),
                      (l[2] = e[0] * i + e[1] * n + o),
                      (l[3] = e[0] * s + e[1] * a + h),
                      (l[4] = r[0] * i + r[1] * n + o),
                      (l[5] = r[0] * s + r[1] * a + h)),
                  l
                );
              }
              function T(t, e, r) {
                return this.isIdentity()
                  ? [t, e, r]
                  : [
                      t * this.props[0] +
                        e * this.props[4] +
                        r * this.props[8] +
                        this.props[12],
                      t * this.props[1] +
                        e * this.props[5] +
                        r * this.props[9] +
                        this.props[13],
                      t * this.props[2] +
                        e * this.props[6] +
                        r * this.props[10] +
                        this.props[14],
                    ];
              }
              function C(t, e) {
                var r;
                return this.isIdentity()
                  ? t + ',' + e
                  : ((r = this.props),
                    Math.round(100 * (t * r[0] + e * r[4] + r[12])) / 100 +
                      ',' +
                      Math.round(100 * (t * r[1] + e * r[5] + r[13])) / 100);
              }
              function I() {
                for (var t = 0, e = this.props, r = 'matrix3d('; t < 16; )
                  (r = r + a(1e4 * e[t]) / 1e4 + (15 === t ? ')' : ',')),
                    (t += 1);
                return r;
              }
              function F(t) {
                return (t < 1e-6 && 0 < t) || (-1e-6 < t && t < 0)
                  ? a(1e4 * t) / 1e4
                  : t;
              }
              function M() {
                var t = this.props;
                return (
                  'matrix(' +
                  F(t[0]) +
                  ',' +
                  F(t[1]) +
                  ',' +
                  F(t[4]) +
                  ',' +
                  F(t[5]) +
                  ',' +
                  F(t[12]) +
                  ',' +
                  F(t[13]) +
                  ')'
                );
              }
              return function () {
                (this.reset = t),
                  (this.rotate = e),
                  (this.rotateX = r),
                  (this.rotateY = o),
                  (this.rotateZ = h),
                  (this.skew = p),
                  (this.skewFromAxis = c),
                  (this.shear = l),
                  (this.scale = f),
                  (this.setTransform = d),
                  (this.translate = u),
                  (this.transform = m),
                  (this.applyToPoint = b),
                  (this.applyToX = S),
                  (this.applyToY = P),
                  (this.applyToZ = x),
                  (this.applyToPointArray = T),
                  (this.applyToTriplePoints = A),
                  (this.applyToPointStringified = C),
                  (this.toCSS = I),
                  (this.to2dCSS = M),
                  (this.clone = v),
                  (this.cloneFromProps = _),
                  (this.equals = g),
                  (this.inversePoints = w),
                  (this.inversePoint = E),
                  (this.getInverseMatrix = k),
                  (this._t = this.transform),
                  (this.isIdentity = y),
                  (this._identity = !0),
                  (this._identityCalculated = !1),
                  (this.props = createTypedArray('float32', 16)),
                  this.reset();
              };
            })(),
            BezierFactory =
              (!(function (a, o) {
                var h = this,
                  l = o.pow(256, 6),
                  p = o.pow(2, 52),
                  c = 2 * p;
                function f(t) {
                  var e,
                    r = t.length,
                    a = this,
                    i = 0,
                    s = (a.i = a.j = 0),
                    n = (a.S = []);
                  for (r || (t = [r++]); i < 256; ) n[i] = i++;
                  for (i = 0; i < 256; i++)
                    (n[i] = n[(s = 255 & (s + t[i % r] + (e = n[i])))]),
                      (n[s] = e);
                  a.g = function (t) {
                    for (var e, r = 0, i = a.i, s = a.j, n = a.S; t--; )
                      (e = n[(i = 255 & (i + 1))]),
                        (r =
                          256 * r +
                          n[
                            255 & ((n[i] = n[(s = 255 & (s + e))]) + (n[s] = e))
                          ]);
                    return (a.i = i), (a.j = s), r;
                  };
                }
                function d(t, e) {
                  return (e.i = t.i), (e.j = t.j), (e.S = t.S.slice()), e;
                }
                function u(t, e) {
                  for (var r, i = t + '', s = 0; s < i.length; )
                    e[255 & s] =
                      255 & ((r ^= 19 * e[255 & s]) + i.charCodeAt(s++));
                  return m(e);
                }
                function m(t) {
                  return String.fromCharCode.apply(0, t);
                }
                (o.seedrandom = function (t, e, r) {
                  function i() {
                    for (var t = n.g(6), e = l, r = 0; t < p; )
                      (t = 256 * (t + r)), (e *= 256), (r = n.g(1));
                    for (; c <= t; ) (t /= 2), (e /= 2), (r >>>= 1);
                    return (t + r) / e;
                  }
                  var s = [],
                    t = u(
                      (function t(e, r) {
                        var i,
                          s = [],
                          n = typeof e;
                        if (r && 'object' == n)
                          for (i in e)
                            try {
                              s.push(t(e[i], r - 1));
                            } catch (t) {}
                        return s.length ? s : 'string' == n ? e : e + '\0';
                      })(
                        (e = !0 === e ? { entropy: !0 } : e || {}).entropy
                          ? [t, m(a)]
                          : null === t
                            ? (function () {
                                try {
                                  var t = new Uint8Array(256);
                                  return (
                                    (h.crypto || h.msCrypto).getRandomValues(t),
                                    m(t)
                                  );
                                } catch (t) {
                                  var e = h.navigator,
                                    e = e && e.plugins;
                                  return [+new Date(), h, e, h.screen, m(a)];
                                }
                              })()
                            : t,
                        3
                      ),
                      s
                    ),
                    n = new f(s);
                  return (
                    (i.int32 = function () {
                      return 0 | n.g(4);
                    }),
                    (i.quick = function () {
                      return n.g(4) / 4294967296;
                    }),
                    (i.double = i),
                    u(m(n.S), a),
                    (
                      e.pass ||
                      r ||
                      function (t, e, r, i) {
                        return (
                          i &&
                            (i.S && d(i, n),
                            (t.state = function () {
                              return d(n, {});
                            })),
                          r ? ((o.random = t), e) : t
                        );
                      }
                    )(i, t, 'global' in e ? e.global : this == o, e.state)
                  );
                }),
                  u(o.random(), a);
              })([], BMMath),
              (function () {
                var t = {
                    getBezierEasing: function (t, e, r, i, s) {
                      s =
                        s ||
                        ('bez_' + t + '_' + e + '_' + r + '_' + i).replace(
                          /\./g,
                          'p'
                        );
                      return n[s] || ((t = new a([t, e, r, i])), (n[s] = t));
                    },
                  },
                  n = {},
                  e = 'function' == typeof Float32Array;
                function i(t, e) {
                  return 1 - 3 * e + 3 * t;
                }
                function P(t, e, r) {
                  return ((i(e, r) * t + (3 * r - 6 * e)) * t + 3 * e) * t;
                }
                function x(t, e, r) {
                  return 3 * i(e, r) * t * t + 2 * (3 * r - 6 * e) * t + 3 * e;
                }
                function a(t) {
                  (this._p = t),
                    (this._mSampleValues = new (e ? Float32Array : Array)(11)),
                    (this._precomputed = !1),
                    (this.get = this.get.bind(this));
                }
                return (
                  (a.prototype = {
                    get: function (t) {
                      var e = this._p[0],
                        r = this._p[1],
                        i = this._p[2],
                        s = this._p[3];
                      return (
                        this._precomputed || this._precompute(),
                        e === r && i === s
                          ? t
                          : 0 === t
                            ? 0
                            : 1 === t
                              ? 1
                              : P(this._getTForX(t), r, s)
                      );
                    },
                    _precompute: function () {
                      var t = this._p[0],
                        e = this._p[1],
                        r = this._p[2],
                        i = this._p[3];
                      (this._precomputed = !0),
                        (t === e && r === i) || this._calcSampleValues();
                    },
                    _calcSampleValues: function () {
                      for (
                        var t = this._p[0], e = this._p[2], r = 0;
                        r < 11;
                        ++r
                      )
                        this._mSampleValues[r] = P(0.1 * r, t, e);
                    },
                    _getTForX: function (t) {
                      for (
                        var e = this._p[0],
                          r = this._p[2],
                          i = this._mSampleValues,
                          s = 0,
                          n = 1;
                        10 !== n && i[n] <= t;
                        ++n
                      )
                        s += 0.1;
                      var a = s + ((t - i[--n]) / (i[n + 1] - i[n])) * 0.1,
                        o = x(a, e, r);
                      if (0.001 <= o) {
                        for (
                          var h = t, l = a, p = e, c = r, f = 0;
                          f < 4;
                          ++f
                        ) {
                          var d = x(l, p, c);
                          if (0 === d) return l;
                          l -= (P(l, p, c) - h) / d;
                        }
                        return l;
                      }
                      if (0 === o) return a;
                      for (
                        var u,
                          m,
                          y = t,
                          g = s,
                          v = s + 0.1,
                          _ = e,
                          b = r,
                          S = 0;
                        0 < (u = P((m = g + (v - g) / 2), _, b) - y)
                          ? (v = m)
                          : (g = m),
                          1e-7 < Math.abs(u) && ++S < 10;

                      );
                      return m;
                    },
                  }),
                  t
                );
              })());
          function extendPrototype(t, e) {
            for (var r, i = t.length, s = 0; s < i; s += 1)
              for (var n in (r = t[s].prototype))
                r.hasOwnProperty(n) && (e.prototype[n] = r[n]);
          }
          function getDescriptor(t, e) {
            return Object.getOwnPropertyDescriptor(t, e);
          }
          function createProxyFunction(t) {
            function e() {}
            return (e.prototype = t), e;
          }
          function bezFunction() {
            function y(t, e, r, i, s, n) {
              s = t * i + e * s + r * n - s * i - n * t - r * e;
              return -0.001 < s && s < 0.001;
            }
            function p(t, e, r, i) {
              for (
                var s,
                  n,
                  a,
                  o,
                  h = defaultCurveSegments,
                  l = 0,
                  p = [],
                  c = [],
                  f = bezier_length_pool.newElement(),
                  d = r.length,
                  u = 0;
                u < h;
                u += 1
              ) {
                for (a = u / (h - 1), s = o = 0; s < d; s += 1)
                  (n =
                    bm_pow(1 - a, 3) * t[s] +
                    3 * bm_pow(1 - a, 2) * a * r[s] +
                    3 * (1 - a) * bm_pow(a, 2) * i[s] +
                    bm_pow(a, 3) * e[s]),
                    (p[s] = n),
                    null !== c[s] && (o += bm_pow(p[s] - c[s], 2)),
                    (c[s] = p[s]);
                o && (l += o = bm_sqrt(o)),
                  (f.percents[u] = a),
                  (f.lengths[u] = l);
              }
              return (f.addedLength = l), f;
            }
            function g(t) {
              (this.segmentLength = 0), (this.points = new Array(t));
            }
            function v(t, e) {
              (this.partialLength = t), (this.point = e);
            }
            var _;
            _ = {};
            function w(t, e) {
              var r = e.percents,
                i = e.lengths,
                s = r.length,
                n = bm_floor((s - 1) * t),
                a = t * e.addedLength,
                o = 0;
              if (n === s - 1 || 0 === n || a === i[n]) return r[n];
              for (var h = i[n] > a ? -1 : 1, l = !0; l; )
                if (
                  (i[n] <= a && i[n + 1] > a
                    ? ((o = (a - i[n]) / (i[n + 1] - i[n])), (l = !1))
                    : (n += h),
                  n < 0 || s - 1 <= n)
                ) {
                  if (n === s - 1) return r[n];
                  l = !1;
                }
              return r[n] + (r[n + 1] - r[n]) * o;
            }
            var A = createTypedArray('float32', 8);
            return {
              getSegmentsLength: function (t) {
                for (
                  var e = segments_length_pool.newElement(),
                    r = t.c,
                    i = t.v,
                    s = t.o,
                    n = t.i,
                    a = t._length,
                    o = e.lengths,
                    h = 0,
                    l = 0;
                  l < a - 1;
                  l += 1
                )
                  (o[l] = p(i[l], i[l + 1], s[l], n[l + 1])),
                    (h += o[l].addedLength);
                return (
                  r &&
                    a &&
                    ((o[l] = p(i[l], i[0], s[l], n[0])),
                    (h += o[l].addedLength)),
                  (e.totalLength = h),
                  e
                );
              },
              getNewSegment: function (t, e, r, i, s, n, a) {
                for (
                  var s = w((s = s < 0 ? 0 : 1 < s ? 1 : s), a),
                    n = w((n = 1 < n ? 1 : n), a),
                    o = t.length,
                    a = 1 - s,
                    h = 1 - n,
                    l = a * a * a,
                    p = s * a * a * 3,
                    c = s * s * a * 3,
                    f = s * s * s,
                    d = a * a * h,
                    u = s * a * h + a * s * h + a * a * n,
                    m = s * s * h + a * s * n + s * a * n,
                    y = s * s * n,
                    g = a * h * h,
                    v = s * h * h + a * n * h + a * h * n,
                    _ = s * n * h + a * n * n + s * h * n,
                    b = s * n * n,
                    S = h * h * h,
                    P = n * h * h + h * n * h + h * h * n,
                    x = n * n * h + h * n * n + n * h * n,
                    k = n * n * n,
                    E = 0;
                  E < o;
                  E += 1
                )
                  (A[4 * E] =
                    Math.round(
                      1e3 * (l * t[E] + p * r[E] + c * i[E] + f * e[E])
                    ) / 1e3),
                    (A[4 * E + 1] =
                      Math.round(
                        1e3 * (d * t[E] + u * r[E] + m * i[E] + y * e[E])
                      ) / 1e3),
                    (A[4 * E + 2] =
                      Math.round(
                        1e3 * (g * t[E] + v * r[E] + _ * i[E] + b * e[E])
                      ) / 1e3),
                    (A[4 * E + 3] =
                      Math.round(
                        1e3 * (S * t[E] + P * r[E] + x * i[E] + k * e[E])
                      ) / 1e3);
                return A;
              },
              getPointInSegment: function (t, e, r, i, s, n) {
                (s = w(s, n)), (n = 1 - s);
                return [
                  Math.round(
                    1e3 *
                      (n * n * n * t[0] +
                        (s * n * n + n * s * n + n * n * s) * r[0] +
                        (s * s * n + n * s * s + s * n * s) * i[0] +
                        s * s * s * e[0])
                  ) / 1e3,
                  Math.round(
                    1e3 *
                      (n * n * n * t[1] +
                        (s * n * n + n * s * n + n * n * s) * r[1] +
                        (s * s * n + n * s * s + s * n * s) * i[1] +
                        s * s * s * e[1])
                  ) / 1e3,
                ];
              },
              buildBezierData: function (t, e, r, i) {
                var s = (
                  t[0] +
                  '_' +
                  t[1] +
                  '_' +
                  e[0] +
                  '_' +
                  e[1] +
                  '_' +
                  r[0] +
                  '_' +
                  r[1] +
                  '_' +
                  i[0] +
                  '_' +
                  i[1]
                ).replace(/\./g, 'p');
                if (!_[s]) {
                  for (
                    var n,
                      a,
                      o,
                      h,
                      l,
                      p = defaultCurveSegments,
                      c = 0,
                      f = null,
                      d = new g(
                        (p =
                          2 === t.length &&
                          (t[0] != e[0] || t[1] != e[1]) &&
                          y(t[0], t[1], e[0], e[1], t[0] + r[0], t[1] + r[1]) &&
                          y(t[0], t[1], e[0], e[1], e[0] + i[0], e[1] + i[1])
                            ? 2
                            : p)
                      ),
                      u = r.length,
                      m = 0;
                    m < p;
                    m += 1
                  ) {
                    for (
                      l = createSizedArray(u), o = m / (p - 1), n = h = 0;
                      n < u;
                      n += 1
                    )
                      (a =
                        bm_pow(1 - o, 3) * t[n] +
                        3 * bm_pow(1 - o, 2) * o * (t[n] + r[n]) +
                        3 * (1 - o) * bm_pow(o, 2) * (e[n] + i[n]) +
                        bm_pow(o, 3) * e[n]),
                        (l[n] = a),
                        null !== f && (h += bm_pow(l[n] - f[n], 2));
                    (c += h = bm_sqrt(h)), (d.points[m] = new v(h, l)), (f = l);
                  }
                  (d.segmentLength = c), (_[s] = d);
                }
                return _[s];
              },
              pointOnLine2D: y,
              pointOnLine3D: function (t, e, r, i, s, n, a, o, h) {
                var l;
                return 0 === r && 0 === n && 0 === h
                  ? y(t, e, i, s, a, o)
                  : ((l = Math.sqrt(
                      Math.pow(i - t, 2) +
                        Math.pow(s - e, 2) +
                        Math.pow(n - r, 2)
                    )),
                    (t = Math.sqrt(
                      Math.pow(a - t, 2) +
                        Math.pow(o - e, 2) +
                        Math.pow(h - r, 2)
                    )),
                    (e = Math.sqrt(
                      Math.pow(a - i, 2) +
                        Math.pow(o - s, 2) +
                        Math.pow(h - n, 2)
                    )),
                    -1e-4 <
                      (r =
                        t < l
                          ? e < l
                            ? l - t - e
                            : e - t - l
                          : t < e
                            ? e - t - l
                            : t - l - e) && r < 1e-4);
              },
            };
          }
          !(function () {
            for (
              var n = 0, t = ['ms', 'moz', 'webkit', 'o'], e = 0;
              e < t.length && !window.requestAnimationFrame;
              ++e
            )
              (window.requestAnimationFrame =
                window[t[e] + 'RequestAnimationFrame']),
                (window.cancelAnimationFrame =
                  window[t[e] + 'CancelAnimationFrame'] ||
                  window[t[e] + 'CancelRequestAnimationFrame']);
            window.requestAnimationFrame ||
              (window.requestAnimationFrame = function (t, e) {
                var r = new Date().getTime(),
                  i = Math.max(0, 16 - (r - n)),
                  s = setTimeout(function () {
                    t(r + i);
                  }, i);
                return (n = r + i), s;
              }),
              window.cancelAnimationFrame ||
                (window.cancelAnimationFrame = function (t) {
                  clearTimeout(t);
                });
          })();
          var bez = bezFunction();
          function dataFunctionManager() {
            function c(t, e, r) {
              for (var i, s, n, a = t.length, o = 0; o < a; o += 1)
                if ('ks' in (n = t[o]) && !n.completed) {
                  if (
                    ((n.completed = !0),
                    n.tt && (t[o - 1].td = n.tt),
                    n.hasMask)
                  )
                    for (
                      var h = n.masksProperties, l = h.length, p = 0;
                      p < l;
                      p += 1
                    )
                      if (h[p].pt.k.i) f(h[p].pt.k);
                      else
                        for (s = h[p].pt.k.length, i = 0; i < s; i += 1)
                          h[p].pt.k[i].s && f(h[p].pt.k[i].s[0]),
                            h[p].pt.k[i].e && f(h[p].pt.k[i].e[0]);
                  0 === n.ty
                    ? ((n.layers = (function (t, e) {
                        for (var r = 0, i = e.length; r < i; ) {
                          if (e[r].id === t)
                            return e[r].layers.__used
                              ? JSON.parse(JSON.stringify(e[r].layers))
                              : ((e[r].layers.__used = !0), e[r].layers);
                          r += 1;
                        }
                      })(n.refId, e)),
                      c(n.layers, e))
                    : 4 === n.ty
                      ? (function t(e) {
                          var r, i, s;
                          for (r = e.length - 1; 0 <= r; --r)
                            if ('sh' == e[r].ty)
                              if (e[r].ks.k.i) f(e[r].ks.k);
                              else
                                for (s = e[r].ks.k.length, i = 0; i < s; i += 1)
                                  e[r].ks.k[i].s && f(e[r].ks.k[i].s[0]),
                                    e[r].ks.k[i].e && f(e[r].ks.k[i].e[0]);
                            else 'gr' == e[r].ty && t(e[r].it);
                        })(n.shapes)
                      : 5 == n.ty &&
                        (0 !== (n = n).t.a.length ||
                          'm' in n.t.p ||
                          (n.singleShape = !0));
                }
            }
            function f(t) {
              for (var e = t.i.length, r = 0; r < e; r += 1)
                (t.i[r][0] += t.v[r][0]),
                  (t.i[r][1] += t.v[r][1]),
                  (t.o[r][0] += t.v[r][0]),
                  (t.o[r][1] += t.v[r][1]);
            }
            function o(t, e) {
              e = e ? e.split('.') : [100, 100, 100];
              return (
                t[0] > e[0] ||
                (!(e[0] > t[0]) &&
                  (t[1] > e[1] ||
                    (!(e[1] > t[1]) && (t[2] > e[2] || (e[2], t[2], 0)))))
              );
            }
            function r(t) {
              if (t.chars && !o(h, t.v))
                for (var e, r, i, s, n = t.chars.length, a = 0; a < n; a += 1)
                  if (t.chars[a].data && t.chars[a].data.shapes)
                    for (
                      r = (s = t.chars[a].data.shapes[0].it).length, e = 0;
                      e < r;
                      e += 1
                    )
                      (i = s[e].ks.k).__converted ||
                        (f(s[e].ks.k), (i.__converted = !0));
            }
            n = [4, 4, 14];
            var h,
              i,
              s,
              n,
              a = function (t) {
                if (o(n, t.v) && (m(t.layers), t.assets))
                  for (var e = t.assets.length, r = 0; r < e; r += 1)
                    t.assets[r].layers && m(t.assets[r].layers);
              },
              l =
                ((h = [4, 7, 99]),
                (s = [4, 1, 9]),
                function (t) {
                  if (o(s, t.v) && (u(t.layers), t.assets))
                    for (var e = t.assets.length, r = 0; r < e; r += 1)
                      t.assets[r].layers && u(t.assets[r].layers);
                }),
              p =
                ((i = [4, 4, 18]),
                function (t) {
                  if (o(i, t.v) && (d(t.layers), t.assets))
                    for (var e = t.assets.length, r = 0; r < e; r += 1)
                      t.assets[r].layers && d(t.assets[r].layers);
                });
            function d(t) {
              for (var e, r, i, s = t.length, n = 0; n < s; n += 1) {
                if ((e = t[n]).hasMask)
                  for (
                    var a = e.masksProperties, o = a.length, h = 0;
                    h < o;
                    h += 1
                  )
                    if (a[h].pt.k.i) a[h].pt.k.c = a[h].cl;
                    else
                      for (i = a[h].pt.k.length, r = 0; r < i; r += 1)
                        a[h].pt.k[r].s && (a[h].pt.k[r].s[0].c = a[h].cl),
                          a[h].pt.k[r].e && (a[h].pt.k[r].e[0].c = a[h].cl);
                4 === e.ty &&
                  (function t(e) {
                    for (var r, i, s = e.length - 1; 0 <= s; --s)
                      if ('sh' == e[s].ty)
                        if (e[s].ks.k.i) e[s].ks.k.c = e[s].closed;
                        else
                          for (i = e[s].ks.k.length, r = 0; r < i; r += 1)
                            e[s].ks.k[r].s &&
                              (e[s].ks.k[r].s[0].c = e[s].closed),
                              e[s].ks.k[r].e &&
                                (e[s].ks.k[r].e[0].c = e[s].closed);
                      else 'gr' == e[s].ty && t(e[s].it);
                  })(e.shapes);
              }
            }
            function u(t) {
              for (var e = t.length, r = 0; r < e; r += 1)
                4 === t[r].ty &&
                  (function t(e) {
                    for (var r, i, s = e.length, n = 0; n < s; n += 1)
                      if ('gr' === e[n].ty) t(e[n].it);
                      else if ('fl' === e[n].ty || 'st' === e[n].ty)
                        if (e[n].c.k && e[n].c.k[0].i)
                          for (i = e[n].c.k.length, r = 0; r < i; r += 1)
                            e[n].c.k[r].s &&
                              ((e[n].c.k[r].s[0] /= 255),
                              (e[n].c.k[r].s[1] /= 255),
                              (e[n].c.k[r].s[2] /= 255),
                              (e[n].c.k[r].s[3] /= 255)),
                              e[n].c.k[r].e &&
                                ((e[n].c.k[r].e[0] /= 255),
                                (e[n].c.k[r].e[1] /= 255),
                                (e[n].c.k[r].e[2] /= 255),
                                (e[n].c.k[r].e[3] /= 255));
                        else
                          (e[n].c.k[0] /= 255),
                            (e[n].c.k[1] /= 255),
                            (e[n].c.k[2] /= 255),
                            (e[n].c.k[3] /= 255);
                  })(t[r].shapes);
            }
            function m(t) {
              for (var e, r, i = t.length, s = 0; s < i; s += 1)
                5 === t[s].ty &&
                  ((r = (e = t[s]).t.d), (e.t.d = { k: [{ s: r, t: 0 }] }));
            }
            var t = {
              completeData: function (t, e) {
                t.__complete ||
                  (l(t),
                  a(t),
                  r(t),
                  p(t),
                  c(t.layers, t.assets),
                  (t.__complete = !0));
              },
            };
            return (
              (t.checkColors = l),
              (t.checkChars = r),
              (t.checkShapes = p),
              (t.completeLayers = c),
              t
            );
          }
          var dataManager = dataFunctionManager(),
            FontManager = (function () {
              var n = { w: 0, size: 0, shapes: [] };
              function d(s, t) {
                var e = createTag('span'),
                  r = ((e.style.fontFamily = t), createTag('span')),
                  i =
                    ((r.innerHTML = 'giItT1WQy@!-/#'),
                    (e.style.position = 'absolute'),
                    (e.style.left = '-10000px'),
                    (e.style.top = '-10000px'),
                    (e.style.fontSize = '300px'),
                    (e.style.fontVariant = 'normal'),
                    (e.style.fontStyle = 'normal'),
                    (e.style.fontWeight = 'normal'),
                    (e.style.letterSpacing = '0'),
                    e.appendChild(r),
                    document.body.appendChild(e),
                    r.offsetWidth);
                return (
                  (r.style.fontFamily =
                    (function () {
                      for (
                        var t = s.split(','), e = t.length, r = [], i = 0;
                        i < e;
                        i += 1
                      )
                        'sans-serif' !== t[i] &&
                          'monospace' !== t[i] &&
                          r.push(t[i]);
                      return r.join(',');
                    })() +
                    ', ' +
                    t),
                  { node: r, w: i, parent: e }
                );
              }
              function t() {
                (this.fonts = []),
                  (this.chars = null),
                  (this.typekitLoaded = 0),
                  (this.isLoaded = !1),
                  (this.initTime = Date.now()),
                  (this.setIsLoadedBinded = this.setIsLoaded.bind(this)),
                  (this.checkLoadedFontsBinded =
                    this.checkLoadedFonts.bind(this));
              }
              var e = (e = []).concat([
                2304, 2305, 2306, 2307, 2362, 2363, 2364, 2364, 2366, 2367,
                2368, 2369, 2370, 2371, 2372, 2373, 2374, 2375, 2376, 2377,
                2378, 2379, 2380, 2381, 2382, 2383, 2387, 2388, 2389, 2390,
                2391, 2402, 2403,
              ]);
              return (
                (t.getCombinedCharacterCodes = function () {
                  return e;
                }),
                (t.prototype = {
                  addChars: function (t) {
                    if (t) {
                      this.chars || (this.chars = []);
                      for (
                        var e, r, i = t.length, s = this.chars.length, n = 0;
                        n < i;
                        n += 1
                      ) {
                        for (e = 0, r = !1; e < s; )
                          this.chars[e].style === t[n].style &&
                            this.chars[e].fFamily === t[n].fFamily &&
                            this.chars[e].ch === t[n].ch &&
                            (r = !0),
                            (e += 1);
                        r || (this.chars.push(t[n]), (s += 1));
                      }
                    }
                  },
                  addFonts: function (t, e) {
                    if (t)
                      if (this.chars)
                        (this.isLoaded = !0), (this.fonts = t.list);
                      else {
                        for (
                          var r = t.list, i = r.length, s = i, n = 0;
                          n < i;
                          n += 1
                        ) {
                          var a,
                            o,
                            h,
                            l = !0;
                          if (
                            ((r[n].loaded = !1),
                            (r[n].monoCase = d(r[n].fFamily, 'monospace')),
                            (r[n].sansCase = d(r[n].fFamily, 'sans-serif')),
                            r[n].fPath)
                          ) {
                            if ('p' === r[n].fOrigin || 3 === r[n].origin)
                              (l =
                                !(
                                  0 <
                                  (a = document.querySelectorAll(
                                    'style[f-forigin="p"][f-family="' +
                                      r[n].fFamily +
                                      '"], style[f-origin="3"][f-family="' +
                                      r[n].fFamily +
                                      '"]'
                                  )).length
                                ) && l) &&
                                ((h = createTag('style')).setAttribute(
                                  'f-forigin',
                                  r[n].fOrigin
                                ),
                                h.setAttribute('f-origin', r[n].origin),
                                h.setAttribute('f-family', r[n].fFamily),
                                (h.type = 'text/css'),
                                (h.innerHTML =
                                  '@font-face {font-family: ' +
                                  r[n].fFamily +
                                  "; font-style: normal; src: url('" +
                                  r[n].fPath +
                                  "');}"),
                                e.appendChild(h));
                            else if (
                              'g' === r[n].fOrigin ||
                              1 === r[n].origin
                            ) {
                              for (
                                a = document.querySelectorAll(
                                  'link[f-forigin="g"], link[f-origin="1"]'
                                ),
                                  o = 0;
                                o < a.length;
                                o++
                              )
                                -1 !== a[o].href.indexOf(r[n].fPath) &&
                                  (l = !1);
                              l &&
                                ((h = createTag('link')).setAttribute(
                                  'f-forigin',
                                  r[n].fOrigin
                                ),
                                h.setAttribute('f-origin', r[n].origin),
                                (h.type = 'text/css'),
                                (h.rel = 'stylesheet'),
                                (h.href = r[n].fPath),
                                document.body.appendChild(h));
                            } else if (
                              't' === r[n].fOrigin ||
                              2 === r[n].origin
                            ) {
                              for (
                                a = document.querySelectorAll(
                                  'script[f-forigin="t"], script[f-origin="2"]'
                                ),
                                  o = 0;
                                o < a.length;
                                o++
                              )
                                r[n].fPath === a[o].src && (l = !1);
                              l &&
                                ((p = createTag('link')).setAttribute(
                                  'f-forigin',
                                  r[n].fOrigin
                                ),
                                p.setAttribute('f-origin', r[n].origin),
                                p.setAttribute('rel', 'stylesheet'),
                                p.setAttribute('href', r[n].fPath),
                                e.appendChild(p));
                            }
                          } else (r[n].loaded = !0), --s;
                          (r[n].helper =
                            ((p = e),
                            (c = r[n]),
                            (f = void 0),
                            ((f = createNS('text')).style.fontSize = '100px'),
                            f.setAttribute('font-family', c.fFamily),
                            f.setAttribute('font-style', c.fStyle),
                            f.setAttribute('font-weight', c.fWeight),
                            (f.textContent = '1'),
                            c.fClass
                              ? ((f.style.fontFamily = 'inherit'),
                                f.setAttribute('class', c.fClass))
                              : (f.style.fontFamily = c.fFamily),
                            p.appendChild(f),
                            (createTag('canvas').getContext('2d').font =
                              c.fWeight +
                              ' ' +
                              c.fStyle +
                              ' 100px ' +
                              c.fFamily),
                            f)),
                            (r[n].cache = {}),
                            this.fonts.push(r[n]);
                        }
                        0 === s
                          ? (this.isLoaded = !0)
                          : setTimeout(this.checkLoadedFonts.bind(this), 100);
                      }
                    else this.isLoaded = !0;
                    var p, c, f;
                  },
                  getCharData: function (t, e, r) {
                    for (var i = 0, s = this.chars.length; i < s; ) {
                      if (
                        this.chars[i].ch === t &&
                        this.chars[i].style === e &&
                        this.chars[i].fFamily === r
                      )
                        return this.chars[i];
                      i += 1;
                    }
                    return (
                      (('string' == typeof t && 13 !== t.charCodeAt(0)) ||
                        !t) &&
                        console &&
                        console.warn &&
                        console.warn(
                          'Missing character from exported characters list: ',
                          t,
                          e,
                          r
                        ),
                      n
                    );
                  },
                  getFontByName: function (t) {
                    for (var e = 0, r = this.fonts.length; e < r; ) {
                      if (this.fonts[e].fName === t) return this.fonts[e];
                      e += 1;
                    }
                    return this.fonts[0];
                  },
                  measureText: function (t, e, r) {
                    var i,
                      s,
                      n,
                      e = this.getFontByName(e),
                      a = t.charCodeAt(0);
                    return (
                      e.cache[a + 1] ||
                        ((i = e.helper),
                        ' ' === t
                          ? ((i.textContent = '|' + t + '|'),
                            (s = i.getComputedTextLength()),
                            (i.textContent = '||'),
                            (n = i.getComputedTextLength()),
                            (e.cache[a + 1] = (s - n) / 100))
                          : ((i.textContent = t),
                            (e.cache[a + 1] =
                              i.getComputedTextLength() / 100))),
                      e.cache[a + 1] * r
                    );
                  },
                  checkLoadedFonts: function () {
                    for (
                      var t, e, r = this.fonts.length, i = r, s = 0;
                      s < r;
                      s += 1
                    )
                      this.fonts[s].loaded
                        ? --i
                        : 'n' === this.fonts[s].fOrigin ||
                            0 === this.fonts[s].origin
                          ? (this.fonts[s].loaded = !0)
                          : ((t = this.fonts[s].monoCase.node),
                            (e = this.fonts[s].monoCase.w),
                            (t.offsetWidth === e &&
                              ((t = this.fonts[s].sansCase.node),
                              (e = this.fonts[s].sansCase.w),
                              t.offsetWidth === e)) ||
                              (--i, (this.fonts[s].loaded = !0)),
                            this.fonts[s].loaded &&
                              (this.fonts[
                                s
                              ].sansCase.parent.parentNode.removeChild(
                                this.fonts[s].sansCase.parent
                              ),
                              this.fonts[
                                s
                              ].monoCase.parent.parentNode.removeChild(
                                this.fonts[s].monoCase.parent
                              )));
                    0 !== i && Date.now() - this.initTime < 5e3
                      ? setTimeout(this.checkLoadedFontsBinded, 20)
                      : setTimeout(this.setIsLoadedBinded, 10);
                  },
                  setIsLoaded: function () {
                    this.isLoaded = !0;
                  },
                }),
                t
              );
            })(),
            PropertyFactory = (function () {
              var c = initialDefaultFrame,
                s = Math.abs;
              function f(t, e) {
                var r,
                  i = this.offsetTime;
                'multidimensional' === this.propType &&
                  (r = createTypedArray('float32', this.pv.length));
                for (
                  var s,
                    n,
                    a,
                    o = e.lastIndex,
                    h = o,
                    L = this.keyframes.length - 1,
                    l = !0;
                  l;

                ) {
                  if (
                    ((s = this.keyframes[h]),
                    (n = this.keyframes[h + 1]),
                    h === L - 1 && t >= n.t - i)
                  ) {
                    s.h && (s = n), (o = 0);
                    break;
                  }
                  if (n.t - i > t) {
                    o = h;
                    break;
                  }
                  h < L - 1 ? (h += 1) : ((o = 0), (l = !1));
                }
                var p,
                  c,
                  f,
                  d,
                  u,
                  m,
                  y,
                  g,
                  v,
                  _,
                  O,
                  b,
                  S,
                  P,
                  x = n.t - i,
                  k = s.t - i;
                if (s.to) {
                  s.bezierData ||
                    (s.bezierData = bez.buildBezierData(
                      s.s,
                      n.s || s.e,
                      s.to,
                      s.ti
                    ));
                  var E = s.bezierData;
                  if (x <= t || t < k)
                    for (
                      var N = x <= t ? E.points.length - 1 : 0,
                        w = E.points[N].point.length,
                        A = 0;
                      A < w;
                      A += 1
                    )
                      r[A] = E.points[N].point[A];
                  else {
                    s.__fnct
                      ? (a = s.__fnct)
                      : ((a = BezierFactory.getBezierEasing(
                          s.o.x,
                          s.o.y,
                          s.i.x,
                          s.i.y,
                          s.n
                        ).get),
                        (s.__fnct = a));
                    for (
                      var B,
                        T = a((t - k) / (x - k)),
                        C = E.segmentLength * T,
                        I =
                          e.lastFrame < t && e._lastKeyframeIndex === h
                            ? e._lastAddedLength
                            : 0,
                        F =
                          e.lastFrame < t && e._lastKeyframeIndex === h
                            ? e._lastPoint
                            : 0,
                        l = !0,
                        V = E.points.length;
                      l;

                    ) {
                      if (
                        ((I += E.points[F].partialLength),
                        0 == C || 0 === T || F === E.points.length - 1)
                      ) {
                        for (w = E.points[F].point.length, A = 0; A < w; A += 1)
                          r[A] = E.points[F].point[A];
                        break;
                      }
                      if (I <= C && C < I + E.points[F + 1].partialLength) {
                        for (
                          B = (C - I) / E.points[F + 1].partialLength,
                            w = E.points[F].point.length,
                            A = 0;
                          A < w;
                          A += 1
                        )
                          r[A] =
                            E.points[F].point[A] +
                            (E.points[F + 1].point[A] - E.points[F].point[A]) *
                              B;
                        break;
                      }
                      F < V - 1 ? (F += 1) : (l = !1);
                    }
                    (e._lastPoint = F),
                      (e._lastAddedLength = I - E.points[F].partialLength),
                      (e._lastKeyframeIndex = h);
                  }
                } else {
                  var M,
                    D,
                    R,
                    G,
                    j,
                    L = s.s.length,
                    z = n.s || s.e;
                  if (this.sh && 1 !== s.h)
                    x <= t
                      ? ((r[0] = z[0]), (r[1] = z[1]), (r[2] = z[2]))
                      : t <= k
                        ? ((r[0] = s.s[0]), (r[1] = s.s[1]), (r[2] = s.s[2]))
                        : ((p = r),
                          (c = U(s.s)),
                          (f = U(z)),
                          (d = (t - k) / (x - k)),
                          (g = []),
                          (v = c[0]),
                          (_ = c[1]),
                          (O = c[2]),
                          (c = c[3]),
                          (b = f[0]),
                          (S = f[1]),
                          (P = f[2]),
                          (f = f[3]),
                          (y = v * b + _ * S + O * P + c * f) < 0 &&
                            ((y = -y), (b = -b), (S = -S), (P = -P), (f = -f)),
                          (y =
                            1e-6 < 1 - y
                              ? ((y = Math.acos(y)),
                                (u = Math.sin(y)),
                                (m = Math.sin((1 - d) * y) / u),
                                Math.sin(d * y) / u)
                              : ((m = 1 - d), d)),
                          (g[0] = m * v + y * b),
                          (g[1] = m * _ + y * S),
                          (g[2] = m * O + y * P),
                          (g[3] = m * c + y * f),
                          (d = (u = g)[0]),
                          (v = u[1]),
                          (b = u[2]),
                          (u = u[3]),
                          (_ = Math.atan2(
                            2 * v * u - 2 * d * b,
                            1 - 2 * v * v - 2 * b * b
                          )),
                          (S = Math.asin(2 * d * v + 2 * b * u)),
                          (u = Math.atan2(
                            2 * d * u - 2 * v * b,
                            1 - 2 * d * d - 2 * b * b
                          )),
                          (p[0] = _ / degToRads),
                          (p[1] = S / degToRads),
                          (p[2] = u / degToRads));
                  else
                    for (h = 0; h < L; h += 1)
                      1 !== s.h &&
                        (T =
                          x <= t
                            ? 1
                            : t < k
                              ? 0
                              : (s.o.x.constructor === Array
                                  ? (s.__fnct || (s.__fnct = []),
                                    s.__fnct[h]
                                      ? (a = s.__fnct[h])
                                      : ((M =
                                          void 0 === s.o.x[h]
                                            ? s.o.x[0]
                                            : s.o.x[h]),
                                        (D =
                                          void 0 === s.o.y[h]
                                            ? s.o.y[0]
                                            : s.o.y[h]),
                                        (R =
                                          void 0 === s.i.x[h]
                                            ? s.i.x[0]
                                            : s.i.x[h]),
                                        (G =
                                          void 0 === s.i.y[h]
                                            ? s.i.y[0]
                                            : s.i.y[h]),
                                        (a = BezierFactory.getBezierEasing(
                                          M,
                                          D,
                                          R,
                                          G
                                        ).get),
                                        (s.__fnct[h] = a)))
                                  : s.__fnct
                                    ? (a = s.__fnct)
                                    : ((M = s.o.x),
                                      (D = s.o.y),
                                      (R = s.i.x),
                                      (G = s.i.y),
                                      (a = BezierFactory.getBezierEasing(
                                        M,
                                        D,
                                        R,
                                        G
                                      ).get),
                                      (s.__fnct = a)),
                                a((t - k) / (x - k)))),
                        (z = n.s || s.e),
                        (j = 1 === s.h ? s.s[h] : s.s[h] + (z[h] - s.s[h]) * T),
                        'multidimensional' === this.propType
                          ? (r[h] = j)
                          : (r = j);
                }
                return (e.lastIndex = o), r;
              }
              function U(t) {
                var e = t[0] * degToRads,
                  r = t[1] * degToRads,
                  t = t[2] * degToRads,
                  i = Math.cos(e / 2),
                  s = Math.cos(r / 2),
                  n = Math.cos(t / 2),
                  e = Math.sin(e / 2),
                  r = Math.sin(r / 2),
                  t = Math.sin(t / 2);
                return [
                  e * r * n + i * s * t,
                  e * s * n + i * r * t,
                  i * r * n - e * s * t,
                  i * s * n - e * r * t,
                ];
              }
              function d() {
                var t = this.comp.renderedFrame - this.offsetTime,
                  e = this.keyframes[0].t - this.offsetTime,
                  r =
                    this.keyframes[this.keyframes.length - 1].t -
                    this.offsetTime;
                return (
                  t === this._caching.lastFrame ||
                    (this._caching.lastFrame !== c &&
                      ((this._caching.lastFrame >= r && r <= t) ||
                        (this._caching.lastFrame < e && t < e))) ||
                    (this._caching.lastFrame >= t &&
                      ((this._caching._lastKeyframeIndex = -1),
                      (this._caching.lastIndex = 0)),
                    (r = this.interpolateValue(t, this._caching)),
                    (this.pv = r)),
                  (this._caching.lastFrame = t),
                  this.pv
                );
              }
              function u(t) {
                var e;
                if ('unidimensional' === this.propType)
                  (e = t * this.mult),
                    1e-5 < s(this.v - e) && ((this.v = e), (this._mdf = !0));
                else
                  for (var r = 0, i = this.v.length; r < i; )
                    (e = t[r] * this.mult),
                      1e-5 < s(this.v[r] - e) &&
                        ((this.v[r] = e), (this._mdf = !0)),
                      (r += 1);
              }
              function m() {
                if (
                  this.elem.globalData.frameId !== this.frameId &&
                  this.effectsSequence.length
                )
                  if (this.lock) this.setVValue(this.pv);
                  else {
                    (this.lock = !0), (this._mdf = this._isFirstFrame);
                    for (
                      var t = this.effectsSequence.length,
                        e = this.kf ? this.pv : this.data.k,
                        r = 0;
                      r < t;
                      r += 1
                    )
                      e = this.effectsSequence[r](e);
                    this.setVValue(e),
                      (this._isFirstFrame = !1),
                      (this.lock = !1),
                      (this.frameId = this.elem.globalData.frameId);
                  }
              }
              function y(t) {
                this.effectsSequence.push(t),
                  this.container.addDynamicProperty(this);
              }
              function a(t, e, r, i) {
                (this.propType = 'unidimensional'),
                  (this.mult = r || 1),
                  (this.data = e),
                  (this.v = r ? e.k * r : e.k),
                  (this.pv = e.k),
                  (this._mdf = !1),
                  (this.elem = t),
                  (this.container = i),
                  (this.comp = t.comp),
                  (this.k = !1),
                  (this.kf = !1),
                  (this.vel = 0),
                  (this.effectsSequence = []),
                  (this._isFirstFrame = !0),
                  (this.getValue = m),
                  (this.setVValue = u),
                  (this.addEffect = y);
              }
              function o(t, e, r, i) {
                (this.propType = 'multidimensional'),
                  (this.mult = r || 1),
                  (this.data = e),
                  (this._mdf = !1),
                  (this.elem = t),
                  (this.container = i),
                  (this.comp = t.comp),
                  (this.k = !1),
                  (this.kf = !1),
                  (this.frameId = -1);
                var s,
                  n = e.k.length;
                for (
                  this.v = createTypedArray('float32', n),
                    this.pv = createTypedArray('float32', n),
                    createTypedArray('float32', n),
                    this.vel = createTypedArray('float32', n),
                    s = 0;
                  s < n;
                  s += 1
                )
                  (this.v[s] = e.k[s] * this.mult), (this.pv[s] = e.k[s]);
                (this._isFirstFrame = !0),
                  (this.effectsSequence = []),
                  (this.getValue = m),
                  (this.setVValue = u),
                  (this.addEffect = y);
              }
              function h(t, e, r, i) {
                (this.propType = 'unidimensional'),
                  (this.keyframes = e.k),
                  (this.offsetTime = t.data.st),
                  (this.frameId = -1),
                  (this._caching = {
                    lastFrame: c,
                    lastIndex: 0,
                    value: 0,
                    _lastKeyframeIndex: -1,
                  }),
                  (this.k = !0),
                  (this.kf = !0),
                  (this.data = e),
                  (this.mult = r || 1),
                  (this.elem = t),
                  (this.container = i),
                  (this.comp = t.comp),
                  (this.v = c),
                  (this.pv = c),
                  (this._isFirstFrame = !0),
                  (this.getValue = m),
                  (this.setVValue = u),
                  (this.interpolateValue = f),
                  (this.effectsSequence = [d.bind(this)]),
                  (this.addEffect = y);
              }
              function l(t, e, r, i) {
                this.propType = 'multidimensional';
                for (var s, n, a, o, h = e.k.length, l = 0; l < h - 1; l += 1)
                  e.k[l].to &&
                    e.k[l].s &&
                    e.k[l + 1] &&
                    e.k[l + 1].s &&
                    ((s = e.k[l].s),
                    (n = e.k[l + 1].s),
                    (a = e.k[l].to),
                    (o = e.k[l].ti),
                    ((2 === s.length &&
                      (s[0] !== n[0] || s[1] !== n[1]) &&
                      bez.pointOnLine2D(
                        s[0],
                        s[1],
                        n[0],
                        n[1],
                        s[0] + a[0],
                        s[1] + a[1]
                      ) &&
                      bez.pointOnLine2D(
                        s[0],
                        s[1],
                        n[0],
                        n[1],
                        n[0] + o[0],
                        n[1] + o[1]
                      )) ||
                      (3 === s.length &&
                        (s[0] !== n[0] || s[1] !== n[1] || s[2] !== n[2]) &&
                        bez.pointOnLine3D(
                          s[0],
                          s[1],
                          s[2],
                          n[0],
                          n[1],
                          n[2],
                          s[0] + a[0],
                          s[1] + a[1],
                          s[2] + a[2]
                        ) &&
                        bez.pointOnLine3D(
                          s[0],
                          s[1],
                          s[2],
                          n[0],
                          n[1],
                          n[2],
                          n[0] + o[0],
                          n[1] + o[1],
                          n[2] + o[2]
                        ))) &&
                      ((e.k[l].to = null), (e.k[l].ti = null)),
                    s[0] === n[0]) &&
                    s[1] === n[1] &&
                    0 === a[0] &&
                    0 === a[1] &&
                    0 === o[0] &&
                    0 === o[1] &&
                    (2 === s.length ||
                      (s[2] === n[2] && 0 === a[2] && 0 === o[2])) &&
                    ((e.k[l].to = null), (e.k[l].ti = null));
                (this.effectsSequence = [d.bind(this)]),
                  (this.keyframes = e.k),
                  (this.offsetTime = t.data.st),
                  (this.k = !0),
                  (this.kf = !0),
                  (this._isFirstFrame = !0),
                  (this.mult = r || 1),
                  (this.elem = t),
                  (this.container = i),
                  (this.comp = t.comp),
                  (this.getValue = m),
                  (this.setVValue = u),
                  (this.interpolateValue = f),
                  (this.frameId = -1);
                var p = e.k[0].s.length;
                for (
                  this.v = createTypedArray('float32', p),
                    this.pv = createTypedArray('float32', p),
                    l = 0;
                  l < p;
                  l += 1
                )
                  (this.v[l] = c), (this.pv[l] = c);
                (this._caching = {
                  lastFrame: c,
                  lastIndex: 0,
                  value: createTypedArray('float32', p),
                }),
                  (this.addEffect = y);
              }
              return {
                getProp: function (t, e, r, i, s) {
                  var n;
                  if (e.k.length)
                    if ('number' == typeof e.k[0]) n = new o(t, e, i, s);
                    else
                      switch (r) {
                        case 0:
                          n = new h(t, e, i, s);
                          break;
                        case 1:
                          n = new l(t, e, i, s);
                      }
                  else n = new a(t, e, i, s);
                  return n.effectsSequence.length && s.addDynamicProperty(n), n;
                },
              };
            })(),
            TransformPropertyFactory = (function () {
              var n = [0, 0];
              function i(t, e, r) {
                if (
                  ((this.elem = t),
                  (this.frameId = -1),
                  (this.propType = 'transform'),
                  (this.data = e),
                  (this.v = new Matrix()),
                  (this.pre = new Matrix()),
                  (this.appliedTransformations = 0),
                  this.initDynamicPropertyContainer(r || t),
                  e.p && e.p.s
                    ? ((this.px = PropertyFactory.getProp(
                        t,
                        e.p.x,
                        0,
                        0,
                        this
                      )),
                      (this.py = PropertyFactory.getProp(t, e.p.y, 0, 0, this)),
                      e.p.z &&
                        (this.pz = PropertyFactory.getProp(
                          t,
                          e.p.z,
                          0,
                          0,
                          this
                        )))
                    : (this.p = PropertyFactory.getProp(
                        t,
                        e.p || { k: [0, 0, 0] },
                        1,
                        0,
                        this
                      )),
                  e.rx)
                ) {
                  if (
                    ((this.rx = PropertyFactory.getProp(
                      t,
                      e.rx,
                      0,
                      degToRads,
                      this
                    )),
                    (this.ry = PropertyFactory.getProp(
                      t,
                      e.ry,
                      0,
                      degToRads,
                      this
                    )),
                    (this.rz = PropertyFactory.getProp(
                      t,
                      e.rz,
                      0,
                      degToRads,
                      this
                    )),
                    e.or.k[0].ti)
                  )
                    for (var i = e.or.k.length, s = 0; s < i; s += 1)
                      e.or.k[s].to = e.or.k[s].ti = null;
                  (this.or = PropertyFactory.getProp(
                    t,
                    e.or,
                    1,
                    degToRads,
                    this
                  )),
                    (this.or.sh = !0);
                } else
                  this.r = PropertyFactory.getProp(
                    t,
                    e.r || { k: 0 },
                    0,
                    degToRads,
                    this
                  );
                e.sk &&
                  ((this.sk = PropertyFactory.getProp(
                    t,
                    e.sk,
                    0,
                    degToRads,
                    this
                  )),
                  (this.sa = PropertyFactory.getProp(
                    t,
                    e.sa,
                    0,
                    degToRads,
                    this
                  ))),
                  (this.a = PropertyFactory.getProp(
                    t,
                    e.a || { k: [0, 0, 0] },
                    1,
                    0,
                    this
                  )),
                  (this.s = PropertyFactory.getProp(
                    t,
                    e.s || { k: [100, 100, 100] },
                    1,
                    0.01,
                    this
                  )),
                  e.o
                    ? (this.o = PropertyFactory.getProp(t, e.o, 0, 0.01, t))
                    : (this.o = { _mdf: !1, v: 1 }),
                  (this._isDirty = !0),
                  this.dynamicProperties.length || this.getValue(!0);
              }
              return (
                (i.prototype = {
                  applyToMatrix: function (t) {
                    var e = this._mdf;
                    this.iterateDynamicProperties(),
                      (this._mdf = this._mdf || e),
                      this.a &&
                        t.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]),
                      this.s && t.scale(this.s.v[0], this.s.v[1], this.s.v[2]),
                      this.sk && t.skewFromAxis(-this.sk.v, this.sa.v),
                      this.r
                        ? t.rotate(-this.r.v)
                        : t
                            .rotateZ(-this.rz.v)
                            .rotateY(this.ry.v)
                            .rotateX(this.rx.v)
                            .rotateZ(-this.or.v[2])
                            .rotateY(this.or.v[1])
                            .rotateX(this.or.v[0]),
                      this.data.p.s
                        ? this.data.p.z
                          ? t.translate(this.px.v, this.py.v, -this.pz.v)
                          : t.translate(this.px.v, this.py.v, 0)
                        : t.translate(this.p.v[0], this.p.v[1], -this.p.v[2]);
                  },
                  getValue: function (t) {
                    var e, r, i, s;
                    this.elem.globalData.frameId !== this.frameId &&
                      (this._isDirty &&
                        (this.precalculateMatrix(), (this._isDirty = !1)),
                      this.iterateDynamicProperties(),
                      (this._mdf || t) &&
                        (this.v.cloneFromProps(this.pre.props),
                        this.appliedTransformations < 1 &&
                          this.v.translate(
                            -this.a.v[0],
                            -this.a.v[1],
                            this.a.v[2]
                          ),
                        this.appliedTransformations < 2 &&
                          this.v.scale(this.s.v[0], this.s.v[1], this.s.v[2]),
                        this.sk &&
                          this.appliedTransformations < 3 &&
                          this.v.skewFromAxis(-this.sk.v, this.sa.v),
                        this.r && this.appliedTransformations < 4
                          ? this.v.rotate(-this.r.v)
                          : !this.r &&
                            this.appliedTransformations < 4 &&
                            this.v
                              .rotateZ(-this.rz.v)
                              .rotateY(this.ry.v)
                              .rotateX(this.rx.v)
                              .rotateZ(-this.or.v[2])
                              .rotateY(this.or.v[1])
                              .rotateX(this.or.v[0]),
                        this.autoOriented &&
                          ((t = this.elem.globalData.frameRate),
                          this.p && this.p.keyframes && this.p.getValueAtTime
                            ? (r =
                                this.p._caching.lastFrame + this.p.offsetTime <=
                                this.p.keyframes[0].t
                                  ? ((e = this.p.getValueAtTime(
                                      (this.p.keyframes[0].t + 0.01) / t,
                                      0
                                    )),
                                    this.p.getValueAtTime(
                                      this.p.keyframes[0].t / t,
                                      0
                                    ))
                                  : this.p._caching.lastFrame +
                                        this.p.offsetTime >=
                                      this.p.keyframes[
                                        this.p.keyframes.length - 1
                                      ].t
                                    ? ((e = this.p.getValueAtTime(
                                        this.p.keyframes[
                                          this.p.keyframes.length - 1
                                        ].t / t,
                                        0
                                      )),
                                      this.p.getValueAtTime(
                                        (this.p.keyframes[
                                          this.p.keyframes.length - 1
                                        ].t -
                                          0.05) /
                                          t,
                                        0
                                      ))
                                    : ((e = this.p.pv),
                                      this.p.getValueAtTime(
                                        (this.p._caching.lastFrame +
                                          this.p.offsetTime -
                                          0.01) /
                                          t,
                                        this.p.offsetTime
                                      )))
                            : this.px &&
                                this.px.keyframes &&
                                this.py.keyframes &&
                                this.px.getValueAtTime &&
                                this.py.getValueAtTime
                              ? ((e = []),
                                (r = []),
                                (i = this.px),
                                (s = this.py),
                                i._caching.lastFrame + i.offsetTime <=
                                i.keyframes[0].t
                                  ? ((e[0] = i.getValueAtTime(
                                      (i.keyframes[0].t + 0.01) / t,
                                      0
                                    )),
                                    (e[1] = s.getValueAtTime(
                                      (s.keyframes[0].t + 0.01) / t,
                                      0
                                    )),
                                    (r[0] = i.getValueAtTime(
                                      i.keyframes[0].t / t,
                                      0
                                    )),
                                    (r[1] = s.getValueAtTime(
                                      s.keyframes[0].t / t,
                                      0
                                    )))
                                  : i._caching.lastFrame + i.offsetTime >=
                                      i.keyframes[i.keyframes.length - 1].t
                                    ? ((e[0] = i.getValueAtTime(
                                        i.keyframes[i.keyframes.length - 1].t /
                                          t,
                                        0
                                      )),
                                      (e[1] = s.getValueAtTime(
                                        s.keyframes[s.keyframes.length - 1].t /
                                          t,
                                        0
                                      )),
                                      (r[0] = i.getValueAtTime(
                                        (i.keyframes[i.keyframes.length - 1].t -
                                          0.01) /
                                          t,
                                        0
                                      )),
                                      (r[1] = s.getValueAtTime(
                                        (s.keyframes[s.keyframes.length - 1].t -
                                          0.01) /
                                          t,
                                        0
                                      )))
                                    : ((e = [i.pv, s.pv]),
                                      (r[0] = i.getValueAtTime(
                                        (i._caching.lastFrame +
                                          i.offsetTime -
                                          0.01) /
                                          t,
                                        i.offsetTime
                                      )),
                                      (r[1] = s.getValueAtTime(
                                        (s._caching.lastFrame +
                                          s.offsetTime -
                                          0.01) /
                                          t,
                                        s.offsetTime
                                      ))))
                              : (e = r = n),
                          this.v.rotate(-Math.atan2(e[1] - r[1], e[0] - r[0]))),
                        this.data.p && this.data.p.s
                          ? this.data.p.z
                            ? this.v.translate(this.px.v, this.py.v, -this.pz.v)
                            : this.v.translate(this.px.v, this.py.v, 0)
                          : this.v.translate(
                              this.p.v[0],
                              this.p.v[1],
                              -this.p.v[2]
                            )),
                      (this.frameId = this.elem.globalData.frameId));
                  },
                  precalculateMatrix: function () {
                    if (
                      !this.a.k &&
                      (this.pre.translate(
                        -this.a.v[0],
                        -this.a.v[1],
                        this.a.v[2]
                      ),
                      (this.appliedTransformations = 1),
                      !this.s.effectsSequence.length)
                    ) {
                      if (
                        (this.pre.scale(this.s.v[0], this.s.v[1], this.s.v[2]),
                        (this.appliedTransformations = 2),
                        this.sk)
                      ) {
                        if (
                          this.sk.effectsSequence.length ||
                          this.sa.effectsSequence.length
                        )
                          return;
                        this.pre.skewFromAxis(-this.sk.v, this.sa.v),
                          (this.appliedTransformations = 3);
                      }
                      this.r
                        ? this.r.effectsSequence.length ||
                          (this.pre.rotate(-this.r.v),
                          (this.appliedTransformations = 4))
                        : this.rz.effectsSequence.length ||
                          this.ry.effectsSequence.length ||
                          this.rx.effectsSequence.length ||
                          this.or.effectsSequence.length ||
                          (this.pre
                            .rotateZ(-this.rz.v)
                            .rotateY(this.ry.v)
                            .rotateX(this.rx.v)
                            .rotateZ(-this.or.v[2])
                            .rotateY(this.or.v[1])
                            .rotateX(this.or.v[0]),
                          (this.appliedTransformations = 4));
                    }
                  },
                  autoOrient: function () {},
                }),
                extendPrototype([DynamicPropertyContainer], i),
                (i.prototype.addDynamicProperty = function (t) {
                  this._addDynamicProperty(t),
                    this.elem.addDynamicProperty(t),
                    (this._isDirty = !0);
                }),
                (i.prototype._addDynamicProperty =
                  DynamicPropertyContainer.prototype.addDynamicProperty),
                {
                  getTransformProperty: function (t, e, r) {
                    return new i(t, e, r);
                  },
                }
              );
            })();
          function ShapePath() {
            (this.c = !1),
              (this._length = 0),
              (this._maxLength = 8),
              (this.v = createSizedArray(this._maxLength)),
              (this.o = createSizedArray(this._maxLength)),
              (this.i = createSizedArray(this._maxLength));
          }
          (ShapePath.prototype.setPathData = function (t, e) {
            (this.c = t), this.setLength(e);
            for (var r = 0; r < e; )
              (this.v[r] = point_pool.newElement()),
                (this.o[r] = point_pool.newElement()),
                (this.i[r] = point_pool.newElement()),
                (r += 1);
          }),
            (ShapePath.prototype.setLength = function (t) {
              for (; this._maxLength < t; ) this.doubleArrayLength();
              this._length = t;
            }),
            (ShapePath.prototype.doubleArrayLength = function () {
              (this.v = this.v.concat(createSizedArray(this._maxLength))),
                (this.i = this.i.concat(createSizedArray(this._maxLength))),
                (this.o = this.o.concat(createSizedArray(this._maxLength))),
                (this._maxLength *= 2);
            }),
            (ShapePath.prototype.setXYAt = function (t, e, r, i, s) {
              var n;
              switch (
                ((this._length = Math.max(this._length, i + 1)),
                this._length >= this._maxLength && this.doubleArrayLength(),
                r)
              ) {
                case 'v':
                  n = this.v;
                  break;
                case 'i':
                  n = this.i;
                  break;
                case 'o':
                  n = this.o;
              }
              (n[i] && (!n[i] || s)) || (n[i] = point_pool.newElement()),
                (n[i][0] = t),
                (n[i][1] = e);
            }),
            (ShapePath.prototype.setTripleAt = function (
              t,
              e,
              r,
              i,
              s,
              n,
              a,
              o
            ) {
              this.setXYAt(t, e, 'v', a, o),
                this.setXYAt(r, i, 'o', a, o),
                this.setXYAt(s, n, 'i', a, o);
            }),
            (ShapePath.prototype.reverse = function () {
              var t = new ShapePath(),
                e = (t.setPathData(this.c, this._length), this.v),
                r = this.o,
                i = this.i,
                s = 0;
              this.c &&
                (t.setTripleAt(
                  e[0][0],
                  e[0][1],
                  i[0][0],
                  i[0][1],
                  r[0][0],
                  r[0][1],
                  0,
                  !1
                ),
                (s = 1));
              for (
                var n = this._length - 1, a = this._length, o = s;
                o < a;
                o += 1
              )
                t.setTripleAt(
                  e[n][0],
                  e[n][1],
                  i[n][0],
                  i[n][1],
                  r[n][0],
                  r[n][1],
                  o,
                  !1
                ),
                  --n;
              return t;
            });
          var ShapePropertyFactory = (function () {
              function t(t, e, r) {
                var i,
                  s,
                  n,
                  a,
                  o,
                  h,
                  l,
                  p = r.lastIndex,
                  c = this.keyframes;
                if (t < c[0].t - this.offsetTime)
                  (i = c[0].s[0]), (s = !0), (p = 0);
                else if (t >= c[c.length - 1].t - this.offsetTime)
                  (i = (
                    c[c.length - 1].s ? c[c.length - 1].s : c[c.length - 2].e
                  )[0]),
                    (s = !0);
                else {
                  for (
                    var f, d, u = p, m = c.length - 1, y = !0;
                    y &&
                    ((f = c[u]), !((d = c[u + 1]).t - this.offsetTime > t));

                  )
                    u < m - 1 ? (u += 1) : (y = !1);
                  var g,
                    v,
                    _,
                    p = u;
                  (s = 1 === f.h) ||
                    ((v =
                      t >= d.t - this.offsetTime
                        ? 1
                        : t < f.t - this.offsetTime
                          ? 0
                          : (f.__fnct
                              ? (g = f.__fnct)
                              : ((g = BezierFactory.getBezierEasing(
                                  f.o.x,
                                  f.o.y,
                                  f.i.x,
                                  f.i.y
                                ).get),
                                (f.__fnct = g)),
                            g(
                              (t - (f.t - this.offsetTime)) /
                                (d.t -
                                  this.offsetTime -
                                  (f.t - this.offsetTime))
                            ))),
                    (_ = (d.s || f.e)[0])),
                    (i = f.s[0]);
                }
                for (
                  o = e._length, h = i.i[0].length, r.lastIndex = p, n = 0;
                  n < o;
                  n += 1
                )
                  for (a = 0; a < h; a += 1)
                    (l = s
                      ? i.i[n][a]
                      : i.i[n][a] + (_.i[n][a] - i.i[n][a]) * v),
                      (e.i[n][a] = l),
                      (l = s
                        ? i.o[n][a]
                        : i.o[n][a] + (_.o[n][a] - i.o[n][a]) * v),
                      (e.o[n][a] = l),
                      (l = s
                        ? i.v[n][a]
                        : i.v[n][a] + (_.v[n][a] - i.v[n][a]) * v),
                      (e.v[n][a] = l);
              }
              function i() {
                this.paths = this.localShapeCollection;
              }
              function e(t) {
                !(function (t, e) {
                  if (t._length === e._length && t.c === e.c) {
                    for (var r = t._length, i = 0; i < r; i += 1)
                      if (
                        t.v[i][0] !== e.v[i][0] ||
                        t.v[i][1] !== e.v[i][1] ||
                        t.o[i][0] !== e.o[i][0] ||
                        t.o[i][1] !== e.o[i][1] ||
                        t.i[i][0] !== e.i[i][0] ||
                        t.i[i][1] !== e.i[i][1]
                      )
                        return;
                    return 1;
                  }
                })(this.v, t) &&
                  ((this.v = shape_pool.clone(t)),
                  this.localShapeCollection.releaseShapes(),
                  this.localShapeCollection.addShape(this.v),
                  (this._mdf = !0),
                  (this.paths = this.localShapeCollection));
              }
              function r() {
                if (this.elem.globalData.frameId !== this.frameId)
                  if (this.effectsSequence.length)
                    if (this.lock) this.setVValue(this.pv);
                    else {
                      (this.lock = !0), (this._mdf = !1);
                      for (
                        var t = this.kf
                            ? this.pv
                            : (this.data.ks || this.data.pt).k,
                          e = this.effectsSequence.length,
                          r = 0;
                        r < e;
                        r += 1
                      )
                        t = this.effectsSequence[r](t);
                      this.setVValue(t),
                        (this.lock = !1),
                        (this.frameId = this.elem.globalData.frameId);
                    }
                  else this._mdf = !1;
              }
              function s(t, e, r) {
                (this.propType = 'shape'),
                  (this.comp = t.comp),
                  (this.container = t),
                  (this.elem = t),
                  (this.data = e),
                  (this.k = !1),
                  (this.kf = !1),
                  (this._mdf = !1);
                t = (3 === r ? e.pt : e.ks).k;
                (this.v = shape_pool.clone(t)),
                  (this.pv = shape_pool.clone(this.v)),
                  (this.localShapeCollection =
                    shapeCollection_pool.newShapeCollection()),
                  (this.paths = this.localShapeCollection),
                  this.paths.addShape(this.v),
                  (this.reset = i),
                  (this.effectsSequence = []);
              }
              function n(t) {
                this.effectsSequence.push(t),
                  this.container.addDynamicProperty(this);
              }
              function a(t, e, r) {
                (this.propType = 'shape'),
                  (this.comp = t.comp),
                  (this.elem = t),
                  (this.container = t),
                  (this.offsetTime = t.data.st),
                  (this.keyframes = (3 === r ? e.pt : e.ks).k),
                  (this.k = !0),
                  (this.kf = !0);
                t = this.keyframes[0].s[0].i.length;
                this.keyframes[0].s[0].i[0].length,
                  (this.v = shape_pool.newElement()),
                  this.v.setPathData(this.keyframes[0].s[0].c, t),
                  (this.pv = shape_pool.clone(this.v)),
                  (this.localShapeCollection =
                    shapeCollection_pool.newShapeCollection()),
                  (this.paths = this.localShapeCollection),
                  this.paths.addShape(this.v),
                  (this.lastFrame = -999999),
                  (this.reset = i),
                  (this._caching = { lastFrame: -999999, lastIndex: 0 }),
                  (this.effectsSequence = [
                    function () {
                      var t = this.comp.renderedFrame - this.offsetTime,
                        e = this.keyframes[0].t - this.offsetTime,
                        r =
                          this.keyframes[this.keyframes.length - 1].t -
                          this.offsetTime,
                        i = this._caching.lastFrame;
                      return (
                        (-999999 !== i &&
                          ((i < e && t < e) || (r < i && r < t))) ||
                          ((this._caching.lastIndex =
                            i < t ? this._caching.lastIndex : 0),
                          this.interpolateShape(t, this.pv, this._caching)),
                        (this._caching.lastFrame = t),
                        this.pv
                      );
                    }.bind(this),
                  ]);
              }
              (s.prototype.interpolateShape = t),
                (s.prototype.getValue = r),
                (s.prototype.setVValue = e),
                (s.prototype.addEffect = n),
                (a.prototype.getValue = r),
                (a.prototype.interpolateShape = t),
                (a.prototype.setVValue = e),
                (a.prototype.addEffect = n);
              (o = roundCorner),
                (d.prototype = {
                  reset: i,
                  getValue: function () {
                    this.elem.globalData.frameId !== this.frameId &&
                      ((this.frameId = this.elem.globalData.frameId),
                      this.iterateDynamicProperties(),
                      this._mdf) &&
                      this.convertEllToPath();
                  },
                  convertEllToPath: function () {
                    var t = this.p.v[0],
                      e = this.p.v[1],
                      r = this.s.v[0] / 2,
                      i = this.s.v[1] / 2,
                      s = 3 !== this.d,
                      n = this.v;
                    (n.v[0][0] = t),
                      (n.v[0][1] = e - i),
                      (n.v[1][0] = s ? t + r : t - r),
                      (n.v[1][1] = e),
                      (n.v[2][0] = t),
                      (n.v[2][1] = e + i),
                      (n.v[3][0] = s ? t - r : t + r),
                      (n.v[3][1] = e),
                      (n.i[0][0] = s ? t - r * o : t + r * o),
                      (n.i[0][1] = e - i),
                      (n.i[1][0] = s ? t + r : t - r),
                      (n.i[1][1] = e - i * o),
                      (n.i[2][0] = s ? t + r * o : t - r * o),
                      (n.i[2][1] = e + i),
                      (n.i[3][0] = s ? t - r : t + r),
                      (n.i[3][1] = e + i * o),
                      (n.o[0][0] = s ? t + r * o : t - r * o),
                      (n.o[0][1] = e - i),
                      (n.o[1][0] = s ? t + r : t - r),
                      (n.o[1][1] = e + i * o),
                      (n.o[2][0] = s ? t - r * o : t + r * o),
                      (n.o[2][1] = e + i),
                      (n.o[3][0] = s ? t - r : t + r),
                      (n.o[3][1] = e - i * o);
                  },
                }),
                extendPrototype([DynamicPropertyContainer], d);
              var o,
                h = d,
                l =
                  ((f.prototype = {
                    reset: i,
                    getValue: function () {
                      this.elem.globalData.frameId !== this.frameId &&
                        ((this.frameId = this.elem.globalData.frameId),
                        this.iterateDynamicProperties(),
                        this._mdf) &&
                        this.convertToPath();
                    },
                    convertStarToPath: function () {
                      for (
                        var t = 2 * Math.floor(this.pt.v),
                          e = (2 * Math.PI) / t,
                          r = !0,
                          i = this.or.v,
                          s = this.ir.v,
                          n = this.os.v,
                          a = this.is.v,
                          o = (2 * Math.PI * i) / (2 * t),
                          h = (2 * Math.PI * s) / (2 * t),
                          l = -Math.PI / 2,
                          p = ((l += this.r.v), 3 === this.data.d ? -1 : 1),
                          c = (this.v._length = 0);
                        c < t;
                        c += 1
                      ) {
                        var f = r ? n : a,
                          d = r ? o : h,
                          u = (m = r ? i : s) * Math.cos(l),
                          m = m * Math.sin(l),
                          y =
                            0 == u && 0 == m ? 0 : m / Math.sqrt(u * u + m * m),
                          g =
                            0 == u && 0 == m
                              ? 0
                              : -u / Math.sqrt(u * u + m * m);
                        (u += +this.p.v[0]),
                          (m += +this.p.v[1]),
                          this.v.setTripleAt(
                            u,
                            m,
                            u - y * d * f * p,
                            m - g * d * f * p,
                            u + y * d * f * p,
                            m + g * d * f * p,
                            c,
                            !0
                          ),
                          (r = !r),
                          (l += e * p);
                      }
                    },
                    convertPolygonToPath: function () {
                      var t,
                        e = Math.floor(this.pt.v),
                        r = (2 * Math.PI) / e,
                        i = this.or.v,
                        s = this.os.v,
                        n = (2 * Math.PI * i) / (4 * e),
                        a = -Math.PI / 2,
                        o = 3 === this.data.d ? -1 : 1;
                      for (
                        a += this.r.v, t = this.v._length = 0;
                        t < e;
                        t += 1
                      ) {
                        var h = i * Math.cos(a),
                          l = i * Math.sin(a),
                          p =
                            0 == h && 0 == l ? 0 : l / Math.sqrt(h * h + l * l),
                          c =
                            0 == h && 0 == l
                              ? 0
                              : -h / Math.sqrt(h * h + l * l);
                        (h += +this.p.v[0]),
                          (l += +this.p.v[1]),
                          this.v.setTripleAt(
                            h,
                            l,
                            h - p * n * s * o,
                            l - c * n * s * o,
                            h + p * n * s * o,
                            l + c * n * s * o,
                            t,
                            !0
                          ),
                          (a += r * o);
                      }
                      (this.paths.length = 0), (this.paths[0] = this.v);
                    },
                  }),
                  extendPrototype([DynamicPropertyContainer], f),
                  f),
                p =
                  ((c.prototype = {
                    convertRectToPath: function () {
                      var t = this.p.v[0],
                        e = this.p.v[1],
                        r = this.s.v[0] / 2,
                        i = this.s.v[1] / 2,
                        s = bm_min(r, i, this.r.v),
                        n = s * (1 - roundCorner);
                      (this.v._length = 0),
                        2 === this.d || 1 === this.d
                          ? (this.v.setTripleAt(
                              t + r,
                              e - i + s,
                              t + r,
                              e - i + s,
                              t + r,
                              e - i + n,
                              0,
                              !0
                            ),
                            this.v.setTripleAt(
                              t + r,
                              e + i - s,
                              t + r,
                              e + i - n,
                              t + r,
                              e + i - s,
                              1,
                              !0
                            ),
                            0 !== s
                              ? (this.v.setTripleAt(
                                  t + r - s,
                                  e + i,
                                  t + r - s,
                                  e + i,
                                  t + r - n,
                                  e + i,
                                  2,
                                  !0
                                ),
                                this.v.setTripleAt(
                                  t - r + s,
                                  e + i,
                                  t - r + n,
                                  e + i,
                                  t - r + s,
                                  e + i,
                                  3,
                                  !0
                                ),
                                this.v.setTripleAt(
                                  t - r,
                                  e + i - s,
                                  t - r,
                                  e + i - s,
                                  t - r,
                                  e + i - n,
                                  4,
                                  !0
                                ),
                                this.v.setTripleAt(
                                  t - r,
                                  e - i + s,
                                  t - r,
                                  e - i + n,
                                  t - r,
                                  e - i + s,
                                  5,
                                  !0
                                ),
                                this.v.setTripleAt(
                                  t - r + s,
                                  e - i,
                                  t - r + s,
                                  e - i,
                                  t - r + n,
                                  e - i,
                                  6,
                                  !0
                                ),
                                this.v.setTripleAt(
                                  t + r - s,
                                  e - i,
                                  t + r - n,
                                  e - i,
                                  t + r - s,
                                  e - i,
                                  7,
                                  !0
                                ))
                              : (this.v.setTripleAt(
                                  t - r,
                                  e + i,
                                  t - r + n,
                                  e + i,
                                  t - r,
                                  e + i,
                                  2
                                ),
                                this.v.setTripleAt(
                                  t - r,
                                  e - i,
                                  t - r,
                                  e - i + n,
                                  t - r,
                                  e - i,
                                  3
                                )))
                          : (this.v.setTripleAt(
                              t + r,
                              e - i + s,
                              t + r,
                              e - i + n,
                              t + r,
                              e - i + s,
                              0,
                              !0
                            ),
                            0 !== s
                              ? (this.v.setTripleAt(
                                  t + r - s,
                                  e - i,
                                  t + r - s,
                                  e - i,
                                  t + r - n,
                                  e - i,
                                  1,
                                  !0
                                ),
                                this.v.setTripleAt(
                                  t - r + s,
                                  e - i,
                                  t - r + n,
                                  e - i,
                                  t - r + s,
                                  e - i,
                                  2,
                                  !0
                                ),
                                this.v.setTripleAt(
                                  t - r,
                                  e - i + s,
                                  t - r,
                                  e - i + s,
                                  t - r,
                                  e - i + n,
                                  3,
                                  !0
                                ),
                                this.v.setTripleAt(
                                  t - r,
                                  e + i - s,
                                  t - r,
                                  e + i - n,
                                  t - r,
                                  e + i - s,
                                  4,
                                  !0
                                ),
                                this.v.setTripleAt(
                                  t - r + s,
                                  e + i,
                                  t - r + s,
                                  e + i,
                                  t - r + n,
                                  e + i,
                                  5,
                                  !0
                                ),
                                this.v.setTripleAt(
                                  t + r - s,
                                  e + i,
                                  t + r - n,
                                  e + i,
                                  t + r - s,
                                  e + i,
                                  6,
                                  !0
                                ),
                                this.v.setTripleAt(
                                  t + r,
                                  e + i - s,
                                  t + r,
                                  e + i - s,
                                  t + r,
                                  e + i - n,
                                  7,
                                  !0
                                ))
                              : (this.v.setTripleAt(
                                  t - r,
                                  e - i,
                                  t - r + n,
                                  e - i,
                                  t - r,
                                  e - i,
                                  1,
                                  !0
                                ),
                                this.v.setTripleAt(
                                  t - r,
                                  e + i,
                                  t - r,
                                  e + i - n,
                                  t - r,
                                  e + i,
                                  2,
                                  !0
                                ),
                                this.v.setTripleAt(
                                  t + r,
                                  e + i,
                                  t + r - n,
                                  e + i,
                                  t + r,
                                  e + i,
                                  3,
                                  !0
                                )));
                    },
                    getValue: function (t) {
                      this.elem.globalData.frameId !== this.frameId &&
                        ((this.frameId = this.elem.globalData.frameId),
                        this.iterateDynamicProperties(),
                        this._mdf) &&
                        this.convertRectToPath();
                    },
                    reset: i,
                  }),
                  extendPrototype([DynamicPropertyContainer], c),
                  c);
              function c(t, e) {
                (this.v = shape_pool.newElement()),
                  (this.v.c = !0),
                  (this.localShapeCollection =
                    shapeCollection_pool.newShapeCollection()),
                  this.localShapeCollection.addShape(this.v),
                  (this.paths = this.localShapeCollection),
                  (this.elem = t),
                  (this.comp = t.comp),
                  (this.frameId = -1),
                  (this.d = e.d),
                  this.initDynamicPropertyContainer(t),
                  (this.p = PropertyFactory.getProp(t, e.p, 1, 0, this)),
                  (this.s = PropertyFactory.getProp(t, e.s, 1, 0, this)),
                  (this.r = PropertyFactory.getProp(t, e.r, 0, 0, this)),
                  this.dynamicProperties.length
                    ? (this.k = !0)
                    : ((this.k = !1), this.convertRectToPath());
              }
              function f(t, e) {
                (this.v = shape_pool.newElement()),
                  this.v.setPathData(!0, 0),
                  (this.elem = t),
                  (this.comp = t.comp),
                  (this.data = e),
                  (this.frameId = -1),
                  (this.d = e.d),
                  this.initDynamicPropertyContainer(t),
                  1 === e.sy
                    ? ((this.ir = PropertyFactory.getProp(t, e.ir, 0, 0, this)),
                      (this.is = PropertyFactory.getProp(
                        t,
                        e.is,
                        0,
                        0.01,
                        this
                      )),
                      (this.convertToPath = this.convertStarToPath))
                    : (this.convertToPath = this.convertPolygonToPath),
                  (this.pt = PropertyFactory.getProp(t, e.pt, 0, 0, this)),
                  (this.p = PropertyFactory.getProp(t, e.p, 1, 0, this)),
                  (this.r = PropertyFactory.getProp(
                    t,
                    e.r,
                    0,
                    degToRads,
                    this
                  )),
                  (this.or = PropertyFactory.getProp(t, e.or, 0, 0, this)),
                  (this.os = PropertyFactory.getProp(t, e.os, 0, 0.01, this)),
                  (this.localShapeCollection =
                    shapeCollection_pool.newShapeCollection()),
                  this.localShapeCollection.addShape(this.v),
                  (this.paths = this.localShapeCollection),
                  this.dynamicProperties.length
                    ? (this.k = !0)
                    : ((this.k = !1), this.convertToPath());
              }
              function d(t, e) {
                (this.v = shape_pool.newElement()),
                  this.v.setPathData(!0, 4),
                  (this.localShapeCollection =
                    shapeCollection_pool.newShapeCollection()),
                  (this.paths = this.localShapeCollection),
                  this.localShapeCollection.addShape(this.v),
                  (this.d = e.d),
                  (this.elem = t),
                  (this.comp = t.comp),
                  (this.frameId = -1),
                  this.initDynamicPropertyContainer(t),
                  (this.p = PropertyFactory.getProp(t, e.p, 1, 0, this)),
                  (this.s = PropertyFactory.getProp(t, e.s, 1, 0, this)),
                  this.dynamicProperties.length
                    ? (this.k = !0)
                    : ((this.k = !1), this.convertEllToPath());
              }
              return {
                getShapeProp: function (t, e, r) {
                  var i;
                  return (
                    3 === r || 4 === r
                      ? (i = new ((3 === r ? e.pt : e.ks).k.length ? a : s)(
                          t,
                          e,
                          r
                        ))
                      : 5 === r
                        ? (i = new p(t, e))
                        : 6 === r
                          ? (i = new h(t, e))
                          : 7 === r && (i = new l(t, e)),
                    i.k && t.addDynamicProperty(i),
                    i
                  );
                },
                getConstructorFunction: function () {
                  return s;
                },
                getKeyframedConstructorFunction: function () {
                  return a;
                },
              };
            })(),
            ShapeModifiers =
              ((ob = {}),
              (modifiers = {}),
              (ob.registerModifier = function (t, e) {
                modifiers[t] || (modifiers[t] = e);
              }),
              (ob.getModifier = function (t, e, r) {
                return new modifiers[t](e, r);
              }),
              ob),
            ob,
            modifiers;
          function ShapeModifier() {}
          function TrimModifier() {}
          function RoundCornersModifier() {}
          function PuckerAndBloatModifier() {}
          function RepeaterModifier() {}
          function ShapeCollection() {
            (this._length = 0),
              (this._maxLength = 4),
              (this.shapes = createSizedArray(this._maxLength));
          }
          function DashProperty(t, e, r, i) {
            (this.elem = t),
              (this.frameId = -1),
              (this.dataProps = createSizedArray(e.length)),
              (this.renderer = r),
              (this.k = !1),
              (this.dashStr = ''),
              (this.dashArray = createTypedArray(
                'float32',
                e.length ? e.length - 1 : 0
              )),
              (this.dashoffset = createTypedArray('float32', 1)),
              this.initDynamicPropertyContainer(i);
            for (var s, n = e.length || 0, a = 0; a < n; a += 1)
              (s = PropertyFactory.getProp(t, e[a].v, 0, 0, this)),
                (this.k = s.k || this.k),
                (this.dataProps[a] = { n: e[a].n, p: s });
            this.k || this.getValue(!0), (this._isAnimated = this.k);
          }
          function GradientProperty(t, e, r) {
            (this.data = e), (this.c = createTypedArray('uint8c', 4 * e.p));
            var i = e.k.k[0].s
              ? e.k.k[0].s.length - 4 * e.p
              : e.k.k.length - 4 * e.p;
            (this.o = createTypedArray('float32', i)),
              (this._cmdf = !1),
              (this._omdf = !1),
              (this._collapsable = this.checkCollapsable()),
              (this._hasOpacity = i),
              this.initDynamicPropertyContainer(r),
              (this.prop = PropertyFactory.getProp(t, e.k, 1, null, this)),
              (this.k = this.prop.k),
              this.getValue(!0);
          }
          (ShapeModifier.prototype.initModifierProperties = function () {}),
            (ShapeModifier.prototype.addShapeToModifier = function () {}),
            (ShapeModifier.prototype.addShape = function (t) {
              var e;
              this.closed ||
                (t.sh.container.addDynamicProperty(t.sh),
                (e = {
                  shape: t.sh,
                  data: t,
                  localShapeCollection:
                    shapeCollection_pool.newShapeCollection(),
                }),
                this.shapes.push(e),
                this.addShapeToModifier(e),
                this._isAnimated && t.setAsAnimated());
            }),
            (ShapeModifier.prototype.init = function (t, e) {
              (this.shapes = []),
                (this.elem = t),
                this.initDynamicPropertyContainer(t),
                this.initModifierProperties(t, e),
                (this.frameId = initialDefaultFrame),
                (this.closed = !1),
                (this.k = !1),
                this.dynamicProperties.length
                  ? (this.k = !0)
                  : this.getValue(!0);
            }),
            (ShapeModifier.prototype.processKeys = function () {
              this.elem.globalData.frameId !== this.frameId &&
                ((this.frameId = this.elem.globalData.frameId),
                this.iterateDynamicProperties());
            }),
            extendPrototype([DynamicPropertyContainer], ShapeModifier),
            extendPrototype([ShapeModifier], TrimModifier),
            (TrimModifier.prototype.initModifierProperties = function (t, e) {
              (this.s = PropertyFactory.getProp(t, e.s, 0, 0.01, this)),
                (this.e = PropertyFactory.getProp(t, e.e, 0, 0.01, this)),
                (this.o = PropertyFactory.getProp(t, e.o, 0, 0, this)),
                (this.sValue = 0),
                (this.eValue = 0),
                (this.getValue = this.processKeys),
                (this.m = e.m),
                (this._isAnimated =
                  !!this.s.effectsSequence.length ||
                  !!this.e.effectsSequence.length ||
                  !!this.o.effectsSequence.length);
            }),
            (TrimModifier.prototype.addShapeToModifier = function (t) {
              t.pathsData = [];
            }),
            (TrimModifier.prototype.calculateShapeEdges = function (
              t,
              e,
              r,
              i,
              s
            ) {
              var n = [];
              e <= 1
                ? n.push({ s: t, e: e })
                : 1 <= t
                  ? n.push({ s: t - 1, e: e - 1 })
                  : (n.push({ s: t, e: 1 }), n.push({ s: 0, e: e - 1 }));
              for (var a, o, h = [], l = n.length, p = 0; p < l; p += 1)
                (o = n[p]).e * s < i ||
                  o.s * s > i + r ||
                  ((a = o.s * s <= i ? 0 : (o.s * s - i) / r),
                  (o = o.e * s >= i + r ? 1 : (o.e * s - i) / r),
                  h.push([a, o]));
              return h.length || h.push([0, 0]), h;
            }),
            (TrimModifier.prototype.releasePathsData = function (t) {
              for (var e = t.length, r = 0; r < e; r += 1)
                segments_length_pool.release(t[r]);
              return (t.length = 0), t;
            }),
            (TrimModifier.prototype.processShapes = function (t) {
              var e, r, i, s;
              this._mdf || t
                ? ((r = (this.o.v % 360) / 360) < 0 && (r += 1),
                  (i = (1 < this.s.v ? 1 : this.s.v < 0 ? 0 : this.s.v) + r) >
                    (s =
                      (1 < this.e.v ? 1 : this.e.v < 0 ? 0 : this.e.v) + r) &&
                    ((r = i), (i = s), (s = r)),
                  (i = 1e-4 * Math.round(1e4 * i)),
                  (s = 1e-4 * Math.round(1e4 * s)),
                  (this.sValue = i),
                  (this.eValue = s))
                : ((i = this.sValue), (s = this.eValue));
              var n,
                a,
                o,
                h,
                l,
                p = this.shapes.length,
                c = 0;
              if (s === i)
                for (m = 0; m < p; m += 1)
                  this.shapes[m].localShapeCollection.releaseShapes(),
                    (this.shapes[m].shape._mdf = !0),
                    (this.shapes[m].shape.paths =
                      this.shapes[m].localShapeCollection),
                    this._mdf && (this.shapes[m].pathsData.length = 0);
              else if ((1 === s && 0 === i) || (0 === s && 1 === i)) {
                if (this._mdf)
                  for (m = 0; m < p; m += 1)
                    (this.shapes[m].pathsData.length = 0),
                      (this.shapes[m].shape._mdf = !0);
              } else {
                for (var f, d, u = [], m = 0; m < p; m += 1)
                  if (
                    (f = this.shapes[m]).shape._mdf ||
                    this._mdf ||
                    t ||
                    2 === this.m
                  ) {
                    if (
                      ((a = (e = f.shape.paths)._length),
                      (l = 0),
                      !f.shape._mdf && f.pathsData.length)
                    )
                      l = f.totalShapeLength;
                    else {
                      for (
                        o = this.releasePathsData(f.pathsData), n = 0;
                        n < a;
                        n += 1
                      )
                        (h = bez.getSegmentsLength(e.shapes[n])),
                          o.push(h),
                          (l += h.totalLength);
                      (f.totalShapeLength = l), (f.pathsData = o);
                    }
                    (c += l), (f.shape._mdf = !0);
                  } else f.shape.paths = f.localShapeCollection;
                var y,
                  g = i,
                  v = s,
                  _ = 0;
                for (m = p - 1; 0 <= m; --m)
                  if ((f = this.shapes[m]).shape._mdf) {
                    for (
                      (d = f.localShapeCollection).releaseShapes(),
                        2 === this.m && 1 < p
                          ? ((y = this.calculateShapeEdges(
                              i,
                              s,
                              f.totalShapeLength,
                              _,
                              c
                            )),
                            (_ += f.totalShapeLength))
                          : (y = [[g, v]]),
                        a = y.length,
                        n = 0;
                      n < a;
                      n += 1
                    ) {
                      (g = y[n][0]),
                        (v = y[n][1]),
                        (u.length = 0),
                        v <= 1
                          ? u.push({
                              s: f.totalShapeLength * g,
                              e: f.totalShapeLength * v,
                            })
                          : 1 <= g
                            ? u.push({
                                s: f.totalShapeLength * (g - 1),
                                e: f.totalShapeLength * (v - 1),
                              })
                            : (u.push({
                                s: f.totalShapeLength * g,
                                e: f.totalShapeLength,
                              }),
                              u.push({
                                s: 0,
                                e: f.totalShapeLength * (v - 1),
                              }));
                      var b,
                        S = this.addShapes(f, u[0]);
                      u[0].s !== u[0].e &&
                        (1 < u.length &&
                          (S = f.shape.paths.shapes[f.shape.paths._length - 1].c
                            ? ((b = S.pop()),
                              this.addPaths(S, d),
                              this.addShapes(f, u[1], b))
                            : (this.addPaths(S, d), this.addShapes(f, u[1]))),
                        this.addPaths(S, d));
                    }
                    f.shape.paths = d;
                  }
              }
            }),
            (TrimModifier.prototype.addPaths = function (t, e) {
              for (var r = t.length, i = 0; i < r; i += 1) e.addShape(t[i]);
            }),
            (TrimModifier.prototype.addSegment = function (
              t,
              e,
              r,
              i,
              s,
              n,
              a
            ) {
              s.setXYAt(e[0], e[1], 'o', n),
                s.setXYAt(r[0], r[1], 'i', n + 1),
                a && s.setXYAt(t[0], t[1], 'v', n),
                s.setXYAt(i[0], i[1], 'v', n + 1);
            }),
            (TrimModifier.prototype.addSegmentFromArray = function (
              t,
              e,
              r,
              i
            ) {
              e.setXYAt(t[1], t[5], 'o', r),
                e.setXYAt(t[2], t[6], 'i', r + 1),
                i && e.setXYAt(t[0], t[4], 'v', r),
                e.setXYAt(t[3], t[7], 'v', r + 1);
            }),
            (TrimModifier.prototype.addShapes = function (t, e, r) {
              var i,
                s,
                n,
                a,
                o,
                h,
                l,
                p,
                c = t.pathsData,
                f = t.shape.paths.shapes,
                d = t.shape.paths._length,
                u = 0,
                m = [],
                y = !0,
                g = r
                  ? ((a = r._length), r._length)
                  : ((r = shape_pool.newElement()), (a = 0));
              for (m.push(r), i = 0; i < d; i += 1) {
                for (
                  o = c[i].lengths,
                    r.c = f[i].c,
                    n = f[i].c ? o.length : o.length + 1,
                    s = 1;
                  s < n;
                  s += 1
                )
                  if (u + (p = o[s - 1]).addedLength < e.s)
                    (u += p.addedLength), (r.c = !1);
                  else {
                    if (u > e.e) {
                      r.c = !1;
                      break;
                    }
                    e.s <= u && e.e >= u + p.addedLength
                      ? (this.addSegment(
                          f[i].v[s - 1],
                          f[i].o[s - 1],
                          f[i].i[s],
                          f[i].v[s],
                          r,
                          a,
                          y
                        ),
                        (y = !1))
                      : ((h = bez.getNewSegment(
                          f[i].v[s - 1],
                          f[i].v[s],
                          f[i].o[s - 1],
                          f[i].i[s],
                          (e.s - u) / p.addedLength,
                          (e.e - u) / p.addedLength,
                          o[s - 1]
                        )),
                        this.addSegmentFromArray(h, r, a, y),
                        (r.c = y = !1)),
                      (u += p.addedLength),
                      (a += 1);
                  }
                if (
                  (f[i].c &&
                    o.length &&
                    ((p = o[s - 1]),
                    u <= e.e
                      ? ((l = o[s - 1].addedLength),
                        e.s <= u && e.e >= u + l
                          ? (this.addSegment(
                              f[i].v[s - 1],
                              f[i].o[s - 1],
                              f[i].i[0],
                              f[i].v[0],
                              r,
                              a,
                              y
                            ),
                            (y = !1))
                          : ((h = bez.getNewSegment(
                              f[i].v[s - 1],
                              f[i].v[0],
                              f[i].o[s - 1],
                              f[i].i[0],
                              (e.s - u) / l,
                              (e.e - u) / l,
                              o[s - 1]
                            )),
                            this.addSegmentFromArray(h, r, a, y),
                            (r.c = y = !1)))
                      : (r.c = !1),
                    (u += p.addedLength),
                    (a += 1)),
                  r._length &&
                    (r.setXYAt(r.v[g][0], r.v[g][1], 'i', g),
                    r.setXYAt(
                      r.v[r._length - 1][0],
                      r.v[r._length - 1][1],
                      'o',
                      r._length - 1
                    )),
                  u > e.e)
                )
                  break;
                i < d - 1 &&
                  ((r = shape_pool.newElement()), (y = !0), m.push(r), (a = 0));
              }
              return m;
            }),
            ShapeModifiers.registerModifier('tm', TrimModifier),
            extendPrototype([ShapeModifier], RoundCornersModifier),
            (RoundCornersModifier.prototype.initModifierProperties = function (
              t,
              e
            ) {
              (this.getValue = this.processKeys),
                (this.rd = PropertyFactory.getProp(t, e.r, 0, null, this)),
                (this._isAnimated = !!this.rd.effectsSequence.length);
            }),
            (RoundCornersModifier.prototype.processPath = function (t, e) {
              var r = shape_pool.newElement();
              r.c = t.c;
              for (
                var i, s, n, a, o, h, l, p, c, f, d = t._length, u = 0, m = 0;
                m < d;
                m += 1
              )
                (i = t.v[m]),
                  (n = t.o[m]),
                  (s = t.i[m]),
                  i[0] === n[0] &&
                  i[1] === n[1] &&
                  i[0] === s[0] &&
                  i[1] === s[1]
                    ? (0 !== m && m !== d - 1) || t.c
                      ? ((a = 0 === m ? t.v[d - 1] : t.v[m - 1]),
                        (h = (o = Math.sqrt(
                          Math.pow(i[0] - a[0], 2) + Math.pow(i[1] - a[1], 2)
                        ))
                          ? Math.min(o / 2, e) / o
                          : 0),
                        (c = i[0] + (a[0] - i[0]) * h),
                        (f = i[1] - (i[1] - a[1]) * h),
                        (l = c - (c - i[0]) * roundCorner),
                        (p = f - (f - i[1]) * roundCorner),
                        r.setTripleAt(c, f, l, p, c, f, u),
                        (u += 1),
                        (a = m === d - 1 ? t.v[0] : t.v[m + 1]),
                        (h = (o = Math.sqrt(
                          Math.pow(i[0] - a[0], 2) + Math.pow(i[1] - a[1], 2)
                        ))
                          ? Math.min(o / 2, e) / o
                          : 0),
                        (l = i[0] + (a[0] - i[0]) * h),
                        (p = i[1] + (a[1] - i[1]) * h),
                        (c = l - (l - i[0]) * roundCorner),
                        (f = p - (p - i[1]) * roundCorner),
                        r.setTripleAt(l, p, l, p, c, f, u))
                      : r.setTripleAt(i[0], i[1], n[0], n[1], s[0], s[1], u)
                    : r.setTripleAt(
                        t.v[m][0],
                        t.v[m][1],
                        t.o[m][0],
                        t.o[m][1],
                        t.i[m][0],
                        t.i[m][1],
                        u
                      ),
                  (u += 1);
              return r;
            }),
            (RoundCornersModifier.prototype.processShapes = function (t) {
              var e,
                r,
                i,
                s,
                n,
                a,
                o = this.shapes.length,
                h = this.rd.v;
              if (0 !== h)
                for (r = 0; r < o; r += 1) {
                  if (
                    ((n = this.shapes[r]).shape.paths,
                    (a = n.localShapeCollection),
                    n.shape._mdf || this._mdf || t)
                  )
                    for (
                      a.releaseShapes(),
                        n.shape._mdf = !0,
                        e = n.shape.paths.shapes,
                        s = n.shape.paths._length,
                        i = 0;
                      i < s;
                      i += 1
                    )
                      a.addShape(this.processPath(e[i], h));
                  n.shape.paths = n.localShapeCollection;
                }
              this.dynamicProperties.length || (this._mdf = !1);
            }),
            ShapeModifiers.registerModifier('rd', RoundCornersModifier),
            extendPrototype([ShapeModifier], PuckerAndBloatModifier),
            (PuckerAndBloatModifier.prototype.initModifierProperties =
              function (t, e) {
                (this.getValue = this.processKeys),
                  (this.amount = PropertyFactory.getProp(
                    t,
                    e.a,
                    0,
                    null,
                    this
                  )),
                  (this._isAnimated = !!this.amount.effectsSequence.length);
              }),
            (PuckerAndBloatModifier.prototype.processPath = function (t, e) {
              for (
                var r = e / 100, i = [0, 0], s = t._length, n = 0, n = 0;
                n < s;
                n += 1
              )
                (i[0] += t.v[n][0]), (i[1] += t.v[n][1]);
              (i[0] /= s), (i[1] /= s);
              var a,
                o,
                h,
                l,
                p,
                c,
                f = shape_pool.newElement();
              for (f.c = t.c, n = 0; n < s; n += 1)
                (a = t.v[n][0] + (i[0] - t.v[n][0]) * r),
                  (o = t.v[n][1] + (i[1] - t.v[n][1]) * r),
                  (h = t.o[n][0] + (i[0] - t.o[n][0]) * -r),
                  (l = t.o[n][1] + (i[1] - t.o[n][1]) * -r),
                  (p = t.i[n][0] + (i[0] - t.i[n][0]) * -r),
                  (c = t.i[n][1] + (i[1] - t.i[n][1]) * -r),
                  f.setTripleAt(a, o, h, l, p, c, n);
              return f;
            }),
            (PuckerAndBloatModifier.prototype.processShapes = function (t) {
              var e,
                r,
                i,
                s,
                n,
                a,
                o = this.shapes.length,
                h = this.amount.v;
              if (0 !== h)
                for (r = 0; r < o; r += 1) {
                  if (
                    ((n = this.shapes[r]).shape.paths,
                    (a = n.localShapeCollection),
                    n.shape._mdf || this._mdf || t)
                  )
                    for (
                      a.releaseShapes(),
                        n.shape._mdf = !0,
                        e = n.shape.paths.shapes,
                        s = n.shape.paths._length,
                        i = 0;
                      i < s;
                      i += 1
                    )
                      a.addShape(this.processPath(e[i], h));
                  n.shape.paths = n.localShapeCollection;
                }
              this.dynamicProperties.length || (this._mdf = !1);
            }),
            ShapeModifiers.registerModifier('pb', PuckerAndBloatModifier),
            extendPrototype([ShapeModifier], RepeaterModifier),
            (RepeaterModifier.prototype.initModifierProperties = function (
              t,
              e
            ) {
              (this.getValue = this.processKeys),
                (this.c = PropertyFactory.getProp(t, e.c, 0, null, this)),
                (this.o = PropertyFactory.getProp(t, e.o, 0, null, this)),
                (this.tr = TransformPropertyFactory.getTransformProperty(
                  t,
                  e.tr,
                  this
                )),
                (this.so = PropertyFactory.getProp(t, e.tr.so, 0, 0.01, this)),
                (this.eo = PropertyFactory.getProp(t, e.tr.eo, 0, 0.01, this)),
                (this.data = e),
                this.dynamicProperties.length || this.getValue(!0),
                (this._isAnimated = !!this.dynamicProperties.length),
                (this.pMatrix = new Matrix()),
                (this.rMatrix = new Matrix()),
                (this.sMatrix = new Matrix()),
                (this.tMatrix = new Matrix()),
                (this.matrix = new Matrix());
            }),
            (RepeaterModifier.prototype.applyTransforms = function (
              t,
              e,
              r,
              i,
              s,
              n
            ) {
              var a = n ? -1 : 1,
                o = i.s.v[0] + (1 - i.s.v[0]) * (1 - s),
                h = i.s.v[1] + (1 - i.s.v[1]) * (1 - s);
              t.translate(i.p.v[0] * a * s, i.p.v[1] * a * s, i.p.v[2]),
                e.translate(-i.a.v[0], -i.a.v[1], i.a.v[2]),
                e.rotate(-i.r.v * a * s),
                e.translate(i.a.v[0], i.a.v[1], i.a.v[2]),
                r.translate(-i.a.v[0], -i.a.v[1], i.a.v[2]),
                r.scale(n ? 1 / o : o, n ? 1 / h : h),
                r.translate(i.a.v[0], i.a.v[1], i.a.v[2]);
            }),
            (RepeaterModifier.prototype.init = function (t, e, r, i) {
              for (
                this.elem = t,
                  this.arr = e,
                  this.pos = r,
                  this.elemsData = i,
                  this._currentCopies = 0,
                  this._elements = [],
                  this._groups = [],
                  this.frameId = -1,
                  this.initDynamicPropertyContainer(t),
                  this.initModifierProperties(t, e[r]);
                0 < r;

              )
                this._elements.unshift(e[--r]);
              this.dynamicProperties.length ? (this.k = !0) : this.getValue(!0);
            }),
            (RepeaterModifier.prototype.resetElements = function (t) {
              for (var e = t.length, r = 0; r < e; r += 1)
                (t[r]._processed = !1),
                  'gr' === t[r].ty && this.resetElements(t[r].it);
            }),
            (RepeaterModifier.prototype.cloneElements = function (t) {
              t.length;
              t = JSON.parse(JSON.stringify(t));
              return this.resetElements(t), t;
            }),
            (RepeaterModifier.prototype.changeGroupRender = function (t, e) {
              for (var r = t.length, i = 0; i < r; i += 1)
                (t[i]._render = e),
                  'gr' === t[i].ty && this.changeGroupRender(t[i].it, e);
            }),
            (RepeaterModifier.prototype.processShapes = function (t) {
              var e, r, i, s, n;
              if (this._mdf || t) {
                var a,
                  o = Math.ceil(this.c.v);
                if (this._groups.length < o) {
                  for (; this._groups.length < o; ) {
                    var h = {
                      it: this.cloneElements(this._elements),
                      ty: 'gr',
                    };
                    h.it.push({
                      a: { a: 0, ix: 1, k: [0, 0] },
                      nm: 'Transform',
                      o: { a: 0, ix: 7, k: 100 },
                      p: { a: 0, ix: 2, k: [0, 0] },
                      r: {
                        a: 1,
                        ix: 6,
                        k: [
                          { s: 0, e: 0, t: 0 },
                          { s: 0, e: 0, t: 1 },
                        ],
                      },
                      s: { a: 0, ix: 3, k: [100, 100] },
                      sa: { a: 0, ix: 5, k: 0 },
                      sk: { a: 0, ix: 4, k: 0 },
                      ty: 'tr',
                    }),
                      this.arr.splice(0, 0, h),
                      this._groups.splice(0, 0, h),
                      (this._currentCopies += 1);
                  }
                  this.elem.reloadShapes();
                }
                for (i = n = 0; i <= this._groups.length - 1; i += 1)
                  (this._groups[i]._render = a = n < o),
                    this.changeGroupRender(this._groups[i].it, a),
                    (n += 1);
                this._currentCopies = o;
                var t = this.o.v,
                  l = t % 1,
                  p = 0 < t ? Math.floor(t) : Math.ceil(t),
                  c = (this.tr.v.props, this.pMatrix.props),
                  f = this.rMatrix.props,
                  d = this.sMatrix.props;
                this.pMatrix.reset(),
                  this.rMatrix.reset(),
                  this.sMatrix.reset(),
                  this.tMatrix.reset(),
                  this.matrix.reset();
                var u,
                  m,
                  y = 0;
                if (0 < t) {
                  for (; y < p; )
                    this.applyTransforms(
                      this.pMatrix,
                      this.rMatrix,
                      this.sMatrix,
                      this.tr,
                      1,
                      !1
                    ),
                      (y += 1);
                  l &&
                    (this.applyTransforms(
                      this.pMatrix,
                      this.rMatrix,
                      this.sMatrix,
                      this.tr,
                      l,
                      !1
                    ),
                    (y += l));
                } else if (t < 0) {
                  for (; p < y; )
                    this.applyTransforms(
                      this.pMatrix,
                      this.rMatrix,
                      this.sMatrix,
                      this.tr,
                      1,
                      !0
                    ),
                      --y;
                  l &&
                    (this.applyTransforms(
                      this.pMatrix,
                      this.rMatrix,
                      this.sMatrix,
                      this.tr,
                      -l,
                      !0
                    ),
                    (y -= l));
                }
                for (
                  i = 1 === this.data.m ? 0 : this._currentCopies - 1,
                    s = 1 === this.data.m ? 1 : -1,
                    n = this._currentCopies;
                  n;

                ) {
                  if (
                    ((m = (r = (e = this.elemsData[i].it)[e.length - 1]
                      .transform.mProps.v.props).length),
                    (e[e.length - 1].transform.mProps._mdf = !0),
                    (e[e.length - 1].transform.op._mdf = !0),
                    (e[e.length - 1].transform.op.v =
                      this.so.v +
                      (this.eo.v - this.so.v) *
                        (i / (this._currentCopies - 1))),
                    0 !== y)
                  ) {
                    for (
                      ((0 !== i && 1 === s) ||
                        (i !== this._currentCopies - 1 && -1 === s)) &&
                        this.applyTransforms(
                          this.pMatrix,
                          this.rMatrix,
                          this.sMatrix,
                          this.tr,
                          1,
                          !1
                        ),
                        this.matrix.transform(
                          f[0],
                          f[1],
                          f[2],
                          f[3],
                          f[4],
                          f[5],
                          f[6],
                          f[7],
                          f[8],
                          f[9],
                          f[10],
                          f[11],
                          f[12],
                          f[13],
                          f[14],
                          f[15]
                        ),
                        this.matrix.transform(
                          d[0],
                          d[1],
                          d[2],
                          d[3],
                          d[4],
                          d[5],
                          d[6],
                          d[7],
                          d[8],
                          d[9],
                          d[10],
                          d[11],
                          d[12],
                          d[13],
                          d[14],
                          d[15]
                        ),
                        this.matrix.transform(
                          c[0],
                          c[1],
                          c[2],
                          c[3],
                          c[4],
                          c[5],
                          c[6],
                          c[7],
                          c[8],
                          c[9],
                          c[10],
                          c[11],
                          c[12],
                          c[13],
                          c[14],
                          c[15]
                        ),
                        u = 0;
                      u < m;
                      u += 1
                    )
                      r[u] = this.matrix.props[u];
                    this.matrix.reset();
                  } else
                    for (this.matrix.reset(), u = 0; u < m; u += 1)
                      r[u] = this.matrix.props[u];
                  (y += 1), --n, (i += s);
                }
              } else
                for (n = this._currentCopies, i = 0, s = 1; n; )
                  (r = (e = this.elemsData[i].it)[e.length - 1].transform.mProps
                    .v.props),
                    (e[e.length - 1].transform.mProps._mdf = !1),
                    (e[e.length - 1].transform.op._mdf = !1),
                    --n,
                    (i += s);
            }),
            (RepeaterModifier.prototype.addShape = function () {}),
            ShapeModifiers.registerModifier('rp', RepeaterModifier),
            (ShapeCollection.prototype.addShape = function (t) {
              this._length === this._maxLength &&
                ((this.shapes = this.shapes.concat(
                  createSizedArray(this._maxLength)
                )),
                (this._maxLength *= 2)),
                (this.shapes[this._length] = t),
                (this._length += 1);
            }),
            (ShapeCollection.prototype.releaseShapes = function () {
              for (var t = 0; t < this._length; t += 1)
                shape_pool.release(this.shapes[t]);
              this._length = 0;
            }),
            (DashProperty.prototype.getValue = function (t) {
              if (
                (this.elem.globalData.frameId !== this.frameId || t) &&
                ((this.frameId = this.elem.globalData.frameId),
                this.iterateDynamicProperties(),
                (this._mdf = this._mdf || t),
                this._mdf)
              ) {
                var e = 0,
                  r = this.dataProps.length;
                for (
                  'svg' === this.renderer && (this.dashStr = ''), e = 0;
                  e < r;
                  e += 1
                )
                  'o' != this.dataProps[e].n
                    ? 'svg' === this.renderer
                      ? (this.dashStr += ' ' + this.dataProps[e].p.v)
                      : (this.dashArray[e] = this.dataProps[e].p.v)
                    : (this.dashoffset[0] = this.dataProps[e].p.v);
              }
            }),
            extendPrototype([DynamicPropertyContainer], DashProperty),
            (GradientProperty.prototype.comparePoints = function (t, e) {
              for (var r = 0, i = this.o.length / 2; r < i; ) {
                if (0.01 < Math.abs(t[4 * r] - t[4 * e + 2 * r])) return !1;
                r += 1;
              }
              return !0;
            }),
            (GradientProperty.prototype.checkCollapsable = function () {
              if (this.o.length / 2 != this.c.length / 4) return !1;
              if (this.data.k.k[0].s)
                for (var t = 0, e = this.data.k.k.length; t < e; ) {
                  if (!this.comparePoints(this.data.k.k[t].s, this.data.p))
                    return !1;
                  t += 1;
                }
              else if (!this.comparePoints(this.data.k.k, this.data.p))
                return !1;
              return !0;
            }),
            (GradientProperty.prototype.getValue = function (t) {
              if (
                (this.prop.getValue(),
                (this._mdf = !1),
                (this._cmdf = !1),
                (this._omdf = !1),
                this.prop._mdf || t)
              ) {
                for (var e, r, i = 4 * this.data.p, s = 0; s < i; s += 1)
                  (e = s % 4 == 0 ? 100 : 255),
                    (r = Math.round(this.prop.v[s] * e)),
                    this.c[s] !== r && ((this.c[s] = r), (this._cmdf = !t));
                if (this.o.length)
                  for (
                    i = this.prop.v.length, s = 4 * this.data.p;
                    s < i;
                    s += 1
                  )
                    (e = s % 2 == 0 ? 100 : 1),
                      (r =
                        s % 2 == 0
                          ? Math.round(100 * this.prop.v[s])
                          : this.prop.v[s]),
                      this.o[s - 4 * this.data.p] !== r &&
                        ((this.o[s - 4 * this.data.p] = r), (this._omdf = !t));
                this._mdf = !t;
              }
            }),
            extendPrototype([DynamicPropertyContainer], GradientProperty);
          var buildShapeString = function (t, e, r, i) {
              if (0 === e) return '';
              for (
                var s = t.o,
                  n = t.i,
                  a = t.v,
                  o = ' M' + i.applyToPointStringified(a[0][0], a[0][1]),
                  h = 1;
                h < e;
                h += 1
              )
                o +=
                  ' C' +
                  i.applyToPointStringified(s[h - 1][0], s[h - 1][1]) +
                  ' ' +
                  i.applyToPointStringified(n[h][0], n[h][1]) +
                  ' ' +
                  i.applyToPointStringified(a[h][0], a[h][1]);
              return (o =
                r && e
                  ? o +
                    (' C' +
                      i.applyToPointStringified(s[h - 1][0], s[h - 1][1]) +
                      ' ' +
                      i.applyToPointStringified(n[0][0], n[0][1]) +
                      ' ' +
                      i.applyToPointStringified(a[0][0], a[0][1])) +
                    'z'
                  : o);
            },
            ImagePreloader = (function () {
              ((t = createTag('canvas')).width = 1),
                (t.height = 1),
                ((e = t.getContext('2d')).fillStyle = 'rgba(0,0,0,0)'),
                e.fillRect(0, 0, 1, 1);
              var t,
                e,
                s = t;
              function r() {
                (this.loadedAssets += 1),
                  this.loadedAssets === this.totalImages &&
                    this.imagesLoadedCb &&
                    this.imagesLoadedCb(null);
              }
              function n(t, e, r) {
                var i = '';
                return (i = t.e
                  ? t.p
                  : e
                    ? e +
                      (e =
                        -1 !== (e = t.p).indexOf('images/')
                          ? e.split('/')[1]
                          : e)
                    : ((i = r), (i += t.u || '') + t.p));
              }
              function i(t) {
                (this._imageLoaded = r.bind(this)),
                  (this.assetsPath = ''),
                  (this.path = ''),
                  (this.totalImages = 0),
                  (this.loadedAssets = 0),
                  (this.imagesLoadedCb = null),
                  (this.images = []);
              }
              return (
                (i.prototype = {
                  loadAssets: function (t, e) {
                    this.imagesLoadedCb = e;
                    for (var r = t.length, i = 0; i < r; i += 1)
                      t[i].layers ||
                        ((this.totalImages += 1),
                        this.images.push(this._createImageData(t[i])));
                  },
                  setAssetsPath: function (t) {
                    this.assetsPath = t || '';
                  },
                  setPath: function (t) {
                    this.path = t || '';
                  },
                  loaded: function () {
                    return this.totalImages === this.loadedAssets;
                  },
                  destroy: function () {
                    (this.imagesLoadedCb = null), (this.images.length = 0);
                  },
                  getImage: function (t) {
                    for (var e = 0, r = this.images.length; e < r; ) {
                      if (this.images[e].assetData === t)
                        return this.images[e].img;
                      e += 1;
                    }
                  },
                  createImgData: function (t) {
                    var e = n(t, this.assetsPath, this.path),
                      r = createTag('img'),
                      i =
                        ((r.crossOrigin = 'anonymous'),
                        r.addEventListener('load', this._imageLoaded, !1),
                        r.addEventListener(
                          'error',
                          function () {
                            (i.img = s), this._imageLoaded();
                          }.bind(this),
                          !1
                        ),
                        (r.src = e),
                        { img: r, assetData: t });
                    return i;
                  },
                  createImageData: function (t) {
                    var e = n(t, this.assetsPath, this.path),
                      r = createNS('image'),
                      i =
                        (r.addEventListener('load', this._imageLoaded, !1),
                        r.addEventListener(
                          'error',
                          function () {
                            (i.img = s), this._imageLoaded();
                          }.bind(this),
                          !1
                        ),
                        r.setAttributeNS(
                          'http://www.w3.org/1999/xlink',
                          'href',
                          e
                        ),
                        { img: r, assetData: t });
                    return i;
                  },
                  imageLoaded: r,
                  setCacheType: function (t) {
                    this._createImageData = (
                      'svg' === t ? this.createImageData : this.createImgData
                    ).bind(this);
                  },
                }),
                i
              );
            })(),
            featureSupport = (function () {
              var t = { maskType: !0 };
              return (
                (/MSIE 10/i.test(navigator.userAgent) ||
                  /MSIE 9/i.test(navigator.userAgent) ||
                  /rv:11.0/i.test(navigator.userAgent) ||
                  /Edge\/\d./i.test(navigator.userAgent)) &&
                  (t.maskType = !1),
                t
              );
            })(),
            filtersFactory = (function () {
              var t = {
                createFilter: function (t) {
                  var e = createNS('filter');
                  return (
                    e.setAttribute('id', t),
                    e.setAttribute('filterUnits', 'objectBoundingBox'),
                    e.setAttribute('x', '0%'),
                    e.setAttribute('y', '0%'),
                    e.setAttribute('width', '100%'),
                    e.setAttribute('height', '100%'),
                    e
                  );
                },
                createAlphaToLuminanceFilter: function () {
                  var t = createNS('feColorMatrix');
                  return (
                    t.setAttribute('type', 'matrix'),
                    t.setAttribute('color-interpolation-filters', 'sRGB'),
                    t.setAttribute(
                      'values',
                      '0 0 0 1 0  0 0 0 1 0  0 0 0 1 0  0 0 0 1 1'
                    ),
                    t
                  );
                },
              };
              return t;
            })(),
            assetLoader = (function () {
              function n(t) {
                return t.response && 'object' == typeof t.response
                  ? t.response
                  : t.response && 'string' == typeof t.response
                    ? JSON.parse(t.response)
                    : t.responseText
                      ? JSON.parse(t.responseText)
                      : void 0;
              }
              return {
                load: function (t, e, r) {
                  var i,
                    s = new XMLHttpRequest();
                  s.open('GET', t, !0);
                  try {
                    s.responseType = 'json';
                  } catch (t) {}
                  s.send(),
                    (s.onreadystatechange = function () {
                      if (4 == s.readyState)
                        if (200 == s.status) (i = n(s)), e(i);
                        else
                          try {
                            (i = n(s)), e(i);
                          } catch (t) {
                            r && r(t);
                          }
                    });
                },
              };
            })();
          function TextAnimatorProperty(t, e, r) {
            (this._isFirstFrame = !0),
              (this._hasMaskedPath = !1),
              (this._frameId = -1),
              (this._textData = t),
              (this._renderType = e),
              (this._elem = r),
              (this._animatorsData = createSizedArray(this._textData.a.length)),
              (this._pathData = {}),
              (this._moreOptions = { alignment: {} }),
              (this.renderedLetters = []),
              (this.lettersChangedFlag = !1),
              this.initDynamicPropertyContainer(r);
          }
          function TextAnimatorDataProperty(t, e, r) {
            var i = { propType: !1 },
              s = PropertyFactory.getProp,
              n = e.a;
            (this.a = {
              r: n.r ? s(t, n.r, 0, degToRads, r) : i,
              rx: n.rx ? s(t, n.rx, 0, degToRads, r) : i,
              ry: n.ry ? s(t, n.ry, 0, degToRads, r) : i,
              sk: n.sk ? s(t, n.sk, 0, degToRads, r) : i,
              sa: n.sa ? s(t, n.sa, 0, degToRads, r) : i,
              s: n.s ? s(t, n.s, 1, 0.01, r) : i,
              a: n.a ? s(t, n.a, 1, 0, r) : i,
              o: n.o ? s(t, n.o, 0, 0.01, r) : i,
              p: n.p ? s(t, n.p, 1, 0, r) : i,
              sw: n.sw ? s(t, n.sw, 0, 0, r) : i,
              sc: n.sc ? s(t, n.sc, 1, 0, r) : i,
              fc: n.fc ? s(t, n.fc, 1, 0, r) : i,
              fh: n.fh ? s(t, n.fh, 0, 0, r) : i,
              fs: n.fs ? s(t, n.fs, 0, 0.01, r) : i,
              fb: n.fb ? s(t, n.fb, 0, 0.01, r) : i,
              t: n.t ? s(t, n.t, 0, 0, r) : i,
            }),
              (this.s = TextSelectorProp.getTextSelectorProp(t, e.s, r)),
              (this.s.t = e.s.t);
          }
          function LetterProps(t, e, r, i, s, n) {
            (this.o = t),
              (this.sw = e),
              (this.sc = r),
              (this.fc = i),
              (this.m = s),
              (this.p = n),
              (this._mdf = { o: !0, sw: !!e, sc: !!r, fc: !!i, m: !0, p: !0 });
          }
          function TextProperty(t, e) {
            (this._frameId = initialDefaultFrame),
              (this.pv = ''),
              (this.v = ''),
              (this.kf = !1),
              (this._isFirstFrame = !0),
              (this._mdf = !1),
              (this.data = e),
              (this.elem = t),
              (this.comp = this.elem.comp),
              (this.keysIndex = 0),
              (this.canResize = !1),
              (this.minimumFontSize = 1),
              (this.effectsSequence = []),
              (this.currentData = {
                ascent: 0,
                boxWidth: this.defaultBoxWidth,
                f: '',
                fStyle: '',
                fWeight: '',
                fc: '',
                j: '',
                justifyOffset: '',
                l: [],
                lh: 0,
                lineWidths: [],
                ls: '',
                of: '',
                s: '',
                sc: '',
                sw: 0,
                t: 0,
                tr: 0,
                sz: 0,
                ps: null,
                fillColorAnim: !1,
                strokeColorAnim: !1,
                strokeWidthAnim: !1,
                yOffset: 0,
                finalSize: 0,
                finalText: [],
                finalLineHeight: 0,
                __complete: !1,
              }),
              this.copyData(this.currentData, this.data.d.k[0].s),
              this.searchProperty() || this.completeTextData(this.currentData);
          }
          (TextAnimatorProperty.prototype.searchProperties = function () {
            for (
              var t,
                e = this._textData.a.length,
                r = PropertyFactory.getProp,
                i = 0;
              i < e;
              i += 1
            )
              (t = this._textData.a[i]),
                (this._animatorsData[i] = new TextAnimatorDataProperty(
                  this._elem,
                  t,
                  this
                ));
            this._textData.p && 'm' in this._textData.p
              ? ((this._pathData = {
                  f: r(this._elem, this._textData.p.f, 0, 0, this),
                  l: r(this._elem, this._textData.p.l, 0, 0, this),
                  r: this._textData.p.r,
                  m: this._elem.maskManager.getMaskProperty(this._textData.p.m),
                }),
                (this._hasMaskedPath = !0))
              : (this._hasMaskedPath = !1),
              (this._moreOptions.alignment = r(
                this._elem,
                this._textData.m.a,
                1,
                0,
                this
              ));
          }),
            (TextAnimatorProperty.prototype.getMeasures = function (t, L) {
              if (
                ((this.lettersChangedFlag = L),
                this._mdf ||
                  this._isFirstFrame ||
                  L ||
                  (this._hasMaskedPath && this._pathData.m._mdf))
              ) {
                this._isFirstFrame = !1;
                var e,
                  r,
                  i,
                  O,
                  s,
                  n,
                  a,
                  o,
                  h,
                  N,
                  l,
                  B,
                  p,
                  c = this._moreOptions.alignment.v,
                  f = this._animatorsData,
                  d = this._textData,
                  u = this.mHelper,
                  V = this._renderType,
                  G = this.renderedLetters.length,
                  m = (this.data, t.l);
                if (this._hasMaskedPath) {
                  if (
                    ((p = this._pathData.m),
                    !this._pathData.n || this._pathData._mdf)
                  ) {
                    for (
                      var y,
                        g = p.v,
                        v = { tLength: 0, segments: [] },
                        _ =
                          (g = this._pathData.r ? g.reverse() : g)._length - 1,
                        b = (l = 0);
                      b < _;
                      b += 1
                    )
                      (y = bez.buildBezierData(
                        g.v[b],
                        g.v[b + 1],
                        [g.o[b][0] - g.v[b][0], g.o[b][1] - g.v[b][1]],
                        [
                          g.i[b + 1][0] - g.v[b + 1][0],
                          g.i[b + 1][1] - g.v[b + 1][1],
                        ]
                      )),
                        (v.tLength += y.segmentLength),
                        v.segments.push(y),
                        (l += y.segmentLength);
                    (b = _),
                      p.v.c &&
                        ((y = bez.buildBezierData(
                          g.v[b],
                          g.v[0],
                          [g.o[b][0] - g.v[b][0], g.o[b][1] - g.v[b][1]],
                          [g.i[0][0] - g.v[0][0], g.i[0][1] - g.v[0][1]]
                        )),
                        (v.tLength += y.segmentLength),
                        v.segments.push(y),
                        (l += y.segmentLength)),
                      (this._pathData.pi = v);
                  }
                  if (
                    ((v = this._pathData.pi),
                    (e = this._pathData.f.v),
                    (s = 1),
                    (O = !(i = n = 0)),
                    (h = v.segments),
                    e < 0 && p.v.c)
                  )
                    for (
                      v.tLength < Math.abs(e) && (e = -Math.abs(e) % v.tLength),
                        s = (o = h[(n = h.length - 1)].points).length - 1;
                      e < 0;

                    )
                      (e += o[s].partialLength),
                        --s < 0 && (s = (o = h[--n].points).length - 1);
                  (a = (o = h[n].points)[s - 1]),
                    (N = (r = o[s]).partialLength);
                }
                _ = m.length;
                var S,
                  j,
                  P,
                  x,
                  U,
                  W,
                  k,
                  E,
                  w,
                  A,
                  T,
                  H,
                  q,
                  Z,
                  Y,
                  C,
                  I = 0,
                  X = 0,
                  K = 1.2 * t.finalSize * 0.714,
                  J = !0,
                  F = f.length,
                  Q = -1,
                  $ = e,
                  tt = n,
                  et = s,
                  rt = -1,
                  it = '',
                  st = this.defaultPropsArray;
                if (2 === t.j || 1 === t.j) {
                  var M = 0,
                    nt = 0,
                    at = 2 === t.j ? -0.5 : -1,
                    D = 0,
                    ot = !0;
                  for (b = 0; b < _; b += 1)
                    if (m[b].n) {
                      for (M && (M += nt); D < b; )
                        (m[D].animatorJustifyOffset = M), (D += 1);
                      ot = !(M = 0);
                    } else {
                      for (z = 0; z < F; z += 1)
                        (S = f[z].a).t.propType &&
                          (ot && 2 === t.j && (nt += S.t.v * at),
                          (P = f[z].s.getMult(
                            m[b].anIndexes[z],
                            d.a[z].s.totalChars
                          )).length
                            ? (M += S.t.v * P[0] * at)
                            : (M += S.t.v * P * at));
                      ot = !1;
                    }
                  for (M && (M += nt); D < b; )
                    (m[D].animatorJustifyOffset = M), (D += 1);
                }
                for (b = 0; b < _; b += 1) {
                  if ((u.reset(), (k = 1), m[b].n))
                    (I = 0),
                      (X = X + t.yOffset + (J ? 1 : 0)),
                      (e = $),
                      (J = !1),
                      this._hasMaskedPath &&
                        ((a = (o = h[(n = tt)].points)[(s = et) - 1]),
                        (N = (r = o[s]).partialLength),
                        (i = 0)),
                      (Y = H = Z = it = ''),
                      (st = this.defaultPropsArray);
                  else {
                    if (this._hasMaskedPath) {
                      if (rt !== m[b].line) {
                        switch (t.j) {
                          case 1:
                            e += l - t.lineWidths[m[b].line];
                            break;
                          case 2:
                            e += (l - t.lineWidths[m[b].line]) / 2;
                        }
                        rt = m[b].line;
                      }
                      Q !== m[b].ind &&
                        (m[Q] && (e += m[Q].extra),
                        (e += m[b].an / 2),
                        (Q = m[b].ind)),
                        (e += (c[0] * m[b].an) / 200);
                      for (var R = 0, z = 0; z < F; z += 1)
                        (S = f[z].a).p.propType &&
                          ((P = f[z].s.getMult(
                            m[b].anIndexes[z],
                            d.a[z].s.totalChars
                          )).length
                            ? (R += S.p.v[0] * P[0])
                            : (R += S.p.v[0] * P)),
                          S.a.propType &&
                            ((P = f[z].s.getMult(
                              m[b].anIndexes[z],
                              d.a[z].s.totalChars
                            )).length
                              ? (R += S.a.v[0] * P[0])
                              : (R += S.a.v[0] * P));
                      for (O = !0; O; )
                        e + R <= i + N || !o
                          ? ((B = (e + R - i) / r.partialLength),
                            (U = a.point[0] + (r.point[0] - a.point[0]) * B),
                            (W = a.point[1] + (r.point[1] - a.point[1]) * B),
                            u.translate(
                              (-c[0] * m[b].an) / 200,
                              (-c[1] * K) / 100
                            ),
                            (O = !1))
                          : o &&
                            ((i += r.partialLength),
                            (s += 1) >= o.length &&
                              ((s = 0),
                              (o = h[(n += 1)]
                                ? h[n].points
                                : p.v.c
                                  ? h[(n = s = 0)].points
                                  : ((i -= r.partialLength), null))),
                            o) &&
                            ((a = r), (N = (r = o[s]).partialLength));
                      (x = m[b].an / 2 - m[b].add), u.translate(-x, 0, 0);
                    } else
                      (x = m[b].an / 2 - m[b].add),
                        u.translate(-x, 0, 0),
                        u.translate(
                          (-c[0] * m[b].an) / 200,
                          (-c[1] * K) / 100,
                          0
                        );
                    for (m[b].l, z = 0; z < F; z += 1)
                      (S = f[z].a).t.propType &&
                        ((P = f[z].s.getMult(
                          m[b].anIndexes[z],
                          d.a[z].s.totalChars
                        )),
                        (0 === I && 0 === t.j) ||
                          (this._hasMaskedPath
                            ? P.length
                              ? (e += S.t.v * P[0])
                              : (e += S.t.v * P)
                            : P.length
                              ? (I += S.t.v * P[0])
                              : (I += S.t.v * P)));
                    for (
                      m[b].l,
                        t.strokeWidthAnim && (w = t.sw || 0),
                        t.strokeColorAnim &&
                          (E = t.sc ? [t.sc[0], t.sc[1], t.sc[2]] : [0, 0, 0]),
                        t.fillColorAnim &&
                          t.fc &&
                          (A = [t.fc[0], t.fc[1], t.fc[2]]),
                        z = 0;
                      z < F;
                      z += 1
                    )
                      (S = f[z].a).a.propType &&
                        ((P = f[z].s.getMult(
                          m[b].anIndexes[z],
                          d.a[z].s.totalChars
                        )).length
                          ? u.translate(
                              -S.a.v[0] * P[0],
                              -S.a.v[1] * P[1],
                              S.a.v[2] * P[2]
                            )
                          : u.translate(
                              -S.a.v[0] * P,
                              -S.a.v[1] * P,
                              S.a.v[2] * P
                            ));
                    for (z = 0; z < F; z += 1)
                      (S = f[z].a).s.propType &&
                        ((P = f[z].s.getMult(
                          m[b].anIndexes[z],
                          d.a[z].s.totalChars
                        )).length
                          ? u.scale(
                              1 + (S.s.v[0] - 1) * P[0],
                              1 + (S.s.v[1] - 1) * P[1],
                              1
                            )
                          : u.scale(
                              1 + (S.s.v[0] - 1) * P,
                              1 + (S.s.v[1] - 1) * P,
                              1
                            ));
                    for (z = 0; z < F; z += 1) {
                      if (
                        ((S = f[z].a),
                        (P = f[z].s.getMult(
                          m[b].anIndexes[z],
                          d.a[z].s.totalChars
                        )),
                        S.sk.propType &&
                          (P.length
                            ? u.skewFromAxis(-S.sk.v * P[0], S.sa.v * P[1])
                            : u.skewFromAxis(-S.sk.v * P, S.sa.v * P)),
                        S.r.propType &&
                          (P.length
                            ? u.rotateZ(-S.r.v * P[2])
                            : u.rotateZ(-S.r.v * P)),
                        S.ry.propType &&
                          (P.length
                            ? u.rotateY(S.ry.v * P[1])
                            : u.rotateY(S.ry.v * P)),
                        S.rx.propType &&
                          (P.length
                            ? u.rotateX(S.rx.v * P[0])
                            : u.rotateX(S.rx.v * P)),
                        S.o.propType &&
                          (P.length
                            ? (k += (S.o.v * P[0] - k) * P[0])
                            : (k += (S.o.v * P - k) * P)),
                        t.strokeWidthAnim &&
                          S.sw.propType &&
                          (P.length ? (w += S.sw.v * P[0]) : (w += S.sw.v * P)),
                        t.strokeColorAnim && S.sc.propType)
                      )
                        for (T = 0; T < 3; T += 1)
                          P.length
                            ? (E[T] = E[T] + (S.sc.v[T] - E[T]) * P[0])
                            : (E[T] = E[T] + (S.sc.v[T] - E[T]) * P);
                      if (t.fillColorAnim && t.fc) {
                        if (S.fc.propType)
                          for (T = 0; T < 3; T += 1)
                            P.length
                              ? (A[T] = A[T] + (S.fc.v[T] - A[T]) * P[0])
                              : (A[T] = A[T] + (S.fc.v[T] - A[T]) * P);
                        S.fh.propType &&
                          (A = P.length
                            ? addHueToRGB(A, S.fh.v * P[0])
                            : addHueToRGB(A, S.fh.v * P)),
                          S.fs.propType &&
                            (A = P.length
                              ? addSaturationToRGB(A, S.fs.v * P[0])
                              : addSaturationToRGB(A, S.fs.v * P)),
                          S.fb.propType &&
                            (A = P.length
                              ? addBrightnessToRGB(A, S.fb.v * P[0])
                              : addBrightnessToRGB(A, S.fb.v * P));
                      }
                    }
                    for (z = 0; z < F; z += 1)
                      (S = f[z].a).p.propType &&
                        ((P = f[z].s.getMult(
                          m[b].anIndexes[z],
                          d.a[z].s.totalChars
                        )),
                        this._hasMaskedPath
                          ? P.length
                            ? u.translate(0, S.p.v[1] * P[0], -S.p.v[2] * P[1])
                            : u.translate(0, S.p.v[1] * P, -S.p.v[2] * P)
                          : P.length
                            ? u.translate(
                                S.p.v[0] * P[0],
                                S.p.v[1] * P[1],
                                -S.p.v[2] * P[2]
                              )
                            : u.translate(
                                S.p.v[0] * P,
                                S.p.v[1] * P,
                                -S.p.v[2] * P
                              ));
                    if (
                      (t.strokeWidthAnim && (H = w < 0 ? 0 : w),
                      t.strokeColorAnim &&
                        (q =
                          'rgb(' +
                          Math.round(255 * E[0]) +
                          ',' +
                          Math.round(255 * E[1]) +
                          ',' +
                          Math.round(255 * E[2]) +
                          ')'),
                      t.fillColorAnim &&
                        t.fc &&
                        (Z =
                          'rgb(' +
                          Math.round(255 * A[0]) +
                          ',' +
                          Math.round(255 * A[1]) +
                          ',' +
                          Math.round(255 * A[2]) +
                          ')'),
                      this._hasMaskedPath)
                    )
                      u.translate(0, -t.ls),
                        u.translate(0, (c[1] * K) / 100 + X, 0),
                        d.p.p &&
                          ((C =
                            (r.point[1] - a.point[1]) /
                            (r.point[0] - a.point[0])),
                          (C = (180 * Math.atan(C)) / Math.PI),
                          r.point[0] < a.point[0] && (C += 180),
                          u.rotate((-C * Math.PI) / 180)),
                        u.translate(U, W, 0),
                        (e -= (c[0] * m[b].an) / 200),
                        m[b + 1] &&
                          Q !== m[b + 1].ind &&
                          (e = (e += m[b].an / 2) + (t.tr / 1e3) * t.finalSize);
                    else {
                      switch (
                        (u.translate(I, X, 0),
                        t.ps && u.translate(t.ps[0], t.ps[1] + t.ascent, 0),
                        t.j)
                      ) {
                        case 1:
                          u.translate(
                            m[b].animatorJustifyOffset +
                              t.justifyOffset +
                              (t.boxWidth - t.lineWidths[m[b].line]),
                            0,
                            0
                          );
                          break;
                        case 2:
                          u.translate(
                            m[b].animatorJustifyOffset +
                              t.justifyOffset +
                              (t.boxWidth - t.lineWidths[m[b].line]) / 2,
                            0,
                            0
                          );
                      }
                      u.translate(0, -t.ls),
                        u.translate(x, 0, 0),
                        u.translate(
                          (c[0] * m[b].an) / 200,
                          (c[1] * K) / 100,
                          0
                        ),
                        (I += m[b].l + (t.tr / 1e3) * t.finalSize);
                    }
                    'html' === V
                      ? (it = u.toCSS())
                      : 'svg' === V
                        ? (it = u.to2dCSS())
                        : (st = [
                            u.props[0],
                            u.props[1],
                            u.props[2],
                            u.props[3],
                            u.props[4],
                            u.props[5],
                            u.props[6],
                            u.props[7],
                            u.props[8],
                            u.props[9],
                            u.props[10],
                            u.props[11],
                            u.props[12],
                            u.props[13],
                            u.props[14],
                            u.props[15],
                          ]),
                      (Y = k);
                  }
                  G <= b
                    ? ((j = new LetterProps(Y, H, q, Z, it, st)),
                      this.renderedLetters.push(j),
                      (G += 1),
                      (this.lettersChangedFlag = !0))
                    : ((j = this.renderedLetters[b]),
                      (this.lettersChangedFlag =
                        j.update(Y, H, q, Z, it, st) ||
                        this.lettersChangedFlag));
                }
              }
            }),
            (TextAnimatorProperty.prototype.getValue = function () {
              this._elem.globalData.frameId !== this._frameId &&
                ((this._frameId = this._elem.globalData.frameId),
                this.iterateDynamicProperties());
            }),
            (TextAnimatorProperty.prototype.mHelper = new Matrix()),
            (TextAnimatorProperty.prototype.defaultPropsArray = []),
            extendPrototype([DynamicPropertyContainer], TextAnimatorProperty),
            (LetterProps.prototype.update = function (t, e, r, i, s, n) {
              (this._mdf.o = !1),
                (this._mdf.sw = !1),
                (this._mdf.sc = !1),
                (this._mdf.fc = !1),
                (this._mdf.m = !1);
              var a = (this._mdf.p = !1);
              return (
                this.o !== t && ((this.o = t), (a = this._mdf.o = !0)),
                this.sw !== e && ((this.sw = e), (a = this._mdf.sw = !0)),
                this.sc !== r && ((this.sc = r), (a = this._mdf.sc = !0)),
                this.fc !== i && ((this.fc = i), (a = this._mdf.fc = !0)),
                this.m !== s && ((this.m = s), (a = this._mdf.m = !0)),
                !n.length ||
                  (this.p[0] === n[0] &&
                    this.p[1] === n[1] &&
                    this.p[4] === n[4] &&
                    this.p[5] === n[5] &&
                    this.p[12] === n[12] &&
                    this.p[13] === n[13]) ||
                  ((this.p = n), (a = this._mdf.p = !0)),
                a
              );
            }),
            (TextProperty.prototype.defaultBoxWidth = [0, 0]),
            (TextProperty.prototype.copyData = function (t, e) {
              for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
              return t;
            }),
            (TextProperty.prototype.setCurrentData = function (t) {
              t.__complete || this.completeTextData(t),
                (this.currentData = t),
                (this.currentData.boxWidth =
                  this.currentData.boxWidth || this.defaultBoxWidth),
                (this._mdf = !0);
            }),
            (TextProperty.prototype.searchProperty = function () {
              return this.searchKeyframes();
            }),
            (TextProperty.prototype.searchKeyframes = function () {
              return (
                (this.kf = 1 < this.data.d.k.length),
                this.kf && this.addEffect(this.getKeyframeValue.bind(this)),
                this.kf
              );
            }),
            (TextProperty.prototype.addEffect = function (t) {
              this.effectsSequence.push(t), this.elem.addDynamicProperty(this);
            }),
            (TextProperty.prototype.getValue = function (t) {
              if (
                (this.elem.globalData.frameId !== this.frameId &&
                  this.effectsSequence.length) ||
                t
              ) {
                this.currentData.t = this.data.d.k[this.keysIndex].s.t;
                var e = this.currentData,
                  r = this.keysIndex;
                if (this.lock) this.setCurrentData(this.currentData);
                else {
                  (this.lock = !0), (this._mdf = !1);
                  for (
                    var i = this.effectsSequence.length,
                      s = t || this.data.d.k[this.keysIndex].s,
                      n = 0;
                    n < i;
                    n += 1
                  )
                    s =
                      r !== this.keysIndex
                        ? this.effectsSequence[n](s, s.t)
                        : this.effectsSequence[n](this.currentData, s.t);
                  e !== s && this.setCurrentData(s),
                    (this.pv = this.v = this.currentData),
                    (this.lock = !1),
                    (this.frameId = this.elem.globalData.frameId);
                }
              }
            }),
            (TextProperty.prototype.getKeyframeValue = function () {
              for (
                var t = this.data.d.k,
                  e = this.elem.comp.renderedFrame,
                  r = 0,
                  i = t.length;
                r <= i - 1 && (t[r].s, !(r === i - 1 || t[r + 1].t > e));

              )
                r += 1;
              return (
                this.keysIndex !== r && (this.keysIndex = r),
                this.data.d.k[this.keysIndex].s
              );
            }),
            (TextProperty.prototype.buildFinalText = function (t) {
              for (
                var e,
                  r = FontManager.getCombinedCharacterCodes(),
                  i = [],
                  s = 0,
                  n = t.length;
                s < n;

              )
                (e = t.charCodeAt(s)),
                  -1 !== r.indexOf(e)
                    ? (i[i.length - 1] += t.charAt(s))
                    : 55296 <= e &&
                        e <= 56319 &&
                        56320 <= (e = t.charCodeAt(s + 1)) &&
                        e <= 57343
                      ? (i.push(t.substr(s, 2)), ++s)
                      : i.push(t.charAt(s)),
                  (s += 1);
              return i;
            }),
            (TextProperty.prototype.completeTextData = function (t) {
              t.__complete = !0;
              var e,
                r,
                i,
                s = this.elem.globalData.fontManager,
                n = this.data,
                a = [],
                o = 0,
                h = n.m.g,
                l = 0,
                p = 0,
                c = 0,
                f = [],
                d = 0,
                u = 0,
                m = s.getFontByName(t.f),
                y = 0,
                g = m.fStyle ? m.fStyle.split(' ') : [],
                v = 'normal',
                _ = 'normal';
              for (E = g.length, A = 0; A < E; A += 1)
                switch (g[A].toLowerCase()) {
                  case 'italic':
                    _ = 'italic';
                    break;
                  case 'bold':
                    v = '700';
                    break;
                  case 'black':
                    v = '900';
                    break;
                  case 'medium':
                    v = '500';
                    break;
                  case 'regular':
                  case 'normal':
                    v = '400';
                    break;
                  case 'light':
                  case 'thin':
                    v = '200';
                }
              (t.fWeight = m.fWeight || v),
                (t.fStyle = _),
                (t.finalSize = t.s),
                (t.finalText = this.buildFinalText(t.t)),
                (E = t.finalText.length),
                (t.finalLineHeight = t.lh);
              var b,
                S = (t.tr / 1e3) * t.finalSize;
              if (t.sz)
                for (var P, x = !0, L = t.sz[0], O = t.sz[1]; x; ) {
                  for (
                    var k = 0,
                      d = 0,
                      E = (P = this.buildFinalText(t.t)).length,
                      S = (t.tr / 1e3) * t.finalSize,
                      w = -1,
                      A = 0;
                    A < E;
                    A += 1
                  )
                    (b = P[A].charCodeAt(0)),
                      (e = !1),
                      ' ' === P[A]
                        ? (w = A)
                        : (13 !== b && 3 !== b) ||
                          ((e = !(d = 0)),
                          (k += t.finalLineHeight || 1.2 * t.finalSize)),
                      L <
                        d +
                          (y = s.chars
                            ? ((i = s.getCharData(P[A], m.fStyle, m.fFamily)),
                              e ? 0 : (i.w * t.finalSize) / 100)
                            : s.measureText(P[A], t.f, t.finalSize)) &&
                      ' ' !== P[A]
                        ? (-1 === w ? (E += 1) : (A = w),
                          (k += t.finalLineHeight || 1.2 * t.finalSize),
                          P.splice(A, w === A ? 1 : 0, '\r'),
                          (w = -1),
                          (d = 0))
                        : (d = d + y + S);
                  (k += (m.ascent * t.finalSize) / 100),
                    this.canResize &&
                    t.finalSize > this.minimumFontSize &&
                    O < k
                      ? (--t.finalSize,
                        (t.finalLineHeight = (t.finalSize * t.lh) / t.s))
                      : ((t.finalText = P), (E = t.finalText.length), (x = !1));
                }
              d = -S;
              var T,
                y = 0,
                C = 0;
              for (A = 0; A < E; A += 1)
                if (
                  ((e = !1),
                  13 === (b = (T = t.finalText[A]).charCodeAt(0)) || 3 === b
                    ? ((C = 0),
                      f.push(d),
                      (u = u < d ? d : u),
                      (d = -2 * S),
                      (e = !(r = '')),
                      (c += 1))
                    : (r = T),
                  (y = s.chars
                    ? ((i = s.getCharData(
                        T,
                        m.fStyle,
                        s.getFontByName(t.f).fFamily
                      )),
                      e ? 0 : (i.w * t.finalSize) / 100)
                    : s.measureText(r, t.f, t.finalSize)),
                  ' ' === T ? (C += y + S) : ((d += y + S + C), (C = 0)),
                  a.push({
                    l: y,
                    an: y,
                    add: l,
                    n: e,
                    anIndexes: [],
                    val: r,
                    line: c,
                    animatorJustifyOffset: 0,
                  }),
                  2 == h)
                ) {
                  if (((l += y), '' === r || ' ' === r || A === E - 1)) {
                    for (('' !== r && ' ' !== r) || (l -= y); p <= A; )
                      (a[p].an = l), (a[p].ind = o), (a[p].extra = y), (p += 1);
                    (o += 1), (l = 0);
                  }
                } else if (3 == h) {
                  if (((l += y), '' === r || A === E - 1)) {
                    for ('' === r && (l -= y); p <= A; )
                      (a[p].an = l), (a[p].ind = o), (a[p].extra = y), (p += 1);
                    (l = 0), (o += 1);
                  }
                } else (a[o].ind = o), (a[o].extra = 0), (o += 1);
              if (((t.l = a), (u = u < d ? d : u), f.push(d), t.sz))
                (t.boxWidth = t.sz[0]), (t.justifyOffset = 0);
              else
                switch (((t.boxWidth = u), t.j)) {
                  case 1:
                    t.justifyOffset = -t.boxWidth;
                    break;
                  case 2:
                    t.justifyOffset = -t.boxWidth / 2;
                    break;
                  default:
                    t.justifyOffset = 0;
                }
              t.lineWidths = f;
              for (
                var I, F, M, D, N = n.a, B = N.length, R = [], z = 0;
                z < B;
                z += 1
              ) {
                for (
                  (I = N[z]).a.sc && (t.strokeColorAnim = !0),
                    I.a.sw && (t.strokeWidthAnim = !0),
                    (I.a.fc || I.a.fh || I.a.fs || I.a.fb) &&
                      (t.fillColorAnim = !0),
                    M = I.s.b,
                    A = D = 0;
                  A < E;
                  A += 1
                )
                  ((F = a[A]).anIndexes[z] = D),
                    ((1 == M && '' !== F.val) ||
                      (2 == M && '' !== F.val && ' ' !== F.val) ||
                      (3 == M && (F.n || ' ' == F.val || A == E - 1)) ||
                      (4 == M && (F.n || A == E - 1))) &&
                      (1 === I.s.rn && R.push(D), (D += 1));
                n.a[z].s.totalChars = D;
                var V,
                  G = -1;
                if (1 === I.s.rn)
                  for (A = 0; A < E; A += 1)
                    G != (F = a[A]).anIndexes[z] &&
                      ((G = F.anIndexes[z]),
                      (V = R.splice(
                        Math.floor(Math.random() * R.length),
                        1
                      )[0])),
                      (F.anIndexes[z] = V);
              }
              (t.yOffset = t.finalLineHeight || 1.2 * t.finalSize),
                (t.ls = t.ls || 0),
                (t.ascent = (m.ascent * t.finalSize) / 100);
            }),
            (TextProperty.prototype.updateDocumentData = function (t, e) {
              e = void 0 === e ? this.keysIndex : e;
              var r = this.copyData({}, this.data.d.k[e].s),
                r = this.copyData(r, t);
              (this.data.d.k[e].s = r),
                this.recalculate(e),
                this.elem.addDynamicProperty(this);
            }),
            (TextProperty.prototype.recalculate = function (t) {
              t = this.data.d.k[t].s;
              (t.__complete = !1),
                (this.keysIndex = 0),
                (this._isFirstFrame = !0),
                this.getValue(t);
            }),
            (TextProperty.prototype.canResizeFont = function (t) {
              (this.canResize = t),
                this.recalculate(this.keysIndex),
                this.elem.addDynamicProperty(this);
            }),
            (TextProperty.prototype.setMinimumFontSize = function (t) {
              (this.minimumFontSize = Math.floor(t) || 1),
                this.recalculate(this.keysIndex),
                this.elem.addDynamicProperty(this);
            });
          var TextSelectorProp = (function () {
              var h = Math.max,
                l = Math.min,
                p = Math.floor;
              function i(t, e) {
                (this._currentTextLength = -1),
                  (this.k = !1),
                  (this.data = e),
                  (this.elem = t),
                  (this.comp = t.comp),
                  (this.finalS = 0),
                  (this.finalE = 0),
                  this.initDynamicPropertyContainer(t),
                  (this.s = PropertyFactory.getProp(
                    t,
                    e.s || { k: 0 },
                    0,
                    0,
                    this
                  )),
                  (this.e =
                    'e' in e
                      ? PropertyFactory.getProp(t, e.e, 0, 0, this)
                      : { v: 100 }),
                  (this.o = PropertyFactory.getProp(
                    t,
                    e.o || { k: 0 },
                    0,
                    0,
                    this
                  )),
                  (this.xe = PropertyFactory.getProp(
                    t,
                    e.xe || { k: 0 },
                    0,
                    0,
                    this
                  )),
                  (this.ne = PropertyFactory.getProp(
                    t,
                    e.ne || { k: 0 },
                    0,
                    0,
                    this
                  )),
                  (this.a = PropertyFactory.getProp(t, e.a, 0, 0.01, this)),
                  this.dynamicProperties.length || this.getValue();
              }
              return (
                (i.prototype = {
                  getMult: function (t) {
                    this._currentTextLength !==
                      this.elem.textProperty.currentData.l.length &&
                      this.getValue();
                    var e,
                      r,
                      i = 0,
                      s = 0,
                      n = 1,
                      a = 1,
                      i =
                        (0 < this.ne.v
                          ? (i = this.ne.v / 100)
                          : (s = -this.ne.v / 100),
                        0 < this.xe.v
                          ? (n = 1 - this.xe.v / 100)
                          : (a = 1 + this.xe.v / 100),
                        BezierFactory.getBezierEasing(i, s, n, a).get),
                      s = 0,
                      n = this.finalS,
                      a = this.finalE,
                      o = this.data.sh;
                    return (
                      (s =
                        2 === o
                          ? i(
                              (s =
                                a === n
                                  ? a <= t
                                    ? 1
                                    : 0
                                  : h(
                                      0,
                                      l(0.5 / (a - n) + (t - n) / (a - n), 1)
                                    ))
                            )
                          : 3 === o
                            ? i(
                                (s =
                                  a === n
                                    ? a <= t
                                      ? 0
                                      : 1
                                    : 1 -
                                      h(
                                        0,
                                        l(0.5 / (a - n) + (t - n) / (a - n), 1)
                                      ))
                              )
                            : 4 === o
                              ? (a === n
                                  ? (s = 0)
                                  : (s = h(
                                        0,
                                        l(0.5 / (a - n) + (t - n) / (a - n), 1)
                                      )) < 0.5
                                    ? (s *= 2)
                                    : (s = 1 - 2 * (s - 0.5)),
                                i(s))
                              : 5 === o
                                ? i(
                                    (s =
                                      a === n
                                        ? 0
                                        : ((e =
                                            -(r = a - n) / 2 +
                                            (t = l(h(0, t + 0.5 - n), a - n))),
                                          (r = r / 2),
                                          Math.sqrt(1 - (e * e) / (r * r))))
                                  )
                                : (6 === o
                                    ? (s =
                                        a === n
                                          ? 0
                                          : ((t = l(h(0, t + 0.5 - n), a - n)),
                                            (1 +
                                              Math.cos(
                                                Math.PI +
                                                  (2 * Math.PI * t) / (a - n)
                                              )) /
                                              2))
                                    : t >= p(n) &&
                                      (s = h(
                                        0,
                                        l(
                                          t - n < 0 ? l(a, 1) - (n - t) : a - t,
                                          1
                                        )
                                      )),
                                  i(s))) * this.a.v
                    );
                  },
                  getValue: function (t) {
                    this.iterateDynamicProperties(),
                      (this._mdf = t || this._mdf),
                      (this._currentTextLength =
                        this.elem.textProperty.currentData.l.length || 0),
                      t &&
                        2 === this.data.r &&
                        (this.e.v = this._currentTextLength);
                    var t = 2 === this.data.r ? 1 : 100 / this.data.totalChars,
                      e = this.o.v / t,
                      r = this.s.v / t + e,
                      t = this.e.v / t + e;
                    t < r && ((e = r), (r = t), (t = e)),
                      (this.finalS = r),
                      (this.finalE = t);
                  },
                }),
                extendPrototype([DynamicPropertyContainer], i),
                {
                  getTextSelectorProp: function (t, e, r) {
                    return new i(t, e);
                  },
                }
              );
            })(),
            pool_factory = function (t, e, r, i) {
              var s = 0,
                n = t,
                a = createSizedArray(n);
              return {
                newElement: function () {
                  return s ? a[--s] : e();
                },
                release: function (t) {
                  s === n && ((a = pooling.double(a)), (n *= 2)),
                    r && r(t),
                    (a[s] = t),
                    (s += 1);
                },
              };
            },
            pooling = {
              double: function (t) {
                return t.concat(createSizedArray(t.length));
              },
            },
            point_pool = pool_factory(8, function () {
              return createTypedArray('float32', 2);
            }),
            shape_pool =
              ((factory = pool_factory(
                4,
                function () {
                  return new ShapePath();
                },
                function (t) {
                  for (var e = t._length, r = 0; r < e; r += 1)
                    point_pool.release(t.v[r]),
                      point_pool.release(t.i[r]),
                      point_pool.release(t.o[r]),
                      (t.v[r] = null),
                      (t.i[r] = null),
                      (t.o[r] = null);
                  (t._length = 0), (t.c = !1);
                }
              )),
              (factory.clone = function (t) {
                var e,
                  r = factory.newElement(),
                  i = void 0 === t._length ? t.v.length : t._length;
                for (r.setLength(i), r.c = t.c, e = 0; e < i; e += 1)
                  r.setTripleAt(
                    t.v[e][0],
                    t.v[e][1],
                    t.o[e][0],
                    t.o[e][1],
                    t.i[e][0],
                    t.i[e][1],
                    e
                  );
                return r;
              }),
              factory),
            factory,
            shapeCollection_pool = (function () {
              var t = {
                  newShapeCollection: function () {
                    return i ? n[--i] : new ShapeCollection();
                  },
                  release: function (t) {
                    for (var e = t._length, r = 0; r < e; r += 1)
                      shape_pool.release(t.shapes[r]);
                    (t._length = 0),
                      i === s && ((n = pooling.double(n)), (s *= 2)),
                      (n[i] = t),
                      (i += 1);
                  },
                },
                i = 0,
                s = 4,
                n = createSizedArray(s);
              return t;
            })(),
            segments_length_pool = pool_factory(
              8,
              function () {
                return { lengths: [], totalLength: 0 };
              },
              function (t) {
                for (var e = t.lengths.length, r = 0; r < e; r += 1)
                  bezier_length_pool.release(t.lengths[r]);
                t.lengths.length = 0;
              }
            ),
            bezier_length_pool = pool_factory(8, function () {
              return {
                addedLength: 0,
                percents: createTypedArray('float32', defaultCurveSegments),
                lengths: createTypedArray('float32', defaultCurveSegments),
              };
            });
          function BaseRenderer() {}
          function SVGRenderer(t, e) {
            (this.animationItem = t),
              (this.layers = null),
              (this.renderedFrame = -1),
              (this.svgElement = createNS('svg'));
            var t = '',
              r =
                (e &&
                  e.title &&
                  ((r = createNS('title')),
                  (i = createElementID()),
                  r.setAttribute('id', i),
                  (r.textContent = e.title),
                  this.svgElement.appendChild(r),
                  (t += i)),
                e &&
                  e.description &&
                  ((r = createNS('desc')),
                  (i = createElementID()),
                  r.setAttribute('id', i),
                  (r.textContent = e.description),
                  this.svgElement.appendChild(r),
                  (t += ' ' + i)),
                t && this.svgElement.setAttribute('aria-labelledby', t),
                createNS('defs')),
              i = (this.svgElement.appendChild(r), createNS('g'));
            this.svgElement.appendChild(i),
              (this.layerElement = i),
              (this.renderConfig = {
                preserveAspectRatio:
                  (e && e.preserveAspectRatio) || 'xMidYMid meet',
                imagePreserveAspectRatio:
                  (e && e.imagePreserveAspectRatio) || 'xMidYMid slice',
                progressiveLoad: (e && e.progressiveLoad) || !1,
                hideOnTransparent: !e || !1 !== e.hideOnTransparent,
                viewBoxOnly: (e && e.viewBoxOnly) || !1,
                viewBoxSize: (e && e.viewBoxSize) || !1,
                className: (e && e.className) || '',
                id: (e && e.id) || '',
                focusable: e && e.focusable,
                filterSize: {
                  width: (e && e.filterSize && e.filterSize.width) || '100%',
                  height: (e && e.filterSize && e.filterSize.height) || '100%',
                  x: (e && e.filterSize && e.filterSize.x) || '0%',
                  y: (e && e.filterSize && e.filterSize.y) || '0%',
                },
              }),
              (this.globalData = {
                _mdf: !1,
                frameNum: -1,
                defs: r,
                renderConfig: this.renderConfig,
              }),
              (this.elements = []),
              (this.pendingElements = []),
              (this.destroyed = !1),
              (this.rendererType = 'svg');
          }
          function MaskElement(t, e, r) {
            (this.data = t),
              (this.element = e),
              (this.globalData = r),
              (this.storedData = []),
              (this.masksProperties = this.data.masksProperties || []),
              (this.maskElement = null);
            var i = this.globalData.defs,
              s = this.masksProperties ? this.masksProperties.length : 0;
            (this.viewData = createSizedArray(s)), (this.solidPath = '');
            for (
              var n,
                a,
                o,
                h,
                l,
                p = this.masksProperties,
                c = 0,
                f = [],
                d = createElementID(),
                u = 'clipPath',
                m = 'clip-path',
                y = 0;
              y < s;
              y++
            )
              if (
                ((('a' !== p[y].mode && 'n' !== p[y].mode) ||
                  p[y].inv ||
                  100 !== p[y].o.k ||
                  p[y].o.x) &&
                  (m = u = 'mask'),
                ('s' != p[y].mode && 'i' != p[y].mode) || 0 !== c
                  ? (a = null)
                  : ((a = createNS('rect')).setAttribute('fill', '#ffffff'),
                    a.setAttribute('width', this.element.comp.data.w || 0),
                    a.setAttribute('height', this.element.comp.data.h || 0),
                    f.push(a)),
                (n = createNS('path')),
                'n' != p[y].mode)
              ) {
                if (
                  ((c += 1),
                  n.setAttribute(
                    'fill',
                    's' === p[y].mode ? '#000000' : '#ffffff'
                  ),
                  n.setAttribute('clip-rule', 'nonzero'),
                  0 !== p[y].x.k
                    ? ((m = u = 'mask'),
                      (h = PropertyFactory.getProp(
                        this.element,
                        p[y].x,
                        0,
                        null,
                        this.element
                      )),
                      (l = createElementID()),
                      (b = createNS('filter')).setAttribute('id', l),
                      (o = createNS('feMorphology')).setAttribute(
                        'operator',
                        'erode'
                      ),
                      o.setAttribute('in', 'SourceGraphic'),
                      o.setAttribute('radius', '0'),
                      b.appendChild(o),
                      i.appendChild(b),
                      n.setAttribute(
                        'stroke',
                        's' === p[y].mode ? '#000000' : '#ffffff'
                      ))
                    : (h = o = null),
                  (this.storedData[y] = {
                    elem: n,
                    x: h,
                    expan: o,
                    lastPath: '',
                    lastOperator: '',
                    filterId: l,
                    lastRadius: 0,
                  }),
                  'i' == p[y].mode)
                ) {
                  for (
                    var g = f.length, v = createNS('g'), _ = 0;
                    _ < g;
                    _ += 1
                  )
                    v.appendChild(f[_]);
                  var b = createNS('mask');
                  b.setAttribute('mask-type', 'alpha'),
                    b.setAttribute('id', d + '_' + c),
                    b.appendChild(n),
                    i.appendChild(b),
                    v.setAttribute(
                      'mask',
                      'url(' + locationHref + '#' + d + '_' + c + ')'
                    ),
                    (f.length = 0),
                    f.push(v);
                } else f.push(n);
                p[y].inv &&
                  !this.solidPath &&
                  (this.solidPath = this.createLayerSolidPath()),
                  (this.viewData[y] = {
                    elem: n,
                    lastPath: '',
                    op: PropertyFactory.getProp(
                      this.element,
                      p[y].o,
                      0,
                      0.01,
                      this.element
                    ),
                    prop: ShapePropertyFactory.getShapeProp(
                      this.element,
                      p[y],
                      3
                    ),
                    invRect: a,
                  }),
                  this.viewData[y].prop.k ||
                    this.drawPath(
                      p[y],
                      this.viewData[y].prop.v,
                      this.viewData[y]
                    );
              } else
                (this.viewData[y] = {
                  op: PropertyFactory.getProp(
                    this.element,
                    p[y].o,
                    0,
                    0.01,
                    this.element
                  ),
                  prop: ShapePropertyFactory.getShapeProp(
                    this.element,
                    p[y],
                    3
                  ),
                  elem: n,
                  lastPath: '',
                }),
                  i.appendChild(n);
            for (
              this.maskElement = createNS(u), s = f.length, y = 0;
              y < s;
              y += 1
            )
              this.maskElement.appendChild(f[y]);
            0 < c &&
              (this.maskElement.setAttribute('id', d),
              this.element.maskedElement.setAttribute(
                m,
                'url(' + locationHref + '#' + d + ')'
              ),
              i.appendChild(this.maskElement)),
              this.viewData.length && this.element.addRenderableComponent(this);
          }
          function HierarchyElement() {}
          function FrameElement() {}
          function TransformElement() {}
          function RenderableElement() {}
          function RenderableDOMElement() {}
          function ProcessedElement(t, e) {
            (this.elem = t), (this.pos = e);
          }
          function SVGStyleData(t, e) {
            (this.data = t),
              (this.type = t.ty),
              (this.d = ''),
              (this.lvl = e),
              (this._mdf = !1),
              (this.closed = !0 === t.hd),
              (this.pElem = createNS('path')),
              (this.msElem = null);
          }
          function SVGShapeData(t, e, r) {
            (this.caches = []),
              (this.styles = []),
              (this.transformers = t),
              (this.lStr = ''),
              (this.sh = r),
              (this.lvl = e),
              (this._isAnimated = !!r.k);
            for (var i = 0, s = t.length; i < s; ) {
              if (t[i].mProps.dynamicProperties.length) {
                this._isAnimated = !0;
                break;
              }
              i += 1;
            }
          }
          function SVGTransformData(t, e, r) {
            (this.transform = { mProps: t, op: e, container: r }),
              (this.elements = []),
              (this._isAnimated =
                this.transform.mProps.dynamicProperties.length ||
                this.transform.op.effectsSequence.length);
          }
          function SVGStrokeStyleData(t, e, r) {
            this.initDynamicPropertyContainer(t),
              (this.getValue = this.iterateDynamicProperties),
              (this.o = PropertyFactory.getProp(t, e.o, 0, 0.01, this)),
              (this.w = PropertyFactory.getProp(t, e.w, 0, null, this)),
              (this.d = new DashProperty(t, e.d || {}, 'svg', this)),
              (this.c = PropertyFactory.getProp(t, e.c, 1, 255, this)),
              (this.style = r),
              (this._isAnimated = !!this._isAnimated);
          }
          function SVGFillStyleData(t, e, r) {
            this.initDynamicPropertyContainer(t),
              (this.getValue = this.iterateDynamicProperties),
              (this.o = PropertyFactory.getProp(t, e.o, 0, 0.01, this)),
              (this.c = PropertyFactory.getProp(t, e.c, 1, 255, this)),
              (this.style = r);
          }
          function SVGGradientFillStyleData(t, e, r) {
            this.initDynamicPropertyContainer(t),
              (this.getValue = this.iterateDynamicProperties),
              this.initGradientData(t, e, r);
          }
          function SVGGradientStrokeStyleData(t, e, r) {
            this.initDynamicPropertyContainer(t),
              (this.getValue = this.iterateDynamicProperties),
              (this.w = PropertyFactory.getProp(t, e.w, 0, null, this)),
              (this.d = new DashProperty(t, e.d || {}, 'svg', this)),
              this.initGradientData(t, e, r),
              (this._isAnimated = !!this._isAnimated);
          }
          function ShapeGroupData() {
            (this.it = []), (this.prevViewData = []), (this.gr = createNS('g'));
          }
          (BaseRenderer.prototype.checkLayers = function (t) {
            var e,
              r,
              i = this.layers.length;
            for (this.completeLayers = !0, e = i - 1; 0 <= e; e--)
              this.elements[e] ||
                ((r = this.layers[e]).ip - r.st <= t - this.layers[e].st &&
                  r.op - r.st > t - this.layers[e].st &&
                  this.buildItem(e)),
                (this.completeLayers =
                  !!this.elements[e] && this.completeLayers);
            this.checkPendingElements();
          }),
            (BaseRenderer.prototype.createItem = function (t) {
              switch (t.ty) {
                case 2:
                  return this.createImage(t);
                case 0:
                  return this.createComp(t);
                case 1:
                  return this.createSolid(t);
                case 3:
                  return this.createNull(t);
                case 4:
                  return this.createShape(t);
                case 5:
                  return this.createText(t);
                case 13:
                  return this.createCamera(t);
              }
              return this.createNull(t);
            }),
            (BaseRenderer.prototype.createCamera = function () {
              throw new Error(
                "You're using a 3d camera. Try the html renderer."
              );
            }),
            (BaseRenderer.prototype.buildAllItems = function () {
              for (var t = this.layers.length, e = 0; e < t; e += 1)
                this.buildItem(e);
              this.checkPendingElements();
            }),
            (BaseRenderer.prototype.includeLayers = function (t) {
              this.completeLayers = !1;
              for (
                var e, r = t.length, i = this.layers.length, s = 0;
                s < r;
                s += 1
              )
                for (e = 0; e < i; ) {
                  if (this.layers[e].id == t[s].id) {
                    this.layers[e] = t[s];
                    break;
                  }
                  e += 1;
                }
            }),
            (BaseRenderer.prototype.setProjectInterface = function (t) {
              this.globalData.projectInterface = t;
            }),
            (BaseRenderer.prototype.initItems = function () {
              this.globalData.progressiveLoad || this.buildAllItems();
            }),
            (BaseRenderer.prototype.buildElementParenting = function (t, e, r) {
              for (
                var i = this.elements, s = this.layers, n = 0, a = s.length;
                n < a;

              )
                s[n].ind == e &&
                  (i[n] && !0 !== i[n]
                    ? (r.push(i[n]),
                      i[n].setAsParent(),
                      void 0 !== s[n].parent
                        ? this.buildElementParenting(t, s[n].parent, r)
                        : t.setHierarchy(r))
                    : (this.buildItem(n), this.addPendingElement(t))),
                  (n += 1);
            }),
            (BaseRenderer.prototype.addPendingElement = function (t) {
              this.pendingElements.push(t);
            }),
            (BaseRenderer.prototype.searchExtraCompositions = function (t) {
              for (var e, r = t.length, i = 0; i < r; i += 1)
                t[i].xt &&
                  ((e = this.createComp(t[i])).initExpressions(),
                  this.globalData.projectInterface.registerComposition(e));
            }),
            (BaseRenderer.prototype.setupGlobalData = function (t, e) {
              (this.globalData.fontManager = new FontManager()),
                this.globalData.fontManager.addChars(t.chars),
                this.globalData.fontManager.addFonts(t.fonts, e),
                (this.globalData.getAssetData =
                  this.animationItem.getAssetData.bind(this.animationItem)),
                (this.globalData.getAssetsPath =
                  this.animationItem.getAssetsPath.bind(this.animationItem)),
                (this.globalData.imageLoader =
                  this.animationItem.imagePreloader),
                (this.globalData.frameId = 0),
                (this.globalData.frameRate = t.fr),
                (this.globalData.nm = t.nm),
                (this.globalData.compSize = { w: t.w, h: t.h });
            }),
            extendPrototype([BaseRenderer], SVGRenderer),
            (SVGRenderer.prototype.createNull = function (t) {
              return new NullElement(t, this.globalData, this);
            }),
            (SVGRenderer.prototype.createShape = function (t) {
              return new SVGShapeElement(t, this.globalData, this);
            }),
            (SVGRenderer.prototype.createText = function (t) {
              return new SVGTextElement(t, this.globalData, this);
            }),
            (SVGRenderer.prototype.createImage = function (t) {
              return new IImageElement(t, this.globalData, this);
            }),
            (SVGRenderer.prototype.createComp = function (t) {
              return new SVGCompElement(t, this.globalData, this);
            }),
            (SVGRenderer.prototype.createSolid = function (t) {
              return new ISolidElement(t, this.globalData, this);
            }),
            (SVGRenderer.prototype.configAnimation = function (t) {
              this.svgElement.setAttribute(
                'xmlns',
                'http://www.w3.org/2000/svg'
              ),
                this.renderConfig.viewBoxSize
                  ? this.svgElement.setAttribute(
                      'viewBox',
                      this.renderConfig.viewBoxSize
                    )
                  : this.svgElement.setAttribute(
                      'viewBox',
                      '0 0 ' + t.w + ' ' + t.h
                    ),
                this.renderConfig.viewBoxOnly ||
                  (this.svgElement.setAttribute('width', t.w),
                  this.svgElement.setAttribute('height', t.h),
                  (this.svgElement.style.width = '100%'),
                  (this.svgElement.style.height = '100%'),
                  (this.svgElement.style.transform = 'translate3d(0,0,0)')),
                this.renderConfig.className &&
                  this.svgElement.setAttribute(
                    'class',
                    this.renderConfig.className
                  ),
                this.renderConfig.id &&
                  this.svgElement.setAttribute('id', this.renderConfig.id),
                void 0 !== this.renderConfig.focusable &&
                  this.svgElement.setAttribute(
                    'focusable',
                    this.renderConfig.focusable
                  ),
                this.svgElement.setAttribute(
                  'preserveAspectRatio',
                  this.renderConfig.preserveAspectRatio
                ),
                this.animationItem.wrapper.appendChild(this.svgElement);
              var e = this.globalData.defs,
                r =
                  (this.setupGlobalData(t, e),
                  (this.globalData.progressiveLoad =
                    this.renderConfig.progressiveLoad),
                  (this.data = t),
                  createNS('clipPath')),
                i = createNS('rect'),
                s =
                  (i.setAttribute('width', t.w),
                  i.setAttribute('height', t.h),
                  i.setAttribute('x', 0),
                  i.setAttribute('y', 0),
                  createElementID());
              r.setAttribute('id', s),
                r.appendChild(i),
                this.layerElement.setAttribute(
                  'clip-path',
                  'url(' + locationHref + '#' + s + ')'
                ),
                e.appendChild(r),
                (this.layers = t.layers),
                (this.elements = createSizedArray(t.layers.length));
            }),
            (SVGRenderer.prototype.destroy = function () {
              (this.animationItem.wrapper.innerHTML = ''),
                (this.layerElement = null),
                (this.globalData.defs = null);
              for (
                var t = this.layers ? this.layers.length : 0, e = 0;
                e < t;
                e++
              )
                this.elements[e] && this.elements[e].destroy();
              (this.elements.length = 0),
                (this.destroyed = !0),
                (this.animationItem = null);
            }),
            (SVGRenderer.prototype.updateContainerSize = function () {}),
            (SVGRenderer.prototype.buildItem = function (t) {
              var e,
                r = this.elements;
              r[t] ||
                99 == this.layers[t].ty ||
                ((r[t] = !0),
                (e = this.createItem(this.layers[t])),
                (r[t] = e),
                expressionsPlugin &&
                  (0 === this.layers[t].ty &&
                    this.globalData.projectInterface.registerComposition(e),
                  e.initExpressions()),
                this.appendElementInPos(e, t),
                this.layers[t].tt &&
                  (this.elements[t - 1] && !0 !== this.elements[t - 1]
                    ? e.setMatte(r[t - 1].layerId)
                    : (this.buildItem(t - 1), this.addPendingElement(e))));
            }),
            (SVGRenderer.prototype.checkPendingElements = function () {
              for (; this.pendingElements.length; ) {
                var t = this.pendingElements.pop();
                if ((t.checkParenting(), t.data.tt))
                  for (var e = 0, r = this.elements.length; e < r; ) {
                    if (this.elements[e] === t) {
                      t.setMatte(this.elements[e - 1].layerId);
                      break;
                    }
                    e += 1;
                  }
              }
            }),
            (SVGRenderer.prototype.renderFrame = function (t) {
              if (this.renderedFrame !== t && !this.destroyed) {
                null === t
                  ? (t = this.renderedFrame)
                  : (this.renderedFrame = t),
                  (this.globalData.frameNum = t),
                  (this.globalData.frameId += 1),
                  (this.globalData.projectInterface.currentFrame = t),
                  (this.globalData._mdf = !1);
                var e,
                  r = this.layers.length;
                for (
                  this.completeLayers || this.checkLayers(t), e = r - 1;
                  0 <= e;
                  e--
                )
                  (this.completeLayers || this.elements[e]) &&
                    this.elements[e].prepareFrame(t - this.layers[e].st);
                if (this.globalData._mdf)
                  for (e = 0; e < r; e += 1)
                    (this.completeLayers || this.elements[e]) &&
                      this.elements[e].renderFrame();
              }
            }),
            (SVGRenderer.prototype.appendElementInPos = function (t, e) {
              t = t.getBaseElement();
              if (t) {
                for (var r, i = 0; i < e; )
                  this.elements[i] &&
                    !0 !== this.elements[i] &&
                    this.elements[i].getBaseElement() &&
                    (r = this.elements[i].getBaseElement()),
                    (i += 1);
                r
                  ? this.layerElement.insertBefore(t, r)
                  : this.layerElement.appendChild(t);
              }
            }),
            (SVGRenderer.prototype.hide = function () {
              this.layerElement.style.display = 'none';
            }),
            (SVGRenderer.prototype.show = function () {
              this.layerElement.style.display = 'block';
            }),
            (MaskElement.prototype.getMaskProperty = function (t) {
              return this.viewData[t].prop;
            }),
            (MaskElement.prototype.renderFrame = function (t) {
              for (
                var e,
                  r = this.element.finalTransform.mat,
                  i = this.masksProperties.length,
                  s = 0;
                s < i;
                s++
              )
                (this.viewData[s].prop._mdf || t) &&
                  this.drawPath(
                    this.masksProperties[s],
                    this.viewData[s].prop.v,
                    this.viewData[s]
                  ),
                  (this.viewData[s].op._mdf || t) &&
                    this.viewData[s].elem.setAttribute(
                      'fill-opacity',
                      this.viewData[s].op.v
                    ),
                  'n' !== this.masksProperties[s].mode &&
                    (this.viewData[s].invRect &&
                      (this.element.finalTransform.mProp._mdf || t) &&
                      this.viewData[s].invRect.setAttribute(
                        'transform',
                        r.getInverseMatrix().to2dCSS()
                      ),
                    this.storedData[s].x) &&
                    (this.storedData[s].x._mdf || t) &&
                    ((e = this.storedData[s].expan),
                    this.storedData[s].x.v < 0
                      ? ('erode' !== this.storedData[s].lastOperator &&
                          ((this.storedData[s].lastOperator = 'erode'),
                          this.storedData[s].elem.setAttribute(
                            'filter',
                            'url(' +
                              locationHref +
                              '#' +
                              this.storedData[s].filterId +
                              ')'
                          )),
                        e.setAttribute('radius', -this.storedData[s].x.v))
                      : ('dilate' !== this.storedData[s].lastOperator &&
                          ((this.storedData[s].lastOperator = 'dilate'),
                          this.storedData[s].elem.setAttribute('filter', null)),
                        this.storedData[s].elem.setAttribute(
                          'stroke-width',
                          2 * this.storedData[s].x.v
                        )));
            }),
            (MaskElement.prototype.getMaskelement = function () {
              return this.maskElement;
            }),
            (MaskElement.prototype.createLayerSolidPath = function () {
              var t = 'M0,0 ';
              return (
                (t =
                  (t =
                    (t += ' h' + this.globalData.compSize.w) +
                    (' v' + this.globalData.compSize.h)) +
                  (' h-' + this.globalData.compSize.w)) +
                (' v-' + this.globalData.compSize.h) +
                ' '
              );
            }),
            (MaskElement.prototype.drawPath = function (t, e, r) {
              for (
                var i,
                  s = ' M' + e.v[0][0] + ',' + e.v[0][1],
                  n = e._length,
                  a = 1;
                a < n;
                a += 1
              )
                s +=
                  ' C' +
                  e.o[a - 1][0] +
                  ',' +
                  e.o[a - 1][1] +
                  ' ' +
                  e.i[a][0] +
                  ',' +
                  e.i[a][1] +
                  ' ' +
                  e.v[a][0] +
                  ',' +
                  e.v[a][1];
              e.c &&
                1 < n &&
                (s +=
                  ' C' +
                  e.o[a - 1][0] +
                  ',' +
                  e.o[a - 1][1] +
                  ' ' +
                  e.i[0][0] +
                  ',' +
                  e.i[0][1] +
                  ' ' +
                  e.v[0][0] +
                  ',' +
                  e.v[0][1]),
                r.lastPath !== s &&
                  ((i = ''),
                  r.elem &&
                    (e.c && (i = t.inv ? this.solidPath + s : s),
                    r.elem.setAttribute('d', i)),
                  (r.lastPath = s));
            }),
            (MaskElement.prototype.destroy = function () {
              (this.element = null),
                (this.globalData = null),
                (this.maskElement = null),
                (this.data = null),
                (this.masksProperties = null);
            }),
            (HierarchyElement.prototype = {
              initHierarchy: function () {
                (this.hierarchy = []),
                  (this._isParent = !1),
                  this.checkParenting();
              },
              setHierarchy: function (t) {
                this.hierarchy = t;
              },
              setAsParent: function () {
                this._isParent = !0;
              },
              checkParenting: function () {
                void 0 !== this.data.parent &&
                  this.comp.buildElementParenting(this, this.data.parent, []);
              },
            }),
            (FrameElement.prototype = {
              initFrame: function () {
                (this._isFirstFrame = !1),
                  (this.dynamicProperties = []),
                  (this._mdf = !1);
              },
              prepareProperties: function (t, e) {
                for (
                  var r = this.dynamicProperties.length, i = 0;
                  i < r;
                  i += 1
                )
                  (e ||
                    (this._isParent &&
                      'transform' === this.dynamicProperties[i].propType)) &&
                    (this.dynamicProperties[i].getValue(),
                    this.dynamicProperties[i]._mdf) &&
                    ((this.globalData._mdf = !0), (this._mdf = !0));
              },
              addDynamicProperty: function (t) {
                -1 === this.dynamicProperties.indexOf(t) &&
                  this.dynamicProperties.push(t);
              },
            }),
            (TransformElement.prototype = {
              initTransform: function () {
                (this.finalTransform = {
                  mProp: this.data.ks
                    ? TransformPropertyFactory.getTransformProperty(
                        this,
                        this.data.ks,
                        this
                      )
                    : { o: 0 },
                  _matMdf: !1,
                  _opMdf: !1,
                  mat: new Matrix(),
                }),
                  this.data.ao && (this.finalTransform.mProp.autoOriented = !0),
                  this.data.ty;
              },
              renderTransform: function () {
                if (
                  ((this.finalTransform._opMdf =
                    this.finalTransform.mProp.o._mdf || this._isFirstFrame),
                  (this.finalTransform._matMdf =
                    this.finalTransform.mProp._mdf || this._isFirstFrame),
                  this.hierarchy)
                ) {
                  var t,
                    e = this.finalTransform.mat,
                    r = 0,
                    i = this.hierarchy.length;
                  if (!this.finalTransform._matMdf)
                    for (; r < i; ) {
                      if (this.hierarchy[r].finalTransform.mProp._mdf) {
                        this.finalTransform._matMdf = !0;
                        break;
                      }
                      r += 1;
                    }
                  if (this.finalTransform._matMdf)
                    for (
                      t = this.finalTransform.mProp.v.props,
                        e.cloneFromProps(t),
                        r = 0;
                      r < i;
                      r += 1
                    )
                      (t = this.hierarchy[r].finalTransform.mProp.v.props),
                        e.transform(
                          t[0],
                          t[1],
                          t[2],
                          t[3],
                          t[4],
                          t[5],
                          t[6],
                          t[7],
                          t[8],
                          t[9],
                          t[10],
                          t[11],
                          t[12],
                          t[13],
                          t[14],
                          t[15]
                        );
                }
              },
              globalToLocal: function (t) {
                var e = [];
                e.push(this.finalTransform);
                for (var r = !0, i = this.comp; r; )
                  i.finalTransform
                    ? (i.data.hasMask && e.splice(0, 0, i.finalTransform),
                      (i = i.comp))
                    : (r = !1);
                for (var s, n = e.length, a = 0; a < n; a += 1)
                  (s = e[a].mat.applyToPointArray(0, 0, 0)),
                    (t = [t[0] - s[0], t[1] - s[1], 0]);
                return t;
              },
              mHelper: new Matrix(),
            }),
            (RenderableElement.prototype = {
              initRenderable: function () {
                (this.isInRange = !1),
                  (this.hidden = !1),
                  (this.isTransparent = !1),
                  (this.renderableComponents = []);
              },
              addRenderableComponent: function (t) {
                -1 === this.renderableComponents.indexOf(t) &&
                  this.renderableComponents.push(t);
              },
              removeRenderableComponent: function (t) {
                -1 !== this.renderableComponents.indexOf(t) &&
                  this.renderableComponents.splice(
                    this.renderableComponents.indexOf(t),
                    1
                  );
              },
              prepareRenderableFrame: function (t) {
                this.checkLayerLimits(t);
              },
              checkTransparency: function () {
                this.finalTransform.mProp.o.v <= 0
                  ? !this.isTransparent &&
                    this.globalData.renderConfig.hideOnTransparent &&
                    ((this.isTransparent = !0), this.hide())
                  : this.isTransparent &&
                    ((this.isTransparent = !1), this.show());
              },
              checkLayerLimits: function (t) {
                this.data.ip - this.data.st <= t &&
                this.data.op - this.data.st > t
                  ? !0 !== this.isInRange &&
                    ((this.globalData._mdf = !0),
                    (this._mdf = !0),
                    (this.isInRange = !0),
                    this.show())
                  : !1 !== this.isInRange &&
                    ((this.globalData._mdf = !0),
                    (this.isInRange = !1),
                    this.hide());
              },
              renderRenderable: function () {
                for (
                  var t = this.renderableComponents.length, e = 0;
                  e < t;
                  e += 1
                )
                  this.renderableComponents[e].renderFrame(this._isFirstFrame);
              },
              sourceRectAtTime: function () {
                return { top: 0, left: 0, width: 100, height: 100 };
              },
              getLayerSize: function () {
                return 5 === this.data.ty
                  ? {
                      w: this.data.textData.width,
                      h: this.data.textData.height,
                    }
                  : { w: this.data.width, h: this.data.height };
              },
            }),
            extendPrototype(
              [
                RenderableElement,
                createProxyFunction({
                  initElement: function (t, e, r) {
                    this.initFrame(),
                      this.initBaseData(t, e, r),
                      this.initTransform(t, e, r),
                      this.initHierarchy(),
                      this.initRenderable(),
                      this.initRendererElement(),
                      this.createContainerElements(),
                      this.createRenderableComponents(),
                      this.createContent(),
                      this.hide();
                  },
                  hide: function () {
                    this.hidden ||
                      (this.isInRange && !this.isTransparent) ||
                      (((this.baseElement || this.layerElement).style.display =
                        'none'),
                      (this.hidden = !0));
                  },
                  show: function () {
                    this.isInRange &&
                      !this.isTransparent &&
                      (this.data.hd ||
                        ((this.baseElement || this.layerElement).style.display =
                          'block'),
                      (this.hidden = !1),
                      (this._isFirstFrame = !0));
                  },
                  renderFrame: function () {
                    this.data.hd ||
                      this.hidden ||
                      (this.renderTransform(),
                      this.renderRenderable(),
                      this.renderElement(),
                      this.renderInnerContent(),
                      this._isFirstFrame && (this._isFirstFrame = !1));
                  },
                  renderInnerContent: function () {},
                  prepareFrame: function (t) {
                    (this._mdf = !1),
                      this.prepareRenderableFrame(t),
                      this.prepareProperties(t, this.isInRange),
                      this.checkTransparency();
                  },
                  destroy: function () {
                    (this.innerElem = null), this.destroyBaseElement();
                  },
                }),
              ],
              RenderableDOMElement
            ),
            (SVGStyleData.prototype.reset = function () {
              (this.d = ''), (this._mdf = !1);
            }),
            (SVGShapeData.prototype.setAsAnimated = function () {
              this._isAnimated = !0;
            }),
            extendPrototype([DynamicPropertyContainer], SVGStrokeStyleData),
            extendPrototype([DynamicPropertyContainer], SVGFillStyleData),
            (SVGGradientFillStyleData.prototype.initGradientData = function (
              t,
              e,
              r
            ) {
              (this.o = PropertyFactory.getProp(t, e.o, 0, 0.01, this)),
                (this.s = PropertyFactory.getProp(t, e.s, 1, null, this)),
                (this.e = PropertyFactory.getProp(t, e.e, 1, null, this)),
                (this.h = PropertyFactory.getProp(
                  t,
                  e.h || { k: 0 },
                  0,
                  0.01,
                  this
                )),
                (this.a = PropertyFactory.getProp(
                  t,
                  e.a || { k: 0 },
                  0,
                  degToRads,
                  this
                )),
                (this.g = new GradientProperty(t, e.g, this)),
                (this.style = r),
                (this.stops = []),
                this.setGradientData(r.pElem, e),
                this.setGradientOpacity(e, r),
                (this._isAnimated = !!this._isAnimated);
            }),
            (SVGGradientFillStyleData.prototype.setGradientData = function (
              t,
              e
            ) {
              var r = createElementID(),
                i = createNS(1 === e.t ? 'linearGradient' : 'radialGradient');
              i.setAttribute('id', r),
                i.setAttribute('spreadMethod', 'pad'),
                i.setAttribute('gradientUnits', 'userSpaceOnUse');
              for (var s, n = [], a = 4 * e.g.p, o = 0; o < a; o += 4)
                (s = createNS('stop')), i.appendChild(s), n.push(s);
              t.setAttribute(
                'gf' === e.ty ? 'fill' : 'stroke',
                'url(' + locationHref + '#' + r + ')'
              ),
                (this.gf = i),
                (this.cst = n);
            }),
            (SVGGradientFillStyleData.prototype.setGradientOpacity = function (
              t,
              e
            ) {
              if (this.g._hasOpacity && !this.g._collapsable) {
                for (
                  var r,
                    i,
                    s = createNS('mask'),
                    n = createNS('path'),
                    a = (s.appendChild(n), createElementID()),
                    o = createElementID(),
                    h =
                      (s.setAttribute('id', o),
                      createNS(
                        1 === t.t ? 'linearGradient' : 'radialGradient'
                      )),
                    l =
                      (h.setAttribute('id', a),
                      h.setAttribute('spreadMethod', 'pad'),
                      h.setAttribute('gradientUnits', 'userSpaceOnUse'),
                      (i = (t.g.k.k[0].s || t.g.k.k).length),
                      this.stops),
                    p = 4 * t.g.p;
                  p < i;
                  p += 2
                )
                  (r = createNS('stop')).setAttribute(
                    'stop-color',
                    'rgb(255,255,255)'
                  ),
                    h.appendChild(r),
                    l.push(r);
                n.setAttribute(
                  'gf' === t.ty ? 'fill' : 'stroke',
                  'url(' + locationHref + '#' + a + ')'
                ),
                  (this.of = h),
                  (this.ms = s),
                  (this.ost = l),
                  (this.maskId = o),
                  (e.msElem = n);
              }
            }),
            extendPrototype(
              [DynamicPropertyContainer],
              SVGGradientFillStyleData
            ),
            extendPrototype(
              [SVGGradientFillStyleData, DynamicPropertyContainer],
              SVGGradientStrokeStyleData
            );
          var SVGElementsRenderer = (function () {
            var y = new Matrix(),
              g = new Matrix();
            function e(t, e, r) {
              (r || e.transform.op._mdf) &&
                e.transform.container.setAttribute('opacity', e.transform.op.v),
                (r || e.transform.mProps._mdf) &&
                  e.transform.container.setAttribute(
                    'transform',
                    e.transform.mProps.v.to2dCSS()
                  );
            }
            function r(t, e, r) {
              for (
                var i,
                  s,
                  n,
                  a,
                  o,
                  h,
                  l,
                  p,
                  c,
                  f,
                  d = e.styles.length,
                  u = e.lvl,
                  m = 0;
                m < d;
                m += 1
              ) {
                if (((a = e.sh._mdf || r), e.styles[m].lvl < u)) {
                  for (
                    l = g.reset(),
                      c = u - e.styles[m].lvl,
                      f = e.transformers.length - 1;
                    !a && 0 < c;

                  )
                    (a = e.transformers[f].mProps._mdf || a), c--, f--;
                  if (a)
                    for (
                      c = u - e.styles[m].lvl, f = e.transformers.length - 1;
                      0 < c;

                    )
                      (p = e.transformers[f].mProps.v.props),
                        l.transform(
                          p[0],
                          p[1],
                          p[2],
                          p[3],
                          p[4],
                          p[5],
                          p[6],
                          p[7],
                          p[8],
                          p[9],
                          p[10],
                          p[11],
                          p[12],
                          p[13],
                          p[14],
                          p[15]
                        ),
                        c--,
                        f--;
                } else l = y;
                if (((s = (h = e.sh.paths)._length), a)) {
                  for (n = '', i = 0; i < s; i += 1)
                    (o = h.shapes[i]) &&
                      o._length &&
                      (n += buildShapeString(o, o._length, o.c, l));
                  e.caches[m] = n;
                } else n = e.caches[m];
                (e.styles[m].d += !0 === t.hd ? '' : n),
                  (e.styles[m]._mdf = a || e.styles[m]._mdf);
              }
            }
            function i(t, e, r) {
              var i = e.style;
              (e.c._mdf || r) &&
                i.pElem.setAttribute(
                  'fill',
                  'rgb(' +
                    bm_floor(e.c.v[0]) +
                    ',' +
                    bm_floor(e.c.v[1]) +
                    ',' +
                    bm_floor(e.c.v[2]) +
                    ')'
                ),
                (e.o._mdf || r) && i.pElem.setAttribute('fill-opacity', e.o.v);
            }
            function s(t, e, r) {
              n(t, e, r), a(0, e, r);
            }
            function n(t, e, r) {
              var i,
                s,
                n,
                a,
                o = e.gf,
                h = e.g._hasOpacity,
                l = e.s.v,
                p = e.e.v;
              if (
                ((e.o._mdf || r) &&
                  ((n = 'gf' === t.ty ? 'fill-opacity' : 'stroke-opacity'),
                  e.style.pElem.setAttribute(n, e.o.v)),
                (e.s._mdf || r) &&
                  ((a = 'x1' == (n = 1 === t.t ? 'x1' : 'cx') ? 'y1' : 'cy'),
                  o.setAttribute(n, l[0]),
                  o.setAttribute(a, l[1]),
                  h) &&
                  !e.g._collapsable &&
                  (e.of.setAttribute(n, l[0]), e.of.setAttribute(a, l[1])),
                e.g._cmdf || r)
              )
                for (
                  var c = e.cst, f = e.g.c, d = c.length, u = 0;
                  u < d;
                  u += 1
                )
                  (i = c[u]).setAttribute('offset', f[4 * u] + '%'),
                    i.setAttribute(
                      'stop-color',
                      'rgb(' +
                        f[4 * u + 1] +
                        ',' +
                        f[4 * u + 2] +
                        ',' +
                        f[4 * u + 3] +
                        ')'
                    );
              if (h && (e.g._omdf || r)) {
                var m = e.g.o;
                for (
                  d = (c = e.g._collapsable ? e.cst : e.ost).length, u = 0;
                  u < d;
                  u += 1
                )
                  (i = c[u]),
                    e.g._collapsable ||
                      i.setAttribute('offset', m[2 * u] + '%'),
                    i.setAttribute('stop-opacity', m[2 * u + 1]);
              }
              1 === t.t
                ? (e.e._mdf || r) &&
                  (o.setAttribute('x2', p[0]), o.setAttribute('y2', p[1]), h) &&
                  !e.g._collapsable &&
                  (e.of.setAttribute('x2', p[0]), e.of.setAttribute('y2', p[1]))
                : ((e.s._mdf || e.e._mdf || r) &&
                    ((s = Math.sqrt(
                      Math.pow(l[0] - p[0], 2) + Math.pow(l[1] - p[1], 2)
                    )),
                    o.setAttribute('r', s),
                    h) &&
                    !e.g._collapsable &&
                    e.of.setAttribute('r', s),
                  (e.e._mdf || e.h._mdf || e.a._mdf || r) &&
                    ((s =
                      s ||
                      Math.sqrt(
                        Math.pow(l[0] - p[0], 2) + Math.pow(l[1] - p[1], 2)
                      )),
                    (n = Math.atan2(p[1] - l[1], p[0] - l[0])),
                    (a = s * (1 <= e.h.v ? 0.99 : e.h.v <= -1 ? -0.99 : e.h.v)),
                    (t = Math.cos(n + e.a.v) * a + l[0]),
                    (r = Math.sin(n + e.a.v) * a + l[1]),
                    o.setAttribute('fx', t),
                    o.setAttribute('fy', r),
                    h) &&
                    !e.g._collapsable &&
                    (e.of.setAttribute('fx', t), e.of.setAttribute('fy', r)));
            }
            function a(t, e, r) {
              var i = e.style,
                s = e.d;
              s &&
                (s._mdf || r) &&
                s.dashStr &&
                (i.pElem.setAttribute('stroke-dasharray', s.dashStr),
                i.pElem.setAttribute('stroke-dashoffset', s.dashoffset[0])),
                e.c &&
                  (e.c._mdf || r) &&
                  i.pElem.setAttribute(
                    'stroke',
                    'rgb(' +
                      bm_floor(e.c.v[0]) +
                      ',' +
                      bm_floor(e.c.v[1]) +
                      ',' +
                      bm_floor(e.c.v[2]) +
                      ')'
                  ),
                (e.o._mdf || r) &&
                  i.pElem.setAttribute('stroke-opacity', e.o.v),
                (e.w._mdf || r) &&
                  (i.pElem.setAttribute('stroke-width', e.w.v), i.msElem) &&
                  i.msElem.setAttribute('stroke-width', e.w.v);
            }
            return {
              createRenderFunction: function (t) {
                switch ((t.ty, t.ty)) {
                  case 'fl':
                    return i;
                  case 'gf':
                    return n;
                  case 'gs':
                    return s;
                  case 'st':
                    return a;
                  case 'sh':
                  case 'el':
                  case 'rc':
                  case 'sr':
                    return r;
                  case 'tr':
                    return e;
                }
              },
            };
          })();
          function BaseElement() {}
          function NullElement(t, e, r) {
            this.initFrame(),
              this.initBaseData(t, e, r),
              this.initFrame(),
              this.initTransform(t, e, r),
              this.initHierarchy();
          }
          function SVGBaseElement() {}
          function IShapeElement() {}
          function ITextElement() {}
          function ICompElement() {}
          function IImageElement(t, e, r) {
            (this.assetData = e.getAssetData(t.refId)),
              this.initElement(t, e, r),
              (this.sourceRect = {
                top: 0,
                left: 0,
                width: this.assetData.w,
                height: this.assetData.h,
              });
          }
          function ISolidElement(t, e, r) {
            this.initElement(t, e, r);
          }
          function SVGCompElement(t, e, r) {
            (this.layers = t.layers),
              (this.supports3d = !0),
              (this.completeLayers = !1),
              (this.pendingElements = []),
              (this.elements = this.layers
                ? createSizedArray(this.layers.length)
                : []),
              this.initElement(t, e, r),
              (this.tm = t.tm
                ? PropertyFactory.getProp(this, t.tm, 0, e.frameRate, this)
                : { _placeholder: !0 });
          }
          function SVGTextElement(t, e, r) {
            (this.textSpans = []),
              (this.renderType = 'svg'),
              this.initElement(t, e, r);
          }
          function SVGShapeElement(t, e, r) {
            (this.shapes = []),
              (this.shapesData = t.shapes),
              (this.stylesList = []),
              (this.shapeModifiers = []),
              (this.itemsData = []),
              (this.processedElements = []),
              (this.animatedContents = []),
              this.initElement(t, e, r),
              (this.prevViewData = []);
          }
          function SVGTintFilter(t, e) {
            this.filterManager = e;
            var r = createNS('feColorMatrix');
            r.setAttribute('type', 'matrix'),
              r.setAttribute('color-interpolation-filters', 'linearRGB'),
              r.setAttribute(
                'values',
                '0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0'
              ),
              r.setAttribute('result', 'f1'),
              t.appendChild(r),
              (r = createNS('feColorMatrix')).setAttribute('type', 'matrix'),
              r.setAttribute('color-interpolation-filters', 'sRGB'),
              r.setAttribute(
                'values',
                '1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0'
              ),
              r.setAttribute('result', 'f2'),
              t.appendChild(r),
              (this.matrixFilter = r),
              (100 === e.effectElements[2].p.v && !e.effectElements[2].p.k) ||
                ((r = createNS('feMerge')),
                t.appendChild(r),
                (e = createNS('feMergeNode')).setAttribute(
                  'in',
                  'SourceGraphic'
                ),
                r.appendChild(e),
                (e = createNS('feMergeNode')).setAttribute('in', 'f2'),
                r.appendChild(e));
          }
          function SVGFillFilter(t, e) {
            this.filterManager = e;
            e = createNS('feColorMatrix');
            e.setAttribute('type', 'matrix'),
              e.setAttribute('color-interpolation-filters', 'sRGB'),
              e.setAttribute(
                'values',
                '1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0'
              ),
              t.appendChild(e),
              (this.matrixFilter = e);
          }
          function SVGGaussianBlurEffect(t, e) {
            t.setAttribute('x', '-100%'),
              t.setAttribute('y', '-100%'),
              t.setAttribute('width', '300%'),
              t.setAttribute('height', '300%'),
              (this.filterManager = e);
            e = createNS('feGaussianBlur');
            t.appendChild(e), (this.feGaussianBlur = e);
          }
          function SVGStrokeEffect(t, e) {
            (this.initialized = !1),
              (this.filterManager = e),
              (this.elem = t),
              (this.paths = []);
          }
          function SVGTritoneFilter(t, e) {
            this.filterManager = e;
            (e = createNS('feColorMatrix')),
              e.setAttribute('type', 'matrix'),
              e.setAttribute('color-interpolation-filters', 'linearRGB'),
              e.setAttribute(
                'values',
                '0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0'
              ),
              e.setAttribute('result', 'f1'),
              t.appendChild(e),
              (e = createNS('feComponentTransfer')),
              e.setAttribute('color-interpolation-filters', 'sRGB'),
              t.appendChild(e),
              (this.matrixFilter = e),
              (t = createNS('feFuncR')),
              t.setAttribute('type', 'table'),
              e.appendChild(t),
              (this.feFuncR = t),
              (t = createNS('feFuncG')),
              t.setAttribute('type', 'table'),
              e.appendChild(t),
              (this.feFuncG = t),
              (t = createNS('feFuncB'));
            t.setAttribute('type', 'table'),
              e.appendChild(t),
              (this.feFuncB = t);
          }
          function SVGProLevelsFilter(t, e) {
            this.filterManager = e;
            var e = this.filterManager.effectElements,
              r = createNS('feComponentTransfer');
            (e[10].p.k ||
              0 !== e[10].p.v ||
              e[11].p.k ||
              1 !== e[11].p.v ||
              e[12].p.k ||
              1 !== e[12].p.v ||
              e[13].p.k ||
              0 !== e[13].p.v ||
              e[14].p.k ||
              1 !== e[14].p.v) &&
              (this.feFuncR = this.createFeFunc('feFuncR', r)),
              (e[17].p.k ||
                0 !== e[17].p.v ||
                e[18].p.k ||
                1 !== e[18].p.v ||
                e[19].p.k ||
                1 !== e[19].p.v ||
                e[20].p.k ||
                0 !== e[20].p.v ||
                e[21].p.k ||
                1 !== e[21].p.v) &&
                (this.feFuncG = this.createFeFunc('feFuncG', r)),
              (e[24].p.k ||
                0 !== e[24].p.v ||
                e[25].p.k ||
                1 !== e[25].p.v ||
                e[26].p.k ||
                1 !== e[26].p.v ||
                e[27].p.k ||
                0 !== e[27].p.v ||
                e[28].p.k ||
                1 !== e[28].p.v) &&
                (this.feFuncB = this.createFeFunc('feFuncB', r)),
              (e[31].p.k ||
                0 !== e[31].p.v ||
                e[32].p.k ||
                1 !== e[32].p.v ||
                e[33].p.k ||
                1 !== e[33].p.v ||
                e[34].p.k ||
                0 !== e[34].p.v ||
                e[35].p.k ||
                1 !== e[35].p.v) &&
                (this.feFuncA = this.createFeFunc('feFuncA', r)),
              (this.feFuncR || this.feFuncG || this.feFuncB || this.feFuncA) &&
                (r.setAttribute('color-interpolation-filters', 'sRGB'),
                t.appendChild(r),
                (r = createNS('feComponentTransfer'))),
              (e[3].p.k ||
                0 !== e[3].p.v ||
                e[4].p.k ||
                1 !== e[4].p.v ||
                e[5].p.k ||
                1 !== e[5].p.v ||
                e[6].p.k ||
                0 !== e[6].p.v ||
                e[7].p.k ||
                1 !== e[7].p.v) &&
                (r.setAttribute('color-interpolation-filters', 'sRGB'),
                t.appendChild(r),
                (this.feFuncRComposed = this.createFeFunc('feFuncR', r)),
                (this.feFuncGComposed = this.createFeFunc('feFuncG', r)),
                (this.feFuncBComposed = this.createFeFunc('feFuncB', r)));
          }
          function SVGDropShadowEffect(t, e) {
            var r = e.container.globalData.renderConfig.filterSize,
              r =
                (t.setAttribute('x', r.x),
                t.setAttribute('y', r.y),
                t.setAttribute('width', r.width),
                t.setAttribute('height', r.height),
                (this.filterManager = e),
                createNS('feGaussianBlur')),
              e =
                (r.setAttribute('in', 'SourceAlpha'),
                r.setAttribute('result', 'drop_shadow_1'),
                r.setAttribute('stdDeviation', '0'),
                (this.feGaussianBlur = r),
                t.appendChild(r),
                createNS('feOffset')),
              r =
                (e.setAttribute('dx', '25'),
                e.setAttribute('dy', '0'),
                e.setAttribute('in', 'drop_shadow_1'),
                e.setAttribute('result', 'drop_shadow_2'),
                (this.feOffset = e),
                t.appendChild(e),
                createNS('feFlood')),
              e =
                (r.setAttribute('flood-color', '#00ff00'),
                r.setAttribute('flood-opacity', '1'),
                r.setAttribute('result', 'drop_shadow_3'),
                (this.feFlood = r),
                t.appendChild(r),
                createNS('feComposite'));
            e.setAttribute('in', 'drop_shadow_3'),
              e.setAttribute('in2', 'drop_shadow_2'),
              e.setAttribute('operator', 'in'),
              e.setAttribute('result', 'drop_shadow_4'),
              t.appendChild(e);
            r = createNS('feMerge');
            t.appendChild(r),
              (e = createNS('feMergeNode')),
              r.appendChild(e),
              (e = createNS('feMergeNode')).setAttribute('in', 'SourceGraphic'),
              (this.feMergeNode = e),
              (this.feMerge = r),
              (this.originalNodeAdded = !1),
              r.appendChild(e);
          }
          (BaseElement.prototype = {
            checkMasks: function () {
              if (this.data.hasMask)
                for (var t = 0, e = this.data.masksProperties.length; t < e; ) {
                  if (
                    'n' !== this.data.masksProperties[t].mode &&
                    !1 !== this.data.masksProperties[t].cl
                  )
                    return !0;
                  t += 1;
                }
              return !1;
            },
            initExpressions: function () {
              (this.layerInterface = LayerExpressionInterface(this)),
                this.data.hasMask &&
                  this.maskManager &&
                  this.layerInterface.registerMaskInterface(this.maskManager);
              var t = EffectsExpressionInterface.createEffectsInterface(
                this,
                this.layerInterface
              );
              this.layerInterface.registerEffectsInterface(t),
                0 === this.data.ty || this.data.xt
                  ? (this.compInterface = CompExpressionInterface(this))
                  : 4 === this.data.ty
                    ? ((this.layerInterface.shapeInterface =
                        ShapeExpressionInterface(
                          this.shapesData,
                          this.itemsData,
                          this.layerInterface
                        )),
                      (this.layerInterface.content =
                        this.layerInterface.shapeInterface))
                    : 5 === this.data.ty &&
                      ((this.layerInterface.textInterface =
                        TextExpressionInterface(this)),
                      (this.layerInterface.text =
                        this.layerInterface.textInterface));
            },
            setBlendMode: function () {
              var t = getBlendMode(this.data.bm);
              (this.baseElement || this.layerElement).style['mix-blend-mode'] =
                t;
            },
            initBaseData: function (t, e, r) {
              (this.globalData = e),
                (this.comp = r),
                (this.data = t),
                (this.layerId = createElementID()),
                this.data.sr || (this.data.sr = 1),
                (this.effectsManager = new EffectsManager(
                  this.data,
                  this,
                  this.dynamicProperties
                ));
            },
            getType: function () {
              return this.type;
            },
            sourceRectAtTime: function () {},
          }),
            (NullElement.prototype.prepareFrame = function (t) {
              this.prepareProperties(t, !0);
            }),
            (NullElement.prototype.renderFrame = function () {}),
            (NullElement.prototype.getBaseElement = function () {
              return null;
            }),
            (NullElement.prototype.destroy = function () {}),
            (NullElement.prototype.sourceRectAtTime = function () {}),
            (NullElement.prototype.hide = function () {}),
            extendPrototype(
              [BaseElement, TransformElement, HierarchyElement, FrameElement],
              NullElement
            ),
            (SVGBaseElement.prototype = {
              initRendererElement: function () {
                this.layerElement = createNS('g');
              },
              createContainerElements: function () {
                (this.matteElement = createNS('g')),
                  (this.transformedElement = this.layerElement),
                  (this.maskedElement = this.layerElement),
                  (this._sizeChanged = !1);
                var t,
                  e,
                  r,
                  i,
                  s,
                  n,
                  a,
                  o = null;
                this.data.td
                  ? 3 == this.data.td || 1 == this.data.td
                    ? ((e = createNS('mask')).setAttribute('id', this.layerId),
                      e.setAttribute(
                        'mask-type',
                        3 == this.data.td ? 'luminance' : 'alpha'
                      ),
                      e.appendChild(this.layerElement),
                      this.globalData.defs.appendChild((o = e)),
                      featureSupport.maskType ||
                        1 != this.data.td ||
                        (e.setAttribute('mask-type', 'luminance'),
                        (s = createElementID()),
                        (n = filtersFactory.createFilter(s)),
                        this.globalData.defs.appendChild(n),
                        n.appendChild(
                          filtersFactory.createAlphaToLuminanceFilter()
                        ),
                        (t = createNS('g')).appendChild(this.layerElement),
                        (o = t),
                        e.appendChild(t),
                        t.setAttribute(
                          'filter',
                          'url(' + locationHref + '#' + s + ')'
                        )))
                    : 2 == this.data.td &&
                      ((e = createNS('mask')).setAttribute('id', this.layerId),
                      e.setAttribute('mask-type', 'alpha'),
                      (r = createNS('g')),
                      e.appendChild(r),
                      (s = createElementID()),
                      (n = filtersFactory.createFilter(s)),
                      (a = createNS('feComponentTransfer')).setAttribute(
                        'in',
                        'SourceGraphic'
                      ),
                      n.appendChild(a),
                      (i = createNS('feFuncA')).setAttribute('type', 'table'),
                      i.setAttribute('tableValues', '1.0 0.0'),
                      a.appendChild(i),
                      this.globalData.defs.appendChild(n),
                      (a = createNS('rect')).setAttribute(
                        'width',
                        this.comp.data.w
                      ),
                      a.setAttribute('height', this.comp.data.h),
                      a.setAttribute('x', '0'),
                      a.setAttribute('y', '0'),
                      a.setAttribute('fill', '#ffffff'),
                      a.setAttribute('opacity', '0'),
                      r.setAttribute(
                        'filter',
                        'url(' + locationHref + '#' + s + ')'
                      ),
                      r.appendChild(a),
                      r.appendChild(this.layerElement),
                      (o = r),
                      featureSupport.maskType ||
                        (e.setAttribute('mask-type', 'luminance'),
                        n.appendChild(
                          filtersFactory.createAlphaToLuminanceFilter()
                        ),
                        (t = createNS('g')),
                        r.appendChild(a),
                        t.appendChild(this.layerElement),
                        (o = t),
                        r.appendChild(t)),
                      this.globalData.defs.appendChild(e))
                  : this.data.tt
                    ? (this.matteElement.appendChild(this.layerElement),
                      (o = this.matteElement),
                      (this.baseElement = this.matteElement))
                    : (this.baseElement = this.layerElement),
                  this.data.ln &&
                    this.layerElement.setAttribute('id', this.data.ln),
                  this.data.cl &&
                    this.layerElement.setAttribute('class', this.data.cl),
                  0 !== this.data.ty ||
                    this.data.hd ||
                    ((i = createNS('clipPath')),
                    (s = createNS('path')).setAttribute(
                      'd',
                      'M0,0 L' +
                        this.data.w +
                        ',0 L' +
                        this.data.w +
                        ',' +
                        this.data.h +
                        ' L0,' +
                        this.data.h +
                        'z'
                    ),
                    (n = createElementID()),
                    i.setAttribute('id', n),
                    i.appendChild(s),
                    this.globalData.defs.appendChild(i),
                    this.checkMasks()
                      ? ((a = createNS('g')).setAttribute(
                          'clip-path',
                          'url(' + locationHref + '#' + n + ')'
                        ),
                        a.appendChild(this.layerElement),
                        (this.transformedElement = a),
                        o
                          ? o.appendChild(this.transformedElement)
                          : (this.baseElement = this.transformedElement))
                      : this.layerElement.setAttribute(
                          'clip-path',
                          'url(' + locationHref + '#' + n + ')'
                        )),
                  0 !== this.data.bm && this.setBlendMode();
              },
              renderElement: function () {
                this.finalTransform._matMdf &&
                  this.transformedElement.setAttribute(
                    'transform',
                    this.finalTransform.mat.to2dCSS()
                  ),
                  this.finalTransform._opMdf &&
                    this.transformedElement.setAttribute(
                      'opacity',
                      this.finalTransform.mProp.o.v
                    );
              },
              destroyBaseElement: function () {
                (this.layerElement = null),
                  (this.matteElement = null),
                  this.maskManager.destroy();
              },
              getBaseElement: function () {
                return this.data.hd ? null : this.baseElement;
              },
              createRenderableComponents: function () {
                (this.maskManager = new MaskElement(
                  this.data,
                  this,
                  this.globalData
                )),
                  (this.renderableEffectsManager = new SVGEffects(this));
              },
              setMatte: function (t) {
                this.matteElement &&
                  this.matteElement.setAttribute(
                    'mask',
                    'url(' + locationHref + '#' + t + ')'
                  );
              },
            }),
            (IShapeElement.prototype = {
              addShapeToModifiers: function (t) {
                for (var e = this.shapeModifiers.length, r = 0; r < e; r += 1)
                  this.shapeModifiers[r].addShape(t);
              },
              isShapeInAnimatedModifiers: function (t) {
                for (var e = this.shapeModifiers.length; 0 < e; )
                  if (this.shapeModifiers[0].isAnimatedWithShape(t)) return !0;
                return !1;
              },
              renderModifiers: function () {
                if (this.shapeModifiers.length) {
                  for (var t = this.shapes.length, e = 0; e < t; e += 1)
                    this.shapes[e].sh.reset();
                  for (e = (t = this.shapeModifiers.length) - 1; 0 <= e; --e)
                    this.shapeModifiers[e].processShapes(this._isFirstFrame);
                }
              },
              lcEnum: { 1: 'butt', 2: 'round', 3: 'square' },
              ljEnum: { 1: 'miter', 2: 'round', 3: 'bevel' },
              searchProcessedElement: function (t) {
                for (
                  var e = this.processedElements, r = 0, i = e.length;
                  r < i;

                ) {
                  if (e[r].elem === t) return e[r].pos;
                  r += 1;
                }
                return 0;
              },
              addProcessedElement: function (t, e) {
                for (var r = this.processedElements, i = r.length; i; )
                  if (r[--i].elem === t) return void (r[i].pos = e);
                r.push(new ProcessedElement(t, e));
              },
              prepareFrame: function (t) {
                this.prepareRenderableFrame(t),
                  this.prepareProperties(t, this.isInRange);
              },
            }),
            (ITextElement.prototype.initElement = function (t, e, r) {
              (this.lettersChangedFlag = !0),
                this.initFrame(),
                this.initBaseData(t, e, r),
                (this.textProperty = new TextProperty(
                  this,
                  t.t,
                  this.dynamicProperties
                )),
                (this.textAnimator = new TextAnimatorProperty(
                  t.t,
                  this.renderType,
                  this
                )),
                this.initTransform(t, e, r),
                this.initHierarchy(),
                this.initRenderable(),
                this.initRendererElement(),
                this.createContainerElements(),
                this.createRenderableComponents(),
                this.createContent(),
                this.hide(),
                this.textAnimator.searchProperties(this.dynamicProperties);
            }),
            (ITextElement.prototype.prepareFrame = function (t) {
              (this._mdf = !1),
                this.prepareRenderableFrame(t),
                this.prepareProperties(t, this.isInRange),
                (this.textProperty._mdf || this.textProperty._isFirstFrame) &&
                  (this.buildNewText(),
                  (this.textProperty._isFirstFrame = !1),
                  (this.textProperty._mdf = !1));
            }),
            (ITextElement.prototype.createPathShape = function (t, e) {
              for (var r, i = e.length, s = '', n = 0; n < i; n += 1)
                (r = e[n].ks.k), (s += buildShapeString(r, r.i.length, !0, t));
              return s;
            }),
            (ITextElement.prototype.updateDocumentData = function (t, e) {
              this.textProperty.updateDocumentData(t, e);
            }),
            (ITextElement.prototype.canResizeFont = function (t) {
              this.textProperty.canResizeFont(t);
            }),
            (ITextElement.prototype.setMinimumFontSize = function (t) {
              this.textProperty.setMinimumFontSize(t);
            }),
            (ITextElement.prototype.applyTextPropertiesToMatrix = function (
              t,
              e,
              r,
              i,
              s
            ) {
              switch (
                (t.ps && e.translate(t.ps[0], t.ps[1] + t.ascent, 0),
                e.translate(0, -t.ls, 0),
                t.j)
              ) {
                case 1:
                  e.translate(
                    t.justifyOffset + (t.boxWidth - t.lineWidths[r]),
                    0,
                    0
                  );
                  break;
                case 2:
                  e.translate(
                    t.justifyOffset + (t.boxWidth - t.lineWidths[r]) / 2,
                    0,
                    0
                  );
              }
              e.translate(i, s, 0);
            }),
            (ITextElement.prototype.buildColor = function (t) {
              return (
                'rgb(' +
                Math.round(255 * t[0]) +
                ',' +
                Math.round(255 * t[1]) +
                ',' +
                Math.round(255 * t[2]) +
                ')'
              );
            }),
            (ITextElement.prototype.emptyProp = new LetterProps()),
            (ITextElement.prototype.destroy = function () {}),
            extendPrototype(
              [
                BaseElement,
                TransformElement,
                HierarchyElement,
                FrameElement,
                RenderableDOMElement,
              ],
              ICompElement
            ),
            (ICompElement.prototype.initElement = function (t, e, r) {
              this.initFrame(),
                this.initBaseData(t, e, r),
                this.initTransform(t, e, r),
                this.initRenderable(),
                this.initHierarchy(),
                this.initRendererElement(),
                this.createContainerElements(),
                this.createRenderableComponents(),
                (!this.data.xt && e.progressiveLoad) || this.buildAllItems(),
                this.hide();
            }),
            (ICompElement.prototype.prepareFrame = function (t) {
              if (
                ((this._mdf = !1),
                this.prepareRenderableFrame(t),
                this.prepareProperties(t, this.isInRange),
                this.isInRange || this.data.xt)
              ) {
                this.tm._placeholder
                  ? (this.renderedFrame = t / this.data.sr)
                  : ((t = this.tm.v) === this.data.op && (t = this.data.op - 1),
                    (this.renderedFrame = t));
                var e,
                  t = this.elements.length;
                for (
                  this.completeLayers || this.checkLayers(this.renderedFrame),
                    e = t - 1;
                  0 <= e;
                  --e
                )
                  (this.completeLayers || this.elements[e]) &&
                    (this.elements[e].prepareFrame(
                      this.renderedFrame - this.layers[e].st
                    ),
                    this.elements[e]._mdf) &&
                    (this._mdf = !0);
              }
            }),
            (ICompElement.prototype.renderInnerContent = function () {
              for (var t = this.layers.length, e = 0; e < t; e += 1)
                (this.completeLayers || this.elements[e]) &&
                  this.elements[e].renderFrame();
            }),
            (ICompElement.prototype.setElements = function (t) {
              this.elements = t;
            }),
            (ICompElement.prototype.getElements = function () {
              return this.elements;
            }),
            (ICompElement.prototype.destroyElements = function () {
              for (var t = this.layers.length, e = 0; e < t; e += 1)
                this.elements[e] && this.elements[e].destroy();
            }),
            (ICompElement.prototype.destroy = function () {
              this.destroyElements(), this.destroyBaseElement();
            }),
            extendPrototype(
              [
                BaseElement,
                TransformElement,
                SVGBaseElement,
                HierarchyElement,
                FrameElement,
                RenderableDOMElement,
              ],
              IImageElement
            ),
            (IImageElement.prototype.createContent = function () {
              var t = this.globalData.getAssetsPath(this.assetData);
              (this.innerElem = createNS('image')),
                this.innerElem.setAttribute('width', this.assetData.w + 'px'),
                this.innerElem.setAttribute('height', this.assetData.h + 'px'),
                this.innerElem.setAttribute(
                  'preserveAspectRatio',
                  this.assetData.pr ||
                    this.globalData.renderConfig.imagePreserveAspectRatio
                ),
                this.innerElem.setAttributeNS(
                  'http://www.w3.org/1999/xlink',
                  'href',
                  t
                ),
                this.layerElement.appendChild(this.innerElem);
            }),
            (IImageElement.prototype.sourceRectAtTime = function () {
              return this.sourceRect;
            }),
            extendPrototype([IImageElement], ISolidElement),
            (ISolidElement.prototype.createContent = function () {
              var t = createNS('rect');
              t.setAttribute('width', this.data.sw),
                t.setAttribute('height', this.data.sh),
                t.setAttribute('fill', this.data.sc),
                this.layerElement.appendChild(t);
            }),
            extendPrototype(
              [SVGRenderer, ICompElement, SVGBaseElement],
              SVGCompElement
            ),
            extendPrototype(
              [
                BaseElement,
                TransformElement,
                SVGBaseElement,
                HierarchyElement,
                FrameElement,
                RenderableDOMElement,
                ITextElement,
              ],
              SVGTextElement
            ),
            (SVGTextElement.prototype.createContent = function () {
              this.data.singleShape &&
                !this.globalData.fontManager.chars &&
                (this.textContainer = createNS('text'));
            }),
            (SVGTextElement.prototype.buildTextContents = function (t) {
              for (var e = 0, r = t.length, i = [], s = ''; e < r; )
                t[e] === String.fromCharCode(13) ||
                t[e] === String.fromCharCode(3)
                  ? (i.push(s), (s = ''))
                  : (s += t[e]),
                  (e += 1);
              return i.push(s), i;
            }),
            (SVGTextElement.prototype.buildNewText = function () {
              var t,
                e,
                r = this.textProperty.currentData,
                i =
                  ((this.renderedLetters = createSizedArray(
                    r ? r.l.length : 0
                  )),
                  r.fc
                    ? this.layerElement.setAttribute(
                        'fill',
                        this.buildColor(r.fc)
                      )
                    : this.layerElement.setAttribute('fill', 'rgba(0,0,0,0)'),
                  r.sc &&
                    (this.layerElement.setAttribute(
                      'stroke',
                      this.buildColor(r.sc)
                    ),
                    this.layerElement.setAttribute('stroke-width', r.sw)),
                  this.layerElement.setAttribute('font-size', r.finalSize),
                  this.globalData.fontManager.getFontByName(r.f));
              i.fClass
                ? this.layerElement.setAttribute('class', i.fClass)
                : (this.layerElement.setAttribute('font-family', i.fFamily),
                  (t = r.fWeight),
                  (e = r.fStyle),
                  this.layerElement.setAttribute('font-style', e),
                  this.layerElement.setAttribute('font-weight', t)),
                this.layerElement.setAttribute('aria-label', r.t);
              var s,
                n = r.l || [],
                a = !!this.globalData.fontManager.chars;
              b = n.length;
              var o = this.mHelper,
                h = '',
                l = this.data.singleShape,
                p = 0,
                c = 0,
                f = !0,
                d = (r.tr / 1e3) * r.finalSize;
              if (!l || a || r.sz) {
                for (var u, m = this.textSpans.length, y = 0; y < b; y += 1)
                  (a && l && 0 !== y) ||
                    ((s =
                      y < m
                        ? this.textSpans[y]
                        : createNS(a ? 'path' : 'text')),
                    m <= y &&
                      (s.setAttribute('stroke-linecap', 'butt'),
                      s.setAttribute('stroke-linejoin', 'round'),
                      s.setAttribute('stroke-miterlimit', '4'),
                      (this.textSpans[y] = s),
                      this.layerElement.appendChild(s)),
                    (s.style.display = 'inherit')),
                    o.reset(),
                    o.scale(r.finalSize / 100, r.finalSize / 100),
                    l &&
                      (n[y].n &&
                        ((p = -d), (c = c + r.yOffset + (f ? 1 : 0)), (f = !1)),
                      this.applyTextPropertiesToMatrix(r, o, n[y].line, p, c),
                      (p = p + (n[y].l || 0) + d)),
                    a
                      ? ((u = (u =
                          ((u = this.globalData.fontManager.getCharData(
                            r.finalText[y],
                            i.fStyle,
                            this.globalData.fontManager.getFontByName(r.f)
                              .fFamily
                          )) &&
                            u.data) ||
                          {}).shapes
                          ? u.shapes[0].it
                          : []),
                        l
                          ? (h += this.createPathShape(o, u))
                          : s.setAttribute('d', this.createPathShape(o, u)))
                      : (l &&
                          s.setAttribute(
                            'transform',
                            'translate(' + o.props[12] + ',' + o.props[13] + ')'
                          ),
                        (s.textContent = n[y].val),
                        s.setAttributeNS(
                          'http://www.w3.org/XML/1998/namespace',
                          'xml:space',
                          'preserve'
                        ));
                l && s && s.setAttribute('d', h);
              } else {
                var g = this.textContainer,
                  v = 'start';
                switch (r.j) {
                  case 1:
                    v = 'end';
                    break;
                  case 2:
                    v = 'middle';
                }
                g.setAttribute('text-anchor', v),
                  g.setAttribute('letter-spacing', d);
                var _ = this.buildTextContents(r.finalText),
                  b = _.length,
                  c = r.ps ? r.ps[1] + r.ascent : 0;
                for (y = 0; y < b; y += 1)
                  ((s = this.textSpans[y] || createNS('tspan')).textContent =
                    _[y]),
                    s.setAttribute('x', 0),
                    s.setAttribute('y', c),
                    (s.style.display = 'inherit'),
                    g.appendChild(s),
                    (this.textSpans[y] = s),
                    (c += r.finalLineHeight);
                this.layerElement.appendChild(g);
              }
              for (; y < this.textSpans.length; )
                (this.textSpans[y].style.display = 'none'), (y += 1);
              this._sizeChanged = !0;
            }),
            (SVGTextElement.prototype.sourceRectAtTime = function (t) {
              var e;
              return (
                this.prepareFrame(this.comp.renderedFrame - this.data.st),
                this.renderInnerContent(),
                this._sizeChanged &&
                  ((this._sizeChanged = !1),
                  (e = this.layerElement.getBBox()),
                  (this.bbox = {
                    top: e.y,
                    left: e.x,
                    width: e.width,
                    height: e.height,
                  })),
                this.bbox
              );
            }),
            (SVGTextElement.prototype.renderInnerContent = function () {
              if (
                !this.data.singleShape &&
                (this.textAnimator.getMeasures(
                  this.textProperty.currentData,
                  this.lettersChangedFlag
                ),
                this.lettersChangedFlag || this.textAnimator.lettersChangedFlag)
              ) {
                this._sizeChanged = !0;
                for (
                  var t,
                    e,
                    r = this.textAnimator.renderedLetters,
                    i = this.textProperty.currentData.l,
                    s = i.length,
                    n = 0;
                  n < s;
                  n += 1
                )
                  i[n].n ||
                    ((t = r[n]),
                    (e = this.textSpans[n]),
                    t._mdf.m && e.setAttribute('transform', t.m),
                    t._mdf.o && e.setAttribute('opacity', t.o),
                    t._mdf.sw && e.setAttribute('stroke-width', t.sw),
                    t._mdf.sc && e.setAttribute('stroke', t.sc),
                    t._mdf.fc && e.setAttribute('fill', t.fc));
              }
            }),
            extendPrototype(
              [
                BaseElement,
                TransformElement,
                SVGBaseElement,
                IShapeElement,
                HierarchyElement,
                FrameElement,
                RenderableDOMElement,
              ],
              SVGShapeElement
            ),
            (SVGShapeElement.prototype.initSecondaryElement = function () {}),
            (SVGShapeElement.prototype.identityMatrix = new Matrix()),
            (SVGShapeElement.prototype.buildExpressionInterface =
              function () {}),
            (SVGShapeElement.prototype.createContent = function () {
              this.searchShapes(
                this.shapesData,
                this.itemsData,
                this.prevViewData,
                this.layerElement,
                0,
                [],
                !0
              ),
                this.filterUniqueShapes();
            }),
            (SVGShapeElement.prototype.filterUniqueShapes = function () {
              for (
                var t,
                  e,
                  r,
                  i = this.shapes.length,
                  s = this.stylesList.length,
                  n = [],
                  a = !1,
                  o = 0;
                o < s;
                o += 1
              ) {
                for (
                  r = this.stylesList[o], a = !1, t = n.length = 0;
                  t < i;
                  t += 1
                )
                  -1 !== (e = this.shapes[t]).styles.indexOf(r) &&
                    (n.push(e), (a = e._isAnimated || a));
                1 < n.length && a && this.setShapesAsAnimated(n);
              }
            }),
            (SVGShapeElement.prototype.setShapesAsAnimated = function (t) {
              for (var e = t.length, r = 0; r < e; r += 1) t[r].setAsAnimated();
            }),
            (SVGShapeElement.prototype.createStyleElement = function (t, e) {
              var r,
                e = new SVGStyleData(t, e),
                i = e.pElem;
              return (
                'st' === t.ty
                  ? (r = new SVGStrokeStyleData(this, t, e))
                  : 'fl' === t.ty
                    ? (r = new SVGFillStyleData(this, t, e))
                    : ('gf' !== t.ty && 'gs' !== t.ty) ||
                      ((r = new (
                        'gf' === t.ty
                          ? SVGGradientFillStyleData
                          : SVGGradientStrokeStyleData
                      )(this, t, e)),
                      this.globalData.defs.appendChild(r.gf),
                      r.maskId &&
                        (this.globalData.defs.appendChild(r.ms),
                        this.globalData.defs.appendChild(r.of),
                        i.setAttribute(
                          'mask',
                          'url(' + locationHref + '#' + r.maskId + ')'
                        ))),
                ('st' !== t.ty && 'gs' !== t.ty) ||
                  (i.setAttribute(
                    'stroke-linecap',
                    this.lcEnum[t.lc] || 'round'
                  ),
                  i.setAttribute(
                    'stroke-linejoin',
                    this.ljEnum[t.lj] || 'round'
                  ),
                  i.setAttribute('fill-opacity', '0'),
                  1 === t.lj && i.setAttribute('stroke-miterlimit', t.ml)),
                2 === t.r && i.setAttribute('fill-rule', 'evenodd'),
                t.ln && i.setAttribute('id', t.ln),
                t.cl && i.setAttribute('class', t.cl),
                t.bm && (i.style['mix-blend-mode'] = getBlendMode(t.bm)),
                this.stylesList.push(e),
                this.addToAnimatedContents(t, r),
                r
              );
            }),
            (SVGShapeElement.prototype.createGroupElement = function (t) {
              var e = new ShapeGroupData();
              return (
                t.ln && e.gr.setAttribute('id', t.ln),
                t.cl && e.gr.setAttribute('class', t.cl),
                t.bm && (e.gr.style['mix-blend-mode'] = getBlendMode(t.bm)),
                e
              );
            }),
            (SVGShapeElement.prototype.createTransformElement = function (
              t,
              e
            ) {
              var r = TransformPropertyFactory.getTransformProperty(
                  this,
                  t,
                  this
                ),
                r = new SVGTransformData(r, r.o, e);
              return this.addToAnimatedContents(t, r), r;
            }),
            (SVGShapeElement.prototype.createShapeElement = function (t, e, r) {
              var i = 4,
                e =
                  ('rc' === t.ty
                    ? (i = 5)
                    : 'el' === t.ty
                      ? (i = 6)
                      : 'sr' === t.ty && (i = 7),
                  new SVGShapeData(
                    e,
                    r,
                    ShapePropertyFactory.getShapeProp(this, t, i, this)
                  ));
              return (
                this.shapes.push(e),
                this.addShapeToModifiers(e),
                this.addToAnimatedContents(t, e),
                e
              );
            }),
            (SVGShapeElement.prototype.addToAnimatedContents = function (t, e) {
              for (var r = 0, i = this.animatedContents.length; r < i; ) {
                if (this.animatedContents[r].element === e) return;
                r += 1;
              }
              this.animatedContents.push({
                fn: SVGElementsRenderer.createRenderFunction(t),
                element: e,
                data: t,
              });
            }),
            (SVGShapeElement.prototype.setElementStyles = function (t) {
              for (
                var e = t.styles, r = this.stylesList.length, i = 0;
                i < r;
                i += 1
              )
                this.stylesList[i].closed || e.push(this.stylesList[i]);
            }),
            (SVGShapeElement.prototype.reloadShapes = function () {
              this._isFirstFrame = !0;
              for (var t = this.itemsData.length, e = 0; e < t; e += 1)
                this.prevViewData[e] = this.itemsData[e];
              for (
                this.searchShapes(
                  this.shapesData,
                  this.itemsData,
                  this.prevViewData,
                  this.layerElement,
                  0,
                  [],
                  !0
                ),
                  this.filterUniqueShapes(),
                  t = this.dynamicProperties.length,
                  e = 0;
                e < t;
                e += 1
              )
                this.dynamicProperties[e].getValue();
              this.renderModifiers();
            }),
            (SVGShapeElement.prototype.searchShapes = function (
              t,
              e,
              r,
              i,
              s,
              n,
              a
            ) {
              for (
                var o,
                  h,
                  l,
                  p,
                  c,
                  f = [].concat(n),
                  d = t.length - 1,
                  u = [],
                  m = [],
                  y = d;
                0 <= y;
                --y
              ) {
                if (
                  ((c = this.searchProcessedElement(t[y]))
                    ? (e[y] = r[c - 1])
                    : (t[y]._render = a),
                  'fl' == t[y].ty ||
                    'st' == t[y].ty ||
                    'gf' == t[y].ty ||
                    'gs' == t[y].ty)
                )
                  c
                    ? (e[y].style.closed = !1)
                    : (e[y] = this.createStyleElement(t[y], s)),
                    t[y]._render && i.appendChild(e[y].style.pElem),
                    u.push(e[y].style);
                else if ('gr' == t[y].ty) {
                  if (c)
                    for (h = e[y].it.length, o = 0; o < h; o += 1)
                      e[y].prevViewData[o] = e[y].it[o];
                  else e[y] = this.createGroupElement(t[y]);
                  this.searchShapes(
                    t[y].it,
                    e[y].it,
                    e[y].prevViewData,
                    e[y].gr,
                    s + 1,
                    f,
                    a
                  ),
                    t[y]._render && i.appendChild(e[y].gr);
                } else
                  'tr' == t[y].ty
                    ? (c || (e[y] = this.createTransformElement(t[y], i)),
                      (l = e[y].transform),
                      f.push(l))
                    : 'sh' == t[y].ty ||
                        'rc' == t[y].ty ||
                        'el' == t[y].ty ||
                        'sr' == t[y].ty
                      ? (c || (e[y] = this.createShapeElement(t[y], f, s)),
                        this.setElementStyles(e[y]))
                      : 'tm' == t[y].ty ||
                          'rd' == t[y].ty ||
                          'ms' == t[y].ty ||
                          'pb' == t[y].ty
                        ? (c
                            ? ((p = e[y]).closed = !1)
                            : ((p = ShapeModifiers.getModifier(t[y].ty)).init(
                                this,
                                t[y]
                              ),
                              (e[y] = p),
                              this.shapeModifiers.push(p)),
                          m.push(p))
                        : 'rp' == t[y].ty &&
                          (c
                            ? ((p = e[y]).closed = !0)
                            : ((p = ShapeModifiers.getModifier(t[y].ty)),
                              (e[y] = p).init(this, t, y, e),
                              this.shapeModifiers.push(p),
                              (a = !1)),
                          m.push(p));
                this.addProcessedElement(t[y], y + 1);
              }
              for (d = u.length, y = 0; y < d; y += 1) u[y].closed = !0;
              for (d = m.length, y = 0; y < d; y += 1) m[y].closed = !0;
            }),
            (SVGShapeElement.prototype.renderInnerContent = function () {
              this.renderModifiers();
              for (var t = this.stylesList.length, e = 0; e < t; e += 1)
                this.stylesList[e].reset();
              for (this.renderShape(), e = 0; e < t; e += 1)
                (this.stylesList[e]._mdf || this._isFirstFrame) &&
                  (this.stylesList[e].msElem &&
                    (this.stylesList[e].msElem.setAttribute(
                      'd',
                      this.stylesList[e].d
                    ),
                    (this.stylesList[e].d = 'M0 0' + this.stylesList[e].d)),
                  this.stylesList[e].pElem.setAttribute(
                    'd',
                    this.stylesList[e].d || 'M0 0'
                  ));
            }),
            (SVGShapeElement.prototype.renderShape = function () {
              for (
                var t, e = this.animatedContents.length, r = 0;
                r < e;
                r += 1
              )
                (t = this.animatedContents[r]),
                  (this._isFirstFrame || t.element._isAnimated) &&
                    !0 !== t.data &&
                    t.fn(t.data, t.element, this._isFirstFrame);
            }),
            (SVGShapeElement.prototype.destroy = function () {
              this.destroyBaseElement(),
                (this.shapesData = null),
                (this.itemsData = null);
            }),
            (SVGTintFilter.prototype.renderFrame = function (t) {
              var e, r;
              (t || this.filterManager._mdf) &&
                ((t = this.filterManager.effectElements[0].p.v),
                (e = this.filterManager.effectElements[1].p.v),
                (r = this.filterManager.effectElements[2].p.v / 100),
                this.matrixFilter.setAttribute(
                  'values',
                  e[0] -
                    t[0] +
                    ' 0 0 0 ' +
                    t[0] +
                    ' ' +
                    (e[1] - t[1]) +
                    ' 0 0 0 ' +
                    t[1] +
                    ' ' +
                    (e[2] - t[2]) +
                    ' 0 0 0 ' +
                    t[2] +
                    ' 0 0 0 ' +
                    r +
                    ' 0'
                ));
            }),
            (SVGFillFilter.prototype.renderFrame = function (t) {
              var e;
              (t || this.filterManager._mdf) &&
                ((t = this.filterManager.effectElements[2].p.v),
                (e = this.filterManager.effectElements[6].p.v),
                this.matrixFilter.setAttribute(
                  'values',
                  '0 0 0 0 ' +
                    t[0] +
                    ' 0 0 0 0 ' +
                    t[1] +
                    ' 0 0 0 0 ' +
                    t[2] +
                    ' 0 0 0 ' +
                    e +
                    ' 0'
                ));
            }),
            (SVGGaussianBlurEffect.prototype.renderFrame = function (t) {
              var e;
              (t || this.filterManager._mdf) &&
                ((t = 0.3 * this.filterManager.effectElements[0].p.v),
                (e = this.filterManager.effectElements[1].p.v),
                this.feGaussianBlur.setAttribute(
                  'stdDeviation',
                  (3 == e ? 0 : t) + ' ' + (2 == e ? 0 : t)
                ),
                (e =
                  1 == this.filterManager.effectElements[2].p.v
                    ? 'wrap'
                    : 'duplicate'),
                this.feGaussianBlur.setAttribute('edgeMode', e));
            }),
            (SVGStrokeEffect.prototype.initialize = function () {
              var t,
                e,
                r,
                i,
                s =
                  this.elem.layerElement.children ||
                  this.elem.layerElement.childNodes;
              for (
                1 === this.filterManager.effectElements[1].p.v
                  ? ((i = this.elem.maskManager.masksProperties.length),
                    (r = 0))
                  : (i =
                      1 + (r = this.filterManager.effectElements[0].p.v - 1)),
                  (e = createNS('g')).setAttribute('fill', 'none'),
                  e.setAttribute('stroke-linecap', 'round'),
                  e.setAttribute('stroke-dashoffset', 1);
                r < i;
                r += 1
              )
                (t = createNS('path')),
                  e.appendChild(t),
                  this.paths.push({ p: t, m: r });
              if (3 === this.filterManager.effectElements[10].p.v) {
                var n = createNS('mask'),
                  a = createElementID(),
                  o =
                    (n.setAttribute('id', a),
                    n.setAttribute('mask-type', 'alpha'),
                    n.appendChild(e),
                    this.elem.globalData.defs.appendChild(n),
                    createNS('g'));
                for (
                  o.setAttribute('mask', 'url(' + locationHref + '#' + a + ')');
                  s[0];

                )
                  o.appendChild(s[0]);
                this.elem.layerElement.appendChild(o),
                  (this.masker = n),
                  e.setAttribute('stroke', '#fff');
              } else if (
                1 === this.filterManager.effectElements[10].p.v ||
                2 === this.filterManager.effectElements[10].p.v
              ) {
                if (2 === this.filterManager.effectElements[10].p.v)
                  for (
                    s =
                      this.elem.layerElement.children ||
                      this.elem.layerElement.childNodes;
                    s.length;

                  )
                    this.elem.layerElement.removeChild(s[0]);
                this.elem.layerElement.appendChild(e),
                  this.elem.layerElement.removeAttribute('mask'),
                  e.setAttribute('stroke', '#fff');
              }
              (this.initialized = !0), (this.pathMasker = e);
            }),
            (SVGStrokeEffect.prototype.renderFrame = function (t) {
              this.initialized || this.initialize();
              for (var e, r, i = this.paths.length, s = 0; s < i; s += 1)
                if (
                  -1 !== this.paths[s].m &&
                  ((n = this.elem.maskManager.viewData[this.paths[s].m]),
                  (e = this.paths[s].p),
                  (t || this.filterManager._mdf || n.prop._mdf) &&
                    e.setAttribute('d', n.lastPath),
                  t ||
                    this.filterManager.effectElements[9].p._mdf ||
                    this.filterManager.effectElements[4].p._mdf ||
                    this.filterManager.effectElements[7].p._mdf ||
                    this.filterManager.effectElements[8].p._mdf ||
                    n.prop._mdf)
                ) {
                  if (
                    0 !== this.filterManager.effectElements[7].p.v ||
                    100 !== this.filterManager.effectElements[8].p.v
                  ) {
                    for (
                      var n =
                          Math.min(
                            this.filterManager.effectElements[7].p.v,
                            this.filterManager.effectElements[8].p.v
                          ) / 100,
                        a =
                          Math.max(
                            this.filterManager.effectElements[7].p.v,
                            this.filterManager.effectElements[8].p.v
                          ) / 100,
                        o = e.getTotalLength(),
                        h = '0 0 0 ' + o * n + ' ',
                        l =
                          1 +
                          (2 *
                            this.filterManager.effectElements[4].p.v *
                            this.filterManager.effectElements[9].p.v) /
                            100,
                        p = Math.floor((o * (a - n)) / l),
                        c = 0;
                      c < p;
                      c += 1
                    )
                      h +=
                        '1 ' +
                        (2 *
                          this.filterManager.effectElements[4].p.v *
                          this.filterManager.effectElements[9].p.v) /
                          100 +
                        ' ';
                    h += '0 ' + 10 * o + ' 0 0';
                  } else
                    h =
                      '1 ' +
                      (2 *
                        this.filterManager.effectElements[4].p.v *
                        this.filterManager.effectElements[9].p.v) /
                        100;
                  e.setAttribute('stroke-dasharray', h);
                }
              (t || this.filterManager.effectElements[4].p._mdf) &&
                this.pathMasker.setAttribute(
                  'stroke-width',
                  2 * this.filterManager.effectElements[4].p.v
                ),
                (t || this.filterManager.effectElements[6].p._mdf) &&
                  this.pathMasker.setAttribute(
                    'opacity',
                    this.filterManager.effectElements[6].p.v
                  ),
                (1 !== this.filterManager.effectElements[10].p.v &&
                  2 !== this.filterManager.effectElements[10].p.v) ||
                  (!t && !this.filterManager.effectElements[3].p._mdf) ||
                  ((r = this.filterManager.effectElements[3].p.v),
                  this.pathMasker.setAttribute(
                    'stroke',
                    'rgb(' +
                      bm_floor(255 * r[0]) +
                      ',' +
                      bm_floor(255 * r[1]) +
                      ',' +
                      bm_floor(255 * r[2]) +
                      ')'
                  ));
            }),
            (SVGTritoneFilter.prototype.renderFrame = function (t) {
              var e, r, i, s;
              (t || this.filterManager._mdf) &&
                ((t = this.filterManager.effectElements[0].p.v),
                (e = this.filterManager.effectElements[1].p.v),
                (r =
                  (s = this.filterManager.effectElements[2].p.v)[0] +
                  ' ' +
                  e[0] +
                  ' ' +
                  t[0]),
                (i = s[1] + ' ' + e[1] + ' ' + t[1]),
                (s = s[2] + ' ' + e[2] + ' ' + t[2]),
                this.feFuncR.setAttribute('tableValues', r),
                this.feFuncG.setAttribute('tableValues', i),
                this.feFuncB.setAttribute('tableValues', s));
            }),
            (SVGProLevelsFilter.prototype.createFeFunc = function (t, e) {
              t = createNS(t);
              return t.setAttribute('type', 'table'), e.appendChild(t), t;
            }),
            (SVGProLevelsFilter.prototype.getTableValue = function (
              t,
              e,
              r,
              i,
              s
            ) {
              for (
                var n,
                  a = 0,
                  o = Math.min(t, e),
                  h = Math.max(t, e),
                  l = Array.call(null, { length: 256 }),
                  p = 0,
                  c = s - i,
                  f = e - t;
                a <= 256;

              )
                (n =
                  (n = a / 256) <= o
                    ? f < 0
                      ? s
                      : i
                    : h <= n
                      ? f < 0
                        ? i
                        : s
                      : i + c * Math.pow((n - t) / f, 1 / r)),
                  (l[p++] = n),
                  (a += 256 / 255);
              return l.join(' ');
            }),
            (SVGProLevelsFilter.prototype.renderFrame = function (t) {
              var e, r;
              (t || this.filterManager._mdf) &&
                ((r = this.filterManager.effectElements),
                this.feFuncRComposed &&
                  (t ||
                    r[3].p._mdf ||
                    r[4].p._mdf ||
                    r[5].p._mdf ||
                    r[6].p._mdf ||
                    r[7].p._mdf) &&
                  ((e = this.getTableValue(
                    r[3].p.v,
                    r[4].p.v,
                    r[5].p.v,
                    r[6].p.v,
                    r[7].p.v
                  )),
                  this.feFuncRComposed.setAttribute('tableValues', e),
                  this.feFuncGComposed.setAttribute('tableValues', e),
                  this.feFuncBComposed.setAttribute('tableValues', e)),
                this.feFuncR &&
                  (t ||
                    r[10].p._mdf ||
                    r[11].p._mdf ||
                    r[12].p._mdf ||
                    r[13].p._mdf ||
                    r[14].p._mdf) &&
                  ((e = this.getTableValue(
                    r[10].p.v,
                    r[11].p.v,
                    r[12].p.v,
                    r[13].p.v,
                    r[14].p.v
                  )),
                  this.feFuncR.setAttribute('tableValues', e)),
                this.feFuncG &&
                  (t ||
                    r[17].p._mdf ||
                    r[18].p._mdf ||
                    r[19].p._mdf ||
                    r[20].p._mdf ||
                    r[21].p._mdf) &&
                  ((e = this.getTableValue(
                    r[17].p.v,
                    r[18].p.v,
                    r[19].p.v,
                    r[20].p.v,
                    r[21].p.v
                  )),
                  this.feFuncG.setAttribute('tableValues', e)),
                this.feFuncB &&
                  (t ||
                    r[24].p._mdf ||
                    r[25].p._mdf ||
                    r[26].p._mdf ||
                    r[27].p._mdf ||
                    r[28].p._mdf) &&
                  ((e = this.getTableValue(
                    r[24].p.v,
                    r[25].p.v,
                    r[26].p.v,
                    r[27].p.v,
                    r[28].p.v
                  )),
                  this.feFuncB.setAttribute('tableValues', e)),
                this.feFuncA) &&
                (t ||
                  r[31].p._mdf ||
                  r[32].p._mdf ||
                  r[33].p._mdf ||
                  r[34].p._mdf ||
                  r[35].p._mdf) &&
                ((e = this.getTableValue(
                  r[31].p.v,
                  r[32].p.v,
                  r[33].p.v,
                  r[34].p.v,
                  r[35].p.v
                )),
                this.feFuncA.setAttribute('tableValues', e));
            }),
            (SVGDropShadowEffect.prototype.renderFrame = function (t) {
              var e, r;
              (t || this.filterManager._mdf) &&
                ((t || this.filterManager.effectElements[4].p._mdf) &&
                  this.feGaussianBlur.setAttribute(
                    'stdDeviation',
                    this.filterManager.effectElements[4].p.v / 4
                  ),
                (t || this.filterManager.effectElements[0].p._mdf) &&
                  ((r = this.filterManager.effectElements[0].p.v),
                  this.feFlood.setAttribute(
                    'flood-color',
                    rgbToHex(
                      Math.round(255 * r[0]),
                      Math.round(255 * r[1]),
                      Math.round(255 * r[2])
                    )
                  )),
                (t || this.filterManager.effectElements[1].p._mdf) &&
                  this.feFlood.setAttribute(
                    'flood-opacity',
                    this.filterManager.effectElements[1].p.v / 255
                  ),
                t ||
                  this.filterManager.effectElements[2].p._mdf ||
                  this.filterManager.effectElements[3].p._mdf) &&
                ((r = this.filterManager.effectElements[3].p.v),
                (t =
                  (this.filterManager.effectElements[2].p.v - 90) * degToRads),
                (e = r * Math.cos(t)),
                (r = r * Math.sin(t)),
                this.feOffset.setAttribute('dx', e),
                this.feOffset.setAttribute('dy', r));
            });
          var _svgMatteSymbols = [];
          function SVGMatte3Effect(t, e, r) {
            (this.initialized = !1),
              (this.filterManager = e),
              (this.filterElem = t),
              ((this.elem = r).matteElement = createNS('g')),
              r.matteElement.appendChild(r.layerElement),
              r.matteElement.appendChild(r.transformedElement),
              (r.baseElement = r.matteElement);
          }
          function SVGEffects(t) {
            var e,
              r,
              i = t.data.ef ? t.data.ef.length : 0,
              s = createElementID(),
              n = filtersFactory.createFilter(s),
              a = 0;
            for (this.filters = [], e = 0; e < i; e += 1)
              (r = null),
                20 === t.data.ef[e].ty
                  ? ((a += 1),
                    (r = new SVGTintFilter(
                      n,
                      t.effectsManager.effectElements[e]
                    )))
                  : 21 === t.data.ef[e].ty
                    ? ((a += 1),
                      (r = new SVGFillFilter(
                        n,
                        t.effectsManager.effectElements[e]
                      )))
                    : 22 === t.data.ef[e].ty
                      ? (r = new SVGStrokeEffect(
                          t,
                          t.effectsManager.effectElements[e]
                        ))
                      : 23 === t.data.ef[e].ty
                        ? ((a += 1),
                          (r = new SVGTritoneFilter(
                            n,
                            t.effectsManager.effectElements[e]
                          )))
                        : 24 === t.data.ef[e].ty
                          ? ((a += 1),
                            (r = new SVGProLevelsFilter(
                              n,
                              t.effectsManager.effectElements[e]
                            )))
                          : 25 === t.data.ef[e].ty
                            ? ((a += 1),
                              (r = new SVGDropShadowEffect(
                                n,
                                t.effectsManager.effectElements[e]
                              )))
                            : 28 === t.data.ef[e].ty
                              ? (r = new SVGMatte3Effect(
                                  n,
                                  t.effectsManager.effectElements[e],
                                  t
                                ))
                              : 29 === t.data.ef[e].ty &&
                                ((a += 1),
                                (r = new SVGGaussianBlurEffect(
                                  n,
                                  t.effectsManager.effectElements[e]
                                ))),
                r && this.filters.push(r);
            a &&
              (t.globalData.defs.appendChild(n),
              t.layerElement.setAttribute(
                'filter',
                'url(' + locationHref + '#' + s + ')'
              )),
              this.filters.length && t.addRenderableComponent(this);
          }
          (SVGMatte3Effect.prototype.findSymbol = function (t) {
            for (var e = 0, r = _svgMatteSymbols.length; e < r; ) {
              if (_svgMatteSymbols[e] === t) return _svgMatteSymbols[e];
              e += 1;
            }
            return null;
          }),
            (SVGMatte3Effect.prototype.replaceInParent = function (t, e) {
              var r = t.layerElement.parentNode;
              if (r) {
                for (
                  var i, s = r.children, n = 0, a = s.length;
                  n < a && s[n] !== t.layerElement;

                )
                  n += 1;
                n <= a - 2 && (i = s[n + 1]);
                var o = createNS('use');
                o.setAttribute('href', '#' + e),
                  i ? r.insertBefore(o, i) : r.appendChild(o);
              }
            }),
            (SVGMatte3Effect.prototype.setElementAsMask = function (t, e) {
              var r, i, s, n;
              this.findSymbol(e) ||
                ((r = createElementID()),
                (i = createNS('mask')).setAttribute('id', e.layerId),
                i.setAttribute('mask-type', 'alpha'),
                _svgMatteSymbols.push(e),
                (n = t.globalData.defs).appendChild(i),
                (s = createNS('symbol')).setAttribute('id', r),
                this.replaceInParent(e, r),
                s.appendChild(e.layerElement),
                n.appendChild(s),
                (n = createNS('use')).setAttribute('href', '#' + r),
                i.appendChild(n),
                (e.data.hd = !1),
                e.show()),
                t.setMatte(e.layerId);
            }),
            (SVGMatte3Effect.prototype.initialize = function () {
              for (
                var t = this.filterManager.effectElements[0].p.v,
                  e = this.elem.comp.elements,
                  r = 0,
                  i = e.length;
                r < i;

              )
                e[r] &&
                  e[r].data.ind === t &&
                  this.setElementAsMask(this.elem, e[r]),
                  (r += 1);
              this.initialized = !0;
            }),
            (SVGMatte3Effect.prototype.renderFrame = function () {
              this.initialized || this.initialize();
            }),
            (SVGEffects.prototype.renderFrame = function (t) {
              for (var e = this.filters.length, r = 0; r < e; r += 1)
                this.filters[r].renderFrame(t);
            });
          var animationManager = (function () {
              var t = {},
                s = [],
                i = 0,
                n = 0,
                a = 0,
                o = !0,
                h = !1;
              function r(t) {
                for (var e = 0, r = t.target; e < n; )
                  s[e].animation === r &&
                    (s.splice(e, 1), --e, --n, r.isPaused || c()),
                    (e += 1);
              }
              function l(t, e) {
                if (!t) return null;
                for (var r = 0; r < n; ) {
                  if (s[r].elem == t && null !== s[r].elem)
                    return s[r].animation;
                  r += 1;
                }
                var i = new AnimationItem();
                return f(i, t), i.setData(t, e), i;
              }
              function p() {
                (a += 1), u();
              }
              function c() {
                --a;
              }
              function f(t, e) {
                t.addEventListener('destroy', r),
                  t.addEventListener('_active', p),
                  t.addEventListener('_idle', c),
                  s.push({ elem: e, animation: t }),
                  (n += 1);
              }
              function d(t) {
                for (var e = t - i, r = 0; r < n; r += 1)
                  s[r].animation.advanceTime(e);
                (i = t), a && !h ? window.requestAnimationFrame(d) : (o = !0);
              }
              function e(t) {
                (i = t), window.requestAnimationFrame(d);
              }
              function u() {
                !h && a && o && (window.requestAnimationFrame(e), (o = !1));
              }
              return (
                (t.registerAnimation = l),
                (t.loadAnimation = function (t) {
                  var e = new AnimationItem();
                  return f(e, null), e.setParams(t), e;
                }),
                (t.setSpeed = function (t, e) {
                  for (var r = 0; r < n; r += 1) s[r].animation.setSpeed(t, e);
                }),
                (t.setDirection = function (t, e) {
                  for (var r = 0; r < n; r += 1)
                    s[r].animation.setDirection(t, e);
                }),
                (t.play = function (t) {
                  for (var e = 0; e < n; e += 1) s[e].animation.play(t);
                }),
                (t.pause = function (t) {
                  for (var e = 0; e < n; e += 1) s[e].animation.pause(t);
                }),
                (t.stop = function (t) {
                  for (var e = 0; e < n; e += 1) s[e].animation.stop(t);
                }),
                (t.togglePause = function (t) {
                  for (var e = 0; e < n; e += 1) s[e].animation.togglePause(t);
                }),
                (t.searchAnimations = function (t, e, r) {
                  for (
                    var i,
                      s = [].concat(
                        [].slice.call(
                          document.getElementsByClassName('lottie')
                        ),
                        [].slice.call(
                          document.getElementsByClassName('bodymovin')
                        )
                      ),
                      n = s.length,
                      a = 0;
                    a < n;
                    a += 1
                  )
                    r && s[a].setAttribute('data-bm-type', r), l(s[a], t);
                  e &&
                    0 === n &&
                    ((r = r || 'svg'),
                    ((e = document.getElementsByTagName('body')[0]).innerHTML =
                      ''),
                    ((i = createTag('div')).style.width = '100%'),
                    (i.style.height = '100%'),
                    i.setAttribute('data-bm-type', r),
                    e.appendChild(i),
                    l(i, t));
                }),
                (t.resize = function () {
                  for (var t = 0; t < n; t += 1) s[t].animation.resize();
                }),
                (t.goToAndStop = function (t, e, r) {
                  for (var i = 0; i < n; i += 1)
                    s[i].animation.goToAndStop(t, e, r);
                }),
                (t.destroy = function (t) {
                  for (var e = n - 1; 0 <= e; --e) s[e].animation.destroy(t);
                }),
                (t.freeze = function () {
                  h = !0;
                }),
                (t.unfreeze = function () {
                  (h = !1), u();
                }),
                (t.getRegisteredAnimations = function () {
                  for (var t = s.length, e = [], r = 0; r < t; r += 1)
                    e.push(s[r].animation);
                  return e;
                }),
                t
              );
            })(),
            AnimationItem = function () {
              (this._cbs = []),
                (this.name = ''),
                (this.path = ''),
                (this.isLoaded = !1),
                (this.currentFrame = 0),
                (this.currentRawFrame = 0),
                (this.firstFrame = 0),
                (this.totalFrames = 0),
                (this.frameRate = 0),
                (this.frameMult = 0),
                (this.playSpeed = 1),
                (this.playDirection = 1),
                (this.playCount = 0),
                (this.animationData = {}),
                (this.assets = []),
                (this.isPaused = !0),
                (this.autoplay = !1),
                (this.loop = !0),
                (this.renderer = null),
                (this.animationID = createElementID()),
                (this.assetsPath = ''),
                (this.timeCompleted = 0),
                (this.segmentPos = 0),
                (this.isSubframeEnabled = subframeEnabled),
                (this.segments = []),
                (this._idle = !0),
                (this._completedLoop = !1),
                (this.projectInterface = ProjectInterface()),
                (this.imagePreloader = new ImagePreloader());
            },
            Expressions =
              (extendPrototype([BaseEvent], AnimationItem),
              (AnimationItem.prototype.setParams = function (t) {
                (t.wrapper || t.container) &&
                  (this.wrapper = t.wrapper || t.container);
                var e = t.animType || t.renderer || 'svg';
                switch (e) {
                  case 'canvas':
                    this.renderer = new CanvasRenderer(
                      this,
                      t.rendererSettings
                    );
                    break;
                  case 'svg':
                    this.renderer = new SVGRenderer(this, t.rendererSettings);
                    break;
                  default:
                    this.renderer = new HybridRenderer(
                      this,
                      t.rendererSettings
                    );
                }
                this.imagePreloader.setCacheType(e),
                  this.renderer.setProjectInterface(this.projectInterface),
                  (this.animType = e),
                  '' === t.loop ||
                  null === t.loop ||
                  void 0 === t.loop ||
                  !0 === t.loop
                    ? (this.loop = !0)
                    : !1 === t.loop
                      ? (this.loop = !1)
                      : (this.loop = parseInt(t.loop)),
                  (this.autoplay = !('autoplay' in t) || t.autoplay),
                  (this.name = t.name || ''),
                  (this.autoloadSegments =
                    !t.hasOwnProperty('autoloadSegments') ||
                    t.autoloadSegments),
                  (this.assetsPath = t.assetsPath),
                  (this.initialSegment = t.initialSegment),
                  t.animationData
                    ? this.configAnimation(t.animationData)
                    : t.path &&
                      (-1 !== t.path.lastIndexOf('\\')
                        ? (this.path = t.path.substr(
                            0,
                            t.path.lastIndexOf('\\') + 1
                          ))
                        : (this.path = t.path.substr(
                            0,
                            t.path.lastIndexOf('/') + 1
                          )),
                      (this.fileName = t.path.substr(
                        t.path.lastIndexOf('/') + 1
                      )),
                      (this.fileName = this.fileName.substr(
                        0,
                        this.fileName.lastIndexOf('.json')
                      )),
                      assetLoader.load(
                        t.path,
                        this.configAnimation.bind(this),
                        function () {
                          this.trigger('data_failed');
                        }.bind(this)
                      ));
              }),
              (AnimationItem.prototype.setData = function (t, e) {
                var e = {
                    wrapper: t,
                    animationData: e
                      ? 'object' == typeof e
                        ? e
                        : JSON.parse(e)
                      : null,
                  },
                  t = t.attributes,
                  r =
                    ((e.path = t.getNamedItem('data-animation-path')
                      ? t.getNamedItem('data-animation-path').value
                      : t.getNamedItem('data-bm-path')
                        ? t.getNamedItem('data-bm-path').value
                        : t.getNamedItem('bm-path')
                          ? t.getNamedItem('bm-path').value
                          : ''),
                    (e.animType = t.getNamedItem('data-anim-type')
                      ? t.getNamedItem('data-anim-type').value
                      : t.getNamedItem('data-bm-type')
                        ? t.getNamedItem('data-bm-type').value
                        : t.getNamedItem('bm-type')
                          ? t.getNamedItem('bm-type').value
                          : t.getNamedItem('data-bm-renderer')
                            ? t.getNamedItem('data-bm-renderer').value
                            : t.getNamedItem('bm-renderer')
                              ? t.getNamedItem('bm-renderer').value
                              : 'canvas'),
                    t.getNamedItem('data-anim-loop')
                      ? t.getNamedItem('data-anim-loop').value
                      : t.getNamedItem('data-bm-loop')
                        ? t.getNamedItem('data-bm-loop').value
                        : t.getNamedItem('bm-loop')
                          ? t.getNamedItem('bm-loop').value
                          : ''),
                  r =
                    ('' !== r &&
                      (e.loop = 'false' !== r && ('true' === r || parseInt(r))),
                    t.getNamedItem('data-anim-autoplay')
                      ? t.getNamedItem('data-anim-autoplay').value
                      : t.getNamedItem('data-bm-autoplay')
                        ? t.getNamedItem('data-bm-autoplay').value
                        : !t.getNamedItem('bm-autoplay') ||
                          t.getNamedItem('bm-autoplay').value);
                (e.autoplay = 'false' !== r),
                  (e.name = t.getNamedItem('data-name')
                    ? t.getNamedItem('data-name').value
                    : t.getNamedItem('data-bm-name')
                      ? t.getNamedItem('data-bm-name').value
                      : t.getNamedItem('bm-name')
                        ? t.getNamedItem('bm-name').value
                        : ''),
                  'false' ===
                    (t.getNamedItem('data-anim-prerender')
                      ? t.getNamedItem('data-anim-prerender').value
                      : t.getNamedItem('data-bm-prerender')
                        ? t.getNamedItem('data-bm-prerender').value
                        : t.getNamedItem('bm-prerender')
                          ? t.getNamedItem('bm-prerender').value
                          : '') && (e.prerender = !1),
                  this.setParams(e);
              }),
              (AnimationItem.prototype.includeLayers = function (t) {
                t.op > this.animationData.op &&
                  ((this.animationData.op = t.op),
                  (this.totalFrames = Math.floor(
                    t.op - this.animationData.ip
                  )));
                for (
                  var e,
                    r = this.animationData.layers,
                    i = r.length,
                    s = t.layers,
                    n = s.length,
                    a = 0;
                  a < n;
                  a += 1
                )
                  for (e = 0; e < i; ) {
                    if (r[e].id == s[a].id) {
                      r[e] = s[a];
                      break;
                    }
                    e += 1;
                  }
                if (
                  ((t.chars || t.fonts) &&
                    (this.renderer.globalData.fontManager.addChars(t.chars),
                    this.renderer.globalData.fontManager.addFonts(
                      t.fonts,
                      this.renderer.globalData.defs
                    )),
                  t.assets)
                )
                  for (i = t.assets.length, e = 0; e < i; e += 1)
                    this.animationData.assets.push(t.assets[e]);
                (this.animationData.__complete = !1),
                  dataManager.completeData(
                    this.animationData,
                    this.renderer.globalData.fontManager
                  ),
                  this.renderer.includeLayers(t.layers),
                  expressionsPlugin && expressionsPlugin.initExpressions(this),
                  this.loadNextSegment();
              }),
              (AnimationItem.prototype.loadNextSegment = function () {
                var t = this.animationData.segments;
                t && 0 !== t.length && this.autoloadSegments
                  ? ((t = t.shift()),
                    (this.timeCompleted = t.time * this.frameRate),
                    (t =
                      this.path +
                      this.fileName +
                      '_' +
                      this.segmentPos +
                      '.json'),
                    (this.segmentPos += 1),
                    assetLoader.load(
                      t,
                      this.includeLayers.bind(this),
                      function () {
                        this.trigger('data_failed');
                      }.bind(this)
                    ))
                  : (this.trigger('data_ready'),
                    (this.timeCompleted = this.totalFrames));
              }),
              (AnimationItem.prototype.loadSegments = function () {
                this.animationData.segments ||
                  (this.timeCompleted = this.totalFrames),
                  this.loadNextSegment();
              }),
              (AnimationItem.prototype.imagesLoaded = function () {
                this.trigger('loaded_images'), this.checkLoaded();
              }),
              (AnimationItem.prototype.preloadImages = function () {
                this.imagePreloader.setAssetsPath(this.assetsPath),
                  this.imagePreloader.setPath(this.path),
                  this.imagePreloader.loadAssets(
                    this.animationData.assets,
                    this.imagesLoaded.bind(this)
                  );
              }),
              (AnimationItem.prototype.configAnimation = function (t) {
                if (this.renderer)
                  try {
                    (this.animationData = t),
                      this.initialSegment
                        ? ((this.totalFrames = Math.floor(
                            this.initialSegment[1] - this.initialSegment[0]
                          )),
                          (this.firstFrame = Math.round(
                            this.initialSegment[0]
                          )))
                        : ((this.totalFrames = Math.floor(
                            this.animationData.op - this.animationData.ip
                          )),
                          (this.firstFrame = Math.round(
                            this.animationData.ip
                          ))),
                      this.renderer.configAnimation(t),
                      t.assets || (t.assets = []),
                      (this.assets = this.animationData.assets),
                      (this.frameRate = this.animationData.fr),
                      (this.frameMult = this.animationData.fr / 1e3),
                      this.renderer.searchExtraCompositions(t.assets),
                      this.trigger('config_ready'),
                      this.preloadImages(),
                      this.loadSegments(),
                      this.updaFrameModifier(),
                      this.waitForFontsLoaded();
                  } catch (t) {
                    this.triggerConfigError(t);
                  }
              }),
              (AnimationItem.prototype.waitForFontsLoaded = function () {
                this.renderer &&
                  (this.renderer.globalData.fontManager.isLoaded
                    ? this.checkLoaded()
                    : setTimeout(this.waitForFontsLoaded.bind(this), 20));
              }),
              (AnimationItem.prototype.checkLoaded = function () {
                this.isLoaded ||
                  !this.renderer.globalData.fontManager.isLoaded ||
                  (!this.imagePreloader.loaded() &&
                    'canvas' === this.renderer.rendererType) ||
                  ((this.isLoaded = !0),
                  dataManager.completeData(
                    this.animationData,
                    this.renderer.globalData.fontManager
                  ),
                  expressionsPlugin && expressionsPlugin.initExpressions(this),
                  this.renderer.initItems(),
                  setTimeout(
                    function () {
                      this.trigger('DOMLoaded');
                    }.bind(this),
                    0
                  ),
                  this.gotoFrame(),
                  this.autoplay && this.play());
              }),
              (AnimationItem.prototype.resize = function () {
                this.renderer.updateContainerSize();
              }),
              (AnimationItem.prototype.setSubframe = function (t) {
                this.isSubframeEnabled = !!t;
              }),
              (AnimationItem.prototype.gotoFrame = function () {
                (this.currentFrame = this.isSubframeEnabled
                  ? this.currentRawFrame
                  : ~~this.currentRawFrame),
                  this.timeCompleted !== this.totalFrames &&
                    this.currentFrame > this.timeCompleted &&
                    (this.currentFrame = this.timeCompleted),
                  this.trigger('enterFrame'),
                  this.renderFrame();
              }),
              (AnimationItem.prototype.renderFrame = function () {
                if (!1 !== this.isLoaded)
                  try {
                    this.renderer.renderFrame(
                      this.currentFrame + this.firstFrame
                    );
                  } catch (t) {
                    this.triggerRenderFrameError(t);
                  }
              }),
              (AnimationItem.prototype.play = function (t) {
                (t && this.name != t) ||
                  (!0 === this.isPaused &&
                    ((this.isPaused = !1), this._idle) &&
                    ((this._idle = !1), this.trigger('_active')));
              }),
              (AnimationItem.prototype.pause = function (t) {
                (t && this.name != t) ||
                  (!1 === this.isPaused &&
                    ((this.isPaused = !0),
                    (this._idle = !0),
                    this.trigger('_idle')));
              }),
              (AnimationItem.prototype.togglePause = function (t) {
                (t && this.name != t) ||
                  (!0 === this.isPaused ? this.play() : this.pause());
              }),
              (AnimationItem.prototype.stop = function (t) {
                (t && this.name != t) ||
                  (this.pause(),
                  (this.playCount = 0),
                  (this._completedLoop = !1),
                  this.setCurrentRawFrameValue(0));
              }),
              (AnimationItem.prototype.goToAndStop = function (t, e, r) {
                (r && this.name != r) ||
                  (e
                    ? this.setCurrentRawFrameValue(t)
                    : this.setCurrentRawFrameValue(t * this.frameModifier),
                  this.pause());
              }),
              (AnimationItem.prototype.goToAndPlay = function (t, e, r) {
                this.goToAndStop(t, e, r), this.play();
              }),
              (AnimationItem.prototype.advanceTime = function (t) {
                var e;
                !0 !== this.isPaused &&
                  !1 !== this.isLoaded &&
                  ((e = !1),
                  (t = this.currentRawFrame + t * this.frameModifier) >=
                    this.totalFrames - 1 && 0 < this.frameModifier
                    ? this.loop && this.playCount !== this.loop
                      ? t >= this.totalFrames
                        ? ((this.playCount += 1),
                          this.checkSegments(t % this.totalFrames) ||
                            (this.setCurrentRawFrameValue(t % this.totalFrames),
                            (this._completedLoop = !0),
                            this.trigger('loopComplete')))
                        : this.setCurrentRawFrameValue(t)
                      : this.checkSegments(
                          t > this.totalFrames ? t % this.totalFrames : 0
                        ) || ((e = !0), (t = this.totalFrames - 1))
                    : t < 0
                      ? this.checkSegments(t % this.totalFrames) ||
                        (!this.loop ||
                        (this.playCount-- <= 0 && !0 !== this.loop)
                          ? ((e = !0), (t = 0))
                          : (this.setCurrentRawFrameValue(
                              this.totalFrames + (t % this.totalFrames)
                            ),
                            this._completedLoop
                              ? this.trigger('loopComplete')
                              : (this._completedLoop = !0)))
                      : this.setCurrentRawFrameValue(t),
                  e) &&
                  (this.setCurrentRawFrameValue(t),
                  this.pause(),
                  this.trigger('complete'));
              }),
              (AnimationItem.prototype.adjustSegment = function (t, e) {
                (this.playCount = 0),
                  t[1] < t[0]
                    ? (0 < this.frameModifier &&
                        (this.playSpeed < 0
                          ? this.setSpeed(-this.playSpeed)
                          : this.setDirection(-1)),
                      (this.timeCompleted = this.totalFrames = t[0] - t[1]),
                      (this.firstFrame = t[1]),
                      this.setCurrentRawFrameValue(
                        this.totalFrames - 0.001 - e
                      ))
                    : t[1] > t[0] &&
                      (this.frameModifier < 0 &&
                        (this.playSpeed < 0
                          ? this.setSpeed(-this.playSpeed)
                          : this.setDirection(1)),
                      (this.timeCompleted = this.totalFrames = t[1] - t[0]),
                      (this.firstFrame = t[0]),
                      this.setCurrentRawFrameValue(0.001 + e)),
                  this.trigger('segmentStart');
              }),
              (AnimationItem.prototype.setSegment = function (t, e) {
                var r = -1;
                this.isPaused &&
                  (this.currentRawFrame + this.firstFrame < t
                    ? (r = t)
                    : this.currentRawFrame + this.firstFrame > e &&
                      (r = e - t)),
                  (this.firstFrame = t),
                  (this.timeCompleted = this.totalFrames = e - t),
                  -1 !== r && this.goToAndStop(r, !0);
              }),
              (AnimationItem.prototype.playSegments = function (t, e) {
                if ((e && (this.segments.length = 0), 'object' == typeof t[0]))
                  for (var r = t.length, i = 0; i < r; i += 1)
                    this.segments.push(t[i]);
                else this.segments.push(t);
                this.segments.length &&
                  e &&
                  this.adjustSegment(this.segments.shift(), 0),
                  this.isPaused && this.play();
              }),
              (AnimationItem.prototype.resetSegments = function (t) {
                (this.segments.length = 0),
                  this.segments.push([
                    this.animationData.ip,
                    this.animationData.op,
                  ]),
                  t && this.checkSegments(0);
              }),
              (AnimationItem.prototype.checkSegments = function (t) {
                return (
                  !!this.segments.length &&
                  (this.adjustSegment(this.segments.shift(), t), !0)
                );
              }),
              (AnimationItem.prototype.destroy = function (t) {
                (t && this.name != t) ||
                  !this.renderer ||
                  (this.renderer.destroy(),
                  this.imagePreloader.destroy(),
                  this.trigger('destroy'),
                  (this._cbs = null),
                  (this.onEnterFrame =
                    this.onLoopComplete =
                    this.onComplete =
                    this.onSegmentStart =
                    this.onDestroy =
                      null),
                  (this.renderer = null));
              }),
              (AnimationItem.prototype.setCurrentRawFrameValue = function (t) {
                (this.currentRawFrame = t), this.gotoFrame();
              }),
              (AnimationItem.prototype.setSpeed = function (t) {
                (this.playSpeed = t), this.updaFrameModifier();
              }),
              (AnimationItem.prototype.setDirection = function (t) {
                (this.playDirection = t < 0 ? -1 : 1), this.updaFrameModifier();
              }),
              (AnimationItem.prototype.updaFrameModifier = function () {
                this.frameModifier =
                  this.frameMult * this.playSpeed * this.playDirection;
              }),
              (AnimationItem.prototype.getPath = function () {
                return this.path;
              }),
              (AnimationItem.prototype.getAssetsPath = function (t) {
                var e,
                  r = '';
                return (r = t.e
                  ? t.p
                  : this.assetsPath
                    ? (-1 !== (e = t.p).indexOf('images/') &&
                        (e = e.split('/')[1]),
                      this.assetsPath + e)
                    : ((r = this.path), (r += t.u || '') + t.p));
              }),
              (AnimationItem.prototype.getAssetData = function (t) {
                for (var e = 0, r = this.assets.length; e < r; ) {
                  if (t == this.assets[e].id) return this.assets[e];
                  e += 1;
                }
              }),
              (AnimationItem.prototype.hide = function () {
                this.renderer.hide();
              }),
              (AnimationItem.prototype.show = function () {
                this.renderer.show();
              }),
              (AnimationItem.prototype.getDuration = function (t) {
                return t ? this.totalFrames : this.totalFrames / this.frameRate;
              }),
              (AnimationItem.prototype.trigger = function (t) {
                if (this._cbs && this._cbs[t])
                  switch (t) {
                    case 'enterFrame':
                      this.triggerEvent(
                        t,
                        new BMEnterFrameEvent(
                          t,
                          this.currentFrame,
                          this.totalFrames,
                          this.frameModifier
                        )
                      );
                      break;
                    case 'loopComplete':
                      this.triggerEvent(
                        t,
                        new BMCompleteLoopEvent(
                          t,
                          this.loop,
                          this.playCount,
                          this.frameMult
                        )
                      );
                      break;
                    case 'complete':
                      this.triggerEvent(
                        t,
                        new BMCompleteEvent(t, this.frameMult)
                      );
                      break;
                    case 'segmentStart':
                      this.triggerEvent(
                        t,
                        new BMSegmentStartEvent(
                          t,
                          this.firstFrame,
                          this.totalFrames
                        )
                      );
                      break;
                    case 'destroy':
                      this.triggerEvent(t, new BMDestroyEvent(t, this));
                      break;
                    default:
                      this.triggerEvent(t);
                  }
                'enterFrame' === t &&
                  this.onEnterFrame &&
                  this.onEnterFrame.call(
                    this,
                    new BMEnterFrameEvent(
                      t,
                      this.currentFrame,
                      this.totalFrames,
                      this.frameMult
                    )
                  ),
                  'loopComplete' === t &&
                    this.onLoopComplete &&
                    this.onLoopComplete.call(
                      this,
                      new BMCompleteLoopEvent(
                        t,
                        this.loop,
                        this.playCount,
                        this.frameMult
                      )
                    ),
                  'complete' === t &&
                    this.onComplete &&
                    this.onComplete.call(
                      this,
                      new BMCompleteEvent(t, this.frameMult)
                    ),
                  'segmentStart' === t &&
                    this.onSegmentStart &&
                    this.onSegmentStart.call(
                      this,
                      new BMSegmentStartEvent(
                        t,
                        this.firstFrame,
                        this.totalFrames
                      )
                    ),
                  'destroy' === t &&
                    this.onDestroy &&
                    this.onDestroy.call(this, new BMDestroyEvent(t, this));
              }),
              (AnimationItem.prototype.triggerRenderFrameError = function (t) {
                t = new BMRenderFrameErrorEvent(t, this.currentFrame);
                this.triggerEvent('error', t),
                  this.onError && this.onError.call(this, t);
              }),
              (AnimationItem.prototype.triggerConfigError = function (t) {
                t = new BMConfigErrorEvent(t, this.currentFrame);
                this.triggerEvent('error', t),
                  this.onError && this.onError.call(this, t);
              }),
              (function () {
                var t = {};
                return (
                  (t.initExpressions = function (t) {
                    var r = 0,
                      i = [];
                    (t.renderer.compInterface = CompExpressionInterface(
                      t.renderer
                    )),
                      t.renderer.globalData.projectInterface.registerComposition(
                        t.renderer
                      ),
                      (t.renderer.globalData.pushExpression = function () {
                        r += 1;
                      }),
                      (t.renderer.globalData.popExpression = function () {
                        if (0 == --r) {
                          for (var t = i.length, e = 0; e < t; e += 1)
                            i[e].release();
                          i.length = 0;
                        }
                      }),
                      (t.renderer.globalData.registerExpressionProperty =
                        function (t) {
                          -1 === i.indexOf(t) && i.push(t);
                        });
                  }),
                  t
                );
              })()),
            expressionsPlugin = Expressions,
            ExpressionManager = (function () {
              var ob = {},
                Math = BMMath,
                easeInBez = BezierFactory.getBezierEasing(
                  0.333,
                  0,
                  0.833,
                  0.833,
                  'easeIn'
                ).get,
                easeOutBez = BezierFactory.getBezierEasing(
                  0.167,
                  0.167,
                  0.667,
                  1,
                  'easeOut'
                ).get,
                easeInOutBez = BezierFactory.getBezierEasing(
                  0.33,
                  0,
                  0.667,
                  1,
                  'easeInOut'
                ).get;
              function initiateExpression(elem, data, property) {
                var val = data.x,
                  needsVelocity = /velocity(?![\w\d])/.test(val),
                  _needsRandom = -1 !== val.indexOf('random'),
                  elemType = elem.data.ty,
                  transform,
                  content,
                  effect,
                  thisProperty = property,
                  inPoint =
                    ((thisProperty.valueAtTime = thisProperty.getValueAtTime),
                    Object.defineProperty(thisProperty, 'value', {
                      get: function () {
                        return thisProperty.v;
                      },
                    }),
                    (elem.comp.frameDuration =
                      1 / elem.comp.globalData.frameRate),
                    (elem.comp.displayStartTime = 0),
                    elem.data.ip / elem.comp.globalData.frameRate),
                  outPoint = elem.data.op / elem.comp.globalData.frameRate,
                  width = elem.data.sw || 0,
                  height = elem.data.sh || 0,
                  name = elem.data.nm,
                  loopIn,
                  loopOut,
                  smooth,
                  toWorld,
                  fromWorld,
                  fromComp,
                  toComp,
                  anchorPoint,
                  thisLayer,
                  thisComp,
                  mask,
                  valueAtTime,
                  velocityAtTime,
                  __expression_functions = [],
                  scoped_bm_rt;
                if (data.xf)
                  for (var i, len = data.xf.length, i = 0; i < len; i += 1)
                    __expression_functions[i] = eval(
                      '(function(){ return ' + data.xf[i] + '}())'
                    );
                var expression_function = eval(
                    '[function _expression_function(){' +
                      val +
                      ';scoped_bm_rt=$bm_rt}]'
                  )[0],
                  numKeys = property.kf ? data.k.length : 0,
                  active = !this.data || !0 !== this.data.hd,
                  wiggle = function (t, e) {
                    for (
                      var r = this.pv.length || 1,
                        i = createTypedArray('float32', r),
                        s = Math.floor(5 * time),
                        n = 0,
                        a = 0;
                      n < s;

                    ) {
                      for (a = 0; a < r; a += 1)
                        i[a] += -e + 2 * e * BMMath.random();
                      n += 1;
                    }
                    var o = 5 * time,
                      h = o - Math.floor(o),
                      l = createTypedArray('float32', r);
                    if (1 < r) {
                      for (a = 0; a < r; a += 1)
                        l[a] =
                          this.pv[a] +
                          i[a] +
                          (-e + 2 * e * BMMath.random()) * h;
                      return l;
                    }
                    return this.pv + i[0] + (-e + 2 * e * BMMath.random()) * h;
                  }.bind(this),
                  comp =
                    (thisProperty.loopIn &&
                      (loopIn = thisProperty.loopIn.bind(thisProperty)),
                    thisProperty.loopOut &&
                      (loopOut = thisProperty.loopOut.bind(thisProperty)),
                    thisProperty.smooth &&
                      (smooth = thisProperty.smooth.bind(thisProperty)),
                    this.getValueAtTime &&
                      (valueAtTime = this.getValueAtTime.bind(this)),
                    this.getVelocityAtTime &&
                      (velocityAtTime = this.getVelocityAtTime.bind(this)),
                    elem.comp.globalData.projectInterface.bind(
                      elem.comp.globalData.projectInterface
                    )),
                  time,
                  velocity,
                  value,
                  text,
                  textIndex,
                  textTotal,
                  selectorValue;
                function seedRandom(t) {
                  BMMath.seedrandom(randSeed + t);
                }
                var index = elem.data.ind,
                  hasParent = !(!elem.hierarchy || !elem.hierarchy.length),
                  parent,
                  randSeed = Math.floor(1e6 * Math.random()),
                  globalData = elem.globalData;
                function executeExpression(t) {
                  return (
                    (value = t),
                    _needsRandom && seedRandom(randSeed),
                    this.frameExpressionId === elem.globalData.frameId &&
                    'textSelector' !== this.propType
                      ? value
                      : ('textSelector' === this.propType &&
                          ((textIndex = this.textIndex),
                          (textTotal = this.textTotal),
                          (selectorValue = this.selectorValue)),
                        thisLayer ||
                          ((text = elem.layerInterface.text),
                          (thisLayer = elem.layerInterface),
                          (thisComp = elem.comp.compInterface),
                          (toWorld = thisLayer.toWorld.bind(thisLayer)),
                          (fromWorld = thisLayer.fromWorld.bind(thisLayer)),
                          (fromComp = thisLayer.fromComp.bind(thisLayer)),
                          (toComp = thisLayer.toComp.bind(thisLayer)),
                          (mask = thisLayer.mask
                            ? thisLayer.mask.bind(thisLayer)
                            : null)),
                        transform ||
                          ((transform = elem.layerInterface(
                            'ADBE Transform Group'
                          )) &&
                            (anchorPoint = transform.anchorPoint)),
                        4 === elemType &&
                          (content =
                            content || thisLayer('ADBE Root Vectors Group')),
                        (effect = effect || thisLayer(4)),
                        (hasParent = !(
                          !elem.hierarchy || !elem.hierarchy.length
                        )) &&
                          !parent &&
                          (parent = elem.hierarchy[0].layerInterface),
                        (time =
                          this.comp.renderedFrame /
                          this.comp.globalData.frameRate),
                        needsVelocity && (velocity = velocityAtTime(time)),
                        expression_function(),
                        (this.frameExpressionId = elem.globalData.frameId),
                        scoped_bm_rt.propType,
                        scoped_bm_rt)
                  );
                }
                return executeExpression;
              }
              return (ob.initiateExpression = initiateExpression), ob;
            })(),
            expressionHelpers = {
              searchExpressions: function (t, e, r) {
                e.x &&
                  ((r.k = !0),
                  (r.x = !0),
                  (r.initiateExpression = ExpressionManager.initiateExpression),
                  r.effectsSequence.push(
                    r.initiateExpression(t, e, r).bind(r)
                  ));
              },
              getSpeedAtTime: function (t) {
                var e = this.getValueAtTime(t),
                  r = this.getValueAtTime(t + -0.01),
                  i = 0;
                if (e.length) {
                  for (var s = 0; s < e.length; s += 1)
                    i += Math.pow(r[s] - e[s], 2);
                  i = 100 * Math.sqrt(i);
                } else i = 0;
                return i;
              },
              getVelocityAtTime: function (t) {
                if (void 0 !== this.vel) return this.vel;
                var e,
                  r,
                  i = this.getValueAtTime(t),
                  s = this.getValueAtTime(t + -0.001);
                if (i.length)
                  for (
                    e = createTypedArray('float32', i.length), r = 0;
                    r < i.length;
                    r += 1
                  )
                    e[r] = (s[r] - i[r]) / -0.001;
                else e = (s - i) / -0.001;
                return e;
              },
              getValueAtTime: function (t) {
                return (
                  (t =
                    (t *= this.elem.globalData.frameRate) - this.offsetTime) !==
                    this._cachingAtTime.lastFrame &&
                    ((this._cachingAtTime.lastIndex =
                      this._cachingAtTime.lastFrame < t
                        ? this._cachingAtTime.lastIndex
                        : 0),
                    (this._cachingAtTime.value = this.interpolateValue(
                      t,
                      this._cachingAtTime
                    )),
                    (this._cachingAtTime.lastFrame = t)),
                  this._cachingAtTime.value
                );
              },
              getStaticValueAtTime: function () {
                return this.pv;
              },
              setGroupProperty: function (t) {
                this.propertyGroup = t;
              },
            },
            ShapePathInterface =
              (!(function () {
                function a(t, e, r) {
                  if (!this.k || !this.keyframes) return this.pv;
                  t = t ? t.toLowerCase() : '';
                  var i,
                    s,
                    n,
                    a,
                    o,
                    h = this.comp.renderedFrame,
                    l = this.keyframes,
                    p = l[l.length - 1].t;
                  if (h <= p) return this.pv;
                  if (
                    (r
                      ? (s =
                          p -
                          (i = e
                            ? Math.abs(p - elem.comp.globalData.frameRate * e)
                            : Math.max(0, p - this.elem.data.ip)))
                      : ((!e || e > l.length - 1) && (e = l.length - 1),
                        (i = p - (s = l[l.length - 1 - e].t))),
                    'pingpong' === t)
                  ) {
                    if (Math.floor((h - s) / i) % 2 != 0)
                      return this.getValueAtTime(
                        (i - ((h - s) % i) + s) /
                          this.comp.globalData.frameRate,
                        0
                      );
                  } else {
                    if ('offset' === t) {
                      var c = this.getValueAtTime(
                          s / this.comp.globalData.frameRate,
                          0
                        ),
                        f = this.getValueAtTime(
                          p / this.comp.globalData.frameRate,
                          0
                        ),
                        d = this.getValueAtTime(
                          (((h - s) % i) + s) / this.comp.globalData.frameRate,
                          0
                        ),
                        u = Math.floor((h - s) / i);
                      if (this.pv.length) {
                        for (
                          a = (o = new Array(c.length)).length, n = 0;
                          n < a;
                          n += 1
                        )
                          o[n] = (f[n] - c[n]) * u + d[n];
                        return o;
                      }
                      return (f - c) * u + d;
                    }
                    if ('continue' === t) {
                      var m = this.getValueAtTime(
                          p / this.comp.globalData.frameRate,
                          0
                        ),
                        y = this.getValueAtTime(
                          (p - 0.001) / this.comp.globalData.frameRate,
                          0
                        );
                      if (this.pv.length) {
                        for (
                          a = (o = new Array(m.length)).length, n = 0;
                          n < a;
                          n += 1
                        )
                          o[n] =
                            m[n] +
                            ((m[n] - y[n]) *
                              ((h - p) / this.comp.globalData.frameRate)) /
                              5e-4;
                        return o;
                      }
                      return m + ((h - p) / 0.001) * (m - y);
                    }
                  }
                  return this.getValueAtTime(
                    (((h - s) % i) + s) / this.comp.globalData.frameRate,
                    0
                  );
                }
                function o(t, e, r) {
                  if (!this.k) return this.pv;
                  t = t ? t.toLowerCase() : '';
                  var i,
                    s,
                    n,
                    a,
                    o,
                    h = this.comp.renderedFrame,
                    l = this.keyframes,
                    p = l[0].t;
                  if (p <= h) return this.pv;
                  if (
                    (r
                      ? (s =
                          p +
                          (i = e
                            ? Math.abs(elem.comp.globalData.frameRate * e)
                            : Math.max(0, this.elem.data.op - p)))
                      : (i =
                          (s =
                            l[(e = !e || e > l.length - 1 ? l.length - 1 : e)]
                              .t) - p),
                    'pingpong' === t)
                  ) {
                    if (Math.floor((p - h) / i) % 2 == 0)
                      return this.getValueAtTime(
                        (((p - h) % i) + p) / this.comp.globalData.frameRate,
                        0
                      );
                  } else {
                    if ('offset' === t) {
                      var c = this.getValueAtTime(
                          p / this.comp.globalData.frameRate,
                          0
                        ),
                        f = this.getValueAtTime(
                          s / this.comp.globalData.frameRate,
                          0
                        ),
                        d = this.getValueAtTime(
                          (i - ((p - h) % i) + p) /
                            this.comp.globalData.frameRate,
                          0
                        ),
                        u = Math.floor((p - h) / i) + 1;
                      if (this.pv.length) {
                        for (
                          a = (o = new Array(c.length)).length, n = 0;
                          n < a;
                          n += 1
                        )
                          o[n] = d[n] - (f[n] - c[n]) * u;
                        return o;
                      }
                      return d - (f - c) * u;
                    }
                    if ('continue' === t) {
                      var m = this.getValueAtTime(
                          p / this.comp.globalData.frameRate,
                          0
                        ),
                        y = this.getValueAtTime(
                          (p + 0.001) / this.comp.globalData.frameRate,
                          0
                        );
                      if (this.pv.length) {
                        for (
                          a = (o = new Array(m.length)).length, n = 0;
                          n < a;
                          n += 1
                        )
                          o[n] = m[n] + ((m[n] - y[n]) * (p - h)) / 0.001;
                        return o;
                      }
                      return m + ((m - y) * (p - h)) / 0.001;
                    }
                  }
                  return this.getValueAtTime(
                    (i - ((p - h) % i) + p) / this.comp.globalData.frameRate,
                    0
                  );
                }
                function h(t, e) {
                  if (!this.k) return this.pv;
                  if (((t = 0.5 * (t || 0.4)), (e = Math.floor(e || 5)) <= 1))
                    return this.pv;
                  for (
                    var r,
                      i =
                        this.comp.renderedFrame /
                        this.comp.globalData.frameRate,
                      s = i - t,
                      n = 1 < e ? (i + t - s) / (e - 1) : 1,
                      a = 0,
                      o = 0,
                      h = this.pv.length
                        ? createTypedArray('float32', this.pv.length)
                        : 0;
                    a < e;

                  ) {
                    if (((r = this.getValueAtTime(s + a * n)), this.pv.length))
                      for (o = 0; o < this.pv.length; o += 1) h[o] += r[o];
                    else h += r;
                    a += 1;
                  }
                  if (this.pv.length)
                    for (o = 0; o < this.pv.length; o += 1) h[o] /= e;
                  else h /= e;
                  return h;
                }
                var i = TransformPropertyFactory.getTransformProperty,
                  l =
                    ((TransformPropertyFactory.getTransformProperty = function (
                      t,
                      e,
                      r
                    ) {
                      t = i(t, e, r);
                      return (
                        t.dynamicProperties.length
                          ? (t.getValueAtTime = function (t) {
                              console.warn('Transform at time not supported');
                            }.bind(t))
                          : (t.getValueAtTime = function (t) {}.bind(t)),
                        (t.setGroupProperty =
                          expressionHelpers.setGroupProperty),
                        t
                      );
                    }),
                    PropertyFactory.getProp),
                  t =
                    ((PropertyFactory.getProp = function (t, e, r, i, s) {
                      var i = l(t, e, r, i, s),
                        n =
                          (i.kf
                            ? (i.getValueAtTime =
                                expressionHelpers.getValueAtTime.bind(i))
                            : (i.getValueAtTime =
                                expressionHelpers.getStaticValueAtTime.bind(i)),
                          (i.setGroupProperty =
                            expressionHelpers.setGroupProperty),
                          (i.loopOut = a),
                          (i.loopIn = o),
                          (i.smooth = h),
                          (i.getVelocityAtTime =
                            expressionHelpers.getVelocityAtTime.bind(i)),
                          (i.getSpeedAtTime =
                            expressionHelpers.getSpeedAtTime.bind(i)),
                          (i.numKeys = 1 === e.a ? e.k.length : 0),
                          (i.propertyIndex = e.ix),
                          0);
                      return (
                        0 !== r &&
                          (n = createTypedArray(
                            'float32',
                            (1 === e.a ? e.k[0].s : e.k).length
                          )),
                        (i._cachingAtTime = {
                          lastFrame: initialDefaultFrame,
                          lastIndex: 0,
                          value: n,
                        }),
                        expressionHelpers.searchExpressions(t, e, i),
                        i.k && s.addDynamicProperty(i),
                        i
                      );
                    }),
                    ShapePropertyFactory.getConstructorFunction()),
                  e = ShapePropertyFactory.getKeyframedConstructorFunction();
                function r() {}
                (r.prototype = {
                  vertices: function (t, e) {
                    this.k && this.getValue();
                    for (
                      var r = this.v,
                        i = (r = void 0 !== e ? this.getValueAtTime(e, 0) : r)
                          ._length,
                        s = r[t],
                        n = r.v,
                        a = createSizedArray(i),
                        o = 0;
                      o < i;
                      o += 1
                    )
                      a[o] =
                        'i' === t || 'o' === t
                          ? [s[o][0] - n[o][0], s[o][1] - n[o][1]]
                          : [s[o][0], s[o][1]];
                    return a;
                  },
                  points: function (t) {
                    return this.vertices('v', t);
                  },
                  inTangents: function (t) {
                    return this.vertices('i', t);
                  },
                  outTangents: function (t) {
                    return this.vertices('o', t);
                  },
                  isClosed: function () {
                    return this.v.c;
                  },
                  pointOnPath: function (t, e) {
                    var r = this.v;
                    void 0 !== e && (r = this.getValueAtTime(e, 0)),
                      this._segmentsLength ||
                        (this._segmentsLength = bez.getSegmentsLength(r));
                    for (
                      var e = this._segmentsLength,
                        i = e.lengths,
                        s = e.totalLength * t,
                        n = 0,
                        a = i.length,
                        o = 0;
                      n < a;

                    ) {
                      if (o + i[n].addedLength > s) {
                        var h = n,
                          l = r.c && n === a - 1 ? 0 : n + 1,
                          p = (s - o) / i[n].addedLength,
                          c = bez.getPointInSegment(
                            r.v[h],
                            r.v[l],
                            r.o[h],
                            r.i[l],
                            p,
                            i[n]
                          );
                        break;
                      }
                      (o += i[n].addedLength), (n += 1);
                    }
                    return (c =
                      c ||
                      (r.c
                        ? [r.v[0][0], r.v[0][1]]
                        : [r.v[r._length - 1][0], r.v[r._length - 1][1]]));
                  },
                  vectorOnPath: function (t, e, r) {
                    t = 1 == t ? (this.v.c ? 0 : 0.999) : t;
                    var i = this.pointOnPath(t, e),
                      t = this.pointOnPath(t + 0.001, e),
                      e = t[0] - i[0],
                      t = t[1] - i[1],
                      i = Math.sqrt(Math.pow(e, 2) + Math.pow(t, 2));
                    return 0 === i
                      ? [0, 0]
                      : 'tangent' === r
                        ? [e / i, t / i]
                        : [-t / i, e / i];
                  },
                  tangentOnPath: function (t, e) {
                    return this.vectorOnPath(t, e, 'tangent');
                  },
                  normalOnPath: function (t, e) {
                    return this.vectorOnPath(t, e, 'normal');
                  },
                  setGroupProperty: expressionHelpers.setGroupProperty,
                  getValueAtTime: expressionHelpers.getStaticValueAtTime,
                }),
                  extendPrototype([r], t),
                  extendPrototype([r], e),
                  (e.prototype.getValueAtTime = function (t) {
                    return (
                      this._cachingAtTime ||
                        (this._cachingAtTime = {
                          shapeValue: shape_pool.clone(this.pv),
                          lastIndex: 0,
                          lastTime: initialDefaultFrame,
                        }),
                      (t =
                        (t *= this.elem.globalData.frameRate) -
                        this.offsetTime) !== this._cachingAtTime.lastTime &&
                        ((this._cachingAtTime.lastIndex =
                          this._cachingAtTime.lastTime < t
                            ? this._caching.lastIndex
                            : 0),
                        (this._cachingAtTime.lastTime = t),
                        this.interpolateShape(
                          t,
                          this._cachingAtTime.shapeValue,
                          this._cachingAtTime
                        )),
                      this._cachingAtTime.shapeValue
                    );
                  }),
                  (e.prototype.initiateExpression =
                    ExpressionManager.initiateExpression);
                var n = ShapePropertyFactory.getShapeProp;
                ShapePropertyFactory.getShapeProp = function (t, e, r, i, s) {
                  i = n(t, e, r, i, s);
                  return (
                    (i.propertyIndex = e.ix),
                    (i.lock = !1),
                    3 === r
                      ? expressionHelpers.searchExpressions(t, e.pt, i)
                      : 4 === r &&
                        expressionHelpers.searchExpressions(t, e.ks, i),
                    i.k && t.addDynamicProperty(i),
                    i
                  );
                };
              })(),
              (TextProperty.prototype.getExpressionValue = function (t, e) {
                var r,
                  e = this.calculateExpression(e);
                return t.t !== e
                  ? (this.copyData((r = {}), t),
                    (r.t = e.toString()),
                    (r.__complete = !1),
                    r)
                  : t;
              }),
              (TextProperty.prototype.searchProperty = function () {
                var t = this.searchKeyframes(),
                  e = this.searchExpressions();
                return (this.kf = t || e), this.kf;
              }),
              (TextProperty.prototype.searchExpressions = function () {
                if (this.data.d.x)
                  return (
                    (this.calculateExpression =
                      ExpressionManager.initiateExpression.bind(this)(
                        this.elem,
                        this.data.d,
                        this
                      )),
                    this.addEffect(this.getExpressionValue.bind(this)),
                    !0
                  );
              }),
              function (t, e, r) {
                var i = e.sh;
                function s(t) {
                  if (
                    'Shape' === t ||
                    'shape' === t ||
                    'Path' === t ||
                    'path' === t ||
                    'ADBE Vector Shape' === t ||
                    2 === t
                  )
                    return s.path;
                }
                e = propertyGroupFactory(s, r);
                return (
                  i.setGroupProperty(PropertyInterface('Path', e)),
                  Object.defineProperties(s, {
                    path: {
                      get: function () {
                        return i.k && i.getValue(), i;
                      },
                    },
                    shape: {
                      get: function () {
                        return i.k && i.getValue(), i;
                      },
                    },
                    _name: { value: t.nm },
                    ix: { value: t.ix },
                    propertyIndex: { value: t.ix },
                    mn: { value: t.mn },
                    propertyGroup: { value: r },
                  }),
                  s
                );
              }),
            propertyGroupFactory = function (e, r) {
              return function (t) {
                return (t = void 0 === t ? 1 : t) <= 0 ? e : r(t - 1);
              };
            },
            PropertyInterface = function (t, e) {
              var r = { _name: t };
              return function (t) {
                return (t = void 0 === t ? 1 : t) <= 0 ? r : e(--t);
              };
            },
            ShapeExpressionInterface = (function () {
              function a(t, e, r) {
                for (var i = [], s = t ? t.length : 0, n = 0; n < s; n += 1)
                  'gr' == t[n].ty
                    ? i.push(
                        (function (t, e, r) {
                          function s(t) {
                            switch (t) {
                              case 'ADBE Vectors Group':
                              case 'Contents':
                              case 2:
                                return s.content;
                              default:
                                return s.transform;
                            }
                          }
                          s.propertyGroup = propertyGroupFactory(s, r);
                          (r = (function (t, e) {
                            function r(t) {
                              for (var e = 0, r = i.length; e < r; ) {
                                if (
                                  i[e]._name === t ||
                                  i[e].mn === t ||
                                  i[e].propertyIndex === t ||
                                  i[e].ix === t ||
                                  i[e].ind === t
                                )
                                  return i[e];
                                e += 1;
                              }
                              if ('number' == typeof t) return i[t - 1];
                            }
                            (r.propertyGroup = propertyGroupFactory(
                              r,
                              s.propertyGroup
                            )),
                              (i = a(t.it, e.it, r.propertyGroup)),
                              (r.numProperties = i.length);
                            var i,
                              e = o(
                                t.it[t.it.length - 1],
                                e.it[e.it.length - 1],
                                r.propertyGroup
                              );
                            return (
                              (r.transform = e),
                              (r.propertyIndex = t.cix),
                              (r._name = t.nm),
                              r
                            );
                          })(t, e)),
                            (e = o(
                              t.it[t.it.length - 1],
                              e.it[e.it.length - 1],
                              s.propertyGroup
                            ));
                          return (
                            (s.content = r),
                            (s.transform = e),
                            Object.defineProperty(s, '_name', {
                              get: function () {
                                return t.nm;
                              },
                            }),
                            (s.numProperties = t.np),
                            (s.propertyIndex = t.ix),
                            (s.nm = t.nm),
                            (s.mn = t.mn),
                            s
                          );
                        })(t[n], e[n], r)
                      )
                    : 'fl' == t[n].ty
                      ? i.push(
                          (function (t, e, r) {
                            function i(t) {
                              return 'Color' === t || 'color' === t
                                ? i.color
                                : 'Opacity' === t || 'opacity' === t
                                  ? i.opacity
                                  : void 0;
                            }
                            return (
                              Object.defineProperties(i, {
                                color: {
                                  get: ExpressionPropertyInterface(e.c),
                                },
                                opacity: {
                                  get: ExpressionPropertyInterface(e.o),
                                },
                                _name: { value: t.nm },
                                mn: { value: t.mn },
                              }),
                              e.c.setGroupProperty(
                                PropertyInterface('Color', r)
                              ),
                              e.o.setGroupProperty(
                                PropertyInterface('Opacity', r)
                              ),
                              i
                            );
                          })(t[n], e[n], r)
                        )
                      : 'st' == t[n].ty
                        ? i.push(
                            (function (e, r, t) {
                              var t = propertyGroupFactory(o, t),
                                i = propertyGroupFactory(void 0, t);
                              var s,
                                n = e.d ? e.d.length : 0,
                                a = {};
                              for (s = 0; s < n; s += 1)
                                (function (t) {
                                  Object.defineProperty(a, e.d[t].nm, {
                                    get: ExpressionPropertyInterface(
                                      r.d.dataProps[t].p
                                    ),
                                  });
                                })(s),
                                  r.d.dataProps[s].p.setGroupProperty(i);
                              function o(t) {
                                return 'Color' === t || 'color' === t
                                  ? o.color
                                  : 'Opacity' === t || 'opacity' === t
                                    ? o.opacity
                                    : 'Stroke Width' === t ||
                                        'stroke width' === t
                                      ? o.strokeWidth
                                      : void 0;
                              }
                              return (
                                Object.defineProperties(o, {
                                  color: {
                                    get: ExpressionPropertyInterface(r.c),
                                  },
                                  opacity: {
                                    get: ExpressionPropertyInterface(r.o),
                                  },
                                  strokeWidth: {
                                    get: ExpressionPropertyInterface(r.w),
                                  },
                                  dash: {
                                    get: function () {
                                      return a;
                                    },
                                  },
                                  _name: { value: e.nm },
                                  mn: { value: e.mn },
                                }),
                                r.c.setGroupProperty(
                                  PropertyInterface('Color', t)
                                ),
                                r.o.setGroupProperty(
                                  PropertyInterface('Opacity', t)
                                ),
                                r.w.setGroupProperty(
                                  PropertyInterface('Stroke Width', t)
                                ),
                                o
                              );
                            })(t[n], e[n], r)
                          )
                        : 'tm' == t[n].ty
                          ? i.push(
                              (function (e, t, r) {
                                function i(t) {
                                  return t === e.e.ix ||
                                    'End' === t ||
                                    'end' === t
                                    ? i.end
                                    : t === e.s.ix
                                      ? i.start
                                      : t === e.o.ix
                                        ? i.offset
                                        : void 0;
                                }
                                var s = propertyGroupFactory(i, r);
                                return (
                                  (i.propertyIndex = e.ix),
                                  t.s.setGroupProperty(
                                    PropertyInterface('Start', s)
                                  ),
                                  t.e.setGroupProperty(
                                    PropertyInterface('End', s)
                                  ),
                                  t.o.setGroupProperty(
                                    PropertyInterface('Offset', s)
                                  ),
                                  (i.propertyIndex = e.ix),
                                  (i.propertyGroup = r),
                                  Object.defineProperties(i, {
                                    start: {
                                      get: ExpressionPropertyInterface(t.s),
                                    },
                                    end: {
                                      get: ExpressionPropertyInterface(t.e),
                                    },
                                    offset: {
                                      get: ExpressionPropertyInterface(t.o),
                                    },
                                    _name: { value: e.nm },
                                  }),
                                  (i.mn = e.mn),
                                  i
                                );
                              })(t[n], e[n], r)
                            )
                          : 'tr' != t[n].ty &&
                            ('el' == t[n].ty
                              ? i.push(
                                  (function (e, t, r) {
                                    function i(t) {
                                      return e.p.ix === t
                                        ? i.position
                                        : e.s.ix === t
                                          ? i.size
                                          : void 0;
                                    }
                                    (r = propertyGroupFactory(i, r)),
                                      (i.propertyIndex = e.ix),
                                      (t = 'tm' === t.sh.ty ? t.sh.prop : t.sh);
                                    return (
                                      t.s.setGroupProperty(
                                        PropertyInterface('Size', r)
                                      ),
                                      t.p.setGroupProperty(
                                        PropertyInterface('Position', r)
                                      ),
                                      Object.defineProperties(i, {
                                        size: {
                                          get: ExpressionPropertyInterface(t.s),
                                        },
                                        position: {
                                          get: ExpressionPropertyInterface(t.p),
                                        },
                                        _name: { value: e.nm },
                                      }),
                                      (i.mn = e.mn),
                                      i
                                    );
                                  })(t[n], e[n], r)
                                )
                              : 'sr' == t[n].ty
                                ? i.push(
                                    (function (e, t, r) {
                                      function i(t) {
                                        return e.p.ix === t
                                          ? i.position
                                          : e.r.ix === t
                                            ? i.rotation
                                            : e.pt.ix === t
                                              ? i.points
                                              : e.or.ix === t ||
                                                  'ADBE Vector Star Outer Radius' ===
                                                    t
                                                ? i.outerRadius
                                                : e.os.ix === t
                                                  ? i.outerRoundness
                                                  : !e.ir ||
                                                      (e.ir.ix !== t &&
                                                        'ADBE Vector Star Inner Radius' !==
                                                          t)
                                                    ? e.is && e.is.ix === t
                                                      ? i.innerRoundness
                                                      : void 0
                                                    : i.innerRadius;
                                      }
                                      (r = propertyGroupFactory(i, r)),
                                        (t =
                                          'tm' === t.sh.ty ? t.sh.prop : t.sh);
                                      return (
                                        (i.propertyIndex = e.ix),
                                        t.or.setGroupProperty(
                                          PropertyInterface('Outer Radius', r)
                                        ),
                                        t.os.setGroupProperty(
                                          PropertyInterface(
                                            'Outer Roundness',
                                            r
                                          )
                                        ),
                                        t.pt.setGroupProperty(
                                          PropertyInterface('Points', r)
                                        ),
                                        t.p.setGroupProperty(
                                          PropertyInterface('Position', r)
                                        ),
                                        t.r.setGroupProperty(
                                          PropertyInterface('Rotation', r)
                                        ),
                                        e.ir &&
                                          (t.ir.setGroupProperty(
                                            PropertyInterface('Inner Radius', r)
                                          ),
                                          t.is.setGroupProperty(
                                            PropertyInterface(
                                              'Inner Roundness',
                                              r
                                            )
                                          )),
                                        Object.defineProperties(i, {
                                          position: {
                                            get: ExpressionPropertyInterface(
                                              t.p
                                            ),
                                          },
                                          rotation: {
                                            get: ExpressionPropertyInterface(
                                              t.r
                                            ),
                                          },
                                          points: {
                                            get: ExpressionPropertyInterface(
                                              t.pt
                                            ),
                                          },
                                          outerRadius: {
                                            get: ExpressionPropertyInterface(
                                              t.or
                                            ),
                                          },
                                          outerRoundness: {
                                            get: ExpressionPropertyInterface(
                                              t.os
                                            ),
                                          },
                                          innerRadius: {
                                            get: ExpressionPropertyInterface(
                                              t.ir
                                            ),
                                          },
                                          innerRoundness: {
                                            get: ExpressionPropertyInterface(
                                              t.is
                                            ),
                                          },
                                          _name: { value: e.nm },
                                        }),
                                        (i.mn = e.mn),
                                        i
                                      );
                                    })(t[n], e[n], r)
                                  )
                                : 'sh' == t[n].ty
                                  ? i.push(ShapePathInterface(t[n], e[n], r))
                                  : 'rc' == t[n].ty
                                    ? i.push(
                                        (function (e, t, r) {
                                          function i(t) {
                                            return e.p.ix === t
                                              ? i.position
                                              : e.r.ix === t
                                                ? i.roundness
                                                : e.s.ix === t ||
                                                    'Size' === t ||
                                                    'ADBE Vector Rect Size' ===
                                                      t
                                                  ? i.size
                                                  : void 0;
                                          }
                                          (r = propertyGroupFactory(i, r)),
                                            (t =
                                              'tm' === t.sh.ty
                                                ? t.sh.prop
                                                : t.sh);
                                          return (
                                            (i.propertyIndex = e.ix),
                                            t.p.setGroupProperty(
                                              PropertyInterface('Position', r)
                                            ),
                                            t.s.setGroupProperty(
                                              PropertyInterface('Size', r)
                                            ),
                                            t.r.setGroupProperty(
                                              PropertyInterface('Rotation', r)
                                            ),
                                            Object.defineProperties(i, {
                                              position: {
                                                get: ExpressionPropertyInterface(
                                                  t.p
                                                ),
                                              },
                                              roundness: {
                                                get: ExpressionPropertyInterface(
                                                  t.r
                                                ),
                                              },
                                              size: {
                                                get: ExpressionPropertyInterface(
                                                  t.s
                                                ),
                                              },
                                              _name: { value: e.nm },
                                            }),
                                            (i.mn = e.mn),
                                            i
                                          );
                                        })(t[n], e[n], r)
                                      )
                                    : 'rd' == t[n].ty
                                      ? i.push(
                                          (function (e, t, r) {
                                            function i(t) {
                                              if (
                                                e.r.ix === t ||
                                                'Round Corners 1' === t
                                              )
                                                return i.radius;
                                            }
                                            r = propertyGroupFactory(i, r);
                                            return (
                                              (i.propertyIndex = e.ix),
                                              t.rd.setGroupProperty(
                                                PropertyInterface('Radius', r)
                                              ),
                                              Object.defineProperties(i, {
                                                radius: {
                                                  get: ExpressionPropertyInterface(
                                                    t.rd
                                                  ),
                                                },
                                                _name: { value: e.nm },
                                              }),
                                              (i.mn = e.mn),
                                              i
                                            );
                                          })(t[n], e[n], r)
                                        )
                                      : 'rp' == t[n].ty &&
                                        i.push(
                                          (function (e, t, r) {
                                            function i(t) {
                                              return e.c.ix === t ||
                                                'Copies' === t
                                                ? i.copies
                                                : e.o.ix === t || 'Offset' === t
                                                  ? i.offset
                                                  : void 0;
                                            }
                                            r = propertyGroupFactory(i, r);
                                            return (
                                              (i.propertyIndex = e.ix),
                                              t.c.setGroupProperty(
                                                PropertyInterface('Copies', r)
                                              ),
                                              t.o.setGroupProperty(
                                                PropertyInterface('Offset', r)
                                              ),
                                              Object.defineProperties(i, {
                                                copies: {
                                                  get: ExpressionPropertyInterface(
                                                    t.c
                                                  ),
                                                },
                                                offset: {
                                                  get: ExpressionPropertyInterface(
                                                    t.o
                                                  ),
                                                },
                                                _name: { value: e.nm },
                                              }),
                                              (i.mn = e.mn),
                                              i
                                            );
                                          })(t[n], e[n], r)
                                        ));
                return i;
              }
              function o(e, t, r) {
                function i(t) {
                  return e.a.ix === t || 'Anchor Point' === t
                    ? i.anchorPoint
                    : e.o.ix === t || 'Opacity' === t
                      ? i.opacity
                      : e.p.ix === t || 'Position' === t
                        ? i.position
                        : e.r.ix === t ||
                            'Rotation' === t ||
                            'ADBE Vector Rotation' === t
                          ? i.rotation
                          : e.s.ix === t || 'Scale' === t
                            ? i.scale
                            : (e.sk && e.sk.ix === t) || 'Skew' === t
                              ? i.skew
                              : (e.sa && e.sa.ix === t) || 'Skew Axis' === t
                                ? i.skewAxis
                                : void 0;
                }
                var s = propertyGroupFactory(i, r);
                return (
                  t.transform.mProps.o.setGroupProperty(
                    PropertyInterface('Opacity', s)
                  ),
                  t.transform.mProps.p.setGroupProperty(
                    PropertyInterface('Position', s)
                  ),
                  t.transform.mProps.a.setGroupProperty(
                    PropertyInterface('Anchor Point', s)
                  ),
                  t.transform.mProps.s.setGroupProperty(
                    PropertyInterface('Scale', s)
                  ),
                  t.transform.mProps.r.setGroupProperty(
                    PropertyInterface('Rotation', s)
                  ),
                  t.transform.mProps.sk &&
                    (t.transform.mProps.sk.setGroupProperty(
                      PropertyInterface('Skew', s)
                    ),
                    t.transform.mProps.sa.setGroupProperty(
                      PropertyInterface('Skew Angle', s)
                    )),
                  t.transform.op.setGroupProperty(
                    PropertyInterface('Opacity', s)
                  ),
                  Object.defineProperties(i, {
                    opacity: {
                      get: ExpressionPropertyInterface(t.transform.mProps.o),
                    },
                    position: {
                      get: ExpressionPropertyInterface(t.transform.mProps.p),
                    },
                    anchorPoint: {
                      get: ExpressionPropertyInterface(t.transform.mProps.a),
                    },
                    scale: {
                      get: ExpressionPropertyInterface(t.transform.mProps.s),
                    },
                    rotation: {
                      get: ExpressionPropertyInterface(t.transform.mProps.r),
                    },
                    skew: {
                      get: ExpressionPropertyInterface(t.transform.mProps.sk),
                    },
                    skewAxis: {
                      get: ExpressionPropertyInterface(t.transform.mProps.sa),
                    },
                    _name: { value: e.nm },
                  }),
                  (i.ty = 'tr'),
                  (i.mn = e.mn),
                  (i.propertyGroup = r),
                  i
                );
              }
              return function (t, e, i) {
                var s;
                function r(t) {
                  if ('number' == typeof t)
                    return 0 === (t = void 0 === t ? 1 : t) ? i : s[t - 1];
                  for (var e = 0, r = s.length; e < r; ) {
                    if (s[e]._name === t) return s[e];
                    e += 1;
                  }
                }
                return (
                  (r.propertyGroup = i),
                  (s = a(t, e, r)),
                  (r.numProperties = s.length),
                  r
                );
              };
            })(),
            TextExpressionInterface = function (e) {
              var r;
              function t() {}
              return (
                Object.defineProperty(t, 'sourceText', {
                  get: function () {
                    e.textProperty.getValue();
                    var t = e.textProperty.currentData.t;
                    return (
                      void 0 !== t &&
                        ((e.textProperty.currentData.t = void 0),
                        ((r = new String(t)).value = t || new String(t))),
                      r
                    );
                  },
                }),
                t
              );
            },
            LayerExpressionInterface = (function () {
              function s(t, e) {
                var r = new Matrix();
                if (
                  (r.reset(),
                  this._elem.finalTransform.mProp.applyToMatrix(r),
                  this._elem.hierarchy && this._elem.hierarchy.length)
                )
                  for (
                    var i = this._elem.hierarchy.length, s = 0;
                    s < i;
                    s += 1
                  )
                    this._elem.hierarchy[s].finalTransform.mProp.applyToMatrix(
                      r
                    );
                return r.applyToPointArray(t[0], t[1], t[2] || 0);
              }
              function n(t, e) {
                var r = new Matrix();
                if (
                  (r.reset(),
                  this._elem.finalTransform.mProp.applyToMatrix(r),
                  this._elem.hierarchy && this._elem.hierarchy.length)
                )
                  for (
                    var i = this._elem.hierarchy.length, s = 0;
                    s < i;
                    s += 1
                  )
                    this._elem.hierarchy[s].finalTransform.mProp.applyToMatrix(
                      r
                    );
                return r.inversePoint(t);
              }
              function a(t) {
                var e = new Matrix();
                if (
                  (e.reset(),
                  this._elem.finalTransform.mProp.applyToMatrix(e),
                  this._elem.hierarchy && this._elem.hierarchy.length)
                )
                  for (
                    var r = this._elem.hierarchy.length, i = 0;
                    i < r;
                    i += 1
                  )
                    this._elem.hierarchy[i].finalTransform.mProp.applyToMatrix(
                      e
                    );
                return e.inversePoint(t);
              }
              function o() {
                return [1, 1, 1, 1];
              }
              return function (e) {
                var r;
                function i(t) {
                  switch (t) {
                    case 'ADBE Root Vectors Group':
                    case 'Contents':
                    case 2:
                      return i.shapeInterface;
                    case 1:
                    case 6:
                    case 'Transform':
                    case 'transform':
                    case 'ADBE Transform Group':
                      return r;
                    case 4:
                    case 'ADBE Effect Parade':
                    case 'effects':
                    case 'Effects':
                      return i.effect;
                  }
                }
                (i.toWorld = s),
                  (i.fromWorld = n),
                  (i.toComp = s),
                  (i.fromComp = a),
                  (i.sampleImage = o),
                  (i.sourceRectAtTime = e.sourceRectAtTime.bind(e));
                var t = getDescriptor(
                  (r = TransformExpressionInterface(
                    (i._elem = e).finalTransform.mProp
                  )),
                  'anchorPoint'
                );
                return (
                  Object.defineProperties(i, {
                    hasParent: {
                      get: function () {
                        return e.hierarchy.length;
                      },
                    },
                    parent: {
                      get: function () {
                        return e.hierarchy[0].layerInterface;
                      },
                    },
                    rotation: getDescriptor(r, 'rotation'),
                    scale: getDescriptor(r, 'scale'),
                    position: getDescriptor(r, 'position'),
                    opacity: getDescriptor(r, 'opacity'),
                    anchorPoint: t,
                    anchor_point: t,
                    transform: {
                      get: function () {
                        return r;
                      },
                    },
                    active: {
                      get: function () {
                        return e.isInRange;
                      },
                    },
                  }),
                  (i.startTime = e.data.st),
                  (i.index = e.data.ind),
                  (i.source = e.data.refId),
                  (i.height = 0 === e.data.ty ? e.data.h : 100),
                  (i.width = 0 === e.data.ty ? e.data.w : 100),
                  (i.inPoint = e.data.ip / e.comp.globalData.frameRate),
                  (i.outPoint = e.data.op / e.comp.globalData.frameRate),
                  (i._name = e.data.nm),
                  (i.registerMaskInterface = function (t) {
                    i.mask = new MaskManagerInterface(t, e);
                  }),
                  (i.registerEffectsInterface = function (t) {
                    i.effect = t;
                  }),
                  i
                );
              };
            })(),
            CompExpressionInterface = function (i) {
              function t(t) {
                for (var e = 0, r = i.layers.length; e < r; ) {
                  if (i.layers[e].nm === t || i.layers[e].ind === t)
                    return i.elements[e].layerInterface;
                  e += 1;
                }
                return null;
              }
              return (
                Object.defineProperty(t, '_name', { value: i.data.nm }),
                ((t.layer = t).pixelAspect = 1),
                (t.height = i.data.h || i.globalData.compSize.h),
                (t.width = i.data.w || i.globalData.compSize.w),
                (t.pixelAspect = 1),
                (t.frameDuration = 1 / i.globalData.frameRate),
                (t.displayStartTime = 0),
                (t.numLayers = i.layers.length),
                t
              );
            },
            TransformExpressionInterface = function (t) {
              function e(t) {
                switch (t) {
                  case 'scale':
                  case 'Scale':
                  case 'ADBE Scale':
                  case 6:
                    return e.scale;
                  case 'rotation':
                  case 'Rotation':
                  case 'ADBE Rotation':
                  case 'ADBE Rotate Z':
                  case 10:
                    return e.rotation;
                  case 'ADBE Rotate X':
                    return e.xRotation;
                  case 'ADBE Rotate Y':
                    return e.yRotation;
                  case 'position':
                  case 'Position':
                  case 'ADBE Position':
                  case 2:
                    return e.position;
                  case 'ADBE Position_0':
                    return e.xPosition;
                  case 'ADBE Position_1':
                    return e.yPosition;
                  case 'ADBE Position_2':
                    return e.zPosition;
                  case 'anchorPoint':
                  case 'AnchorPoint':
                  case 'Anchor Point':
                  case 'ADBE AnchorPoint':
                  case 1:
                    return e.anchorPoint;
                  case 'opacity':
                  case 'Opacity':
                  case 11:
                    return e.opacity;
                }
              }
              var r, i, s, n;
              return (
                Object.defineProperty(e, 'rotation', {
                  get: ExpressionPropertyInterface(t.r || t.rz),
                }),
                Object.defineProperty(e, 'zRotation', {
                  get: ExpressionPropertyInterface(t.rz || t.r),
                }),
                Object.defineProperty(e, 'xRotation', {
                  get: ExpressionPropertyInterface(t.rx),
                }),
                Object.defineProperty(e, 'yRotation', {
                  get: ExpressionPropertyInterface(t.ry),
                }),
                Object.defineProperty(e, 'scale', {
                  get: ExpressionPropertyInterface(t.s),
                }),
                t.p
                  ? (r = ExpressionPropertyInterface(t.p))
                  : ((s = ExpressionPropertyInterface(t.px)),
                    (n = ExpressionPropertyInterface(t.py)),
                    t.pz && (i = ExpressionPropertyInterface(t.pz))),
                Object.defineProperty(e, 'position', {
                  get: function () {
                    return t.p ? r() : [s(), n(), i ? i() : 0];
                  },
                }),
                Object.defineProperty(e, 'xPosition', {
                  get: ExpressionPropertyInterface(t.px),
                }),
                Object.defineProperty(e, 'yPosition', {
                  get: ExpressionPropertyInterface(t.py),
                }),
                Object.defineProperty(e, 'zPosition', {
                  get: ExpressionPropertyInterface(t.pz),
                }),
                Object.defineProperty(e, 'anchorPoint', {
                  get: ExpressionPropertyInterface(t.a),
                }),
                Object.defineProperty(e, 'opacity', {
                  get: ExpressionPropertyInterface(t.o),
                }),
                Object.defineProperty(e, 'skew', {
                  get: ExpressionPropertyInterface(t.sk),
                }),
                Object.defineProperty(e, 'skewAxis', {
                  get: ExpressionPropertyInterface(t.sa),
                }),
                Object.defineProperty(e, 'orientation', {
                  get: ExpressionPropertyInterface(t.or),
                }),
                e
              );
            },
            ProjectInterface = (function () {
              function e(t) {
                this.compositions.push(t);
              }
              return function () {
                function t(t) {
                  for (var e = 0, r = this.compositions.length; e < r; ) {
                    if (
                      this.compositions[e].data &&
                      this.compositions[e].data.nm === t
                    )
                      return (
                        this.compositions[e].prepareFrame &&
                          this.compositions[e].data.xt &&
                          this.compositions[e].prepareFrame(this.currentFrame),
                        this.compositions[e].compInterface
                      );
                    e += 1;
                  }
                }
                return (
                  (t.compositions = []),
                  (t.currentFrame = 0),
                  (t.registerComposition = e),
                  t
                );
              };
            })(),
            EffectsExpressionInterface = (function () {
              function l(s, t, e, r) {
                function i(t) {
                  for (var e = s.ef, r = 0, i = e.length; r < i; ) {
                    if (t === e[r].nm || t === e[r].mn || t === e[r].ix)
                      return 5 === e[r].ty ? a[r] : a[r]();
                    r += 1;
                  }
                  return a[0]();
                }
                for (
                  var n = propertyGroupFactory(i, e),
                    a = [],
                    o = s.ef.length,
                    h = 0;
                  h < o;
                  h += 1
                )
                  5 === s.ef[h].ty
                    ? a.push(
                        l(
                          s.ef[h],
                          t.effectElements[h],
                          t.effectElements[h].propertyGroup,
                          r
                        )
                      )
                    : a.push(
                        (function (t, e, r, i) {
                          var s = ExpressionPropertyInterface(t.p);
                          return (
                            t.p.setGroupProperty &&
                              t.p.setGroupProperty(PropertyInterface('', i)),
                            function () {
                              return 10 === e
                                ? r.comp.compInterface(t.p.v)
                                : s();
                            }
                          );
                        })(t.effectElements[h], s.ef[h].ty, r, n)
                      );
                return (
                  'ADBE Color Control' === s.mn &&
                    Object.defineProperty(i, 'color', {
                      get: function () {
                        return a[0]();
                      },
                    }),
                  Object.defineProperties(i, {
                    numProperties: {
                      get: function () {
                        return s.np;
                      },
                    },
                    _name: { value: s.nm },
                    propertyGroup: { value: n },
                  }),
                  (i.active = i.enabled = 0 !== s.en),
                  i
                );
              }
              return {
                createEffectsInterface: function (t, e) {
                  if (t.effectsManager) {
                    for (
                      var r = [],
                        i = t.data.ef,
                        s = t.effectsManager.effectElements.length,
                        n = 0;
                      n < s;
                      n += 1
                    )
                      r.push(l(i[n], t.effectsManager.effectElements[n], e, t));
                    var a = t.data.ef || [],
                      o = function (t) {
                        for (n = 0, s = a.length; n < s; ) {
                          if (t === a[n].nm || t === a[n].mn || t === a[n].ix)
                            return r[n];
                          n += 1;
                        }
                      };
                    return (
                      Object.defineProperty(o, 'numProperties', {
                        get: function () {
                          return a.length;
                        },
                      }),
                      o
                    );
                  }
                },
              };
            })(),
            MaskManagerInterface = (function () {
              function n(t, e) {
                (this._mask = t), (this._data = e);
              }
              return (
                Object.defineProperty(n.prototype, 'maskPath', {
                  get: function () {
                    return (
                      this._mask.prop.k && this._mask.prop.getValue(),
                      this._mask.prop
                    );
                  },
                }),
                Object.defineProperty(n.prototype, 'maskOpacity', {
                  get: function () {
                    return (
                      this._mask.op.k && this._mask.op.getValue(),
                      100 * this._mask.op.v
                    );
                  },
                }),
                function (e, t) {
                  for (
                    var r = createSizedArray(e.viewData.length),
                      i = e.viewData.length,
                      s = 0;
                    s < i;
                    s += 1
                  )
                    r[s] = new n(e.viewData[s], e.masksProperties[s]);
                  return function (t) {
                    for (s = 0; s < i; ) {
                      if (e.masksProperties[s].nm === t) return r[s];
                      s += 1;
                    }
                  };
                }
              );
            })(),
            ExpressionPropertyInterface = (function () {
              var p = { pv: 0, v: 0, mult: 1 },
                c = { pv: [0, 0, 0], v: [0, 0, 0], mult: 1 };
              function f(r, i, s) {
                Object.defineProperty(r, 'velocity', {
                  get: function () {
                    return i.getVelocityAtTime(i.comp.currentFrame);
                  },
                }),
                  (r.numKeys = i.keyframes ? i.keyframes.length : 0),
                  (r.key = function (t) {
                    var e;
                    return r.numKeys
                      ? ((e = ''),
                        (e =
                          's' in i.keyframes[t - 1]
                            ? i.keyframes[t - 1].s
                            : 'e' in i.keyframes[t - 2]
                              ? i.keyframes[t - 2].e
                              : i.keyframes[t - 2].s),
                        ((e =
                          'unidimensional' === s
                            ? new Number(e)
                            : Object.assign({}, e)).time =
                          i.keyframes[t - 1].t /
                          i.elem.comp.globalData.frameRate),
                        e)
                      : 0;
                  }),
                  (r.valueAtTime = i.getValueAtTime),
                  (r.speedAtTime = i.getSpeedAtTime),
                  (r.velocityAtTime = i.getVelocityAtTime),
                  (r.propertyGroup = i.propertyGroup);
              }
              function d() {
                return p;
              }
              return function (t) {
                return t
                  ? 'unidimensional' === t.propType
                    ? ((o = 1 / (a = (a = t) && 'pv' in a ? a : p).mult),
                      (h = a.pv * o),
                      ((l = new Number(h)).value = h),
                      f(l, a, 'unidimensional'),
                      function () {
                        return (
                          a.k && a.getValue(),
                          (h = a.v * o),
                          l.value !== h &&
                            (((l = new Number(h)).value = h),
                            f(l, a, 'unidimensional')),
                          l
                        );
                      })
                    : ((r = 1 / (e = (e = t) && 'pv' in e ? e : c).mult),
                      (i = e.pv.length),
                      (s = createTypedArray('float32', i)),
                      (n = createTypedArray('float32', i)),
                      (s.value = n),
                      f(s, e, 'multidimensional'),
                      function () {
                        e.k && e.getValue();
                        for (var t = 0; t < i; t += 1) s[t] = n[t] = e.v[t] * r;
                        return s;
                      })
                  : d;
                var e, r, i, s, n, a, o, h, l;
              };
            })(),
            TextExpressionSelectorProp,
            propertyGetTextProp;
          function SliderEffect(t, e, r) {
            this.p = PropertyFactory.getProp(e, t.v, 0, 0, r);
          }
          function AngleEffect(t, e, r) {
            this.p = PropertyFactory.getProp(e, t.v, 0, 0, r);
          }
          function ColorEffect(t, e, r) {
            this.p = PropertyFactory.getProp(e, t.v, 1, 0, r);
          }
          function PointEffect(t, e, r) {
            this.p = PropertyFactory.getProp(e, t.v, 1, 0, r);
          }
          function LayerIndexEffect(t, e, r) {
            this.p = PropertyFactory.getProp(e, t.v, 0, 0, r);
          }
          function MaskIndexEffect(t, e, r) {
            this.p = PropertyFactory.getProp(e, t.v, 0, 0, r);
          }
          function CheckboxEffect(t, e, r) {
            this.p = PropertyFactory.getProp(e, t.v, 0, 0, r);
          }
          function NoValueEffect() {
            this.p = {};
          }
          function EffectsManager() {}
          function EffectsManager(t, e) {
            var r = t.ef || [];
            this.effectElements = [];
            for (var i, s = r.length, n = 0; n < s; n++)
              (i = new GroupEffect(r[n], e)), this.effectElements.push(i);
          }
          function GroupEffect(t, e) {
            this.init(t, e);
          }
          (TextExpressionSelectorProp = (function () {
            function r(t, e) {
              return (
                (this.textIndex = t + 1),
                (this.textTotal = e),
                (this.v = this.getValue() * this.mult),
                this.v
              );
            }
            return function (t, e) {
              (this.pv = 1),
                (this.comp = t.comp),
                (this.elem = t),
                (this.mult = 0.01),
                (this.propType = 'textSelector'),
                (this.textTotal = e.totalChars),
                (this.selectorValue = 100),
                (this.lastValue = [1, 1, 1]),
                (this.k = !0),
                (this.x = !0),
                (this.getValue = ExpressionManager.initiateExpression.bind(
                  this
                )(t, e, this)),
                (this.getMult = r),
                (this.getVelocityAtTime = expressionHelpers.getVelocityAtTime),
                this.kf
                  ? (this.getValueAtTime =
                      expressionHelpers.getValueAtTime.bind(this))
                  : (this.getValueAtTime =
                      expressionHelpers.getStaticValueAtTime.bind(this)),
                (this.setGroupProperty = expressionHelpers.setGroupProperty);
            };
          })()),
            (propertyGetTextProp = TextSelectorProp.getTextSelectorProp),
            (TextSelectorProp.getTextSelectorProp = function (t, e, r) {
              return 1 === e.t
                ? new TextExpressionSelectorProp(t, e, r)
                : propertyGetTextProp(t, e, r);
            }),
            extendPrototype([DynamicPropertyContainer], GroupEffect),
            (GroupEffect.prototype.getValue =
              GroupEffect.prototype.iterateDynamicProperties),
            (GroupEffect.prototype.init = function (t, e) {
              (this.data = t),
                (this.effectElements = []),
                this.initDynamicPropertyContainer(e);
              for (
                var r, i = this.data.ef.length, s = this.data.ef, n = 0;
                n < i;
                n += 1
              ) {
                switch (((r = null), s[n].ty)) {
                  case 0:
                    r = new SliderEffect(s[n], e, this);
                    break;
                  case 1:
                    r = new AngleEffect(s[n], e, this);
                    break;
                  case 2:
                    r = new ColorEffect(s[n], e, this);
                    break;
                  case 3:
                    r = new PointEffect(s[n], e, this);
                    break;
                  case 4:
                  case 7:
                    r = new CheckboxEffect(s[n], e, this);
                    break;
                  case 10:
                    r = new LayerIndexEffect(s[n], e, this);
                    break;
                  case 11:
                    r = new MaskIndexEffect(s[n], e, this);
                    break;
                  case 5:
                    r = new EffectsManager(s[n], e, this);
                    break;
                  default:
                    r = new NoValueEffect(s[n], e, this);
                }
                r && this.effectElements.push(r);
              }
            });
          var lottie = {};
          function setLocationHref(t) {
            locationHref = t;
          }
          function searchAnimations() {
            animationManager.searchAnimations();
          }
          function setSubframeRendering(t) {
            subframeEnabled = t;
          }
          function loadAnimation(t) {
            return animationManager.loadAnimation(t);
          }
          function setQuality(t) {
            if ('string' == typeof t)
              switch (t) {
                case 'high':
                  defaultCurveSegments = 200;
                  break;
                case 'medium':
                  defaultCurveSegments = 50;
                  break;
                case 'low':
                  defaultCurveSegments = 10;
              }
            else !isNaN(t) && 1 < t && (defaultCurveSegments = t);
          }
          function inBrowser() {
            return 'undefined' != typeof navigator;
          }
          function installPlugin(t, e) {
            'expressions' === t && (expressionsPlugin = e);
          }
          function getFactory(t) {
            switch (t) {
              case 'propertyFactory':
                return PropertyFactory;
              case 'shapePropertyFactory':
                return ShapePropertyFactory;
              case 'matrix':
                return Matrix;
            }
          }
          function checkReady() {
            'complete' === document.readyState &&
              (clearInterval(readyStateCheckInterval), searchAnimations());
          }
          function getQueryVariable(t) {
            for (var e = queryString.split('&'), r = 0; r < e.length; r++) {
              var i = e[r].split('=');
              if (decodeURIComponent(i[0]) == t)
                return decodeURIComponent(i[1]);
            }
          }
          (lottie.play = animationManager.play),
            (lottie.pause = animationManager.pause),
            (lottie.setLocationHref = setLocationHref),
            (lottie.togglePause = animationManager.togglePause),
            (lottie.setSpeed = animationManager.setSpeed),
            (lottie.setDirection = animationManager.setDirection),
            (lottie.stop = animationManager.stop),
            (lottie.searchAnimations = searchAnimations),
            (lottie.registerAnimation = animationManager.registerAnimation),
            (lottie.loadAnimation = loadAnimation),
            (lottie.setSubframeRendering = setSubframeRendering),
            (lottie.resize = animationManager.resize),
            (lottie.goToAndStop = animationManager.goToAndStop),
            (lottie.destroy = animationManager.destroy),
            (lottie.setQuality = setQuality),
            (lottie.inBrowser = inBrowser),
            (lottie.installPlugin = installPlugin),
            (lottie.freeze = animationManager.freeze),
            (lottie.unfreeze = animationManager.unfreeze),
            (lottie.getRegisteredAnimations =
              animationManager.getRegisteredAnimations),
            (lottie.__getFactory = getFactory),
            (lottie.version = '5.7.1');
          var renderer = '',
            scripts = document.getElementsByTagName('script'),
            index = scripts.length - 1,
            myScript = scripts[index] || { src: '' },
            queryString = myScript.src.replace(/^[^\?]+\??/, ''),
            renderer = getQueryVariable('renderer'),
            readyStateCheckInterval = setInterval(checkReady, 100);
          return lottie;
        });
    }),
    jszip = createCommonjsModule(function (t, e) {
      t.exports = (function i(s, n, a) {
        function o(e, t) {
          if (!n[e]) {
            if (!s[e]) {
              var r = 'function' == typeof commonjsRequire && commonjsRequire;
              if (!t && r) return r(e, !0);
              if (h) return h(e, !0);
              t = new Error("Cannot find module '" + e + "'");
              throw ((t.code = 'MODULE_NOT_FOUND'), t);
            }
            r = n[e] = { exports: {} };
            s[e][0].call(
              r.exports,
              function (t) {
                return o(s[e][1][t] || t);
              },
              r,
              r.exports,
              i,
              s,
              n,
              a
            );
          }
          return n[e].exports;
        }
        for (
          var h = 'function' == typeof commonjsRequire && commonjsRequire,
            t = 0;
          t < a.length;
          t++
        )
          o(a[t]);
        return o;
      })(
        {
          1: [
            function (t, e, r) {
              var c = t('./utils'),
                p = t('./support'),
                f =
                  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
              (r.encode = function (t) {
                for (
                  var e,
                    r,
                    i,
                    s,
                    n,
                    a,
                    o = [],
                    h = 0,
                    l = t.length,
                    p = 'string' !== c.getTypeOf(t);
                  h < t.length;

                )
                  (a = l - h),
                    (i = p
                      ? ((e = t[h++]),
                        (r = h < l ? t[h++] : 0),
                        h < l ? t[h++] : 0)
                      : ((e = t.charCodeAt(h++)),
                        (r = h < l ? t.charCodeAt(h++) : 0),
                        h < l ? t.charCodeAt(h++) : 0)),
                    (s = ((3 & e) << 4) | (r >> 4)),
                    (n = 1 < a ? ((15 & r) << 2) | (i >> 6) : 64),
                    (a = 2 < a ? 63 & i : 64),
                    o.push(
                      f.charAt(e >> 2) + f.charAt(s) + f.charAt(n) + f.charAt(a)
                    );
                return o.join('');
              }),
                (r.decode = function (t) {
                  var e,
                    r,
                    i,
                    s,
                    n,
                    a = 0,
                    o = 0;
                  if ('data:' === t.substr(0, 'data:'.length))
                    throw new Error(
                      'Invalid base64 input, it looks like a data url.'
                    );
                  var h,
                    l =
                      (3 * (t = t.replace(/[^A-Za-z0-9\+\/\=]/g, '')).length) /
                      4;
                  if (
                    (t.charAt(t.length - 1) === f.charAt(64) && l--,
                    t.charAt(t.length - 2) === f.charAt(64) && l--,
                    l % 1 != 0)
                  )
                    throw new Error(
                      'Invalid base64 input, bad content length.'
                    );
                  for (
                    h = new (p.uint8array ? Uint8Array : Array)(0 | l);
                    a < t.length;

                  )
                    (e =
                      (f.indexOf(t.charAt(a++)) << 2) |
                      ((s = f.indexOf(t.charAt(a++))) >> 4)),
                      (r =
                        ((15 & s) << 4) |
                        ((s = f.indexOf(t.charAt(a++))) >> 2)),
                      (i = ((3 & s) << 6) | (n = f.indexOf(t.charAt(a++)))),
                      (h[o++] = e),
                      64 !== s && (h[o++] = r),
                      64 !== n && (h[o++] = i);
                  return h;
                });
            },
            { './support': 30, './utils': 32 },
          ],
          2: [
            function (t, e, r) {
              var i = t('./external'),
                s = t('./stream/DataWorker'),
                n = t('./stream/DataLengthProbe'),
                a = t('./stream/Crc32Probe');
              function o(t, e, r, i, s) {
                (this.compressedSize = t),
                  (this.uncompressedSize = e),
                  (this.crc32 = r),
                  (this.compression = i),
                  (this.compressedContent = s);
              }
              (n = t('./stream/DataLengthProbe')),
                (o.prototype = {
                  getContentWorker: function () {
                    var t = new s(i.Promise.resolve(this.compressedContent))
                        .pipe(this.compression.uncompressWorker())
                        .pipe(new n('data_length')),
                      e = this;
                    return (
                      t.on('end', function () {
                        if (this.streamInfo.data_length !== e.uncompressedSize)
                          throw new Error(
                            'Bug : uncompressed data size mismatch'
                          );
                      }),
                      t
                    );
                  },
                  getCompressedWorker: function () {
                    return new s(i.Promise.resolve(this.compressedContent))
                      .withStreamInfo('compressedSize', this.compressedSize)
                      .withStreamInfo('uncompressedSize', this.uncompressedSize)
                      .withStreamInfo('crc32', this.crc32)
                      .withStreamInfo('compression', this.compression);
                  },
                }),
                (o.createWorkerFrom = function (t, e, r) {
                  return t
                    .pipe(new a())
                    .pipe(new n('uncompressedSize'))
                    .pipe(e.compressWorker(r))
                    .pipe(new n('compressedSize'))
                    .withStreamInfo('compression', e);
                }),
                (e.exports = o);
            },
            {
              './external': 6,
              './stream/Crc32Probe': 25,
              './stream/DataLengthProbe': 26,
              './stream/DataWorker': 27,
            },
          ],
          3: [
            function (t, e, r) {
              var i = t('./stream/GenericWorker');
              (r.STORE = {
                magic: '\0\0',
                compressWorker: function (t) {
                  return new i('STORE compression');
                },
                uncompressWorker: function () {
                  return new i('STORE decompression');
                },
              }),
                (r.DEFLATE = t('./flate'));
            },
            { './flate': 7, './stream/GenericWorker': 28 },
          ],
          4: [
            function (t, e, r) {
              var i = t('./utils'),
                a = (function () {
                  for (var t = [], e = 0; e < 256; e++) {
                    for (var r = e, i = 0; i < 8; i++)
                      r = 1 & r ? 3988292384 ^ (r >>> 1) : r >>> 1;
                    t[e] = r;
                  }
                  return t;
                })();
              e.exports = function (t, e) {
                return void 0 !== t && t.length
                  ? ('string' !== i.getTypeOf(t)
                      ? function (t, e, r) {
                          var i = a,
                            s = 0 + r;
                          t ^= -1;
                          for (var n = 0; n < s; n++)
                            t = (t >>> 8) ^ i[255 & (t ^ e[n])];
                          return -1 ^ t;
                        }
                      : function (t, e, r) {
                          var i = a,
                            s = 0 + r;
                          t ^= -1;
                          for (var n = 0; n < s; n++)
                            t = (t >>> 8) ^ i[255 & (t ^ e.charCodeAt(n))];
                          return -1 ^ t;
                        })(0 | e, t, t.length)
                  : 0;
              };
            },
            { './utils': 32 },
          ],
          5: [
            function (t, e, r) {
              (r.base64 = !1),
                (r.binary = !1),
                (r.dir = !1),
                (r.createFolders = !0),
                (r.date = null),
                (r.compression = null),
                (r.compressionOptions = null),
                (r.comment = null),
                (r.unixPermissions = null),
                (r.dosPermissions = null);
            },
            {},
          ],
          6: [
            function (t, e, r) {
              t = 'undefined' != typeof Promise ? Promise : t('lie');
              e.exports = { Promise: t };
            },
            { lie: 37 },
          ],
          7: [
            function (t, e, r) {
              var i =
                  'undefined' != typeof Uint8Array &&
                  'undefined' != typeof Uint16Array &&
                  'undefined' != typeof Uint32Array,
                s = t('pako'),
                n = t('./utils'),
                a = t('./stream/GenericWorker'),
                o = i ? 'uint8array' : 'array';
              function h(t, e) {
                a.call(this, 'FlateWorker/' + t),
                  (this._pako = null),
                  (this._pakoAction = t),
                  (this._pakoOptions = e),
                  (this.meta = {});
              }
              (r.magic = '\b\0'),
                n.inherits(h, a),
                (h.prototype.processChunk = function (t) {
                  (this.meta = t.meta),
                    null === this._pako && this._createPako(),
                    this._pako.push(n.transformTo(o, t.data), !1);
                }),
                (h.prototype.flush = function () {
                  a.prototype.flush.call(this),
                    null === this._pako && this._createPako(),
                    this._pako.push([], !0);
                }),
                (h.prototype.cleanUp = function () {
                  a.prototype.cleanUp.call(this), (this._pako = null);
                }),
                (h.prototype._createPako = function () {
                  this._pako = new s[this._pakoAction]({
                    raw: !0,
                    level: this._pakoOptions.level || -1,
                  });
                  var e = this;
                  this._pako.onData = function (t) {
                    e.push({ data: t, meta: e.meta });
                  };
                }),
                (r.compressWorker = function (t) {
                  return new h('Deflate', t);
                }),
                (r.uncompressWorker = function () {
                  return new h('Inflate', {});
                });
            },
            { './stream/GenericWorker': 28, './utils': 32, pako: 38 },
          ],
          8: [
            function (t, e, r) {
              function v(t, e) {
                for (var r = '', i = 0; i < e; i++)
                  (r += String.fromCharCode(255 & t)), (t >>>= 8);
                return r;
              }
              function i(t, e, r, i, s, n) {
                var a = t.file,
                  o = t.compression,
                  h = n !== b.utf8encode,
                  l = _.transformTo('string', n(a.name)),
                  p = _.transformTo('string', b.utf8encode(a.name)),
                  c = a.comment,
                  n = _.transformTo('string', n(c)),
                  f = _.transformTo('string', b.utf8encode(c)),
                  d = p.length !== a.name.length,
                  c = f.length !== c.length,
                  u = '',
                  m = a.dir,
                  y = a.date,
                  g = { crc32: 0, compressedSize: 0, uncompressedSize: 0 },
                  r =
                    ((e && !r) ||
                      ((g.crc32 = t.crc32),
                      (g.compressedSize = t.compressedSize),
                      (g.uncompressedSize = t.uncompressedSize)),
                    0);
                return (
                  e && (r |= 8),
                  h || (!d && !c) || (r |= 2048),
                  (e = t = 0),
                  m && (t |= 16),
                  'UNIX' === s
                    ? ((e = 798),
                      (t |=
                        (65535 &
                          ((h = a.unixPermissions) ? h : m ? 16893 : 33204)) <<
                        16))
                    : ((e = 20), (t |= 63 & (a.dosPermissions || 0))),
                  (s = y.getUTCHours()),
                  (s =
                    (s = ((s <<= 6) | y.getUTCMinutes()) << 5) |
                    (y.getUTCSeconds() / 2)),
                  (h = y.getUTCFullYear() - 1980),
                  (h =
                    (h = ((h <<= 4) | (y.getUTCMonth() + 1)) << 5) |
                    y.getUTCDate()),
                  d &&
                    ((m = v(1, 1) + v(S(l), 4) + p),
                    (u += 'up' + v(m.length, 2) + m)),
                  c &&
                    ((a = v(1, 1) + v(S(n), 4) + f),
                    (u += 'uc' + v(a.length, 2) + a)),
                  (y = ''),
                  (y =
                    (y =
                      (y =
                        (y =
                          (y =
                            (y =
                              (y =
                                (y = (y = (y += '\n\0') + v(r, 2)) + o.magic) +
                                v(s, 2)) + v(h, 2)) + v(g.crc32, 4)) +
                          v(g.compressedSize, 4)) + v(g.uncompressedSize, 4)) +
                      v(l.length, 2)) + v(u.length, 2)),
                  {
                    fileRecord: P.LOCAL_FILE_HEADER + y + l + u,
                    dirRecord:
                      P.CENTRAL_FILE_HEADER +
                      v(e, 2) +
                      y +
                      v(n.length, 2) +
                      '\0\0\0\0' +
                      v(t, 4) +
                      v(i, 4) +
                      l +
                      u +
                      n,
                  }
                );
              }
              var _ = t('../utils'),
                s = t('../stream/GenericWorker'),
                b = t('../utf8'),
                S = t('../crc32'),
                P = t('../signature');
              function n(t, e, r, i) {
                s.call(this, 'ZipFileWorker'),
                  (this.bytesWritten = 0),
                  (this.zipComment = e),
                  (this.zipPlatform = r),
                  (this.encodeFileName = i),
                  (this.streamFiles = t),
                  (this.accumulate = !1),
                  (this.contentBuffer = []),
                  (this.dirRecords = []),
                  (this.currentSourceOffset = 0),
                  (this.entriesCount = 0),
                  (this.currentFile = null),
                  (this._sources = []);
              }
              _.inherits(n, s),
                (n.prototype.push = function (t) {
                  var e = t.meta.percent || 0,
                    r = this.entriesCount,
                    i = this._sources.length;
                  this.accumulate
                    ? this.contentBuffer.push(t)
                    : ((this.bytesWritten += t.data.length),
                      s.prototype.push.call(this, {
                        data: t.data,
                        meta: {
                          currentFile: this.currentFile,
                          percent: r ? (e + 100 * (r - i - 1)) / r : 100,
                        },
                      }));
                }),
                (n.prototype.openedSource = function (t) {
                  (this.currentSourceOffset = this.bytesWritten),
                    (this.currentFile = t.file.name);
                  var e = this.streamFiles && !t.file.dir;
                  e
                    ? ((t = i(
                        t,
                        e,
                        !1,
                        this.currentSourceOffset,
                        this.zipPlatform,
                        this.encodeFileName
                      )),
                      this.push({ data: t.fileRecord, meta: { percent: 0 } }))
                    : (this.accumulate = !0);
                }),
                (n.prototype.closedSource = function (t) {
                  this.accumulate = !1;
                  var e = this.streamFiles && !t.file.dir,
                    r = i(
                      t,
                      e,
                      !0,
                      this.currentSourceOffset,
                      this.zipPlatform,
                      this.encodeFileName
                    );
                  if ((this.dirRecords.push(r.dirRecord), e))
                    this.push({
                      data:
                        ((e = t),
                        P.DATA_DESCRIPTOR +
                          v(e.crc32, 4) +
                          v(e.compressedSize, 4) +
                          v(e.uncompressedSize, 4)),
                      meta: { percent: 100 },
                    });
                  else
                    for (
                      this.push({ data: r.fileRecord, meta: { percent: 0 } });
                      this.contentBuffer.length;

                    )
                      this.push(this.contentBuffer.shift());
                  this.currentFile = null;
                }),
                (n.prototype.flush = function () {
                  for (
                    var t = this.bytesWritten, e = 0;
                    e < this.dirRecords.length;
                    e++
                  )
                    this.push({
                      data: this.dirRecords[e],
                      meta: { percent: 100 },
                    });
                  var r = this.bytesWritten - t,
                    r = (function (t, e, r, i, s) {
                      s = _.transformTo('string', s(i));
                      return (
                        P.CENTRAL_DIRECTORY_END +
                        '\0\0\0\0' +
                        v(t, 2) +
                        v(t, 2) +
                        v(e, 4) +
                        v(r, 4) +
                        v(s.length, 2) +
                        s
                      );
                    })(
                      this.dirRecords.length,
                      r,
                      t,
                      this.zipComment,
                      this.encodeFileName
                    );
                  this.push({ data: r, meta: { percent: 100 } });
                }),
                (n.prototype.prepareNextSource = function () {
                  (this.previous = this._sources.shift()),
                    this.openedSource(this.previous.streamInfo),
                    this.isPaused
                      ? this.previous.pause()
                      : this.previous.resume();
                }),
                (n.prototype.registerPrevious = function (t) {
                  this._sources.push(t);
                  var e = this;
                  return (
                    t.on('data', function (t) {
                      e.processChunk(t);
                    }),
                    t.on('end', function () {
                      e.closedSource(e.previous.streamInfo),
                        e._sources.length ? e.prepareNextSource() : e.end();
                    }),
                    t.on('error', function (t) {
                      e.error(t);
                    }),
                    this
                  );
                }),
                (n.prototype.resume = function () {
                  return (
                    !!s.prototype.resume.call(this) &&
                    (!this.previous && this._sources.length
                      ? (this.prepareNextSource(), !0)
                      : this.previous ||
                          this._sources.length ||
                          this.generatedError
                        ? void 0
                        : (this.end(), !0))
                  );
                }),
                (n.prototype.error = function (t) {
                  var e = this._sources;
                  if (!s.prototype.error.call(this, t)) return !1;
                  for (var r = 0; r < e.length; r++)
                    try {
                      e[r].error(t);
                    } catch (t) {}
                  return !0;
                }),
                (n.prototype.lock = function () {
                  s.prototype.lock.call(this);
                  for (var t = this._sources, e = 0; e < t.length; e++)
                    t[e].lock();
                }),
                (e.exports = n);
            },
            {
              '../crc32': 4,
              '../signature': 23,
              '../stream/GenericWorker': 28,
              '../utf8': 31,
              '../utils': 32,
            },
          ],
          9: [
            function (t, e, r) {
              var l = t('../compressions'),
                i = t('./ZipFileWorker');
              r.generateWorker = function (t, a, e) {
                var o = new i(a.streamFiles, e, a.platform, a.encodeFileName),
                  h = 0;
                try {
                  t.forEach(function (t, e) {
                    h++;
                    var r = (function (t, e) {
                        (t = t || e), (e = l[t]);
                        if (e) return e;
                        throw new Error(
                          t + ' is not a valid compression method !'
                        );
                      })(e.options.compression, a.compression),
                      i =
                        e.options.compressionOptions ||
                        a.compressionOptions ||
                        {},
                      s = e.dir,
                      n = e.date;
                    e._compressWorker(r, i)
                      .withStreamInfo('file', {
                        name: t,
                        dir: s,
                        date: n,
                        comment: e.comment || '',
                        unixPermissions: e.unixPermissions,
                        dosPermissions: e.dosPermissions,
                      })
                      .pipe(o);
                  }),
                    (o.entriesCount = h);
                } catch (t) {
                  o.error(t);
                }
                return o;
              };
            },
            { '../compressions': 3, './ZipFileWorker': 8 },
          ],
          10: [
            function (t, e, r) {
              function i() {
                if (!(this instanceof i)) return new i();
                if (arguments.length)
                  throw new Error(
                    'The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.'
                  );
                (this.files = {}),
                  (this.comment = null),
                  (this.root = ''),
                  (this.clone = function () {
                    var t,
                      e = new i();
                    for (t in this)
                      'function' != typeof this[t] && (e[t] = this[t]);
                    return e;
                  });
              }
              ((i.prototype = t('./object')).loadAsync = t('./load')),
                (i.support = t('./support')),
                (i.defaults = t('./defaults')),
                (i.version = '3.5.0'),
                (i.loadAsync = function (t, e) {
                  return new i().loadAsync(t, e);
                }),
                (i.external = t('./external')),
                (e.exports = i);
            },
            {
              './defaults': 5,
              './external': 6,
              './load': 11,
              './object': 15,
              './support': 30,
            },
          ],
          11: [
            function (t, e, r) {
              var i = t('./utils'),
                a = t('./external'),
                o = t('./utf8'),
                h = ((i = t('./utils')), t('./zipEntries')),
                l = t('./stream/Crc32Probe'),
                p = t('./nodejsUtils');
              e.exports = function (t, s) {
                var n = this;
                return (
                  (s = i.extend(s || {}, {
                    base64: !1,
                    checkCRC32: !1,
                    optimizedBinaryString: !1,
                    createFolders: !1,
                    decodeFileName: o.utf8decode,
                  })),
                  p.isNode && p.isStream(t)
                    ? a.Promise.reject(
                        new Error(
                          "JSZip can't accept a stream when loading a zip file."
                        )
                      )
                    : i
                        .prepareContent(
                          'the loaded zip file',
                          t,
                          !0,
                          s.optimizedBinaryString,
                          s.base64
                        )
                        .then(function (t) {
                          var e = new h(s);
                          return e.load(t), e;
                        })
                        .then(function (t) {
                          var e = [a.Promise.resolve(t)],
                            r = t.files;
                          if (s.checkCRC32)
                            for (var i = 0; i < r.length; i++)
                              e.push(
                                (function (i) {
                                  return new a.Promise(function (t, e) {
                                    var r = i.decompressed
                                      .getContentWorker()
                                      .pipe(new l());
                                    r.on('error', function (t) {
                                      e(t);
                                    })
                                      .on('end', function () {
                                        r.streamInfo.crc32 !==
                                        i.decompressed.crc32
                                          ? e(
                                              new Error(
                                                'Corrupted zip : CRC32 mismatch'
                                              )
                                            )
                                          : t();
                                      })
                                      .resume();
                                  });
                                })(r[i])
                              );
                          return a.Promise.all(e);
                        })
                        .then(function (t) {
                          for (
                            var t = t.shift(), e = t.files, r = 0;
                            r < e.length;
                            r++
                          ) {
                            var i = e[r];
                            n.file(i.fileNameStr, i.decompressed, {
                              binary: !0,
                              optimizedBinaryString: !0,
                              date: i.date,
                              dir: i.dir,
                              comment: i.fileCommentStr.length
                                ? i.fileCommentStr
                                : null,
                              unixPermissions: i.unixPermissions,
                              dosPermissions: i.dosPermissions,
                              createFolders: s.createFolders,
                            });
                          }
                          return (
                            t.zipComment.length && (n.comment = t.zipComment), n
                          );
                        })
                );
              };
            },
            {
              './external': 6,
              './nodejsUtils': 14,
              './stream/Crc32Probe': 25,
              './utf8': 31,
              './utils': 32,
              './zipEntries': 33,
            },
          ],
          12: [
            function (t, e, r) {
              var i = t('../utils'),
                s = t('../stream/GenericWorker');
              function n(t, e) {
                s.call(this, 'Nodejs stream input adapter for ' + t),
                  (this._upstreamEnded = !1),
                  this._bindStream(e);
              }
              i.inherits(n, s),
                (n.prototype._bindStream = function (t) {
                  var e = this;
                  (this._stream = t).pause(),
                    t
                      .on('data', function (t) {
                        e.push({ data: t, meta: { percent: 0 } });
                      })
                      .on('error', function (t) {
                        e.isPaused ? (this.generatedError = t) : e.error(t);
                      })
                      .on('end', function () {
                        e.isPaused ? (e._upstreamEnded = !0) : e.end();
                      });
                }),
                (n.prototype.pause = function () {
                  return (
                    !!s.prototype.pause.call(this) && (this._stream.pause(), !0)
                  );
                }),
                (n.prototype.resume = function () {
                  return (
                    !!s.prototype.resume.call(this) &&
                    (this._upstreamEnded ? this.end() : this._stream.resume(),
                    !0)
                  );
                }),
                (e.exports = n);
            },
            { '../stream/GenericWorker': 28, '../utils': 32 },
          ],
          13: [
            function (t, e, r) {
              var s = t('readable-stream').Readable;
              function i(t, e, r) {
                s.call(this, e), (this._helper = t);
                var i = this;
                t.on('data', function (t, e) {
                  i.push(t) || i._helper.pause(), r && r(e);
                })
                  .on('error', function (t) {
                    i.emit('error', t);
                  })
                  .on('end', function () {
                    i.push(null);
                  });
              }
              t('../utils').inherits(i, s),
                (i.prototype._read = function () {
                  this._helper.resume();
                }),
                (e.exports = i);
            },
            { '../utils': 32, 'readable-stream': 16 },
          ],
          14: [
            function (t, e, r) {
              e.exports = {
                isNode: 'undefined' != typeof Buffer,
                newBufferFrom: function (t, e) {
                  if (Buffer.from && Buffer.from !== Uint8Array.from)
                    return Buffer.from(t, e);
                  if ('number' == typeof t)
                    throw new Error('The "data" argument must not be a number');
                  return new Buffer(t, e);
                },
                allocBuffer: function (t) {
                  return Buffer.alloc
                    ? Buffer.alloc(t)
                    : ((t = new Buffer(t)).fill(0), t);
                },
                isBuffer: function (t) {
                  return Buffer.isBuffer(t);
                },
                isStream: function (t) {
                  return (
                    t &&
                    'function' == typeof t.on &&
                    'function' == typeof t.pause &&
                    'function' == typeof t.resume
                  );
                },
              };
            },
            {},
          ],
          15: [
            function (t, e, r) {
              function o(t, e) {
                return (
                  (e = void 0 !== e ? e : p.createFolders),
                  (t = y(t)),
                  this.files[t] ||
                    m.call(this, t, null, { dir: !0, createFolders: e }),
                  this.files[t]
                );
              }
              var s = t('./utf8'),
                h = t('./utils'),
                l = t('./stream/GenericWorker'),
                n = t('./stream/StreamHelper'),
                p = t('./defaults'),
                c = t('./compressedObject'),
                f = t('./zipObject'),
                a = t('./generate'),
                d = t('./nodejsUtils'),
                u = t('./nodejs/NodejsStreamInputAdapter'),
                m = function (t, e, r) {
                  var i = h.getTypeOf(e),
                    s = h.extend(r || {}, p),
                    n =
                      ((s.date = s.date || new Date()),
                      null !== s.compression &&
                        (s.compression = s.compression.toUpperCase()),
                      'string' == typeof s.unixPermissions &&
                        (s.unixPermissions = parseInt(s.unixPermissions, 8)),
                      s.unixPermissions &&
                        16384 & s.unixPermissions &&
                        (s.dir = !0),
                      s.dosPermissions && 16 & s.dosPermissions && (s.dir = !0),
                      s.dir && (t = y(t)),
                      s.createFolders &&
                        (a =
                          0 <
                          (n = (a =
                            '/' === (a = t).slice(-1)
                              ? a.substring(0, a.length - 1)
                              : a).lastIndexOf('/'))
                            ? a.substring(0, n)
                            : '') &&
                        o.call(this, a, !0),
                      'string' === i && !1 === s.binary && !1 === s.base64),
                    a =
                      ((r && void 0 !== r.binary) || (s.binary = !n),
                      ((e instanceof c && 0 === e.uncompressedSize) ||
                        s.dir ||
                        !e ||
                        0 === e.length) &&
                        ((s.base64 = !1),
                        (s.binary = !0),
                        (e = ''),
                        (s.compression = 'STORE')),
                      e instanceof c || e instanceof l
                        ? e
                        : d.isNode && d.isStream(e)
                          ? new u(t, e)
                          : h.prepareContent(
                              t,
                              e,
                              s.binary,
                              s.optimizedBinaryString,
                              s.base64
                            )),
                    i = new f(t, a, s);
                  this.files[t] = i;
                },
                y = function (t) {
                  return '/' !== t.slice(-1) && (t += '/'), t;
                };
              function g(t) {
                return '[object RegExp]' === Object.prototype.toString.call(t);
              }
              e.exports = {
                load: function () {
                  throw new Error(
                    'This method has been removed in JSZip 3.0, please check the upgrade guide.'
                  );
                },
                forEach: function (t) {
                  var e, r, i;
                  for (e in this.files)
                    this.files.hasOwnProperty(e) &&
                      ((i = this.files[e]),
                      (r = e.slice(this.root.length, e.length))) &&
                      e.slice(0, this.root.length) === this.root &&
                      t(r, i);
                },
                filter: function (r) {
                  var i = [];
                  return (
                    this.forEach(function (t, e) {
                      r(t, e) && i.push(e);
                    }),
                    i
                  );
                },
                file: function (t, e, r) {
                  var i, s;
                  return 1 === arguments.length
                    ? g(t)
                      ? ((i = t),
                        this.filter(function (t, e) {
                          return !e.dir && i.test(t);
                        }))
                      : (s = this.files[this.root + t]) && !s.dir
                        ? s
                        : null
                    : ((t = this.root + t), m.call(this, t, e, r), this);
                },
                folder: function (r) {
                  var t, e;
                  return r
                    ? g(r)
                      ? this.filter(function (t, e) {
                          return e.dir && r.test(t);
                        })
                      : ((t = this.root + r),
                        (t = o.call(this, t)),
                        ((e = this.clone()).root = t.name),
                        e)
                    : this;
                },
                remove: function (r) {
                  r = this.root + r;
                  var t = this.files[r];
                  if (
                    (t ||
                      ('/' !== r.slice(-1) && (r += '/'), (t = this.files[r])),
                    t && !t.dir)
                  )
                    delete this.files[r];
                  else
                    for (
                      var e = this.filter(function (t, e) {
                          return e.name.slice(0, r.length) === r;
                        }),
                        i = 0;
                      i < e.length;
                      i++
                    )
                      delete this.files[e[i].name];
                  return this;
                },
                generate: function (t) {
                  throw new Error(
                    'This method has been removed in JSZip 3.0, please check the upgrade guide.'
                  );
                },
                generateInternalStream: function (t) {
                  var e = {};
                  try {
                    if (
                      (((e = h.extend(t || {}, {
                        streamFiles: !1,
                        compression: 'STORE',
                        compressionOptions: null,
                        type: '',
                        platform: 'DOS',
                        comment: null,
                        mimeType: 'application/zip',
                        encodeFileName: s.utf8encode,
                      })).type = e.type.toLowerCase()),
                      (e.compression = e.compression.toUpperCase()),
                      'binarystring' === e.type && (e.type = 'string'),
                      !e.type)
                    )
                      throw new Error('No output type specified.');
                    h.checkSupport(e.type),
                      ('darwin' !== e.platform &&
                        'freebsd' !== e.platform &&
                        'linux' !== e.platform &&
                        'sunos' !== e.platform) ||
                        (e.platform = 'UNIX'),
                      'win32' === e.platform && (e.platform = 'DOS');
                    var r = e.comment || this.comment || '',
                      i = a.generateWorker(this, e, r);
                  } catch (t) {
                    (i = new l('error')).error(t);
                  }
                  return new n(i, e.type || 'string', e.mimeType);
                },
                generateAsync: function (t, e) {
                  return this.generateInternalStream(t).accumulate(e);
                },
                generateNodeStream: function (t, e) {
                  return (
                    (t = t || {}).type || (t.type = 'nodebuffer'),
                    this.generateInternalStream(t).toNodejsStream(e)
                  );
                },
              };
            },
            {
              './compressedObject': 2,
              './defaults': 5,
              './generate': 9,
              './nodejs/NodejsStreamInputAdapter': 12,
              './nodejsUtils': 14,
              './stream/GenericWorker': 28,
              './stream/StreamHelper': 29,
              './utf8': 31,
              './utils': 32,
              './zipObject': 35,
            },
          ],
          16: [
            function (t, e, r) {
              e.exports = t('stream');
            },
            { stream: void 0 },
          ],
          17: [
            function (t, e, r) {
              var i = t('./DataReader');
              function s(t) {
                i.call(this, t);
                for (var e = 0; e < this.data.length; e++) t[e] = 255 & t[e];
              }
              t('../utils').inherits(s, i),
                (s.prototype.byteAt = function (t) {
                  return this.data[this.zero + t];
                }),
                (s.prototype.lastIndexOfSignature = function (t) {
                  for (
                    var e = t.charCodeAt(0),
                      r = t.charCodeAt(1),
                      i = t.charCodeAt(2),
                      s = t.charCodeAt(3),
                      n = this.length - 4;
                    0 <= n;
                    --n
                  )
                    if (
                      this.data[n] === e &&
                      this.data[n + 1] === r &&
                      this.data[n + 2] === i &&
                      this.data[n + 3] === s
                    )
                      return n - this.zero;
                  return -1;
                }),
                (s.prototype.readAndCheckSignature = function (t) {
                  var e = t.charCodeAt(0),
                    r = t.charCodeAt(1),
                    i = t.charCodeAt(2),
                    t = t.charCodeAt(3),
                    s = this.readData(4);
                  return e === s[0] && r === s[1] && i === s[2] && t === s[3];
                }),
                (s.prototype.readData = function (t) {
                  var e;
                  return (
                    this.checkOffset(t),
                    0 === t
                      ? []
                      : ((e = this.data.slice(
                          this.zero + this.index,
                          this.zero + this.index + t
                        )),
                        (this.index += t),
                        e)
                  );
                }),
                (e.exports = s);
            },
            { '../utils': 32, './DataReader': 18 },
          ],
          18: [
            function (t, e, r) {
              var i = t('../utils');
              function s(t) {
                (this.data = t),
                  (this.length = t.length),
                  (this.index = 0),
                  (this.zero = 0);
              }
              (s.prototype = {
                checkOffset: function (t) {
                  this.checkIndex(this.index + t);
                },
                checkIndex: function (t) {
                  if (this.length < this.zero + t || t < 0)
                    throw new Error(
                      'End of data reached (data length = ' +
                        this.length +
                        ', asked index = ' +
                        t +
                        '). Corrupted zip ?'
                    );
                },
                setIndex: function (t) {
                  this.checkIndex(t), (this.index = t);
                },
                skip: function (t) {
                  this.setIndex(this.index + t);
                },
                byteAt: function (t) {},
                readInt: function (t) {
                  var e,
                    r = 0;
                  for (
                    this.checkOffset(t), e = this.index + t - 1;
                    e >= this.index;
                    e--
                  )
                    r = (r << 8) + this.byteAt(e);
                  return (this.index += t), r;
                },
                readString: function (t) {
                  return i.transformTo('string', this.readData(t));
                },
                readData: function (t) {},
                lastIndexOfSignature: function (t) {},
                readAndCheckSignature: function (t) {},
                readDate: function () {
                  var t = this.readInt(4);
                  return new Date(
                    Date.UTC(
                      1980 + ((t >> 25) & 127),
                      ((t >> 21) & 15) - 1,
                      (t >> 16) & 31,
                      (t >> 11) & 31,
                      (t >> 5) & 63,
                      (31 & t) << 1
                    )
                  );
                },
              }),
                (e.exports = s);
            },
            { '../utils': 32 },
          ],
          19: [
            function (t, e, r) {
              var i = t('./Uint8ArrayReader');
              function s(t) {
                i.call(this, t);
              }
              t('../utils').inherits(s, i),
                (s.prototype.readData = function (t) {
                  this.checkOffset(t);
                  var e = this.data.slice(
                    this.zero + this.index,
                    this.zero + this.index + t
                  );
                  return (this.index += t), e;
                }),
                (e.exports = s);
            },
            { '../utils': 32, './Uint8ArrayReader': 21 },
          ],
          20: [
            function (t, e, r) {
              var i = t('./DataReader');
              function s(t) {
                i.call(this, t);
              }
              t('../utils').inherits(s, i),
                (s.prototype.byteAt = function (t) {
                  return this.data.charCodeAt(this.zero + t);
                }),
                (s.prototype.lastIndexOfSignature = function (t) {
                  return this.data.lastIndexOf(t) - this.zero;
                }),
                (s.prototype.readAndCheckSignature = function (t) {
                  return t === this.readData(4);
                }),
                (s.prototype.readData = function (t) {
                  this.checkOffset(t);
                  var e = this.data.slice(
                    this.zero + this.index,
                    this.zero + this.index + t
                  );
                  return (this.index += t), e;
                }),
                (e.exports = s);
            },
            { '../utils': 32, './DataReader': 18 },
          ],
          21: [
            function (t, e, r) {
              var i = t('./ArrayReader');
              function s(t) {
                i.call(this, t);
              }
              t('../utils').inherits(s, i),
                (s.prototype.readData = function (t) {
                  var e;
                  return (
                    this.checkOffset(t),
                    0 === t
                      ? new Uint8Array(0)
                      : ((e = this.data.subarray(
                          this.zero + this.index,
                          this.zero + this.index + t
                        )),
                        (this.index += t),
                        e)
                  );
                }),
                (e.exports = s);
            },
            { '../utils': 32, './ArrayReader': 17 },
          ],
          22: [
            function (t, e, r) {
              var i = t('../utils'),
                s = t('../support'),
                n = t('./ArrayReader'),
                a = t('./StringReader'),
                o = t('./NodeBufferReader'),
                h = t('./Uint8ArrayReader');
              e.exports = function (t) {
                var e = i.getTypeOf(t);
                return (
                  i.checkSupport(e),
                  'string' !== e || s.uint8array
                    ? 'nodebuffer' === e
                      ? new o(t)
                      : s.uint8array
                        ? new h(i.transformTo('uint8array', t))
                        : new n(i.transformTo('array', t))
                    : new a(t)
                );
              };
            },
            {
              '../support': 30,
              '../utils': 32,
              './ArrayReader': 17,
              './NodeBufferReader': 19,
              './StringReader': 20,
              './Uint8ArrayReader': 21,
            },
          ],
          23: [
            function (t, e, r) {
              (r.LOCAL_FILE_HEADER = 'PK'),
                (r.CENTRAL_FILE_HEADER = 'PK'),
                (r.CENTRAL_DIRECTORY_END = 'PK'),
                (r.ZIP64_CENTRAL_DIRECTORY_LOCATOR = 'PK'),
                (r.ZIP64_CENTRAL_DIRECTORY_END = 'PK'),
                (r.DATA_DESCRIPTOR = 'PK\b');
            },
            {},
          ],
          24: [
            function (t, e, r) {
              var i = t('./GenericWorker'),
                s = t('../utils');
              function n(t) {
                i.call(this, 'ConvertWorker to ' + t), (this.destType = t);
              }
              s.inherits(n, i),
                (n.prototype.processChunk = function (t) {
                  this.push({
                    data: s.transformTo(this.destType, t.data),
                    meta: t.meta,
                  });
                }),
                (e.exports = n);
            },
            { '../utils': 32, './GenericWorker': 28 },
          ],
          25: [
            function (t, e, r) {
              var i = t('./GenericWorker'),
                s = t('../crc32');
              function n() {
                i.call(this, 'Crc32Probe'), this.withStreamInfo('crc32', 0);
              }
              t('../utils').inherits(n, i),
                (n.prototype.processChunk = function (t) {
                  (this.streamInfo.crc32 = s(
                    t.data,
                    this.streamInfo.crc32 || 0
                  )),
                    this.push(t);
                }),
                (e.exports = n);
            },
            { '../crc32': 4, '../utils': 32, './GenericWorker': 28 },
          ],
          26: [
            function (t, e, r) {
              var i = t('../utils'),
                s = t('./GenericWorker');
              function n(t) {
                s.call(this, 'DataLengthProbe for ' + t),
                  (this.propName = t),
                  this.withStreamInfo(t, 0);
              }
              i.inherits(n, s),
                (n.prototype.processChunk = function (t) {
                  var e;
                  t &&
                    ((e = this.streamInfo[this.propName] || 0),
                    (this.streamInfo[this.propName] = e + t.data.length)),
                    s.prototype.processChunk.call(this, t);
                }),
                (e.exports = n);
            },
            { '../utils': 32, './GenericWorker': 28 },
          ],
          27: [
            function (t, e, r) {
              var i = t('../utils'),
                s = t('./GenericWorker');
              function n(t) {
                s.call(this, 'DataWorker');
                var e = this;
                (this.dataIsReady = !1),
                  (this.index = 0),
                  (this.max = 0),
                  (this.data = null),
                  (this.type = ''),
                  (this._tickScheduled = !1),
                  t.then(
                    function (t) {
                      (e.dataIsReady = !0),
                        (e.data = t),
                        (e.max = (t && t.length) || 0),
                        (e.type = i.getTypeOf(t)),
                        e.isPaused || e._tickAndRepeat();
                    },
                    function (t) {
                      e.error(t);
                    }
                  );
              }
              i.inherits(n, s),
                (n.prototype.cleanUp = function () {
                  s.prototype.cleanUp.call(this), (this.data = null);
                }),
                (n.prototype.resume = function () {
                  return (
                    !!s.prototype.resume.call(this) &&
                    (!this._tickScheduled &&
                      this.dataIsReady &&
                      ((this._tickScheduled = !0),
                      i.delay(this._tickAndRepeat, [], this)),
                    !0)
                  );
                }),
                (n.prototype._tickAndRepeat = function () {
                  (this._tickScheduled = !1),
                    this.isPaused ||
                      this.isFinished ||
                      (this._tick(), this.isFinished) ||
                      (i.delay(this._tickAndRepeat, [], this),
                      (this._tickScheduled = !0));
                }),
                (n.prototype._tick = function () {
                  if (this.isPaused || this.isFinished) return !1;
                  var t = null,
                    e = Math.min(this.max, this.index + 16384);
                  if (this.index >= this.max) return this.end();
                  switch (this.type) {
                    case 'string':
                      t = this.data.substring(this.index, e);
                      break;
                    case 'uint8array':
                      t = this.data.subarray(this.index, e);
                      break;
                    case 'array':
                    case 'nodebuffer':
                      t = this.data.slice(this.index, e);
                  }
                  return (
                    (this.index = e),
                    this.push({
                      data: t,
                      meta: {
                        percent: this.max ? (this.index / this.max) * 100 : 0,
                      },
                    })
                  );
                }),
                (e.exports = n);
            },
            { '../utils': 32, './GenericWorker': 28 },
          ],
          28: [
            function (t, e, r) {
              function i(t) {
                (this.name = t || 'default'),
                  (this.streamInfo = {}),
                  (this.generatedError = null),
                  (this.extraStreamInfo = {}),
                  (this.isPaused = !0),
                  (this.isFinished = !1),
                  (this.isLocked = !1),
                  (this._listeners = { data: [], end: [], error: [] }),
                  (this.previous = null);
              }
              (i.prototype = {
                push: function (t) {
                  this.emit('data', t);
                },
                end: function () {
                  if (this.isFinished) return !1;
                  this.flush();
                  try {
                    this.emit('end'), this.cleanUp(), (this.isFinished = !0);
                  } catch (t) {
                    this.emit('error', t);
                  }
                  return !0;
                },
                error: function (t) {
                  return (
                    !this.isFinished &&
                    (this.isPaused
                      ? (this.generatedError = t)
                      : ((this.isFinished = !0),
                        this.emit('error', t),
                        this.previous && this.previous.error(t),
                        this.cleanUp()),
                    !0)
                  );
                },
                on: function (t, e) {
                  return this._listeners[t].push(e), this;
                },
                cleanUp: function () {
                  (this.streamInfo =
                    this.generatedError =
                    this.extraStreamInfo =
                      null),
                    (this._listeners = []);
                },
                emit: function (t, e) {
                  if (this._listeners[t])
                    for (var r = 0; r < this._listeners[t].length; r++)
                      this._listeners[t][r].call(this, e);
                },
                pipe: function (t) {
                  return t.registerPrevious(this);
                },
                registerPrevious: function (t) {
                  if (this.isLocked)
                    throw new Error(
                      "The stream '" + this + "' has already been used."
                    );
                  (this.streamInfo = t.streamInfo),
                    this.mergeStreamInfo(),
                    (this.previous = t);
                  var e = this;
                  return (
                    t.on('data', function (t) {
                      e.processChunk(t);
                    }),
                    t.on('end', function () {
                      e.end();
                    }),
                    t.on('error', function (t) {
                      e.error(t);
                    }),
                    this
                  );
                },
                pause: function () {
                  return (
                    !this.isPaused &&
                    !this.isFinished &&
                    ((this.isPaused = !0),
                    this.previous && this.previous.pause(),
                    !0)
                  );
                },
                resume: function () {
                  var t;
                  return !(
                    !this.isPaused ||
                    this.isFinished ||
                    ((t = this.isPaused = !1),
                    this.generatedError &&
                      (this.error(this.generatedError), (t = !0)),
                    this.previous && this.previous.resume(),
                    t)
                  );
                },
                flush: function () {},
                processChunk: function (t) {
                  this.push(t);
                },
                withStreamInfo: function (t, e) {
                  return (
                    (this.extraStreamInfo[t] = e), this.mergeStreamInfo(), this
                  );
                },
                mergeStreamInfo: function () {
                  for (var t in this.extraStreamInfo)
                    this.extraStreamInfo.hasOwnProperty(t) &&
                      (this.streamInfo[t] = this.extraStreamInfo[t]);
                },
                lock: function () {
                  if (this.isLocked)
                    throw new Error(
                      "The stream '" + this + "' has already been used."
                    );
                  (this.isLocked = !0), this.previous && this.previous.lock();
                },
                toString: function () {
                  var t = 'Worker ' + this.name;
                  return this.previous ? this.previous + ' -> ' + t : t;
                },
              }),
                (e.exports = i);
            },
            {},
          ],
          29: [
            function (t, e, r) {
              var l = t('../utils'),
                s = t('./ConvertWorker'),
                n = t('./GenericWorker'),
                p = t('../base64'),
                i = t('../support'),
                a = t('../external'),
                o = null;
              if (i.nodestream)
                try {
                  o = t('../nodejs/NodejsStreamOutputAdapter');
                } catch (t) {}
              function h(t, e, r) {
                var i = e;
                switch (e) {
                  case 'blob':
                  case 'arraybuffer':
                    i = 'uint8array';
                    break;
                  case 'base64':
                    i = 'string';
                }
                try {
                  (this._internalType = i),
                    (this._outputType = e),
                    (this._mimeType = r),
                    l.checkSupport(i),
                    (this._worker = t.pipe(new s(i))),
                    t.lock();
                } catch (t) {
                  (this._worker = new n('error')), this._worker.error(t);
                }
              }
              (h.prototype = {
                accumulate: function (t) {
                  return (
                    (o = this),
                    (h = t),
                    new a.Promise(function (e, r) {
                      var i = [],
                        s = o._internalType,
                        n = o._outputType,
                        a = o._mimeType;
                      o.on('data', function (t, e) {
                        i.push(t), h && h(e);
                      })
                        .on('error', function (t) {
                          (i = []), r(t);
                        })
                        .on('end', function () {
                          try {
                            var t = (function (t, e, r) {
                              switch (t) {
                                case 'blob':
                                  return l.newBlob(
                                    l.transformTo('arraybuffer', e),
                                    r
                                  );
                                case 'base64':
                                  return p.encode(e);
                                default:
                                  return l.transformTo(t, e);
                              }
                            })(
                              n,
                              (function (t, e) {
                                for (
                                  var r = 0, i = null, s = 0, n = 0;
                                  n < e.length;
                                  n++
                                )
                                  s += e[n].length;
                                switch (t) {
                                  case 'string':
                                    return e.join('');
                                  case 'array':
                                    return Array.prototype.concat.apply([], e);
                                  case 'uint8array':
                                    for (
                                      i = new Uint8Array(s), n = 0;
                                      n < e.length;
                                      n++
                                    )
                                      i.set(e[n], r), (r += e[n].length);
                                    return i;
                                  case 'nodebuffer':
                                    return Buffer.concat(e);
                                  default:
                                    throw new Error(
                                      "concat : unsupported type '" + t + "'"
                                    );
                                }
                              })(s, i),
                              a
                            );
                            e(t);
                          } catch (t) {
                            r(t);
                          }
                          i = [];
                        })
                        .resume();
                    })
                  );
                  var o, h;
                },
                on: function (t, e) {
                  var r = this;
                  return (
                    'data' === t
                      ? this._worker.on(t, function (t) {
                          e.call(r, t.data, t.meta);
                        })
                      : this._worker.on(t, function () {
                          l.delay(e, arguments, r);
                        }),
                    this
                  );
                },
                resume: function () {
                  return l.delay(this._worker.resume, [], this._worker), this;
                },
                pause: function () {
                  return this._worker.pause(), this;
                },
                toNodejsStream: function (t) {
                  if (
                    (l.checkSupport('nodestream'),
                    'nodebuffer' !== this._outputType)
                  )
                    throw new Error(
                      this._outputType + ' is not supported by this method'
                    );
                  return new o(
                    this,
                    { objectMode: 'nodebuffer' !== this._outputType },
                    t
                  );
                },
              }),
                (e.exports = h);
            },
            {
              '../base64': 1,
              '../external': 6,
              '../nodejs/NodejsStreamOutputAdapter': 13,
              '../support': 30,
              '../utils': 32,
              './ConvertWorker': 24,
              './GenericWorker': 28,
            },
          ],
          30: [
            function (t, e, r) {
              if (
                ((r.base64 = !0),
                (r.array = !0),
                (r.string = !0),
                (r.arraybuffer =
                  'undefined' != typeof ArrayBuffer &&
                  'undefined' != typeof Uint8Array),
                (r.nodebuffer = 'undefined' != typeof Buffer),
                (r.uint8array = 'undefined' != typeof Uint8Array),
                'undefined' == typeof ArrayBuffer)
              )
                r.blob = !1;
              else {
                var i = new ArrayBuffer(0);
                try {
                  r.blob =
                    0 === new Blob([i], { type: 'application/zip' }).size;
                } catch (t) {
                  try {
                    var s = new (self.BlobBuilder ||
                      self.WebKitBlobBuilder ||
                      self.MozBlobBuilder ||
                      self.MSBlobBuilder)();
                    s.append(i),
                      (r.blob = 0 === s.getBlob('application/zip').size);
                  } catch (t) {
                    r.blob = !1;
                  }
                }
              }
              try {
                r.nodestream = !!t('readable-stream').Readable;
              } catch (t) {
                r.nodestream = !1;
              }
            },
            { 'readable-stream': 16 },
          ],
          31: [
            function (t, e, s) {
              for (
                var h = t('./utils'),
                  l = t('./support'),
                  p = t('./nodejsUtils'),
                  r = t('./stream/GenericWorker'),
                  c = new Array(256),
                  i = 0;
                i < 256;
                i++
              )
                c[i] =
                  252 <= i
                    ? 6
                    : 248 <= i
                      ? 5
                      : 240 <= i
                        ? 4
                        : 224 <= i
                          ? 3
                          : 192 <= i
                            ? 2
                            : 1;
              function n() {
                r.call(this, 'utf-8 decode'), (this.leftOver = null);
              }
              function a() {
                r.call(this, 'utf-8 encode');
              }
              (c[254] = c[254] = 1),
                (s.utf8encode = function (t) {
                  if (l.nodebuffer) return p.newBufferFrom(t, 'utf-8');
                  for (
                    var e, r, i, s, n = t, a = n.length, o = 0, h = 0;
                    h < a;
                    h++
                  )
                    55296 == (64512 & (r = n.charCodeAt(h))) &&
                      h + 1 < a &&
                      56320 == (64512 & (i = n.charCodeAt(h + 1))) &&
                      ((r = 65536 + ((r - 55296) << 10) + (i - 56320)), h++),
                      (o += r < 128 ? 1 : r < 2048 ? 2 : r < 65536 ? 3 : 4);
                  for (
                    e = new (l.uint8array ? Uint8Array : Array)(o), h = s = 0;
                    s < o;
                    h++
                  )
                    55296 == (64512 & (r = n.charCodeAt(h))) &&
                      h + 1 < a &&
                      56320 == (64512 & (i = n.charCodeAt(h + 1))) &&
                      ((r = 65536 + ((r - 55296) << 10) + (i - 56320)), h++),
                      r < 128
                        ? (e[s++] = r)
                        : (r < 2048
                            ? (e[s++] = 192 | (r >>> 6))
                            : (r < 65536
                                ? (e[s++] = 224 | (r >>> 12))
                                : ((e[s++] = 240 | (r >>> 18)),
                                  (e[s++] = 128 | ((r >>> 12) & 63))),
                              (e[s++] = 128 | ((r >>> 6) & 63))),
                          (e[s++] = 128 | (63 & r)));
                  return e;
                }),
                (s.utf8decode = function (t) {
                  if (l.nodebuffer)
                    return h.transformTo('nodebuffer', t).toString('utf-8');
                  for (
                    var e,
                      r,
                      i = (t = h.transformTo(
                        l.uint8array ? 'uint8array' : 'array',
                        t
                      )),
                      s = i.length,
                      n = new Array(2 * s),
                      a = 0,
                      o = 0;
                    o < s;

                  )
                    if ((e = i[o++]) < 128) n[a++] = e;
                    else if (4 < (r = c[e])) (n[a++] = 65533), (o += r - 1);
                    else {
                      for (
                        e &= 2 === r ? 31 : 3 === r ? 15 : 7;
                        1 < r && o < s;

                      )
                        (e = (e << 6) | (63 & i[o++])), r--;
                      1 < r
                        ? (n[a++] = 65533)
                        : e < 65536
                          ? (n[a++] = e)
                          : ((e -= 65536),
                            (n[a++] = 55296 | ((e >> 10) & 1023)),
                            (n[a++] = 56320 | (1023 & e)));
                    }
                  return (
                    n.length !== a &&
                      (n.subarray ? (n = n.subarray(0, a)) : (n.length = a)),
                    h.applyFromCharCode(n)
                  );
                }),
                h.inherits(n, r),
                (n.prototype.processChunk = function (t) {
                  var e = h.transformTo(
                      l.uint8array ? 'uint8array' : 'array',
                      t.data
                    ),
                    r =
                      (this.leftOver &&
                        this.leftOver.length &&
                        (l.uint8array
                          ? ((r = e),
                            (e = new Uint8Array(
                              r.length + this.leftOver.length
                            )).set(this.leftOver, 0),
                            e.set(r, this.leftOver.length))
                          : (e = this.leftOver.concat(e)),
                        (this.leftOver = null)),
                      (function (t, e) {
                        for (
                          var r =
                            (e =
                              (e = e || t.length) > t.length ? t.length : e) -
                            1;
                          0 <= r && 128 == (192 & t[r]);

                        )
                          r--;
                        return !(r < 0 || 0 === r) && r + c[t[r]] > e ? r : e;
                      })(e)),
                    i = e;
                  r !== e.length &&
                    (l.uint8array
                      ? ((i = e.subarray(0, r)),
                        (this.leftOver = e.subarray(r, e.length)))
                      : ((i = e.slice(0, r)),
                        (this.leftOver = e.slice(r, e.length)))),
                    this.push({ data: s.utf8decode(i), meta: t.meta });
                }),
                (n.prototype.flush = function () {
                  this.leftOver &&
                    this.leftOver.length &&
                    (this.push({ data: s.utf8decode(this.leftOver), meta: {} }),
                    (this.leftOver = null));
                }),
                (s.Utf8DecodeWorker = n),
                h.inherits(a, r),
                (a.prototype.processChunk = function (t) {
                  this.push({ data: s.utf8encode(t.data), meta: t.meta });
                }),
                (s.Utf8EncodeWorker = a);
            },
            {
              './nodejsUtils': 14,
              './stream/GenericWorker': 28,
              './support': 30,
              './utils': 32,
            },
          ],
          32: [
            function (t, e, a) {
              var o = t('./support'),
                h = t('./base64'),
                r = t('./nodejsUtils'),
                i = t('set-immediate-shim'),
                l = t('./external');
              function s(t) {
                return t;
              }
              function p(t, e) {
                for (var r = 0; r < t.length; ++r) e[r] = 255 & t.charCodeAt(r);
                return e;
              }
              a.newBlob = function (e, r) {
                a.checkSupport('blob');
                try {
                  return new Blob([e], { type: r });
                } catch (t) {
                  try {
                    var i = new (self.BlobBuilder ||
                      self.WebKitBlobBuilder ||
                      self.MozBlobBuilder ||
                      self.MSBlobBuilder)();
                    return i.append(e), i.getBlob(r);
                  } catch (e) {
                    throw new Error("Bug : can't construct the Blob.");
                  }
                }
              };
              var n = {
                stringifyByChunk: function (t, e, r) {
                  var i = [],
                    s = 0,
                    n = t.length;
                  if (n <= r) return String.fromCharCode.apply(null, t);
                  for (; s < n; )
                    i.push(
                      'array' === e || 'nodebuffer' === e
                        ? String.fromCharCode.apply(
                            null,
                            t.slice(s, Math.min(s + r, n))
                          )
                        : String.fromCharCode.apply(
                            null,
                            t.subarray(s, Math.min(s + r, n))
                          )
                    ),
                      (s += r);
                  return i.join('');
                },
                stringifyByChar: function (t) {
                  for (var e = '', r = 0; r < t.length; r++)
                    e += String.fromCharCode(t[r]);
                  return e;
                },
                applyCanBeUsed: {
                  uint8array: (function () {
                    try {
                      return (
                        o.uint8array &&
                        1 ===
                          String.fromCharCode.apply(null, new Uint8Array(1))
                            .length
                      );
                    } catch (t) {
                      return !1;
                    }
                  })(),
                  nodebuffer: (function () {
                    try {
                      return (
                        o.nodebuffer &&
                        1 ===
                          String.fromCharCode.apply(null, r.allocBuffer(1))
                            .length
                      );
                    } catch (t) {
                      return !1;
                    }
                  })(),
                },
              };
              function c(t) {
                var e = 65536,
                  r = a.getTypeOf(t),
                  i = !0;
                if (
                  ('uint8array' === r
                    ? (i = n.applyCanBeUsed.uint8array)
                    : 'nodebuffer' === r && (i = n.applyCanBeUsed.nodebuffer),
                  i)
                )
                  for (; 1 < e; )
                    try {
                      return n.stringifyByChunk(t, r, e);
                    } catch (t) {
                      e = Math.floor(e / 2);
                    }
                return n.stringifyByChar(t);
              }
              function f(t, e) {
                for (var r = 0; r < t.length; r++) e[r] = t[r];
                return e;
              }
              a.applyFromCharCode = c;
              var d = {};
              (d.string = {
                string: s,
                array: function (t) {
                  return p(t, new Array(t.length));
                },
                arraybuffer: function (t) {
                  return d.string.uint8array(t).buffer;
                },
                uint8array: function (t) {
                  return p(t, new Uint8Array(t.length));
                },
                nodebuffer: function (t) {
                  return p(t, r.allocBuffer(t.length));
                },
              }),
                (d.array = {
                  string: c,
                  array: s,
                  arraybuffer: function (t) {
                    return new Uint8Array(t).buffer;
                  },
                  uint8array: function (t) {
                    return new Uint8Array(t);
                  },
                  nodebuffer: function (t) {
                    return r.newBufferFrom(t);
                  },
                }),
                (d.arraybuffer = {
                  string: function (t) {
                    return c(new Uint8Array(t));
                  },
                  array: function (t) {
                    return f(new Uint8Array(t), new Array(t.byteLength));
                  },
                  arraybuffer: s,
                  uint8array: function (t) {
                    return new Uint8Array(t);
                  },
                  nodebuffer: function (t) {
                    return r.newBufferFrom(new Uint8Array(t));
                  },
                }),
                (d.uint8array = {
                  string: c,
                  array: function (t) {
                    return f(t, new Array(t.length));
                  },
                  arraybuffer: function (t) {
                    return t.buffer;
                  },
                  uint8array: s,
                  nodebuffer: function (t) {
                    return r.newBufferFrom(t);
                  },
                }),
                (d.nodebuffer = {
                  string: c,
                  array: function (t) {
                    return f(t, new Array(t.length));
                  },
                  arraybuffer: function (t) {
                    return d.nodebuffer.uint8array(t).buffer;
                  },
                  uint8array: function (t) {
                    return f(t, new Uint8Array(t.length));
                  },
                  nodebuffer: s,
                }),
                (a.transformTo = function (t, e) {
                  if (((e = e || ''), !t)) return e;
                  a.checkSupport(t);
                  var r = a.getTypeOf(e);
                  return d[r][t](e);
                }),
                (a.getTypeOf = function (t) {
                  return 'string' == typeof t
                    ? 'string'
                    : '[object Array]' === Object.prototype.toString.call(t)
                      ? 'array'
                      : o.nodebuffer && r.isBuffer(t)
                        ? 'nodebuffer'
                        : o.uint8array && t instanceof Uint8Array
                          ? 'uint8array'
                          : o.arraybuffer && t instanceof ArrayBuffer
                            ? 'arraybuffer'
                            : void 0;
                }),
                (a.checkSupport = function (t) {
                  if (!o[t.toLowerCase()])
                    throw new Error(t + ' is not supported by this platform');
                }),
                (a.MAX_VALUE_16BITS = 65535),
                (a.MAX_VALUE_32BITS = -1),
                (a.pretty = function (t) {
                  for (var e, r = '', i = 0; i < (t || '').length; i++)
                    r +=
                      '\\x' +
                      ((e = t.charCodeAt(i)) < 16 ? '0' : '') +
                      e.toString(16).toUpperCase();
                  return r;
                }),
                (a.delay = function (t, e, r) {
                  i(function () {
                    t.apply(r || null, e || []);
                  });
                }),
                (a.inherits = function (t, e) {
                  function r() {}
                  (r.prototype = e.prototype), (t.prototype = new r());
                }),
                (a.extend = function () {
                  for (var t, e = {}, r = 0; r < arguments.length; r++)
                    for (t in arguments[r])
                      arguments[r].hasOwnProperty(t) &&
                        void 0 === e[t] &&
                        (e[t] = arguments[r][t]);
                  return e;
                }),
                (a.prepareContent = function (r, t, i, s, n) {
                  return l.Promise.resolve(t)
                    .then(function (i) {
                      return o.blob &&
                        (i instanceof Blob ||
                          -1 !==
                            ['[object File]', '[object Blob]'].indexOf(
                              Object.prototype.toString.call(i)
                            )) &&
                        'undefined' != typeof FileReader
                        ? new l.Promise(function (e, r) {
                            var t = new FileReader();
                            (t.onload = function (t) {
                              e(t.target.result);
                            }),
                              (t.onerror = function (t) {
                                r(t.target.error);
                              }),
                              t.readAsArrayBuffer(i);
                          })
                        : i;
                    })
                    .then(function (t) {
                      var e = a.getTypeOf(t);
                      return e
                        ? ('arraybuffer' === e
                            ? (t = a.transformTo('uint8array', t))
                            : 'string' === e &&
                              (n
                                ? (t = h.decode(t))
                                : i &&
                                  !0 !== s &&
                                  (t = p(
                                    (e = t),
                                    new (o.uint8array ? Uint8Array : Array)(
                                      e.length
                                    )
                                  ))),
                          t)
                        : l.Promise.reject(
                            new Error(
                              "Can't read the data of '" +
                                r +
                                "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"
                            )
                          );
                    });
                });
            },
            {
              './base64': 1,
              './external': 6,
              './nodejsUtils': 14,
              './support': 30,
              'set-immediate-shim': 54,
            },
          ],
          33: [
            function (t, e, r) {
              var i = t('./reader/readerFor'),
                s = t('./utils'),
                n = t('./signature'),
                a = t('./zipEntry'),
                o = (t('./utf8'), t('./support'));
              function h(t) {
                (this.files = []), (this.loadOptions = t);
              }
              (h.prototype = {
                checkSignature: function (t) {
                  var e;
                  if (!this.reader.readAndCheckSignature(t))
                    throw (
                      ((this.reader.index -= 4),
                      (e = this.reader.readString(4)),
                      new Error(
                        'Corrupted zip or bug: unexpected signature (' +
                          s.pretty(e) +
                          ', expected ' +
                          s.pretty(t) +
                          ')'
                      ))
                    );
                },
                isSignature: function (t, e) {
                  var r = this.reader.index,
                    t =
                      (this.reader.setIndex(t),
                      this.reader.readString(4) === e);
                  return this.reader.setIndex(r), t;
                },
                readBlockEndOfCentral: function () {
                  (this.diskNumber = this.reader.readInt(2)),
                    (this.diskWithCentralDirStart = this.reader.readInt(2)),
                    (this.centralDirRecordsOnThisDisk = this.reader.readInt(2)),
                    (this.centralDirRecords = this.reader.readInt(2)),
                    (this.centralDirSize = this.reader.readInt(4)),
                    (this.centralDirOffset = this.reader.readInt(4)),
                    (this.zipCommentLength = this.reader.readInt(2));
                  var t = this.reader.readData(this.zipCommentLength),
                    e = o.uint8array ? 'uint8array' : 'array',
                    e = s.transformTo(e, t);
                  this.zipComment = this.loadOptions.decodeFileName(e);
                },
                readBlockZip64EndOfCentral: function () {
                  (this.zip64EndOfCentralSize = this.reader.readInt(8)),
                    this.reader.skip(4),
                    (this.diskNumber = this.reader.readInt(4)),
                    (this.diskWithCentralDirStart = this.reader.readInt(4)),
                    (this.centralDirRecordsOnThisDisk = this.reader.readInt(8)),
                    (this.centralDirRecords = this.reader.readInt(8)),
                    (this.centralDirSize = this.reader.readInt(8)),
                    (this.centralDirOffset = this.reader.readInt(8)),
                    (this.zip64ExtensibleData = {});
                  for (
                    var t, e, r, i = this.zip64EndOfCentralSize - 44;
                    0 < i;

                  )
                    (t = this.reader.readInt(2)),
                      (e = this.reader.readInt(4)),
                      (r = this.reader.readData(e)),
                      (this.zip64ExtensibleData[t] = {
                        id: t,
                        length: e,
                        value: r,
                      });
                },
                readBlockZip64EndOfCentralLocator: function () {
                  if (
                    ((this.diskWithZip64CentralDirStart =
                      this.reader.readInt(4)),
                    (this.relativeOffsetEndOfZip64CentralDir =
                      this.reader.readInt(8)),
                    (this.disksCount = this.reader.readInt(4)),
                    1 < this.disksCount)
                  )
                    throw new Error('Multi-volumes zip are not supported');
                },
                readLocalFiles: function () {
                  for (var t, e = 0; e < this.files.length; e++)
                    (t = this.files[e]),
                      this.reader.setIndex(t.localHeaderOffset),
                      this.checkSignature(n.LOCAL_FILE_HEADER),
                      t.readLocalPart(this.reader),
                      t.handleUTF8(),
                      t.processAttributes();
                },
                readCentralDir: function () {
                  var t;
                  for (
                    this.reader.setIndex(this.centralDirOffset);
                    this.reader.readAndCheckSignature(n.CENTRAL_FILE_HEADER);

                  )
                    (t = new a(
                      { zip64: this.zip64 },
                      this.loadOptions
                    )).readCentralPart(this.reader),
                      this.files.push(t);
                  if (
                    this.centralDirRecords !== this.files.length &&
                    0 !== this.centralDirRecords &&
                    0 === this.files.length
                  )
                    throw new Error(
                      'Corrupted zip or bug: expected ' +
                        this.centralDirRecords +
                        ' records in central dir, got ' +
                        this.files.length
                    );
                },
                readEndOfCentral: function () {
                  var t = this.reader.lastIndexOfSignature(
                    n.CENTRAL_DIRECTORY_END
                  );
                  if (t < 0)
                    throw this.isSignature(0, n.LOCAL_FILE_HEADER)
                      ? new Error(
                          "Corrupted zip: can't find end of central directory"
                        )
                      : new Error(
                          "Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html"
                        );
                  this.reader.setIndex(t);
                  var e = t;
                  if (
                    (this.checkSignature(n.CENTRAL_DIRECTORY_END),
                    this.readBlockEndOfCentral(),
                    this.diskNumber === s.MAX_VALUE_16BITS ||
                      this.diskWithCentralDirStart === s.MAX_VALUE_16BITS ||
                      this.centralDirRecordsOnThisDisk === s.MAX_VALUE_16BITS ||
                      this.centralDirRecords === s.MAX_VALUE_16BITS ||
                      this.centralDirSize === s.MAX_VALUE_32BITS ||
                      this.centralDirOffset === s.MAX_VALUE_32BITS)
                  ) {
                    if (
                      ((this.zip64 = !0),
                      (t = this.reader.lastIndexOfSignature(
                        n.ZIP64_CENTRAL_DIRECTORY_LOCATOR
                      )) < 0)
                    )
                      throw new Error(
                        "Corrupted zip: can't find the ZIP64 end of central directory locator"
                      );
                    if (
                      (this.reader.setIndex(t),
                      this.checkSignature(n.ZIP64_CENTRAL_DIRECTORY_LOCATOR),
                      this.readBlockZip64EndOfCentralLocator(),
                      !this.isSignature(
                        this.relativeOffsetEndOfZip64CentralDir,
                        n.ZIP64_CENTRAL_DIRECTORY_END
                      ) &&
                        ((this.relativeOffsetEndOfZip64CentralDir =
                          this.reader.lastIndexOfSignature(
                            n.ZIP64_CENTRAL_DIRECTORY_END
                          )),
                        this.relativeOffsetEndOfZip64CentralDir < 0))
                    )
                      throw new Error(
                        "Corrupted zip: can't find the ZIP64 end of central directory"
                      );
                    this.reader.setIndex(
                      this.relativeOffsetEndOfZip64CentralDir
                    ),
                      this.checkSignature(n.ZIP64_CENTRAL_DIRECTORY_END),
                      this.readBlockZip64EndOfCentral();
                  }
                  (t = this.centralDirOffset + this.centralDirSize),
                    (t =
                      e -
                      (t = this.zip64
                        ? t + 20 + (12 + this.zip64EndOfCentralSize)
                        : t));
                  if (0 < t)
                    this.isSignature(e, n.CENTRAL_FILE_HEADER) ||
                      (this.reader.zero = t);
                  else if (t < 0)
                    throw new Error(
                      'Corrupted zip: missing ' + Math.abs(t) + ' bytes.'
                    );
                },
                prepareReader: function (t) {
                  this.reader = i(t);
                },
                load: function (t) {
                  this.prepareReader(t),
                    this.readEndOfCentral(),
                    this.readCentralDir(),
                    this.readLocalFiles();
                },
              }),
                (e.exports = h);
            },
            {
              './reader/readerFor': 22,
              './signature': 23,
              './support': 30,
              './utf8': 31,
              './utils': 32,
              './zipEntry': 34,
            },
          ],
          34: [
            function (t, e, r) {
              var i = t('./reader/readerFor'),
                s = t('./utils'),
                n = t('./compressedObject'),
                a = t('./crc32'),
                o = t('./utf8'),
                h = t('./compressions'),
                l = t('./support');
              function p(t, e) {
                (this.options = t), (this.loadOptions = e);
              }
              (p.prototype = {
                isEncrypted: function () {
                  return 1 == (1 & this.bitFlag);
                },
                useUTF8: function () {
                  return 2048 == (2048 & this.bitFlag);
                },
                readLocalPart: function (t) {
                  var e;
                  if (
                    (t.skip(22),
                    (this.fileNameLength = t.readInt(2)),
                    (e = t.readInt(2)),
                    (this.fileName = t.readData(this.fileNameLength)),
                    t.skip(e),
                    -1 === this.compressedSize || -1 === this.uncompressedSize)
                  )
                    throw new Error(
                      "Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)"
                    );
                  if (
                    null ===
                    (e = (function (t) {
                      for (var e in h)
                        if (h.hasOwnProperty(e) && h[e].magic === t)
                          return h[e];
                      return null;
                    })(this.compressionMethod))
                  )
                    throw new Error(
                      'Corrupted zip : compression ' +
                        s.pretty(this.compressionMethod) +
                        ' unknown (inner file : ' +
                        s.transformTo('string', this.fileName) +
                        ')'
                    );
                  this.decompressed = new n(
                    this.compressedSize,
                    this.uncompressedSize,
                    this.crc32,
                    e,
                    t.readData(this.compressedSize)
                  );
                },
                readCentralPart: function (t) {
                  (this.versionMadeBy = t.readInt(2)),
                    t.skip(2),
                    (this.bitFlag = t.readInt(2)),
                    (this.compressionMethod = t.readString(2)),
                    (this.date = t.readDate()),
                    (this.crc32 = t.readInt(4)),
                    (this.compressedSize = t.readInt(4)),
                    (this.uncompressedSize = t.readInt(4));
                  var e = t.readInt(2);
                  if (
                    ((this.extraFieldsLength = t.readInt(2)),
                    (this.fileCommentLength = t.readInt(2)),
                    (this.diskNumberStart = t.readInt(2)),
                    (this.internalFileAttributes = t.readInt(2)),
                    (this.externalFileAttributes = t.readInt(4)),
                    (this.localHeaderOffset = t.readInt(4)),
                    this.isEncrypted())
                  )
                    throw new Error('Encrypted zip are not supported');
                  t.skip(e),
                    this.readExtraFields(t),
                    this.parseZIP64ExtraField(t),
                    (this.fileComment = t.readData(this.fileCommentLength));
                },
                processAttributes: function () {
                  (this.unixPermissions = null), (this.dosPermissions = null);
                  var t = this.versionMadeBy >> 8;
                  (this.dir = !!(16 & this.externalFileAttributes)),
                    0 == t &&
                      (this.dosPermissions = 63 & this.externalFileAttributes),
                    3 == t &&
                      (this.unixPermissions =
                        (this.externalFileAttributes >> 16) & 65535),
                    this.dir ||
                      '/' !== this.fileNameStr.slice(-1) ||
                      (this.dir = !0);
                },
                parseZIP64ExtraField: function (t) {
                  var e;
                  this.extraFields[1] &&
                    ((e = i(this.extraFields[1].value)),
                    this.uncompressedSize === s.MAX_VALUE_32BITS &&
                      (this.uncompressedSize = e.readInt(8)),
                    this.compressedSize === s.MAX_VALUE_32BITS &&
                      (this.compressedSize = e.readInt(8)),
                    this.localHeaderOffset === s.MAX_VALUE_32BITS &&
                      (this.localHeaderOffset = e.readInt(8)),
                    this.diskNumberStart === s.MAX_VALUE_32BITS) &&
                    (this.diskNumberStart = e.readInt(4));
                },
                readExtraFields: function (t) {
                  var e,
                    r,
                    i,
                    s = t.index + this.extraFieldsLength;
                  for (
                    this.extraFields || (this.extraFields = {});
                    t.index + 4 < s;

                  )
                    (e = t.readInt(2)),
                      (r = t.readInt(2)),
                      (i = t.readData(r)),
                      (this.extraFields[e] = { id: e, length: r, value: i });
                  t.setIndex(s);
                },
                handleUTF8: function () {
                  var t,
                    e = l.uint8array ? 'uint8array' : 'array';
                  this.useUTF8()
                    ? ((this.fileNameStr = o.utf8decode(this.fileName)),
                      (this.fileCommentStr = o.utf8decode(this.fileComment)))
                    : (null !== (t = this.findExtraFieldUnicodePath())
                        ? (this.fileNameStr = t)
                        : ((t = s.transformTo(e, this.fileName)),
                          (this.fileNameStr =
                            this.loadOptions.decodeFileName(t))),
                      null !== (t = this.findExtraFieldUnicodeComment())
                        ? (this.fileCommentStr = t)
                        : ((t = s.transformTo(e, this.fileComment)),
                          (this.fileCommentStr =
                            this.loadOptions.decodeFileName(t))));
                },
                findExtraFieldUnicodePath: function () {
                  var t,
                    e = this.extraFields[28789];
                  return !e ||
                    1 !== (t = i(e.value)).readInt(1) ||
                    a(this.fileName) !== t.readInt(4)
                    ? null
                    : o.utf8decode(t.readData(e.length - 5));
                },
                findExtraFieldUnicodeComment: function () {
                  var t,
                    e = this.extraFields[25461];
                  return !e ||
                    1 !== (t = i(e.value)).readInt(1) ||
                    a(this.fileComment) !== t.readInt(4)
                    ? null
                    : o.utf8decode(t.readData(e.length - 5));
                },
              }),
                (e.exports = p);
            },
            {
              './compressedObject': 2,
              './compressions': 3,
              './crc32': 4,
              './reader/readerFor': 22,
              './support': 30,
              './utf8': 31,
              './utils': 32,
            },
          ],
          35: [
            function (t, e, r) {
              function i(t, e, r) {
                (this.name = t),
                  (this.dir = r.dir),
                  (this.date = r.date),
                  (this.comment = r.comment),
                  (this.unixPermissions = r.unixPermissions),
                  (this.dosPermissions = r.dosPermissions),
                  (this._data = e),
                  (this._dataBinary = r.binary),
                  (this.options = {
                    compression: r.compression,
                    compressionOptions: r.compressionOptions,
                  });
              }
              var n = t('./stream/StreamHelper'),
                s = t('./stream/DataWorker'),
                a = t('./utf8'),
                o = t('./compressedObject'),
                h = t('./stream/GenericWorker');
              i.prototype = {
                internalStream: function (t) {
                  var e = null,
                    r = 'string';
                  try {
                    if (!t) throw new Error('No output type specified.');
                    var i = 'string' === (r = t.toLowerCase()) || 'text' === r,
                      s =
                        (('binarystring' !== r && 'text' !== r) ||
                          (r = 'string'),
                        (e = this._decompressWorker()),
                        !this._dataBinary);
                    s && !i && (e = e.pipe(new a.Utf8EncodeWorker())),
                      !s && i && (e = e.pipe(new a.Utf8DecodeWorker()));
                  } catch (t) {
                    (e = new h('error')).error(t);
                  }
                  return new n(e, r, '');
                },
                async: function (t, e) {
                  return this.internalStream(t).accumulate(e);
                },
                nodeStream: function (t, e) {
                  return this.internalStream(t || 'nodebuffer').toNodejsStream(
                    e
                  );
                },
                _compressWorker: function (t, e) {
                  var r;
                  return this._data instanceof o &&
                    this._data.compression.magic === t.magic
                    ? this._data.getCompressedWorker()
                    : ((r = this._decompressWorker()),
                      this._dataBinary ||
                        (r = r.pipe(new a.Utf8EncodeWorker())),
                      o.createWorkerFrom(r, t, e));
                },
                _decompressWorker: function () {
                  return this._data instanceof o
                    ? this._data.getContentWorker()
                    : this._data instanceof h
                      ? this._data
                      : new s(this._data);
                },
              };
              for (
                var l = [
                    'asText',
                    'asBinary',
                    'asNodeBuffer',
                    'asUint8Array',
                    'asArrayBuffer',
                  ],
                  p = function () {
                    throw new Error(
                      'This method has been removed in JSZip 3.0, please check the upgrade guide.'
                    );
                  },
                  c = 0;
                c < l.length;
                c++
              )
                i.prototype[l[c]] = p;
              e.exports = i;
            },
            {
              './compressedObject': 2,
              './stream/DataWorker': 27,
              './stream/GenericWorker': 28,
              './stream/StreamHelper': 29,
              './utf8': 31,
            },
          ],
          36: [
            function (t, l, e) {
              !function (e) {
                var i,
                  t,
                  r,
                  s,
                  n = e.MutationObserver || e.WebKitMutationObserver,
                  a = n
                    ? ((t = 0),
                      (n = new n(h)),
                      (r = e.document.createTextNode('')),
                      n.observe(r, { characterData: !0 }),
                      function () {
                        r.data = t = ++t % 2;
                      })
                    : e.setImmediate || void 0 === e.MessageChannel
                      ? 'document' in e &&
                        'onreadystatechange' in
                          e.document.createElement('script')
                        ? function () {
                            var t = e.document.createElement('script');
                            (t.onreadystatechange = function () {
                              h(),
                                (t.onreadystatechange = null),
                                t.parentNode.removeChild(t),
                                (t = null);
                            }),
                              e.document.documentElement.appendChild(t);
                          }
                        : function () {
                            setTimeout(h, 0);
                          }
                      : (((s = new e.MessageChannel()).port1.onmessage = h),
                        function () {
                          s.port2.postMessage(0);
                        }),
                  o = [];
                function h() {
                  var t, e;
                  i = !0;
                  for (var r = o.length; r; ) {
                    for (e = o, o = [], t = -1; ++t < r; ) e[t]();
                    r = o.length;
                  }
                  i = !1;
                }
                l.exports = function (t) {
                  1 !== o.push(t) || i || a();
                };
              }.call(
                this,
                void 0 !== commonjsGlobal
                  ? commonjsGlobal
                  : 'undefined' != typeof self
                    ? self
                    : 'undefined' != typeof window
                      ? window
                      : {}
              );
            },
            {},
          ],
          37: [
            function (t, e, r) {
              var s = t('immediate');
              function h() {}
              var l = {},
                n = ['REJECTED'],
                a = ['FULFILLED'],
                i = ['PENDING'];
              function o(t) {
                if ('function' != typeof t)
                  throw new TypeError('resolver must be a function');
                (this.state = i),
                  (this.queue = []),
                  (this.outcome = void 0),
                  t !== h && d(this, t);
              }
              function p(t, e, r) {
                (this.promise = t),
                  'function' == typeof e &&
                    ((this.onFulfilled = e),
                    (this.callFulfilled = this.otherCallFulfilled)),
                  'function' == typeof r &&
                    ((this.onRejected = r),
                    (this.callRejected = this.otherCallRejected));
              }
              function c(e, r, i) {
                s(function () {
                  var t;
                  try {
                    t = r(i);
                  } catch (t) {
                    return l.reject(e, t);
                  }
                  t === e
                    ? l.reject(
                        e,
                        new TypeError('Cannot resolve promise with itself')
                      )
                    : l.resolve(e, t);
                });
              }
              function f(t) {
                var e = t && t.then;
                if (
                  t &&
                  ('object' == typeof t || 'function' == typeof t) &&
                  'function' == typeof e
                )
                  return function () {
                    e.apply(t, arguments);
                  };
              }
              function d(e, t) {
                var r = !1;
                function i(t) {
                  r || ((r = !0), l.reject(e, t));
                }
                function s(t) {
                  r || ((r = !0), l.resolve(e, t));
                }
                var n = u(function () {
                  t(s, i);
                });
                'error' === n.status && i(n.value);
              }
              function u(t, e) {
                var r = {};
                try {
                  (r.value = t(e)), (r.status = 'success');
                } catch (t) {
                  (r.status = 'error'), (r.value = t);
                }
                return r;
              }
              ((e.exports = o).prototype.finally = function (e) {
                var r;
                return 'function' != typeof e
                  ? this
                  : ((r = this.constructor),
                    this.then(
                      function (t) {
                        return r.resolve(e()).then(function () {
                          return t;
                        });
                      },
                      function (t) {
                        return r.resolve(e()).then(function () {
                          throw t;
                        });
                      }
                    ));
              }),
                (o.prototype.catch = function (t) {
                  return this.then(null, t);
                }),
                (o.prototype.then = function (t, e) {
                  var r;
                  return ('function' != typeof t && this.state === a) ||
                    ('function' != typeof e && this.state === n)
                    ? this
                    : ((r = new this.constructor(h)),
                      this.state !== i
                        ? c(r, this.state === a ? t : e, this.outcome)
                        : this.queue.push(new p(r, t, e)),
                      r);
                }),
                (p.prototype.callFulfilled = function (t) {
                  l.resolve(this.promise, t);
                }),
                (p.prototype.otherCallFulfilled = function (t) {
                  c(this.promise, this.onFulfilled, t);
                }),
                (p.prototype.callRejected = function (t) {
                  l.reject(this.promise, t);
                }),
                (p.prototype.otherCallRejected = function (t) {
                  c(this.promise, this.onRejected, t);
                }),
                (l.resolve = function (t, e) {
                  var r = u(f, e);
                  if ('error' === r.status) return l.reject(t, r.value);
                  r = r.value;
                  if (r) d(t, r);
                  else {
                    (t.state = a), (t.outcome = e);
                    for (var i = -1, s = t.queue.length; ++i < s; )
                      t.queue[i].callFulfilled(e);
                  }
                  return t;
                }),
                (l.reject = function (t, e) {
                  (t.state = n), (t.outcome = e);
                  for (var r = -1, i = t.queue.length; ++r < i; )
                    t.queue[r].callRejected(e);
                  return t;
                }),
                (o.resolve = function (t) {
                  return t instanceof this ? t : l.resolve(new this(h), t);
                }),
                (o.reject = function (t) {
                  var e = new this(h);
                  return l.reject(e, t);
                }),
                (o.all = function (t) {
                  var r = this;
                  if ('[object Array]' !== Object.prototype.toString.call(t))
                    return this.reject(new TypeError('must be an array'));
                  var i = t.length,
                    s = !1;
                  if (!i) return this.resolve([]);
                  for (
                    var n = new Array(i), a = 0, e = -1, o = new this(h);
                    ++e < i;

                  )
                    !(function (t, e) {
                      r.resolve(t).then(
                        function (t) {
                          (n[e] = t),
                            ++a !== i || s || ((s = !0), l.resolve(o, n));
                        },
                        function (t) {
                          s || ((s = !0), l.reject(o, t));
                        }
                      );
                    })(t[e], e);
                  return o;
                }),
                (o.race = function (t) {
                  if ('[object Array]' !== Object.prototype.toString.call(t))
                    return this.reject(new TypeError('must be an array'));
                  var e = t.length,
                    r = !1;
                  if (!e) return this.resolve([]);
                  for (var i, s = -1, n = new this(h); ++s < e; )
                    (i = t[s]),
                      this.resolve(i).then(
                        function (t) {
                          r || ((r = !0), l.resolve(n, t));
                        },
                        function (t) {
                          r || ((r = !0), l.reject(n, t));
                        }
                      );
                  return n;
                });
            },
            { immediate: 36 },
          ],
          38: [
            function (t, e, r) {
              var i = {};
              (0, t('./lib/utils/common').assign)(
                i,
                t('./lib/deflate'),
                t('./lib/inflate'),
                t('./lib/zlib/constants')
              ),
                (e.exports = i);
            },
            {
              './lib/deflate': 39,
              './lib/inflate': 40,
              './lib/utils/common': 41,
              './lib/zlib/constants': 44,
            },
          ],
          39: [
            function (t, e, r) {
              var a = t('./zlib/deflate'),
                o = t('./utils/common'),
                h = t('./utils/strings'),
                i = t('./zlib/messages'),
                s = t('./zlib/zstream'),
                l = Object.prototype.toString;
              function n(t) {
                if (!(this instanceof n)) return new n(t);
                this.options = o.assign(
                  {
                    level: -1,
                    method: 8,
                    chunkSize: 16384,
                    windowBits: 15,
                    memLevel: 8,
                    strategy: 0,
                    to: '',
                  },
                  t || {}
                );
                var t = this.options,
                  e =
                    (t.raw && 0 < t.windowBits
                      ? (t.windowBits = -t.windowBits)
                      : t.gzip &&
                        0 < t.windowBits &&
                        t.windowBits < 16 &&
                        (t.windowBits += 16),
                    (this.err = 0),
                    (this.msg = ''),
                    (this.ended = !1),
                    (this.chunks = []),
                    (this.strm = new s()),
                    (this.strm.avail_out = 0),
                    a.deflateInit2(
                      this.strm,
                      t.level,
                      t.method,
                      t.windowBits,
                      t.memLevel,
                      t.strategy
                    ));
                if (0 !== e) throw new Error(i[e]);
                if (
                  (t.header && a.deflateSetHeader(this.strm, t.header),
                  t.dictionary)
                ) {
                  t =
                    'string' == typeof t.dictionary
                      ? h.string2buf(t.dictionary)
                      : '[object ArrayBuffer]' === l.call(t.dictionary)
                        ? new Uint8Array(t.dictionary)
                        : t.dictionary;
                  if (0 !== (e = a.deflateSetDictionary(this.strm, t)))
                    throw new Error(i[e]);
                  this._dict_set = !0;
                }
              }
              function p(t, e) {
                e = new n(e);
                if ((e.push(t, !0), e.err)) throw e.msg || i[e.err];
                return e.result;
              }
              (n.prototype.push = function (t, e) {
                var r,
                  i,
                  s = this.strm,
                  n = this.options.chunkSize;
                if (this.ended) return !1;
                (i = e === ~~e ? e : !0 === e ? 4 : 0),
                  'string' == typeof t
                    ? (s.input = h.string2buf(t))
                    : '[object ArrayBuffer]' === l.call(t)
                      ? (s.input = new Uint8Array(t))
                      : (s.input = t),
                  (s.next_in = 0),
                  (s.avail_in = s.input.length);
                do {
                  if (
                    (0 === s.avail_out &&
                      ((s.output = new o.Buf8(n)),
                      (s.next_out = 0),
                      (s.avail_out = n)),
                    1 !== (r = a.deflate(s, i)) && 0 !== r)
                  )
                    return this.onEnd(r), !(this.ended = !0);
                } while (
                  ((0 !== s.avail_out &&
                    (0 !== s.avail_in || (4 !== i && 2 !== i))) ||
                    ('string' === this.options.to
                      ? this.onData(
                          h.buf2binstring(o.shrinkBuf(s.output, s.next_out))
                        )
                      : this.onData(o.shrinkBuf(s.output, s.next_out))),
                  (0 < s.avail_in || 0 === s.avail_out) && 1 !== r)
                );
                return 4 === i
                  ? ((r = a.deflateEnd(this.strm)),
                    this.onEnd(r),
                    (this.ended = !0),
                    0 === r)
                  : 2 !== i || (this.onEnd(0), !(s.avail_out = 0));
              }),
                (n.prototype.onData = function (t) {
                  this.chunks.push(t);
                }),
                (n.prototype.onEnd = function (t) {
                  0 === t &&
                    ('string' === this.options.to
                      ? (this.result = this.chunks.join(''))
                      : (this.result = o.flattenChunks(this.chunks))),
                    (this.chunks = []),
                    (this.err = t),
                    (this.msg = this.strm.msg);
                }),
                (r.Deflate = n),
                (r.deflate = p),
                (r.deflateRaw = function (t, e) {
                  return ((e = e || {}).raw = !0), p(t, e);
                }),
                (r.gzip = function (t, e) {
                  return ((e = e || {}).gzip = !0), p(t, e);
                });
            },
            {
              './utils/common': 41,
              './utils/strings': 42,
              './zlib/deflate': 46,
              './zlib/messages': 51,
              './zlib/zstream': 53,
            },
          ],
          40: [
            function (t, e, r) {
              var c = t('./zlib/inflate'),
                f = t('./utils/common'),
                d = t('./utils/strings'),
                u = t('./zlib/constants'),
                i = t('./zlib/messages'),
                s = t('./zlib/zstream'),
                n = t('./zlib/gzheader'),
                m = Object.prototype.toString;
              function a(t) {
                if (!(this instanceof a)) return new a(t);
                this.options = f.assign(
                  { chunkSize: 16384, windowBits: 0, to: '' },
                  t || {}
                );
                var e = this.options,
                  t =
                    (e.raw &&
                      0 <= e.windowBits &&
                      e.windowBits < 16 &&
                      ((e.windowBits = -e.windowBits), 0 === e.windowBits) &&
                      (e.windowBits = -15),
                    !(0 <= e.windowBits && e.windowBits < 16) ||
                      (t && t.windowBits) ||
                      (e.windowBits += 32),
                    15 < e.windowBits &&
                      e.windowBits < 48 &&
                      0 == (15 & e.windowBits) &&
                      (e.windowBits |= 15),
                    (this.err = 0),
                    (this.msg = ''),
                    (this.ended = !1),
                    (this.chunks = []),
                    (this.strm = new s()),
                    (this.strm.avail_out = 0),
                    c.inflateInit2(this.strm, e.windowBits));
                if (t !== u.Z_OK) throw new Error(i[t]);
                (this.header = new n()),
                  c.inflateGetHeader(this.strm, this.header);
              }
              function o(t, e) {
                e = new a(e);
                if ((e.push(t, !0), e.err)) throw e.msg || i[e.err];
                return e.result;
              }
              (a.prototype.push = function (t, e) {
                var r,
                  i,
                  s,
                  n,
                  a,
                  o = this.strm,
                  h = this.options.chunkSize,
                  l = this.options.dictionary,
                  p = !1;
                if (this.ended) return !1;
                (i = e === ~~e ? e : !0 === e ? u.Z_FINISH : u.Z_NO_FLUSH),
                  'string' == typeof t
                    ? (o.input = d.binstring2buf(t))
                    : '[object ArrayBuffer]' === m.call(t)
                      ? (o.input = new Uint8Array(t))
                      : (o.input = t),
                  (o.next_in = 0),
                  (o.avail_in = o.input.length);
                do {
                  if (
                    (0 === o.avail_out &&
                      ((o.output = new f.Buf8(h)),
                      (o.next_out = 0),
                      (o.avail_out = h)),
                    (r = c.inflate(o, u.Z_NO_FLUSH)) === u.Z_NEED_DICT &&
                      l &&
                      ((a =
                        'string' == typeof l
                          ? d.string2buf(l)
                          : '[object ArrayBuffer]' === m.call(l)
                            ? new Uint8Array(l)
                            : l),
                      (r = c.inflateSetDictionary(this.strm, a))),
                    r === u.Z_BUF_ERROR && !0 === p && ((r = u.Z_OK), (p = !1)),
                    r !== u.Z_STREAM_END && r !== u.Z_OK)
                  )
                    return this.onEnd(r), !(this.ended = !0);
                } while (
                  (!o.next_out ||
                    (0 !== o.avail_out &&
                      r !== u.Z_STREAM_END &&
                      (0 !== o.avail_in ||
                        (i !== u.Z_FINISH && i !== u.Z_SYNC_FLUSH))) ||
                    ('string' === this.options.to
                      ? ((a = d.utf8border(o.output, o.next_out)),
                        (s = o.next_out - a),
                        (n = d.buf2string(o.output, a)),
                        (o.next_out = s),
                        (o.avail_out = h - s),
                        s && f.arraySet(o.output, o.output, a, s, 0),
                        this.onData(n))
                      : this.onData(f.shrinkBuf(o.output, o.next_out))),
                  0 === o.avail_in && 0 === o.avail_out && (p = !0),
                  (0 < o.avail_in || 0 === o.avail_out) && r !== u.Z_STREAM_END)
                );
                return (i = r === u.Z_STREAM_END ? u.Z_FINISH : i) ===
                  u.Z_FINISH
                  ? ((r = c.inflateEnd(this.strm)),
                    this.onEnd(r),
                    (this.ended = !0),
                    r === u.Z_OK)
                  : i !== u.Z_SYNC_FLUSH ||
                      (this.onEnd(u.Z_OK), !(o.avail_out = 0));
              }),
                (a.prototype.onData = function (t) {
                  this.chunks.push(t);
                }),
                (a.prototype.onEnd = function (t) {
                  t === u.Z_OK &&
                    ('string' === this.options.to
                      ? (this.result = this.chunks.join(''))
                      : (this.result = f.flattenChunks(this.chunks))),
                    (this.chunks = []),
                    (this.err = t),
                    (this.msg = this.strm.msg);
                }),
                (r.Inflate = a),
                (r.inflate = o),
                (r.inflateRaw = function (t, e) {
                  return ((e = e || {}).raw = !0), o(t, e);
                }),
                (r.ungzip = o);
            },
            {
              './utils/common': 41,
              './utils/strings': 42,
              './zlib/constants': 44,
              './zlib/gzheader': 47,
              './zlib/inflate': 49,
              './zlib/messages': 51,
              './zlib/zstream': 53,
            },
          ],
          41: [
            function (t, e, r) {
              var i =
                  'undefined' != typeof Uint8Array &&
                  'undefined' != typeof Uint16Array &&
                  'undefined' != typeof Int32Array,
                s =
                  ((r.assign = function (t) {
                    for (
                      var e = Array.prototype.slice.call(arguments, 1);
                      e.length;

                    ) {
                      var r = e.shift();
                      if (r) {
                        if ('object' != typeof r)
                          throw new TypeError(r + 'must be non-object');
                        for (var i in r) r.hasOwnProperty(i) && (t[i] = r[i]);
                      }
                    }
                    return t;
                  }),
                  (r.shrinkBuf = function (t, e) {
                    return t.length === e
                      ? t
                      : t.subarray
                        ? t.subarray(0, e)
                        : ((t.length = e), t);
                  }),
                  {
                    arraySet: function (t, e, r, i, s) {
                      if (e.subarray && t.subarray)
                        t.set(e.subarray(r, r + i), s);
                      else for (var n = 0; n < i; n++) t[s + n] = e[r + n];
                    },
                    flattenChunks: function (t) {
                      for (var e, r, i, s = 0, n = 0, a = t.length; n < a; n++)
                        s += t[n].length;
                      for (
                        i = new Uint8Array(s), n = e = 0, a = t.length;
                        n < a;
                        n++
                      )
                        (r = t[n]), i.set(r, e), (e += r.length);
                      return i;
                    },
                  }),
                n = {
                  arraySet: function (t, e, r, i, s) {
                    for (var n = 0; n < i; n++) t[s + n] = e[r + n];
                  },
                  flattenChunks: function (t) {
                    return [].concat.apply([], t);
                  },
                };
              (r.setTyped = function (t) {
                t
                  ? ((r.Buf8 = Uint8Array),
                    (r.Buf16 = Uint16Array),
                    (r.Buf32 = Int32Array),
                    r.assign(r, s))
                  : ((r.Buf8 = Array),
                    (r.Buf16 = Array),
                    (r.Buf32 = Array),
                    r.assign(r, n));
              }),
                r.setTyped(i);
            },
            {},
          ],
          42: [
            function (t, e, r) {
              var h = t('./common'),
                s = !0,
                n = !0;
              try {
                String.fromCharCode.apply(null, [0]);
              } catch (t) {
                s = !1;
              }
              try {
                String.fromCharCode.apply(null, new Uint8Array(1));
              } catch (t) {
                n = !1;
              }
              for (var l = new h.Buf8(256), i = 0; i < 256; i++)
                l[i] =
                  252 <= i
                    ? 6
                    : 248 <= i
                      ? 5
                      : 240 <= i
                        ? 4
                        : 224 <= i
                          ? 3
                          : 192 <= i
                            ? 2
                            : 1;
              function p(t, e) {
                if (e < 65537 && ((t.subarray && n) || (!t.subarray && s)))
                  return String.fromCharCode.apply(null, h.shrinkBuf(t, e));
                for (var r = '', i = 0; i < e; i++)
                  r += String.fromCharCode(t[i]);
                return r;
              }
              (l[254] = l[254] = 1),
                (r.string2buf = function (t) {
                  for (var e, r, i, s, n = t.length, a = 0, o = 0; o < n; o++)
                    55296 == (64512 & (r = t.charCodeAt(o))) &&
                      o + 1 < n &&
                      56320 == (64512 & (i = t.charCodeAt(o + 1))) &&
                      ((r = 65536 + ((r - 55296) << 10) + (i - 56320)), o++),
                      (a += r < 128 ? 1 : r < 2048 ? 2 : r < 65536 ? 3 : 4);
                  for (e = new h.Buf8(a), o = s = 0; s < a; o++)
                    55296 == (64512 & (r = t.charCodeAt(o))) &&
                      o + 1 < n &&
                      56320 == (64512 & (i = t.charCodeAt(o + 1))) &&
                      ((r = 65536 + ((r - 55296) << 10) + (i - 56320)), o++),
                      r < 128
                        ? (e[s++] = r)
                        : (r < 2048
                            ? (e[s++] = 192 | (r >>> 6))
                            : (r < 65536
                                ? (e[s++] = 224 | (r >>> 12))
                                : ((e[s++] = 240 | (r >>> 18)),
                                  (e[s++] = 128 | ((r >>> 12) & 63))),
                              (e[s++] = 128 | ((r >>> 6) & 63))),
                          (e[s++] = 128 | (63 & r)));
                  return e;
                }),
                (r.buf2binstring = function (t) {
                  return p(t, t.length);
                }),
                (r.binstring2buf = function (t) {
                  for (
                    var e = new h.Buf8(t.length), r = 0, i = e.length;
                    r < i;
                    r++
                  )
                    e[r] = t.charCodeAt(r);
                  return e;
                }),
                (r.buf2string = function (t, e) {
                  for (
                    var r,
                      i,
                      s = e || t.length,
                      n = new Array(2 * s),
                      a = 0,
                      o = 0;
                    o < s;

                  )
                    if ((r = t[o++]) < 128) n[a++] = r;
                    else if (4 < (i = l[r])) (n[a++] = 65533), (o += i - 1);
                    else {
                      for (
                        r &= 2 === i ? 31 : 3 === i ? 15 : 7;
                        1 < i && o < s;

                      )
                        (r = (r << 6) | (63 & t[o++])), i--;
                      1 < i
                        ? (n[a++] = 65533)
                        : r < 65536
                          ? (n[a++] = r)
                          : ((r -= 65536),
                            (n[a++] = 55296 | ((r >> 10) & 1023)),
                            (n[a++] = 56320 | (1023 & r)));
                    }
                  return p(n, a);
                }),
                (r.utf8border = function (t, e) {
                  for (
                    var r =
                      (e = (e = e || t.length) > t.length ? t.length : e) - 1;
                    0 <= r && 128 == (192 & t[r]);

                  )
                    r--;
                  return !(r < 0 || 0 === r) && r + l[t[r]] > e ? r : e;
                });
            },
            { './common': 41 },
          ],
          43: [
            function (t, e, r) {
              e.exports = function (t, e, r, i) {
                for (
                  var s = (65535 & t) | 0, n = ((t >>> 16) & 65535) | 0, a = 0;
                  0 !== r;

                ) {
                  for (
                    r -= a = 2e3 < r ? 2e3 : r;
                    (n = (n + (s = (s + e[i++]) | 0)) | 0), --a;

                  );
                  (s %= 65521), (n %= 65521);
                }
                return s | (n << 16) | 0;
              };
            },
            {},
          ],
          44: [
            function (t, e, r) {
              e.exports = {
                Z_NO_FLUSH: 0,
                Z_PARTIAL_FLUSH: 1,
                Z_SYNC_FLUSH: 2,
                Z_FULL_FLUSH: 3,
                Z_FINISH: 4,
                Z_BLOCK: 5,
                Z_TREES: 6,
                Z_OK: 0,
                Z_STREAM_END: 1,
                Z_NEED_DICT: 2,
                Z_ERRNO: -1,
                Z_STREAM_ERROR: -2,
                Z_DATA_ERROR: -3,
                Z_BUF_ERROR: -5,
                Z_NO_COMPRESSION: 0,
                Z_BEST_SPEED: 1,
                Z_BEST_COMPRESSION: 9,
                Z_DEFAULT_COMPRESSION: -1,
                Z_FILTERED: 1,
                Z_HUFFMAN_ONLY: 2,
                Z_RLE: 3,
                Z_FIXED: 4,
                Z_DEFAULT_STRATEGY: 0,
                Z_BINARY: 0,
                Z_TEXT: 1,
                Z_UNKNOWN: 2,
                Z_DEFLATED: 8,
              };
            },
            {},
          ],
          45: [
            function (t, e, r) {
              var o = (function () {
                for (var t = [], e = 0; e < 256; e++) {
                  for (var r = e, i = 0; i < 8; i++)
                    r = 1 & r ? 3988292384 ^ (r >>> 1) : r >>> 1;
                  t[e] = r;
                }
                return t;
              })();
              e.exports = function (t, e, r, i) {
                var s = o,
                  n = i + r;
                t ^= -1;
                for (var a = i; a < n; a++) t = (t >>> 8) ^ s[255 & (t ^ e[a])];
                return -1 ^ t;
              };
            },
            {},
          ],
          46: [
            function (t, e, r) {
              var o,
                c = t('../utils/common'),
                h = t('./trees'),
                f = t('./adler32'),
                d = t('./crc32'),
                i = t('./messages');
              function l(t, e) {
                return (t.msg = i[e]), e;
              }
              function p(t) {
                return (t << 1) - (4 < t ? 9 : 0);
              }
              function u(t) {
                for (var e = t.length; 0 <= --e; ) t[e] = 0;
              }
              function m(t) {
                var e = t.state,
                  r = e.pending;
                0 !== (r = r > t.avail_out ? t.avail_out : r) &&
                  (c.arraySet(
                    t.output,
                    e.pending_buf,
                    e.pending_out,
                    r,
                    t.next_out
                  ),
                  (t.next_out += r),
                  (e.pending_out += r),
                  (t.total_out += r),
                  (t.avail_out -= r),
                  (e.pending -= r),
                  0 === e.pending) &&
                  (e.pending_out = 0);
              }
              function y(t, e) {
                h._tr_flush_block(
                  t,
                  0 <= t.block_start ? t.block_start : -1,
                  t.strstart - t.block_start,
                  e
                ),
                  (t.block_start = t.strstart),
                  m(t.strm);
              }
              function g(t, e) {
                t.pending_buf[t.pending++] = e;
              }
              function v(t, e) {
                (t.pending_buf[t.pending++] = (e >>> 8) & 255),
                  (t.pending_buf[t.pending++] = 255 & e);
              }
              function n(t, e) {
                var r,
                  i,
                  s = t.max_chain_length,
                  n = t.strstart,
                  a = t.prev_length,
                  o = t.nice_match,
                  h =
                    t.strstart > t.w_size - 262
                      ? t.strstart - (t.w_size - 262)
                      : 0,
                  l = t.window,
                  p = t.w_mask,
                  c = t.prev,
                  f = t.strstart + 258,
                  d = l[n + a - 1],
                  u = l[n + a];
                t.prev_length >= t.good_match && (s >>= 2),
                  o > t.lookahead && (o = t.lookahead);
                do {
                  if (
                    l[(r = e) + a] === u &&
                    l[r + a - 1] === d &&
                    l[r] === l[n] &&
                    l[++r] === l[n + 1]
                  ) {
                    for (
                      n += 2, r++;
                      l[++n] === l[++r] &&
                      l[++n] === l[++r] &&
                      l[++n] === l[++r] &&
                      l[++n] === l[++r] &&
                      l[++n] === l[++r] &&
                      l[++n] === l[++r] &&
                      l[++n] === l[++r] &&
                      l[++n] === l[++r] &&
                      n < f;

                    );
                    if (((i = 258 - (f - n)), (n = f - 258), a < i)) {
                      if (((t.match_start = e), o <= (a = i))) break;
                      (d = l[n + a - 1]), (u = l[n + a]);
                    }
                  }
                } while ((e = c[e & p]) > h && 0 != --s);
                return a <= t.lookahead ? a : t.lookahead;
              }
              function _(t) {
                var e,
                  r,
                  i,
                  s,
                  n,
                  a,
                  o,
                  h,
                  l,
                  p = t.w_size;
                do {
                  if (
                    ((h = t.window_size - t.lookahead - t.strstart),
                    t.strstart >= p + (p - 262))
                  ) {
                    for (
                      c.arraySet(t.window, t.window, p, p, 0),
                        t.match_start -= p,
                        t.strstart -= p,
                        t.block_start -= p,
                        e = r = t.hash_size;
                      (i = t.head[--e]), (t.head[e] = p <= i ? i - p : 0), --r;

                    );
                    for (
                      e = r = p;
                      (i = t.prev[--e]), (t.prev[e] = p <= i ? i - p : 0), --r;

                    );
                    h += p;
                  }
                  if (0 === t.strm.avail_in) break;
                  if (
                    ((n = t.strm),
                    (a = t.window),
                    (o = t.strstart + t.lookahead),
                    (h = h),
                    (l = void 0),
                    (r =
                      0 === (l = (l = n.avail_in) > h ? h : l)
                        ? 0
                        : ((n.avail_in -= l),
                          c.arraySet(a, n.input, n.next_in, l, o),
                          1 === n.state.wrap
                            ? (n.adler = f(n.adler, a, l, o))
                            : 2 === n.state.wrap &&
                              (n.adler = d(n.adler, a, l, o)),
                          (n.next_in += l),
                          (n.total_in += l),
                          l)),
                    (t.lookahead += r),
                    3 <= t.lookahead + t.insert)
                  )
                    for (
                      s = t.strstart - t.insert,
                        t.ins_h = t.window[s],
                        t.ins_h =
                          ((t.ins_h << t.hash_shift) ^ t.window[s + 1]) &
                          t.hash_mask;
                      t.insert &&
                      ((t.ins_h =
                        ((t.ins_h << t.hash_shift) ^ t.window[s + 3 - 1]) &
                        t.hash_mask),
                      (t.prev[s & t.w_mask] = t.head[t.ins_h]),
                      (t.head[t.ins_h] = s),
                      s++,
                      t.insert--,
                      !(t.lookahead + t.insert < 3));

                    );
                } while (t.lookahead < 262 && 0 !== t.strm.avail_in);
              }
              function s(t, e) {
                for (var r, i; ; ) {
                  if (t.lookahead < 262) {
                    if ((_(t), t.lookahead < 262 && 0 === e)) return 1;
                    if (0 === t.lookahead) break;
                  }
                  if (
                    ((r = 0),
                    3 <= t.lookahead &&
                      ((t.ins_h =
                        ((t.ins_h << t.hash_shift) ^
                          t.window[t.strstart + 3 - 1]) &
                        t.hash_mask),
                      (r = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h]),
                      (t.head[t.ins_h] = t.strstart)),
                    0 !== r &&
                      t.strstart - r <= t.w_size - 262 &&
                      (t.match_length = n(t, r)),
                    3 <= t.match_length)
                  )
                    if (
                      ((i = h._tr_tally(
                        t,
                        t.strstart - t.match_start,
                        t.match_length - 3
                      )),
                      (t.lookahead -= t.match_length),
                      t.match_length <= t.max_lazy_match && 3 <= t.lookahead)
                    ) {
                      for (
                        t.match_length--;
                        t.strstart++,
                          (t.ins_h =
                            ((t.ins_h << t.hash_shift) ^
                              t.window[t.strstart + 3 - 1]) &
                            t.hash_mask),
                          (r = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h]),
                          (t.head[t.ins_h] = t.strstart),
                          0 != --t.match_length;

                      );
                      t.strstart++;
                    } else
                      (t.strstart += t.match_length),
                        (t.match_length = 0),
                        (t.ins_h = t.window[t.strstart]),
                        (t.ins_h =
                          ((t.ins_h << t.hash_shift) ^
                            t.window[t.strstart + 1]) &
                          t.hash_mask);
                  else
                    (i = h._tr_tally(t, 0, t.window[t.strstart])),
                      t.lookahead--,
                      t.strstart++;
                  if (i && (y(t, !1), 0 === t.strm.avail_out)) return 1;
                }
                return (
                  (t.insert = t.strstart < 2 ? t.strstart : 2),
                  4 === e
                    ? (y(t, !0), 0 === t.strm.avail_out ? 3 : 4)
                    : t.last_lit && (y(t, !1), 0 === t.strm.avail_out)
                      ? 1
                      : 2
                );
              }
              function a(t, e) {
                for (var r, i, s; ; ) {
                  if (t.lookahead < 262) {
                    if ((_(t), t.lookahead < 262 && 0 === e)) return 1;
                    if (0 === t.lookahead) break;
                  }
                  if (
                    ((r = 0),
                    3 <= t.lookahead &&
                      ((t.ins_h =
                        ((t.ins_h << t.hash_shift) ^
                          t.window[t.strstart + 3 - 1]) &
                        t.hash_mask),
                      (r = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h]),
                      (t.head[t.ins_h] = t.strstart)),
                    (t.prev_length = t.match_length),
                    (t.prev_match = t.match_start),
                    (t.match_length = 2),
                    0 !== r &&
                      t.prev_length < t.max_lazy_match &&
                      t.strstart - r <= t.w_size - 262 &&
                      ((t.match_length = n(t, r)), t.match_length <= 5) &&
                      (1 === t.strategy ||
                        (3 === t.match_length &&
                          4096 < t.strstart - t.match_start)) &&
                      (t.match_length = 2),
                    3 <= t.prev_length && t.match_length <= t.prev_length)
                  ) {
                    for (
                      s = t.strstart + t.lookahead - 3,
                        i = h._tr_tally(
                          t,
                          t.strstart - 1 - t.prev_match,
                          t.prev_length - 3
                        ),
                        t.lookahead -= t.prev_length - 1,
                        t.prev_length -= 2;
                      ++t.strstart <= s &&
                        ((t.ins_h =
                          ((t.ins_h << t.hash_shift) ^
                            t.window[t.strstart + 3 - 1]) &
                          t.hash_mask),
                        (r = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h]),
                        (t.head[t.ins_h] = t.strstart)),
                        0 != --t.prev_length;

                    );
                    if (
                      ((t.match_available = 0),
                      (t.match_length = 2),
                      t.strstart++,
                      i && (y(t, !1), 0 === t.strm.avail_out))
                    )
                      return 1;
                  } else if (t.match_available) {
                    if (
                      ((i = h._tr_tally(t, 0, t.window[t.strstart - 1])) &&
                        y(t, !1),
                      t.strstart++,
                      t.lookahead--,
                      0 === t.strm.avail_out)
                    )
                      return 1;
                  } else (t.match_available = 1), t.strstart++, t.lookahead--;
                }
                return (
                  t.match_available &&
                    ((i = h._tr_tally(t, 0, t.window[t.strstart - 1])),
                    (t.match_available = 0)),
                  (t.insert = t.strstart < 2 ? t.strstart : 2),
                  4 === e
                    ? (y(t, !0), 0 === t.strm.avail_out ? 3 : 4)
                    : t.last_lit && (y(t, !1), 0 === t.strm.avail_out)
                      ? 1
                      : 2
                );
              }
              function b(t, e, r, i, s) {
                (this.good_length = t),
                  (this.max_lazy = e),
                  (this.nice_length = r),
                  (this.max_chain = i),
                  (this.func = s);
              }
              function S() {
                (this.strm = null),
                  (this.status = 0),
                  (this.pending_buf = null),
                  (this.pending_buf_size = 0),
                  (this.pending_out = 0),
                  (this.pending = 0),
                  (this.wrap = 0),
                  (this.gzhead = null),
                  (this.gzindex = 0),
                  (this.method = 8),
                  (this.last_flush = -1),
                  (this.w_size = 0),
                  (this.w_bits = 0),
                  (this.w_mask = 0),
                  (this.window = null),
                  (this.window_size = 0),
                  (this.prev = null),
                  (this.head = null),
                  (this.ins_h = 0),
                  (this.hash_size = 0),
                  (this.hash_bits = 0),
                  (this.hash_mask = 0),
                  (this.hash_shift = 0),
                  (this.block_start = 0),
                  (this.match_length = 0),
                  (this.prev_match = 0),
                  (this.match_available = 0),
                  (this.strstart = 0),
                  (this.match_start = 0),
                  (this.lookahead = 0),
                  (this.prev_length = 0),
                  (this.max_chain_length = 0),
                  (this.max_lazy_match = 0),
                  (this.level = 0),
                  (this.strategy = 0),
                  (this.good_match = 0),
                  (this.nice_match = 0),
                  (this.dyn_ltree = new c.Buf16(1146)),
                  (this.dyn_dtree = new c.Buf16(122)),
                  (this.bl_tree = new c.Buf16(78)),
                  u(this.dyn_ltree),
                  u(this.dyn_dtree),
                  u(this.bl_tree),
                  (this.l_desc = null),
                  (this.d_desc = null),
                  (this.bl_desc = null),
                  (this.bl_count = new c.Buf16(16)),
                  (this.heap = new c.Buf16(573)),
                  u(this.heap),
                  (this.heap_len = 0),
                  (this.heap_max = 0),
                  (this.depth = new c.Buf16(573)),
                  u(this.depth),
                  (this.l_buf = 0),
                  (this.lit_bufsize = 0),
                  (this.last_lit = 0),
                  (this.d_buf = 0),
                  (this.opt_len = 0),
                  (this.static_len = 0),
                  (this.matches = 0),
                  (this.insert = 0),
                  (this.bi_buf = 0),
                  (this.bi_valid = 0);
              }
              function P(t) {
                var e;
                return t && t.state
                  ? ((t.total_in = t.total_out = 0),
                    (t.data_type = 2),
                    ((e = t.state).pending = 0),
                    (e.pending_out = 0),
                    e.wrap < 0 && (e.wrap = -e.wrap),
                    (e.status = e.wrap ? 42 : 113),
                    (t.adler = 2 === e.wrap ? 0 : 1),
                    (e.last_flush = 0),
                    h._tr_init(e),
                    0)
                  : l(t, -2);
              }
              function x(t) {
                var e = P(t);
                return (
                  0 === e &&
                    (((t = t.state).window_size = 2 * t.w_size),
                    u(t.head),
                    (t.max_lazy_match = o[t.level].max_lazy),
                    (t.good_match = o[t.level].good_length),
                    (t.nice_match = o[t.level].nice_length),
                    (t.max_chain_length = o[t.level].max_chain),
                    (t.strstart = 0),
                    (t.block_start = 0),
                    (t.lookahead = 0),
                    (t.insert = 0),
                    (t.match_length = t.prev_length = 2),
                    (t.match_available = 0),
                    (t.ins_h = 0)),
                  e
                );
              }
              function k(t, e, r, i, s, n) {
                if (!t) return -2;
                var a = 1;
                if (
                  (-1 === e && (e = 6),
                  i < 0 ? ((a = 0), (i = -i)) : 15 < i && ((a = 2), (i -= 16)),
                  s < 1 ||
                    9 < s ||
                    8 !== r ||
                    i < 8 ||
                    15 < i ||
                    e < 0 ||
                    9 < e ||
                    n < 0 ||
                    4 < n)
                )
                  return l(t, -2);
                8 === i && (i = 9);
                var o = new S();
                return (
                  ((t.state = o).strm = t),
                  (o.wrap = a),
                  (o.gzhead = null),
                  (o.w_bits = i),
                  (o.w_size = 1 << o.w_bits),
                  (o.w_mask = o.w_size - 1),
                  (o.hash_bits = s + 7),
                  (o.hash_size = 1 << o.hash_bits),
                  (o.hash_mask = o.hash_size - 1),
                  (o.hash_shift = ~~((o.hash_bits + 3 - 1) / 3)),
                  (o.window = new c.Buf8(2 * o.w_size)),
                  (o.head = new c.Buf16(o.hash_size)),
                  (o.prev = new c.Buf16(o.w_size)),
                  (o.lit_bufsize = 1 << (s + 6)),
                  (o.pending_buf_size = 4 * o.lit_bufsize),
                  (o.pending_buf = new c.Buf8(o.pending_buf_size)),
                  (o.d_buf = +o.lit_bufsize),
                  (o.l_buf = 3 * o.lit_bufsize),
                  (o.level = e),
                  (o.strategy = n),
                  (o.method = r),
                  x(t)
                );
              }
              (o = [
                new b(0, 0, 0, 0, function (t, e) {
                  var r = 65535;
                  for (
                    r > t.pending_buf_size - 5 && (r = t.pending_buf_size - 5);
                    ;

                  ) {
                    if (t.lookahead <= 1) {
                      if ((_(t), 0 === t.lookahead && 0 === e)) return 1;
                      if (0 === t.lookahead) break;
                    }
                    (t.strstart += t.lookahead), (t.lookahead = 0);
                    var i = t.block_start + r;
                    if (
                      (0 === t.strstart || t.strstart >= i) &&
                      ((t.lookahead = t.strstart - i),
                      (t.strstart = i),
                      y(t, !1),
                      0 === t.strm.avail_out)
                    )
                      return 1;
                    if (
                      t.strstart - t.block_start >= t.w_size - 262 &&
                      (y(t, !1), 0 === t.strm.avail_out)
                    )
                      return 1;
                  }
                  return (
                    (t.insert = 0),
                    4 === e
                      ? (y(t, !0), 0 === t.strm.avail_out ? 3 : 4)
                      : (t.strstart > t.block_start &&
                          (y(t, !1), t.strm.avail_out),
                        1)
                  );
                }),
                new b(4, 4, 8, 4, s),
                new b(4, 5, 16, 8, s),
                new b(4, 6, 32, 32, s),
                new b(4, 4, 16, 16, a),
                new b(8, 16, 32, 32, a),
                new b(8, 16, 128, 128, a),
                new b(8, 32, 128, 256, a),
                new b(32, 128, 258, 1024, a),
                new b(32, 258, 258, 4096, a),
              ]),
                (r.deflateInit = function (t, e) {
                  return k(t, e, 8, 15, 8, 0);
                }),
                (r.deflateInit2 = k),
                (r.deflateReset = x),
                (r.deflateResetKeep = P),
                (r.deflateSetHeader = function (t, e) {
                  return !t || !t.state || 2 !== t.state.wrap
                    ? -2
                    : ((t.state.gzhead = e), 0);
                }),
                (r.deflate = function (t, e) {
                  var r, i, s, n;
                  if (!t || !t.state || 5 < e || e < 0)
                    return t ? l(t, -2) : -2;
                  if (
                    ((i = t.state),
                    !t.output ||
                      (!t.input && 0 !== t.avail_in) ||
                      (666 === i.status && 4 !== e))
                  )
                    return l(t, 0 === t.avail_out ? -5 : -2);
                  if (
                    ((i.strm = t),
                    (r = i.last_flush),
                    (i.last_flush = e),
                    42 === i.status &&
                      (2 === i.wrap
                        ? ((t.adler = 0),
                          g(i, 31),
                          g(i, 139),
                          g(i, 8),
                          i.gzhead
                            ? (g(
                                i,
                                (i.gzhead.text ? 1 : 0) +
                                  (i.gzhead.hcrc ? 2 : 0) +
                                  (i.gzhead.extra ? 4 : 0) +
                                  (i.gzhead.name ? 8 : 0) +
                                  (i.gzhead.comment ? 16 : 0)
                              ),
                              g(i, 255 & i.gzhead.time),
                              g(i, (i.gzhead.time >> 8) & 255),
                              g(i, (i.gzhead.time >> 16) & 255),
                              g(i, (i.gzhead.time >> 24) & 255),
                              g(
                                i,
                                9 === i.level
                                  ? 2
                                  : 2 <= i.strategy || i.level < 2
                                    ? 4
                                    : 0
                              ),
                              g(i, 255 & i.gzhead.os),
                              i.gzhead.extra &&
                                i.gzhead.extra.length &&
                                (g(i, 255 & i.gzhead.extra.length),
                                g(i, (i.gzhead.extra.length >> 8) & 255)),
                              i.gzhead.hcrc &&
                                (t.adler = d(
                                  t.adler,
                                  i.pending_buf,
                                  i.pending,
                                  0
                                )),
                              (i.gzindex = 0),
                              (i.status = 69))
                            : (g(i, 0),
                              g(i, 0),
                              g(i, 0),
                              g(i, 0),
                              g(i, 0),
                              g(
                                i,
                                9 === i.level
                                  ? 2
                                  : 2 <= i.strategy || i.level < 2
                                    ? 4
                                    : 0
                              ),
                              g(i, 3),
                              (i.status = 113)))
                        : ((a = (8 + ((i.w_bits - 8) << 4)) << 8),
                          (a |=
                            (2 <= i.strategy || i.level < 2
                              ? 0
                              : i.level < 6
                                ? 1
                                : 6 === i.level
                                  ? 2
                                  : 3) << 6),
                          0 !== i.strstart && (a |= 32),
                          (a += 31 - (a % 31)),
                          (i.status = 113),
                          v(i, a),
                          0 !== i.strstart &&
                            (v(i, t.adler >>> 16), v(i, 65535 & t.adler)),
                          (t.adler = 1))),
                    69 === i.status)
                  )
                    if (i.gzhead.extra) {
                      for (
                        s = i.pending;
                        i.gzindex < (65535 & i.gzhead.extra.length) &&
                        (i.pending !== i.pending_buf_size ||
                          (i.gzhead.hcrc &&
                            i.pending > s &&
                            (t.adler = d(
                              t.adler,
                              i.pending_buf,
                              i.pending - s,
                              s
                            )),
                          m(t),
                          (s = i.pending),
                          i.pending !== i.pending_buf_size));

                      )
                        g(i, 255 & i.gzhead.extra[i.gzindex]), i.gzindex++;
                      i.gzhead.hcrc &&
                        i.pending > s &&
                        (t.adler = d(t.adler, i.pending_buf, i.pending - s, s)),
                        i.gzindex === i.gzhead.extra.length &&
                          ((i.gzindex = 0), (i.status = 73));
                    } else i.status = 73;
                  if (73 === i.status)
                    if (i.gzhead.name) {
                      s = i.pending;
                      do {
                        if (
                          i.pending === i.pending_buf_size &&
                          (i.gzhead.hcrc &&
                            i.pending > s &&
                            (t.adler = d(
                              t.adler,
                              i.pending_buf,
                              i.pending - s,
                              s
                            )),
                          m(t),
                          (s = i.pending),
                          i.pending === i.pending_buf_size)
                        ) {
                          n = 1;
                          break;
                        }
                      } while (
                        ((n =
                          i.gzindex < i.gzhead.name.length
                            ? 255 & i.gzhead.name.charCodeAt(i.gzindex++)
                            : 0),
                        g(i, n),
                        0 !== n)
                      );
                      i.gzhead.hcrc &&
                        i.pending > s &&
                        (t.adler = d(t.adler, i.pending_buf, i.pending - s, s)),
                        0 === n && ((i.gzindex = 0), (i.status = 91));
                    } else i.status = 91;
                  if (91 === i.status)
                    if (i.gzhead.comment) {
                      s = i.pending;
                      do {
                        if (
                          i.pending === i.pending_buf_size &&
                          (i.gzhead.hcrc &&
                            i.pending > s &&
                            (t.adler = d(
                              t.adler,
                              i.pending_buf,
                              i.pending - s,
                              s
                            )),
                          m(t),
                          (s = i.pending),
                          i.pending === i.pending_buf_size)
                        ) {
                          n = 1;
                          break;
                        }
                      } while (
                        ((n =
                          i.gzindex < i.gzhead.comment.length
                            ? 255 & i.gzhead.comment.charCodeAt(i.gzindex++)
                            : 0),
                        g(i, n),
                        0 !== n)
                      );
                      i.gzhead.hcrc &&
                        i.pending > s &&
                        (t.adler = d(t.adler, i.pending_buf, i.pending - s, s)),
                        0 === n && (i.status = 103);
                    } else i.status = 103;
                  if (
                    (103 === i.status &&
                      (i.gzhead.hcrc
                        ? (i.pending + 2 > i.pending_buf_size && m(t),
                          i.pending + 2 <= i.pending_buf_size &&
                            (g(i, 255 & t.adler),
                            g(i, (t.adler >> 8) & 255),
                            (t.adler = 0),
                            (i.status = 113)))
                        : (i.status = 113)),
                    0 !== i.pending)
                  ) {
                    if ((m(t), 0 === t.avail_out))
                      return (i.last_flush = -1), 0;
                  } else if (0 === t.avail_in && p(e) <= p(r) && 4 !== e)
                    return l(t, -5);
                  if (666 === i.status && 0 !== t.avail_in) return l(t, -5);
                  if (
                    0 !== t.avail_in ||
                    0 !== i.lookahead ||
                    (0 !== e && 666 !== i.status)
                  ) {
                    var a =
                      2 === i.strategy
                        ? (function (t, e) {
                            for (var r; ; ) {
                              if (
                                0 === t.lookahead &&
                                (_(t), 0 === t.lookahead)
                              ) {
                                if (0 === e) return 1;
                                break;
                              }
                              if (
                                ((t.match_length = 0),
                                (r = h._tr_tally(t, 0, t.window[t.strstart])),
                                t.lookahead--,
                                t.strstart++,
                                r && (y(t, !1), 0 === t.strm.avail_out))
                              )
                                return 1;
                            }
                            return (
                              (t.insert = 0),
                              4 === e
                                ? (y(t, !0), 0 === t.strm.avail_out ? 3 : 4)
                                : t.last_lit &&
                                    (y(t, !1), 0 === t.strm.avail_out)
                                  ? 1
                                  : 2
                            );
                          })(i, e)
                        : 3 === i.strategy
                          ? (function (t, e) {
                              for (var r, i, s, n, a = t.window; ; ) {
                                if (t.lookahead <= 258) {
                                  if ((_(t), t.lookahead <= 258 && 0 === e))
                                    return 1;
                                  if (0 === t.lookahead) break;
                                }
                                if (
                                  ((t.match_length = 0),
                                  3 <= t.lookahead &&
                                    0 < t.strstart &&
                                    (i = a[(s = t.strstart - 1)]) === a[++s] &&
                                    i === a[++s] &&
                                    i === a[++s])
                                ) {
                                  for (
                                    n = t.strstart + 258;
                                    i === a[++s] &&
                                    i === a[++s] &&
                                    i === a[++s] &&
                                    i === a[++s] &&
                                    i === a[++s] &&
                                    i === a[++s] &&
                                    i === a[++s] &&
                                    i === a[++s] &&
                                    s < n;

                                  );
                                  (t.match_length = 258 - (n - s)),
                                    t.match_length > t.lookahead &&
                                      (t.match_length = t.lookahead);
                                }
                                if (
                                  (3 <= t.match_length
                                    ? ((r = h._tr_tally(
                                        t,
                                        1,
                                        t.match_length - 3
                                      )),
                                      (t.lookahead -= t.match_length),
                                      (t.strstart += t.match_length),
                                      (t.match_length = 0))
                                    : ((r = h._tr_tally(
                                        t,
                                        0,
                                        t.window[t.strstart]
                                      )),
                                      t.lookahead--,
                                      t.strstart++),
                                  r && (y(t, !1), 0 === t.strm.avail_out))
                                )
                                  return 1;
                              }
                              return (
                                (t.insert = 0),
                                4 === e
                                  ? (y(t, !0), 0 === t.strm.avail_out ? 3 : 4)
                                  : t.last_lit &&
                                      (y(t, !1), 0 === t.strm.avail_out)
                                    ? 1
                                    : 2
                              );
                            })(i, e)
                          : o[i.level].func(i, e);
                    if (
                      ((3 !== a && 4 !== a) || (i.status = 666),
                      1 === a || 3 === a)
                    )
                      return 0 === t.avail_out && (i.last_flush = -1), 0;
                    if (
                      2 === a &&
                      (1 === e
                        ? h._tr_align(i)
                        : 5 !== e &&
                          (h._tr_stored_block(i, 0, 0, !1), 3 === e) &&
                          (u(i.head), 0 === i.lookahead) &&
                          ((i.strstart = 0),
                          (i.block_start = 0),
                          (i.insert = 0)),
                      m(t),
                      0 === t.avail_out)
                    )
                      return (i.last_flush = -1), 0;
                  }
                  return 4 !== e ||
                    (!(i.wrap <= 0) &&
                      (2 === i.wrap
                        ? (g(i, 255 & t.adler),
                          g(i, (t.adler >> 8) & 255),
                          g(i, (t.adler >> 16) & 255),
                          g(i, (t.adler >> 24) & 255),
                          g(i, 255 & t.total_in),
                          g(i, (t.total_in >> 8) & 255),
                          g(i, (t.total_in >> 16) & 255),
                          g(i, (t.total_in >> 24) & 255))
                        : (v(i, t.adler >>> 16), v(i, 65535 & t.adler)),
                      m(t),
                      0 < i.wrap && (i.wrap = -i.wrap),
                      0 !== i.pending))
                    ? 0
                    : 1;
                }),
                (r.deflateEnd = function (t) {
                  var e;
                  return t && t.state
                    ? 42 !== (e = t.state.status) &&
                      69 !== e &&
                      73 !== e &&
                      91 !== e &&
                      103 !== e &&
                      113 !== e &&
                      666 !== e
                      ? l(t, -2)
                      : ((t.state = null), 113 === e ? l(t, -3) : 0)
                    : -2;
                }),
                (r.deflateSetDictionary = function (t, e) {
                  var r,
                    i,
                    s,
                    n,
                    a,
                    o,
                    h,
                    l = e.length;
                  if (!t || !t.state) return -2;
                  if (
                    2 === (n = (r = t.state).wrap) ||
                    (1 === n && 42 !== r.status) ||
                    r.lookahead
                  )
                    return -2;
                  for (
                    1 === n && (t.adler = f(t.adler, e, l, 0)),
                      r.wrap = 0,
                      l >= r.w_size &&
                        (0 === n &&
                          (u(r.head),
                          (r.strstart = 0),
                          (r.block_start = 0),
                          (r.insert = 0)),
                        (h = new c.Buf8(r.w_size)),
                        c.arraySet(h, e, l - r.w_size, r.w_size, 0),
                        (e = h),
                        (l = r.w_size)),
                      h = t.avail_in,
                      a = t.next_in,
                      o = t.input,
                      t.avail_in = l,
                      t.next_in = 0,
                      t.input = e,
                      _(r);
                    3 <= r.lookahead;

                  ) {
                    for (
                      i = r.strstart, s = r.lookahead - 2;
                      (r.ins_h =
                        ((r.ins_h << r.hash_shift) ^ r.window[i + 3 - 1]) &
                        r.hash_mask),
                        (r.prev[i & r.w_mask] = r.head[r.ins_h]),
                        (r.head[r.ins_h] = i),
                        i++,
                        --s;

                    );
                    (r.strstart = i), (r.lookahead = 2), _(r);
                  }
                  return (
                    (r.strstart += r.lookahead),
                    (r.block_start = r.strstart),
                    (r.insert = r.lookahead),
                    (r.lookahead = 0),
                    (r.match_length = r.prev_length = 2),
                    (r.match_available = 0),
                    (t.next_in = a),
                    (t.input = o),
                    (t.avail_in = h),
                    (r.wrap = n),
                    0
                  );
                }),
                (r.deflateInfo = 'pako deflate (from Nodeca project)');
            },
            {
              '../utils/common': 41,
              './adler32': 43,
              './crc32': 45,
              './messages': 51,
              './trees': 52,
            },
          ],
          47: [
            function (t, e, r) {
              e.exports = function () {
                (this.text = 0),
                  (this.time = 0),
                  (this.xflags = 0),
                  (this.os = 0),
                  (this.extra = null),
                  (this.extra_len = 0),
                  (this.name = ''),
                  (this.comment = ''),
                  (this.hcrc = 0),
                  (this.done = !1);
              };
            },
            {},
          ],
          48: [
            function (t, e, r) {
              e.exports = function (t, e) {
                var r,
                  i,
                  s,
                  n,
                  a,
                  o,
                  h = t.state,
                  l = t.next_in,
                  p = t.input,
                  c = l + (t.avail_in - 5),
                  f = t.next_out,
                  d = t.output,
                  u = f - (e - t.avail_out),
                  m = f + (t.avail_out - 257),
                  y = h.dmax,
                  g = h.wsize,
                  v = h.whave,
                  _ = h.wnext,
                  b = h.window,
                  S = h.hold,
                  P = h.bits,
                  x = h.lencode,
                  k = h.distcode,
                  E = (1 << h.lenbits) - 1,
                  w = (1 << h.distbits) - 1;
                t: do {
                  for (
                    P < 15 &&
                      ((S += p[l++] << P),
                      (P += 8),
                      (S += p[l++] << P),
                      (P += 8)),
                      r = x[S & E];
                    ;

                  ) {
                    if (
                      ((S >>>= i = r >>> 24),
                      (P -= i),
                      0 == (i = (r >>> 16) & 255))
                    )
                      d[f++] = 65535 & r;
                    else {
                      if (!(16 & i)) {
                        if (0 == (64 & i)) {
                          r = x[(65535 & r) + (S & ((1 << i) - 1))];
                          continue;
                        }
                        if (32 & i) {
                          h.mode = 12;
                          break t;
                        }
                        (t.msg = 'invalid literal/length code'), (h.mode = 30);
                        break t;
                      }
                      for (
                        s = 65535 & r,
                          (i &= 15) &&
                            (P < i && ((S += p[l++] << P), (P += 8)),
                            (s += S & ((1 << i) - 1)),
                            (S >>>= i),
                            (P -= i)),
                          P < 15 &&
                            ((S += p[l++] << P),
                            (P += 8),
                            (S += p[l++] << P),
                            (P += 8)),
                          r = k[S & w];
                        ;

                      ) {
                        if (
                          ((S >>>= i = r >>> 24),
                          (P -= i),
                          !(16 & (i = (r >>> 16) & 255)))
                        ) {
                          if (0 == (64 & i)) {
                            r = k[(65535 & r) + (S & ((1 << i) - 1))];
                            continue;
                          }
                          (t.msg = 'invalid distance code'), (h.mode = 30);
                          break t;
                        }
                        if (
                          ((n = 65535 & r),
                          P < (i &= 15) &&
                            ((S += p[l++] << P), (P += 8) < i) &&
                            ((S += p[l++] << P), (P += 8)),
                          (n += S & ((1 << i) - 1)) > y)
                        ) {
                          (t.msg = 'invalid distance too far back'),
                            (h.mode = 30);
                          break t;
                        }
                        if (((S >>>= i), (P -= i), n > (i = f - u))) {
                          if ((i = n - i) > v && h.sane) {
                            (t.msg = 'invalid distance too far back'),
                              (h.mode = 30);
                            break t;
                          }
                          if (((o = b), (a = 0) === _)) {
                            if (((a += g - i), i < s)) {
                              for (s -= i; (d[f++] = b[a++]), --i; );
                              (a = f - n), (o = d);
                            }
                          } else if (_ < i) {
                            if (((a += g + _ - i), (i -= _) < s)) {
                              for (s -= i; (d[f++] = b[a++]), --i; );
                              if (((a = 0), _ < s)) {
                                for (s -= i = _; (d[f++] = b[a++]), --i; );
                                (a = f - n), (o = d);
                              }
                            }
                          } else if (((a += _ - i), i < s)) {
                            for (s -= i; (d[f++] = b[a++]), --i; );
                            (a = f - n), (o = d);
                          }
                          for (; 2 < s; )
                            (d[f++] = o[a++]),
                              (d[f++] = o[a++]),
                              (d[f++] = o[a++]),
                              (s -= 3);
                          s && ((d[f++] = o[a++]), 1 < s) && (d[f++] = o[a++]);
                        } else {
                          for (
                            a = f - n;
                            (d[f++] = d[a++]),
                              (d[f++] = d[a++]),
                              (d[f++] = d[a++]),
                              2 < (s -= 3);

                          );
                          s && ((d[f++] = d[a++]), 1 < s) && (d[f++] = d[a++]);
                        }
                        break;
                      }
                    }
                    break;
                  }
                } while (l < c && f < m);
                (l -= s = P >> 3),
                  (S &= (1 << (P -= s << 3)) - 1),
                  (t.next_in = l),
                  (t.next_out = f),
                  (t.avail_in = l < c ? c - l + 5 : 5 - (l - c)),
                  (t.avail_out = f < m ? m - f + 257 : 257 - (f - m)),
                  (h.hold = S),
                  (h.bits = P);
              };
            },
            {},
          ],
          49: [
            function (t, e, r) {
              var F = t('../utils/common'),
                M = t('./adler32'),
                D = t('./crc32'),
                R = t('./inffast'),
                z = t('./inftrees');
              function L(t) {
                return (
                  ((t >>> 24) & 255) +
                  ((t >>> 8) & 65280) +
                  ((65280 & t) << 8) +
                  ((255 & t) << 24)
                );
              }
              function i() {
                (this.mode = 0),
                  (this.last = !1),
                  (this.wrap = 0),
                  (this.havedict = !1),
                  (this.flags = 0),
                  (this.dmax = 0),
                  (this.check = 0),
                  (this.total = 0),
                  (this.head = null),
                  (this.wbits = 0),
                  (this.wsize = 0),
                  (this.whave = 0),
                  (this.wnext = 0),
                  (this.window = null),
                  (this.hold = 0),
                  (this.bits = 0),
                  (this.length = 0),
                  (this.offset = 0),
                  (this.extra = 0),
                  (this.lencode = null),
                  (this.distcode = null),
                  (this.lenbits = 0),
                  (this.distbits = 0),
                  (this.ncode = 0),
                  (this.nlen = 0),
                  (this.ndist = 0),
                  (this.have = 0),
                  (this.next = null),
                  (this.lens = new F.Buf16(320)),
                  (this.work = new F.Buf16(288)),
                  (this.lendyn = null),
                  (this.distdyn = null),
                  (this.sane = 0),
                  (this.back = 0),
                  (this.was = 0);
              }
              function s(t) {
                var e;
                return t && t.state
                  ? ((e = t.state),
                    (t.total_in = t.total_out = e.total = 0),
                    (t.msg = ''),
                    e.wrap && (t.adler = 1 & e.wrap),
                    (e.mode = 1),
                    (e.last = 0),
                    (e.havedict = 0),
                    (e.dmax = 32768),
                    (e.head = null),
                    (e.hold = 0),
                    (e.bits = 0),
                    (e.lencode = e.lendyn = new F.Buf32(852)),
                    (e.distcode = e.distdyn = new F.Buf32(592)),
                    (e.sane = 1),
                    (e.back = -1),
                    0)
                  : -2;
              }
              function n(t) {
                var e;
                return t && t.state
                  ? (((e = t.state).wsize = 0),
                    (e.whave = 0),
                    (e.wnext = 0),
                    s(t))
                  : -2;
              }
              function a(t, e) {
                var r, i;
                return !t ||
                  !t.state ||
                  ((i = t.state),
                  e < 0
                    ? ((r = 0), (e = -e))
                    : ((r = 1 + (e >> 4)), e < 48 && (e &= 15)),
                  e && (e < 8 || 15 < e))
                  ? -2
                  : (null !== i.window && i.wbits !== e && (i.window = null),
                    (i.wrap = r),
                    (i.wbits = e),
                    n(t));
              }
              function o(t, e) {
                var r;
                return t
                  ? ((r = new i()),
                    ((t.state = r).window = null),
                    0 !== (r = a(t, e)) && (t.state = null),
                    r)
                  : -2;
              }
              var O,
                N,
                B = !0;
              function V(t, e, r, i) {
                var s,
                  t = t.state;
                return (
                  null === t.window &&
                    ((t.wsize = 1 << t.wbits),
                    (t.wnext = 0),
                    (t.whave = 0),
                    (t.window = new F.Buf8(t.wsize))),
                  i >= t.wsize
                    ? (F.arraySet(t.window, e, r - t.wsize, t.wsize, 0),
                      (t.wnext = 0),
                      (t.whave = t.wsize))
                    : ((s = t.wsize - t.wnext) > i && (s = i),
                      F.arraySet(t.window, e, r - i, s, t.wnext),
                      (i -= s)
                        ? (F.arraySet(t.window, e, r - i, i, 0),
                          (t.wnext = i),
                          (t.whave = t.wsize))
                        : ((t.wnext += s),
                          t.wnext === t.wsize && (t.wnext = 0),
                          t.whave < t.wsize && (t.whave += s))),
                  0
                );
              }
              (r.inflateReset = n),
                (r.inflateReset2 = a),
                (r.inflateResetKeep = s),
                (r.inflateInit = function (t) {
                  return o(t, 15);
                }),
                (r.inflateInit2 = o),
                (r.inflate = function (t, e) {
                  var r,
                    i,
                    s,
                    n,
                    a,
                    o,
                    h,
                    l,
                    p,
                    c,
                    f,
                    d,
                    u,
                    m,
                    y,
                    g,
                    v,
                    _,
                    b,
                    S,
                    P,
                    x,
                    k,
                    E,
                    w = 0,
                    A = new F.Buf8(4),
                    T = [
                      16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14,
                      1, 15,
                    ];
                  if (
                    !t ||
                    !t.state ||
                    !t.output ||
                    (!t.input && 0 !== t.avail_in)
                  )
                    return -2;
                  12 === (r = t.state).mode && (r.mode = 13),
                    (a = t.next_out),
                    (s = t.output),
                    (h = t.avail_out),
                    (n = t.next_in),
                    (i = t.input),
                    (o = t.avail_in),
                    (l = r.hold),
                    (p = r.bits),
                    (c = o),
                    (f = h),
                    (x = 0);
                  t: for (;;)
                    switch (r.mode) {
                      case 1:
                        if (0 === r.wrap) r.mode = 13;
                        else {
                          for (; p < 16; ) {
                            if (0 === o) break t;
                            o--, (l += i[n++] << p), (p += 8);
                          }
                          if (2 & r.wrap && 35615 === l)
                            (A[(r.check = 0)] = 255 & l),
                              (A[1] = (l >>> 8) & 255),
                              (r.check = D(r.check, A, 2, 0)),
                              (p = l = 0),
                              (r.mode = 2);
                          else if (
                            ((r.flags = 0),
                            r.head && (r.head.done = !1),
                            !(1 & r.wrap) || (((255 & l) << 8) + (l >> 8)) % 31)
                          )
                            (t.msg = 'incorrect header check'), (r.mode = 30);
                          else if (8 != (15 & l))
                            (t.msg = 'unknown compression method'),
                              (r.mode = 30);
                          else {
                            if (
                              ((p -= 4),
                              (P = 8 + (15 & (l >>>= 4))),
                              0 === r.wbits)
                            )
                              r.wbits = P;
                            else if (P > r.wbits) {
                              (t.msg = 'invalid window size'), (r.mode = 30);
                              break;
                            }
                            (r.dmax = 1 << P),
                              (t.adler = r.check = 1),
                              (r.mode = 512 & l ? 10 : 12),
                              (p = l = 0);
                          }
                        }
                        break;
                      case 2:
                        for (; p < 16; ) {
                          if (0 === o) break t;
                          o--, (l += i[n++] << p), (p += 8);
                        }
                        if (((r.flags = l), 8 != (255 & r.flags))) {
                          (t.msg = 'unknown compression method'), (r.mode = 30);
                          break;
                        }
                        if (57344 & r.flags) {
                          (t.msg = 'unknown header flags set'), (r.mode = 30);
                          break;
                        }
                        r.head && (r.head.text = (l >> 8) & 1),
                          512 & r.flags &&
                            ((A[0] = 255 & l),
                            (A[1] = (l >>> 8) & 255),
                            (r.check = D(r.check, A, 2, 0))),
                          (p = l = 0),
                          (r.mode = 3);
                      case 3:
                        for (; p < 32; ) {
                          if (0 === o) break t;
                          o--, (l += i[n++] << p), (p += 8);
                        }
                        r.head && (r.head.time = l),
                          512 & r.flags &&
                            ((A[0] = 255 & l),
                            (A[1] = (l >>> 8) & 255),
                            (A[2] = (l >>> 16) & 255),
                            (A[3] = (l >>> 24) & 255),
                            (r.check = D(r.check, A, 4, 0))),
                          (p = l = 0),
                          (r.mode = 4);
                      case 4:
                        for (; p < 16; ) {
                          if (0 === o) break t;
                          o--, (l += i[n++] << p), (p += 8);
                        }
                        r.head &&
                          ((r.head.xflags = 255 & l), (r.head.os = l >> 8)),
                          512 & r.flags &&
                            ((A[0] = 255 & l),
                            (A[1] = (l >>> 8) & 255),
                            (r.check = D(r.check, A, 2, 0))),
                          (p = l = 0),
                          (r.mode = 5);
                      case 5:
                        if (1024 & r.flags) {
                          for (; p < 16; ) {
                            if (0 === o) break t;
                            o--, (l += i[n++] << p), (p += 8);
                          }
                          (r.length = l),
                            r.head && (r.head.extra_len = l),
                            512 & r.flags &&
                              ((A[0] = 255 & l),
                              (A[1] = (l >>> 8) & 255),
                              (r.check = D(r.check, A, 2, 0))),
                            (p = l = 0);
                        } else r.head && (r.head.extra = null);
                        r.mode = 6;
                      case 6:
                        if (
                          1024 & r.flags &&
                          ((d = (d = r.length) > o ? o : d) &&
                            (r.head &&
                              ((P = r.head.extra_len - r.length),
                              r.head.extra ||
                                (r.head.extra = new Array(r.head.extra_len)),
                              F.arraySet(r.head.extra, i, n, d, P)),
                            512 & r.flags && (r.check = D(r.check, i, d, n)),
                            (o -= d),
                            (n += d),
                            (r.length -= d)),
                          r.length)
                        )
                          break t;
                        (r.length = 0), (r.mode = 7);
                      case 7:
                        if (2048 & r.flags) {
                          if (0 === o) break t;
                          for (
                            d = 0;
                            (P = i[n + d++]),
                              r.head &&
                                P &&
                                r.length < 65536 &&
                                (r.head.name += String.fromCharCode(P)),
                              P && d < o;

                          );
                          if (
                            (512 & r.flags && (r.check = D(r.check, i, d, n)),
                            (o -= d),
                            (n += d),
                            P)
                          )
                            break t;
                        } else r.head && (r.head.name = null);
                        (r.length = 0), (r.mode = 8);
                      case 8:
                        if (4096 & r.flags) {
                          if (0 === o) break t;
                          for (
                            d = 0;
                            (P = i[n + d++]),
                              r.head &&
                                P &&
                                r.length < 65536 &&
                                (r.head.comment += String.fromCharCode(P)),
                              P && d < o;

                          );
                          if (
                            (512 & r.flags && (r.check = D(r.check, i, d, n)),
                            (o -= d),
                            (n += d),
                            P)
                          )
                            break t;
                        } else r.head && (r.head.comment = null);
                        r.mode = 9;
                      case 9:
                        if (512 & r.flags) {
                          for (; p < 16; ) {
                            if (0 === o) break t;
                            o--, (l += i[n++] << p), (p += 8);
                          }
                          if (l !== (65535 & r.check)) {
                            (t.msg = 'header crc mismatch'), (r.mode = 30);
                            break;
                          }
                          p = l = 0;
                        }
                        r.head &&
                          ((r.head.hcrc = (r.flags >> 9) & 1),
                          (r.head.done = !0)),
                          (t.adler = r.check = 0),
                          (r.mode = 12);
                        break;
                      case 10:
                        for (; p < 32; ) {
                          if (0 === o) break t;
                          o--, (l += i[n++] << p), (p += 8);
                        }
                        (t.adler = r.check = L(l)), (p = l = 0), (r.mode = 11);
                      case 11:
                        if (0 === r.havedict)
                          return (
                            (t.next_out = a),
                            (t.avail_out = h),
                            (t.next_in = n),
                            (t.avail_in = o),
                            (r.hold = l),
                            (r.bits = p),
                            2
                          );
                        (t.adler = r.check = 1), (r.mode = 12);
                      case 12:
                        if (5 === e || 6 === e) break t;
                      case 13:
                        if (r.last) (l >>>= 7 & p), (p -= 7 & p), (r.mode = 27);
                        else {
                          for (; p < 3; ) {
                            if (0 === o) break t;
                            o--, (l += i[n++] << p), (p += 8);
                          }
                          switch (((r.last = 1 & l), --p, 3 & (l >>>= 1))) {
                            case 0:
                              r.mode = 14;
                              break;
                            case 1:
                              C = I = void 0;
                              var C,
                                I = r;
                              if (B) {
                                for (
                                  O = new F.Buf32(512),
                                    N = new F.Buf32(32),
                                    C = 0;
                                  C < 144;

                                )
                                  I.lens[C++] = 8;
                                for (; C < 256; ) I.lens[C++] = 9;
                                for (; C < 280; ) I.lens[C++] = 7;
                                for (; C < 288; ) I.lens[C++] = 8;
                                for (
                                  z(1, I.lens, 0, 288, O, 0, I.work, {
                                    bits: 9,
                                  }),
                                    C = 0;
                                  C < 32;

                                )
                                  I.lens[C++] = 5;
                                z(2, I.lens, 0, 32, N, 0, I.work, { bits: 5 }),
                                  (B = !1);
                              }
                              if (
                                ((I.lencode = O),
                                (I.lenbits = 9),
                                (I.distcode = N),
                                (I.distbits = 5),
                                (r.mode = 20),
                                6 !== e)
                              )
                                break;
                              (l >>>= 2), (p -= 2);
                              break t;
                            case 2:
                              r.mode = 17;
                              break;
                            case 3:
                              (t.msg = 'invalid block type'), (r.mode = 30);
                          }
                          (l >>>= 2), (p -= 2);
                        }
                        break;
                      case 14:
                        for (l >>>= 7 & p, p -= 7 & p; p < 32; ) {
                          if (0 === o) break t;
                          o--, (l += i[n++] << p), (p += 8);
                        }
                        if ((65535 & l) != ((l >>> 16) ^ 65535)) {
                          (t.msg = 'invalid stored block lengths'),
                            (r.mode = 30);
                          break;
                        }
                        if (
                          ((r.length = 65535 & l),
                          (p = l = 0),
                          (r.mode = 15),
                          6 === e)
                        )
                          break t;
                      case 15:
                        r.mode = 16;
                      case 16:
                        if ((d = r.length)) {
                          if (0 === (d = h < (d = o < d ? o : d) ? h : d))
                            break t;
                          F.arraySet(s, i, n, d, a),
                            (o -= d),
                            (n += d),
                            (h -= d),
                            (a += d),
                            (r.length -= d);
                        } else r.mode = 12;
                        break;
                      case 17:
                        for (; p < 14; ) {
                          if (0 === o) break t;
                          o--, (l += i[n++] << p), (p += 8);
                        }
                        if (
                          ((r.nlen = 257 + (31 & l)),
                          (l >>>= 5),
                          (p -= 5),
                          (r.ndist = 1 + (31 & l)),
                          (l >>>= 5),
                          (p -= 5),
                          (r.ncode = 4 + (15 & l)),
                          (l >>>= 4),
                          (p -= 4),
                          286 < r.nlen || 30 < r.ndist)
                        ) {
                          (t.msg = 'too many length or distance symbols'),
                            (r.mode = 30);
                          break;
                        }
                        (r.have = 0), (r.mode = 18);
                      case 18:
                        for (; r.have < r.ncode; ) {
                          for (; p < 3; ) {
                            if (0 === o) break t;
                            o--, (l += i[n++] << p), (p += 8);
                          }
                          (r.lens[T[r.have++]] = 7 & l), (l >>>= 3), (p -= 3);
                        }
                        for (; r.have < 19; ) r.lens[T[r.have++]] = 0;
                        if (
                          ((r.lencode = r.lendyn),
                          (r.lenbits = 7),
                          (k = { bits: r.lenbits }),
                          (x = z(0, r.lens, 0, 19, r.lencode, 0, r.work, k)),
                          (r.lenbits = k.bits),
                          x)
                        ) {
                          (t.msg = 'invalid code lengths set'), (r.mode = 30);
                          break;
                        }
                        (r.have = 0), (r.mode = 19);
                      case 19:
                        for (; r.have < r.nlen + r.ndist; ) {
                          for (
                            ;
                            (g =
                              ((w = r.lencode[l & ((1 << r.lenbits) - 1)]) >>>
                                16) &
                              255),
                              (v = 65535 & w),
                              !((y = w >>> 24) <= p);

                          ) {
                            if (0 === o) break t;
                            o--, (l += i[n++] << p), (p += 8);
                          }
                          if (v < 16)
                            (l >>>= y), (p -= y), (r.lens[r.have++] = v);
                          else {
                            if (16 === v) {
                              for (E = y + 2; p < E; ) {
                                if (0 === o) break t;
                                o--, (l += i[n++] << p), (p += 8);
                              }
                              if (((l >>>= y), (p -= y), 0 === r.have)) {
                                (t.msg = 'invalid bit length repeat'),
                                  (r.mode = 30);
                                break;
                              }
                              (P = r.lens[r.have - 1]),
                                (d = 3 + (3 & l)),
                                (l >>>= 2),
                                (p -= 2);
                            } else if (17 === v) {
                              for (E = y + 3; p < E; ) {
                                if (0 === o) break t;
                                o--, (l += i[n++] << p), (p += 8);
                              }
                              (P = 0),
                                (d = 3 + (7 & (l >>>= y))),
                                (l >>>= 3),
                                (p = p - y - 3);
                            } else {
                              for (E = y + 7; p < E; ) {
                                if (0 === o) break t;
                                o--, (l += i[n++] << p), (p += 8);
                              }
                              (P = 0),
                                (d = 11 + (127 & (l >>>= y))),
                                (l >>>= 7),
                                (p = p - y - 7);
                            }
                            if (r.have + d > r.nlen + r.ndist) {
                              (t.msg = 'invalid bit length repeat'),
                                (r.mode = 30);
                              break;
                            }
                            for (; d--; ) r.lens[r.have++] = P;
                          }
                        }
                        if (30 === r.mode) break;
                        if (0 === r.lens[256]) {
                          (t.msg = 'invalid code -- missing end-of-block'),
                            (r.mode = 30);
                          break;
                        }
                        if (
                          ((r.lenbits = 9),
                          (k = { bits: r.lenbits }),
                          (x = z(
                            1,
                            r.lens,
                            0,
                            r.nlen,
                            r.lencode,
                            0,
                            r.work,
                            k
                          )),
                          (r.lenbits = k.bits),
                          x)
                        ) {
                          (t.msg = 'invalid literal/lengths set'),
                            (r.mode = 30);
                          break;
                        }
                        if (
                          ((r.distbits = 6),
                          (r.distcode = r.distdyn),
                          (k = { bits: r.distbits }),
                          (x = z(
                            2,
                            r.lens,
                            r.nlen,
                            r.ndist,
                            r.distcode,
                            0,
                            r.work,
                            k
                          )),
                          (r.distbits = k.bits),
                          x)
                        ) {
                          (t.msg = 'invalid distances set'), (r.mode = 30);
                          break;
                        }
                        if (((r.mode = 20), 6 === e)) break t;
                      case 20:
                        r.mode = 21;
                      case 21:
                        if (6 <= o && 258 <= h) {
                          (t.next_out = a),
                            (t.avail_out = h),
                            (t.next_in = n),
                            (t.avail_in = o),
                            (r.hold = l),
                            (r.bits = p),
                            R(t, f),
                            (a = t.next_out),
                            (s = t.output),
                            (h = t.avail_out),
                            (n = t.next_in),
                            (i = t.input),
                            (o = t.avail_in),
                            (l = r.hold),
                            (p = r.bits),
                            12 === r.mode && (r.back = -1);
                          break;
                        }
                        for (
                          r.back = 0;
                          (g =
                            ((w = r.lencode[l & ((1 << r.lenbits) - 1)]) >>>
                              16) &
                            255),
                            (v = 65535 & w),
                            !((y = w >>> 24) <= p);

                        ) {
                          if (0 === o) break t;
                          o--, (l += i[n++] << p), (p += 8);
                        }
                        if (g && 0 == (240 & g)) {
                          for (
                            _ = y, b = g, S = v;
                            (g =
                              ((w =
                                r.lencode[
                                  S + ((l & ((1 << (_ + b)) - 1)) >> _)
                                ]) >>>
                                16) &
                              255),
                              (v = 65535 & w),
                              !(_ + (y = w >>> 24) <= p);

                          ) {
                            if (0 === o) break t;
                            o--, (l += i[n++] << p), (p += 8);
                          }
                          (l >>>= _), (p -= _), (r.back += _);
                        }
                        if (
                          ((l >>>= y),
                          (p -= y),
                          (r.back += y),
                          (r.length = v),
                          0 === g)
                        ) {
                          r.mode = 26;
                          break;
                        }
                        if (32 & g) {
                          (r.back = -1), (r.mode = 12);
                          break;
                        }
                        if (64 & g) {
                          (t.msg = 'invalid literal/length code'),
                            (r.mode = 30);
                          break;
                        }
                        (r.extra = 15 & g), (r.mode = 22);
                      case 22:
                        if (r.extra) {
                          for (E = r.extra; p < E; ) {
                            if (0 === o) break t;
                            o--, (l += i[n++] << p), (p += 8);
                          }
                          (r.length += l & ((1 << r.extra) - 1)),
                            (l >>>= r.extra),
                            (p -= r.extra),
                            (r.back += r.extra);
                        }
                        (r.was = r.length), (r.mode = 23);
                      case 23:
                        for (
                          ;
                          (g =
                            ((w = r.distcode[l & ((1 << r.distbits) - 1)]) >>>
                              16) &
                            255),
                            (v = 65535 & w),
                            !((y = w >>> 24) <= p);

                        ) {
                          if (0 === o) break t;
                          o--, (l += i[n++] << p), (p += 8);
                        }
                        if (0 == (240 & g)) {
                          for (
                            _ = y, b = g, S = v;
                            (g =
                              ((w =
                                r.distcode[
                                  S + ((l & ((1 << (_ + b)) - 1)) >> _)
                                ]) >>>
                                16) &
                              255),
                              (v = 65535 & w),
                              !(_ + (y = w >>> 24) <= p);

                          ) {
                            if (0 === o) break t;
                            o--, (l += i[n++] << p), (p += 8);
                          }
                          (l >>>= _), (p -= _), (r.back += _);
                        }
                        if (((l >>>= y), (p -= y), (r.back += y), 64 & g)) {
                          (t.msg = 'invalid distance code'), (r.mode = 30);
                          break;
                        }
                        (r.offset = v), (r.extra = 15 & g), (r.mode = 24);
                      case 24:
                        if (r.extra) {
                          for (E = r.extra; p < E; ) {
                            if (0 === o) break t;
                            o--, (l += i[n++] << p), (p += 8);
                          }
                          (r.offset += l & ((1 << r.extra) - 1)),
                            (l >>>= r.extra),
                            (p -= r.extra),
                            (r.back += r.extra);
                        }
                        if (r.offset > r.dmax) {
                          (t.msg = 'invalid distance too far back'),
                            (r.mode = 30);
                          break;
                        }
                        r.mode = 25;
                      case 25:
                        if (0 === h) break t;
                        if (r.offset > (d = f - h)) {
                          if ((d = r.offset - d) > r.whave && r.sane) {
                            (t.msg = 'invalid distance too far back'),
                              (r.mode = 30);
                            break;
                          }
                          (u =
                            d > r.wnext
                              ? ((d -= r.wnext), r.wsize - d)
                              : r.wnext - d),
                            d > r.length && (d = r.length),
                            (m = r.window);
                        } else (m = s), (u = a - r.offset), (d = r.length);
                        for (
                          h -= d = h < d ? h : d, r.length -= d;
                          (s[a++] = m[u++]), --d;

                        );
                        0 === r.length && (r.mode = 21);
                        break;
                      case 26:
                        if (0 === h) break t;
                        (s[a++] = r.length), h--, (r.mode = 21);
                        break;
                      case 27:
                        if (r.wrap) {
                          for (; p < 32; ) {
                            if (0 === o) break t;
                            o--, (l |= i[n++] << p), (p += 8);
                          }
                          if (
                            ((f -= h),
                            (t.total_out += f),
                            (r.total += f),
                            f &&
                              (t.adler = r.check =
                                (r.flags ? D : M)(r.check, s, f, a - f)),
                            (f = h),
                            (r.flags ? l : L(l)) !== r.check)
                          ) {
                            (t.msg = 'incorrect data check'), (r.mode = 30);
                            break;
                          }
                          p = l = 0;
                        }
                        r.mode = 28;
                      case 28:
                        if (r.wrap && r.flags) {
                          for (; p < 32; ) {
                            if (0 === o) break t;
                            o--, (l += i[n++] << p), (p += 8);
                          }
                          if (l !== (4294967295 & r.total)) {
                            (t.msg = 'incorrect length check'), (r.mode = 30);
                            break;
                          }
                          p = l = 0;
                        }
                        r.mode = 29;
                      case 29:
                        x = 1;
                        break t;
                      case 30:
                        x = -3;
                        break t;
                      case 31:
                        return -4;
                      default:
                        return -2;
                    }
                  return (
                    (t.next_out = a),
                    (t.avail_out = h),
                    (t.next_in = n),
                    (t.avail_in = o),
                    (r.hold = l),
                    (r.bits = p),
                    (r.wsize ||
                      (f !== t.avail_out &&
                        r.mode < 30 &&
                        (r.mode < 27 || 4 !== e))) &&
                      V(t, t.output, t.next_out, f - t.avail_out),
                    (c -= t.avail_in),
                    (f -= t.avail_out),
                    (t.total_in += c),
                    (t.total_out += f),
                    (r.total += f),
                    r.wrap &&
                      f &&
                      (t.adler = r.check =
                        (r.flags ? D : M)(r.check, s, f, t.next_out - f)),
                    (t.data_type =
                      r.bits +
                      (r.last ? 64 : 0) +
                      (12 === r.mode ? 128 : 0) +
                      (20 === r.mode || 15 === r.mode ? 256 : 0)),
                    (x = ((0 == c && 0 === f) || 4 === e) && 0 === x ? -5 : x)
                  );
                }),
                (r.inflateEnd = function (t) {
                  var e;
                  return t && t.state
                    ? ((e = t.state).window && (e.window = null),
                      (t.state = null),
                      0)
                    : -2;
                }),
                (r.inflateGetHeader = function (t, e) {
                  return !t || !t.state || 0 == (2 & (t = t.state).wrap)
                    ? -2
                    : (((t.head = e).done = !1), 0);
                }),
                (r.inflateSetDictionary = function (t, e) {
                  var r,
                    i = e.length;
                  return !t ||
                    !t.state ||
                    (0 !== (r = t.state).wrap && 11 !== r.mode)
                    ? -2
                    : 11 === r.mode && M(1, e, i, 0) !== r.check
                      ? -3
                      : V(t, e, i, i)
                        ? ((r.mode = 31), -4)
                        : ((r.havedict = 1), 0);
                }),
                (r.inflateInfo = 'pako inflate (from Nodeca project)');
            },
            {
              '../utils/common': 41,
              './adler32': 43,
              './crc32': 45,
              './inffast': 48,
              './inftrees': 50,
            },
          ],
          50: [
            function (t, e, r) {
              var R = t('../utils/common'),
                z = [
                  3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35,
                  43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0,
                ],
                L = [
                  16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18,
                  18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72,
                  78,
                ],
                O = [
                  1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193,
                  257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193,
                  12289, 16385, 24577, 0, 0,
                ],
                N = [
                  16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22,
                  22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29,
                  64, 64,
                ];
              e.exports = function (t, e, r, i, s, n, a, o) {
                for (
                  var h,
                    l,
                    p,
                    c,
                    f,
                    d,
                    u,
                    m,
                    y,
                    g = o.bits,
                    v = 0,
                    _ = 0,
                    b = 0,
                    S = 0,
                    P = 0,
                    x = 0,
                    k = 0,
                    E = 0,
                    w = 0,
                    A = 0,
                    T = null,
                    C = 0,
                    I = new R.Buf16(16),
                    F = new R.Buf16(16),
                    M = null,
                    D = 0,
                    v = 0;
                  v <= 15;
                  v++
                )
                  I[v] = 0;
                for (_ = 0; _ < i; _++) I[e[r + _]]++;
                for (P = g, S = 15; 1 <= S && 0 === I[S]; S--);
                if ((S < P && (P = S), 0 === S))
                  (s[n++] = 20971520), (s[n++] = 20971520), (o.bits = 1);
                else {
                  for (b = 1; b < S && 0 === I[b]; b++);
                  for (P < b && (P = b), v = E = 1; v <= 15; v++)
                    if ((E = (E << 1) - I[v]) < 0) return -1;
                  if (0 < E && (0 === t || 1 !== S)) return -1;
                  for (F[1] = 0, v = 1; v < 15; v++) F[v + 1] = F[v] + I[v];
                  for (_ = 0; _ < i; _++)
                    0 !== e[r + _] && (a[F[e[r + _]]++] = _);
                  if (
                    ((d =
                      0 === t
                        ? ((T = M = a), 19)
                        : 1 === t
                          ? ((T = z), (C -= 257), (M = L), (D -= 257), 256)
                          : ((T = O), (M = N), -1)),
                    (v = b),
                    (f = n),
                    (k = _ = A = 0),
                    (p = -1),
                    (c = (w = 1 << (x = P)) - 1),
                    (1 === t && 852 < w) || (2 === t && 592 < w))
                  )
                    return 1;
                  for (;;) {
                    for (
                      y =
                        a[_] < d
                          ? ((m = 0), a[_])
                          : a[_] > d
                            ? ((m = M[D + a[_]]), T[C + a[_]])
                            : ((m = 96), 0),
                        h = 1 << (u = v - k),
                        b = l = 1 << x;
                      (s[f + (A >> k) + (l -= h)] =
                        (u << 24) | (m << 16) | y | 0),
                        0 !== l;

                    );
                    for (h = 1 << (v - 1); A & h; ) h >>= 1;
                    if (
                      (0 !== h ? (A = (A & (h - 1)) + h) : (A = 0),
                      _++,
                      0 == --I[v])
                    ) {
                      if (v === S) break;
                      v = e[r + a[_]];
                    }
                    if (P < v && (A & c) !== p) {
                      for (
                        f += b, E = 1 << (x = v - (k = 0 === k ? P : k));
                        x + k < S && !((E -= I[x + k]) <= 0);

                      )
                        x++, (E <<= 1);
                      if (
                        ((w += 1 << x),
                        (1 === t && 852 < w) || (2 === t && 592 < w))
                      )
                        return 1;
                      s[(p = A & c)] = (P << 24) | (x << 16) | (f - n) | 0;
                    }
                  }
                  0 !== A && (s[f + A] = ((v - k) << 24) | (64 << 16) | 0),
                    (o.bits = P);
                }
                return 0;
              };
            },
            { '../utils/common': 41 },
          ],
          51: [
            function (t, e, r) {
              e.exports = {
                2: 'need dictionary',
                1: 'stream end',
                0: '',
                '-1': 'file error',
                '-2': 'stream error',
                '-3': 'data error',
                '-4': 'insufficient memory',
                '-5': 'buffer error',
                '-6': 'incompatible version',
              };
            },
            {},
          ],
          52: [
            function (t, i, e) {
              var s = t('../utils/common');
              function r(t) {
                for (var e = t.length; 0 <= --e; ) t[e] = 0;
              }
              var h = [
                  0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4,
                  4, 4, 4, 5, 5, 5, 5, 0,
                ],
                l = [
                  0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9,
                  9, 10, 10, 11, 11, 12, 12, 13, 13,
                ],
                o = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7],
                p = [
                  16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1,
                  15,
                ],
                c = new Array(576),
                f = (r(c), new Array(60)),
                d = (r(f), new Array(512)),
                u = (r(d), new Array(256)),
                m = (r(u), new Array(29));
              r(m);
              var y,
                g,
                v,
                _ = new Array(30);
              function b(t, e, r, i, s) {
                (this.static_tree = t),
                  (this.extra_bits = e),
                  (this.extra_base = r),
                  (this.elems = i),
                  (this.max_length = s),
                  (this.has_stree = t && t.length);
              }
              function S(t, e) {
                (this.dyn_tree = t), (this.max_code = 0), (this.stat_desc = e);
              }
              function P(t) {
                return t < 256 ? d[t] : d[256 + (t >>> 7)];
              }
              function n(t, e) {
                (t.pending_buf[t.pending++] = 255 & e),
                  (t.pending_buf[t.pending++] = (e >>> 8) & 255);
              }
              function x(t, e, r) {
                t.bi_valid > 16 - r
                  ? ((t.bi_buf |= (e << t.bi_valid) & 65535),
                    n(t, t.bi_buf),
                    (t.bi_buf = e >> (16 - t.bi_valid)),
                    (t.bi_valid += r - 16))
                  : ((t.bi_buf |= (e << t.bi_valid) & 65535),
                    (t.bi_valid += r));
              }
              function k(t, e, r) {
                x(t, r[2 * e], r[2 * e + 1]);
              }
              function E(t, e) {
                for (var r = 0; (r |= 1 & t), (t >>>= 1), (r <<= 1), 0 < --e; );
                return r >>> 1;
              }
              function w(t, e, r) {
                for (var i, s = new Array(16), n = 0, a = 1; a <= 15; a++)
                  s[a] = n = (n + r[a - 1]) << 1;
                for (i = 0; i <= e; i++) {
                  var o = t[2 * i + 1];
                  0 !== o && (t[2 * i] = E(s[o]++, o));
                }
              }
              function A(t) {
                for (var e = 0; e < 286; e++) t.dyn_ltree[2 * e] = 0;
                for (e = 0; e < 30; e++) t.dyn_dtree[2 * e] = 0;
                for (e = 0; e < 19; e++) t.bl_tree[2 * e] = 0;
                (t.dyn_ltree[512] = 1),
                  (t.opt_len = t.static_len = 0),
                  (t.last_lit = t.matches = 0);
              }
              function T(t) {
                8 < t.bi_valid
                  ? n(t, t.bi_buf)
                  : 0 < t.bi_valid && (t.pending_buf[t.pending++] = t.bi_buf),
                  (t.bi_buf = 0),
                  (t.bi_valid = 0);
              }
              function a(t, e, r, i) {
                var s = 2 * e,
                  n = 2 * r;
                return t[s] < t[n] || (t[s] === t[n] && i[e] <= i[r]);
              }
              function C(t, e, r) {
                for (
                  var i = t.heap[r], s = r << 1;
                  s <= t.heap_len &&
                  (s < t.heap_len &&
                    a(e, t.heap[s + 1], t.heap[s], t.depth) &&
                    s++,
                  !a(e, i, t.heap[s], t.depth));

                )
                  (t.heap[r] = t.heap[s]), (r = s), (s <<= 1);
                t.heap[r] = i;
              }
              function I(t, e, r) {
                var i,
                  s,
                  n,
                  a,
                  o = 0;
                if (0 !== t.last_lit)
                  for (
                    ;
                    (i =
                      (t.pending_buf[t.d_buf + 2 * o] << 8) |
                      t.pending_buf[t.d_buf + 2 * o + 1]),
                      (s = t.pending_buf[t.l_buf + o]),
                      o++,
                      0 == i
                        ? k(t, s, e)
                        : (k(t, (n = u[s]) + 256 + 1, e),
                          0 !== (a = h[n]) && x(t, (s -= m[n]), a),
                          k(t, (n = P(--i)), r),
                          0 !== (a = l[n]) && x(t, (i -= _[n]), a)),
                      o < t.last_lit;

                  );
                k(t, 256, e);
              }
              function F(t, e) {
                var r,
                  i,
                  s,
                  n = e.dyn_tree,
                  a = e.stat_desc.static_tree,
                  o = e.stat_desc.has_stree,
                  h = e.stat_desc.elems,
                  l = -1;
                for (t.heap_len = 0, t.heap_max = 573, r = 0; r < h; r++)
                  0 !== n[2 * r]
                    ? ((t.heap[++t.heap_len] = l = r), (t.depth[r] = 0))
                    : (n[2 * r + 1] = 0);
                for (; t.heap_len < 2; )
                  (n[2 * (s = t.heap[++t.heap_len] = l < 2 ? ++l : 0)] = 1),
                    (t.depth[s] = 0),
                    t.opt_len--,
                    o && (t.static_len -= a[2 * s + 1]);
                for (e.max_code = l, r = t.heap_len >> 1; 1 <= r; r--)
                  C(t, n, r);
                for (
                  s = h;
                  (r = t.heap[1]),
                    (t.heap[1] = t.heap[t.heap_len--]),
                    C(t, n, 1),
                    (i = t.heap[1]),
                    (t.heap[--t.heap_max] = r),
                    (t.heap[--t.heap_max] = i),
                    (n[2 * s] = n[2 * r] + n[2 * i]),
                    (t.depth[s] =
                      (t.depth[r] >= t.depth[i] ? t.depth[r] : t.depth[i]) + 1),
                    (n[2 * r + 1] = n[2 * i + 1] = s),
                    (t.heap[1] = s++),
                    C(t, n, 1),
                    2 <= t.heap_len;

                );
                t.heap[--t.heap_max] = t.heap[1];
                for (
                  var p,
                    c,
                    f,
                    d,
                    u,
                    m = t,
                    y = e.dyn_tree,
                    g = e.max_code,
                    v = e.stat_desc.static_tree,
                    _ = e.stat_desc.has_stree,
                    b = e.stat_desc.extra_bits,
                    S = e.stat_desc.extra_base,
                    P = e.stat_desc.max_length,
                    x = 0,
                    k = 0;
                  k <= 15;
                  k++
                )
                  m.bl_count[k] = 0;
                for (
                  y[2 * m.heap[m.heap_max] + 1] = 0, p = m.heap_max + 1;
                  p < 573;
                  p++
                )
                  (k = y[2 * y[2 * (c = m.heap[p]) + 1] + 1] + 1) > P &&
                    ((k = P), x++),
                    (y[2 * c + 1] = k),
                    g < c ||
                      (m.bl_count[k]++,
                      (d = 0),
                      S <= c && (d = b[c - S]),
                      (u = y[2 * c]),
                      (m.opt_len += u * (k + d)),
                      _ && (m.static_len += u * (v[2 * c + 1] + d)));
                if (0 !== x) {
                  do {
                    for (k = P - 1; 0 === m.bl_count[k]; ) k--;
                  } while (
                    (m.bl_count[k]--,
                    (m.bl_count[k + 1] += 2),
                    m.bl_count[P]--,
                    0 < (x -= 2))
                  );
                  for (k = P; 0 !== k; k--)
                    for (c = m.bl_count[k]; 0 !== c; )
                      (f = m.heap[--p]) > g ||
                        (y[2 * f + 1] !== k &&
                          ((m.opt_len += (k - y[2 * f + 1]) * y[2 * f]),
                          (y[2 * f + 1] = k)),
                        c--);
                }
                w(n, l, t.bl_count);
              }
              function M(t, e, r) {
                var i,
                  s,
                  n = -1,
                  a = e[1],
                  o = 0,
                  h = 7,
                  l = 4;
                for (
                  0 === a && ((h = 138), (l = 3)),
                    e[2 * (r + 1) + 1] = 65535,
                    i = 0;
                  i <= r;
                  i++
                )
                  (s = a),
                    (a = e[2 * (i + 1) + 1]),
                    (++o < h && s === a) ||
                      (o < l
                        ? (t.bl_tree[2 * s] += o)
                        : 0 !== s
                          ? (s !== n && t.bl_tree[2 * s]++, t.bl_tree[32]++)
                          : o <= 10
                            ? t.bl_tree[34]++
                            : t.bl_tree[36]++,
                      (n = s),
                      (l =
                        (o = 0) === a
                          ? ((h = 138), 3)
                          : s === a
                            ? ((h = 6), 3)
                            : ((h = 7), 4)));
              }
              function D(t, e, r) {
                var i,
                  s,
                  n = -1,
                  a = e[1],
                  o = 0,
                  h = 7,
                  l = 4;
                for (0 === a && ((h = 138), (l = 3)), i = 0; i <= r; i++)
                  if (
                    ((s = a), (a = e[2 * (i + 1) + 1]), !(++o < h && s === a))
                  ) {
                    if (o < l) for (; k(t, s, t.bl_tree), 0 != --o; );
                    else
                      0 !== s
                        ? (s !== n && (k(t, s, t.bl_tree), o--),
                          k(t, 16, t.bl_tree),
                          x(t, o - 3, 2))
                        : o <= 10
                          ? (k(t, 17, t.bl_tree), x(t, o - 3, 3))
                          : (k(t, 18, t.bl_tree), x(t, o - 11, 7));
                    (n = s),
                      (l =
                        (o = 0) === a
                          ? ((h = 138), 3)
                          : s === a
                            ? ((h = 6), 3)
                            : ((h = 7), 4));
                  }
              }
              r(_);
              var R = !1;
              function z(t, e, r, i) {
                x(t, 0 + (i ? 1 : 0), 3),
                  (i = e),
                  (e = r),
                  T((r = t)),
                  n(r, e),
                  n(r, ~e),
                  s.arraySet(r.pending_buf, r.window, i, e, r.pending),
                  (r.pending += e);
              }
              (e._tr_init = function (t) {
                if (!R) {
                  for (
                    var e, r, i, s = new Array(16), n = 0, a = 0;
                    a < 28;
                    a++
                  )
                    for (m[a] = n, e = 0; e < 1 << h[a]; e++) u[n++] = a;
                  for (u[n - 1] = a, a = i = 0; a < 16; a++)
                    for (_[a] = i, e = 0; e < 1 << l[a]; e++) d[i++] = a;
                  for (i >>= 7; a < 30; a++)
                    for (_[a] = i << 7, e = 0; e < 1 << (l[a] - 7); e++)
                      d[256 + i++] = a;
                  for (r = 0; r <= 15; r++) s[r] = 0;
                  for (e = 0; e <= 143; ) (c[2 * e + 1] = 8), e++, s[8]++;
                  for (; e <= 255; ) (c[2 * e + 1] = 9), e++, s[9]++;
                  for (; e <= 279; ) (c[2 * e + 1] = 7), e++, s[7]++;
                  for (; e <= 287; ) (c[2 * e + 1] = 8), e++, s[8]++;
                  for (w(c, 287, s), e = 0; e < 30; e++)
                    (f[2 * e + 1] = 5), (f[2 * e] = E(e, 5));
                  (y = new b(c, h, 257, 286, 15)),
                    (g = new b(f, l, 0, 30, 15)),
                    (v = new b(new Array(0), o, 0, 19, 7)),
                    (R = !0);
                }
                (t.l_desc = new S(t.dyn_ltree, y)),
                  (t.d_desc = new S(t.dyn_dtree, g)),
                  (t.bl_desc = new S(t.bl_tree, v)),
                  (t.bi_buf = 0),
                  (t.bi_valid = 0),
                  A(t);
              }),
                (e._tr_stored_block = z),
                (e._tr_flush_block = function (t, e, r, i) {
                  var s,
                    n,
                    a,
                    o = 0;
                  if (
                    (0 < t.level
                      ? (2 === t.strm.data_type &&
                          (t.strm.data_type = (function (t) {
                            for (
                              var e = 4093624447, r = 0;
                              r <= 31;
                              r++, e >>>= 1
                            )
                              if (1 & e && 0 !== t.dyn_ltree[2 * r]) return 0;
                            if (
                              0 !== t.dyn_ltree[18] ||
                              0 !== t.dyn_ltree[20] ||
                              0 !== t.dyn_ltree[26]
                            )
                              return 1;
                            for (r = 32; r < 256; r++)
                              if (0 !== t.dyn_ltree[2 * r]) return 1;
                            return 0;
                          })(t)),
                        F(t, t.l_desc),
                        F(t, t.d_desc),
                        (o = (function (t) {
                          var e;
                          for (
                            M(t, t.dyn_ltree, t.l_desc.max_code),
                              M(t, t.dyn_dtree, t.d_desc.max_code),
                              F(t, t.bl_desc),
                              e = 18;
                            3 <= e && 0 === t.bl_tree[2 * p[e] + 1];
                            e--
                          );
                          return (t.opt_len += 3 * (e + 1) + 5 + 5 + 4), e;
                        })(t)),
                        (s = (t.opt_len + 3 + 7) >>> 3),
                        (n = (t.static_len + 3 + 7) >>> 3) <= s && (s = n))
                      : (s = n = r + 5),
                    r + 4 <= s && -1 !== e)
                  )
                    z(t, e, r, i);
                  else if (4 === t.strategy || n === s)
                    x(t, 2 + (i ? 1 : 0), 3), I(t, c, f);
                  else {
                    x(t, 4 + (i ? 1 : 0), 3);
                    var h = t,
                      l =
                        ((e = t.l_desc.max_code + 1),
                        (r = t.d_desc.max_code + 1),
                        o + 1);
                    for (
                      x(h, e - 257, 5), x(h, r - 1, 5), x(h, l - 4, 4), a = 0;
                      a < l;
                      a++
                    )
                      x(h, h.bl_tree[2 * p[a] + 1], 3);
                    D(h, h.dyn_ltree, e - 1),
                      D(h, h.dyn_dtree, r - 1),
                      I(t, t.dyn_ltree, t.dyn_dtree);
                  }
                  A(t), i && T(t);
                }),
                (e._tr_tally = function (t, e, r) {
                  return (
                    (t.pending_buf[t.d_buf + 2 * t.last_lit] = (e >>> 8) & 255),
                    (t.pending_buf[t.d_buf + 2 * t.last_lit + 1] = 255 & e),
                    (t.pending_buf[t.l_buf + t.last_lit] = 255 & r),
                    t.last_lit++,
                    0 === e
                      ? t.dyn_ltree[2 * r]++
                      : (t.matches++,
                        e--,
                        t.dyn_ltree[2 * (u[r] + 256 + 1)]++,
                        t.dyn_dtree[2 * P(e)]++),
                    t.last_lit === t.lit_bufsize - 1
                  );
                }),
                (e._tr_align = function (t) {
                  x(t, 2, 3),
                    k(t, 256, c),
                    16 === (t = t).bi_valid
                      ? (n(t, t.bi_buf), (t.bi_buf = 0), (t.bi_valid = 0))
                      : 8 <= t.bi_valid &&
                        ((t.pending_buf[t.pending++] = 255 & t.bi_buf),
                        (t.bi_buf >>= 8),
                        (t.bi_valid -= 8));
                });
            },
            { '../utils/common': 41 },
          ],
          53: [
            function (t, e, r) {
              e.exports = function () {
                (this.input = null),
                  (this.next_in = 0),
                  (this.avail_in = 0),
                  (this.total_in = 0),
                  (this.output = null),
                  (this.next_out = 0),
                  (this.avail_out = 0),
                  (this.total_out = 0),
                  (this.msg = ''),
                  (this.state = null),
                  (this.data_type = 2),
                  (this.adler = 0);
              };
            },
            {},
          ],
          54: [
            function (t, e, r) {
              e.exports =
                'function' == typeof setImmediate
                  ? setImmediate
                  : function () {
                      var t = [].slice.apply(arguments);
                      t.splice(1, 0, 0), setTimeout.apply(null, t);
                    };
            },
            {},
          ],
        },
        {},
        [10]
      )(10);
    });
  function _templateObject() {
    const t = _taggedTemplateLiteral([
      '\n* {\n  box-sizing: border-box;\n  padding: 0;\n  margin: 0;\n}\n\n:host {\n  --lottie-player-toolbar-height: 35px;\n  --lottie-player-toolbar-background-color: transparent;\n  --lottie-player-toolbar-icon-color: #999;\n  --lottie-player-toolbar-icon-hover-color: #222;\n  --lottie-player-toolbar-icon-active-color: #555;\n  --lottie-player-seeker-track-color: #CCC;\n  --lottie-player-seeker-thumb-color: rgba(0, 107, 120, 0.8);\n\n  display: block;\n}\n\n.main {\n  display: grid;\n  grid-auto-columns: auto;\n  grid-template-rows: auto;\n  height: inherit;\n  width: inherit;\n}\n\n.main.controls {\n  grid-template-rows: 1fr var(--lottie-player-toolbar-height);\n}\n\n.animation {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: inherit;\n  height: inherit;\n}\n\n.toolbar {\n  display: grid;\n  grid-template-columns: 32px 32px 1fr 32px;\n  align-items: center;\n  justify-items: center;\n  background-color: var(--lottie-player-toolbar-background-color);\n}\n\n.toolbar button {\n  cursor: pointer;\n  fill: var(--lottie-player-toolbar-icon-color);\n  display: flex;\n  background: none;\n  border: 0;\n  padding: 0;\n  outline: none;\n  height: 100%;\n}\n\n.toolbar button:hover {\n  fill: var(--lottie-player-toolbar-icon-hover-color);\n}\n\n.toolbar button.active {\n  fill: var(--lottie-player-toolbar-icon-active-color);\n}\n\n.toolbar button svg {\n}\n\n.toolbar button.disabled svg {\n  display: none;\n}\n\n.toolbar a {\n  filter: grayscale(100%);\n  display: flex;\n  transition: filter .5s, opacity 0.5s;\n  opacity: 0.4;\n  height: 100%;\n  align-items: center;\n}\n\n.toolbar a:hover {\n  filter: none;\n  display: flex;\n  opacity: 1;\n}\n\n.toolbar a svg {\n}\n\n.seeker {\n  -webkit-appearance: none;\n  width: 95%;\n  outline: none;\n}\n\n.seeker::-webkit-slider-runnable-track {\n  width: 100%;\n  height: 5px;\n  cursor: pointer;\n  background: var(--lottie-player-seeker-track-color);\n  border-radius: 3px;\n}\n.seeker::-webkit-slider-thumb {\n  height: 15px;\n  width: 15px;\n  border-radius: 50%;\n  background: var(--lottie-player-seeker-thumb-color);\n  cursor: pointer;\n  -webkit-appearance: none;\n  margin-top: -5px;\n}\n.seeker:focus::-webkit-slider-runnable-track {\n  background: #999;\n}\n.seeker::-moz-range-track {\n  width: 100%;\n  height: 5px;\n  cursor: pointer;\n  background: var(--lottie-player-seeker-track-color);\n  border-radius: 3px;\n}\n.seeker::-moz-range-thumb {\n  height: 15px;\n  width: 15px;\n  border-radius: 50%;\n  background: var(--lottie-player-seeker-thumb-color);\n  cursor: pointer;\n}\n.seeker::-ms-track {\n  width: 100%;\n  height: 5px;\n  cursor: pointer;\n  background: transparent;\n  border-color: transparent;\n  color: transparent;\n}\n.seeker::-ms-fill-lower {\n  background: var(--lottie-player-seeker-track-color);\n  border-radius: 3px;\n}\n.seeker::-ms-fill-upper {\n  background: var(--lottie-player-seeker-track-color);\n  border-radius: 3px;\n}\n.seeker::-ms-thumb {\n  border: 0;\n  height: 15px;\n  width: 15px;\n  border-radius: 50%;\n  background: var(--lottie-player-seeker-thumb-color);\n  cursor: pointer;\n}\n.seeker:focus::-ms-fill-lower {\n  background: var(--lottie-player-seeker-track-color);\n}\n.seeker:focus::-ms-fill-upper {\n  background: var(--lottie-player-seeker-track-color);\n}\n\n.error {\n  display: flex;\n  justify-content: center;\n  height: 100%;\n  align-items: center;\n}\n',
    ]);
    return (
      (_templateObject = function () {
        return t;
      }),
      t
    );
  }
  var styles = css(_templateObject()),
    PlayerState,
    PlayMode,
    PlayerEvents;
  function _templateObject5() {
    const t = _taggedTemplateLiteral([
      '\n                <div class="error">⚠</div>\n              ',
    ]);
    return (
      (_templateObject5 = function () {
        return t;
      }),
      t
    );
  }
  function _templateObject4() {
    const t = _taggedTemplateLiteral([
      '\n      <div class=',
      '>\n        <div class="animation" style=',
      '>\n          ',
      '\n        </div>\n        ',
      '\n      </div>\n    ',
    ]);
    return (
      (_templateObject4 = function () {
        return t;
      }),
      t
    );
  }
  function _templateObject3() {
    const t = _taggedTemplateLiteral([
      '\n                <svg width="24" height="24"><path d="M8.016 5.016L18.985 12 8.016 18.984V5.015z" /></svg>\n              ',
    ]);
    return (
      (_templateObject3 = function () {
        return t;
      }),
      t
    );
  }
  function _templateObject2() {
    const t = _taggedTemplateLiteral([
      '\n                <svg width="24" height="24">\n                  <path d="M14.016 5.016H18v13.969h-3.984V5.016zM6 18.984V5.015h3.984v13.969H6z" />\n                </svg>\n              ',
    ]);
    return (
      (_templateObject2 = function () {
        return t;
      }),
      t
    );
  }
  function _templateObject$1() {
    const t = _taggedTemplateLiteral([
      '\n      <div class="toolbar">\n        <button @click=',
      ' class=',
      '>\n          ',
      '\n        </button>\n        <button @click=',
      ' class=',
      '>\n          <svg width="24" height="24"><path d="M6 6h12v12H6V6z" /></svg>\n        </button>\n        <input\n          class="seeker"\n          type="range"\n          min="0"\n          step="1"\n          max="100"\n          .value=',
      '\n          @input=',
      '\n          @mousedown=',
      '\n          @mouseup=',
      '\n        />\n        <button @click=',
      ' class=',
      '>\n          <svg width="24" height="24">\n            <path\n              d="M17.016 17.016v-4.031h1.969v6h-12v3l-3.984-3.984 3.984-3.984v3h10.031zM6.984 6.984v4.031H5.015v-6h12v-3l3.984 3.984-3.984 3.984v-3H6.984z"\n            />\n          </svg>\n        </button>\n      </div>\n    ',
    ]);
    return (
      (_templateObject$1 = function () {
        return t;
      }),
      t
    );
  }
  function fetchPath(i) {
    return new Promise((r, e) => {
      const t = new XMLHttpRequest();
      t.open('GET', i, !0),
        (t.responseType = 'arraybuffer'),
        t.send(),
        (t.onreadystatechange = function () {
          4 == t.readyState &&
            200 == t.status &&
            jszip
              .loadAsync(t.response)
              .then((i) => {
                i.file('manifest.json')
                  .async('string')
                  .then((t) => {
                    t = JSON.parse(t);
                    if (!('animations' in t))
                      throw new Error('Manifest not found');
                    if (0 === t.animations.length)
                      throw new Error('No animations listed in the manifest');
                    t = t.animations[0];
                    i.file('animations/'.concat(t.id, '.json'))
                      .async('string')
                      .then((t) => {
                        const e = JSON.parse(t);
                        'assets' in e &&
                          Promise.all(
                            e.assets.map((r) => {
                              if (r.p && null != i.file('images/'.concat(r.p)))
                                return new Promise((e) => {
                                  i.file('images/'.concat(r.p))
                                    .async('base64')
                                    .then((t) => {
                                      (r.p = 'data:;base64,' + t),
                                        (r.e = 1),
                                        e();
                                    });
                                });
                            })
                          ).then(() => {
                            r(e);
                          });
                      });
                  });
              })
              .catch((t) => {
                e(t);
              });
        });
    });
  }
  (PlayerState = exports.PlayerState || (exports.PlayerState = {})),
    (PlayerState.Loading = 'loading'),
    (PlayerState.Playing = 'playing'),
    (PlayerState.Paused = 'paused'),
    (PlayerState.Stopped = 'stopped'),
    (PlayerState.Frozen = 'frozen'),
    (PlayerState.Error = 'error'),
    (PlayMode = exports.PlayMode || (exports.PlayMode = {})),
    (PlayMode.Normal = 'normal'),
    (PlayMode.Bounce = 'bounce'),
    (PlayerEvents = exports.PlayerEvents || (exports.PlayerEvents = {})),
    (PlayerEvents.Load = 'load'),
    (PlayerEvents.Error = 'error'),
    (PlayerEvents.Ready = 'ready'),
    (PlayerEvents.Play = 'play'),
    (PlayerEvents.Pause = 'pause'),
    (PlayerEvents.Stop = 'stop'),
    (PlayerEvents.Freeze = 'freeze'),
    (PlayerEvents.Loop = 'loop'),
    (PlayerEvents.Complete = 'complete'),
    (PlayerEvents.Frame = 'frame'),
    (exports.DotLottiePlayer = class extends LitElement {
      constructor() {
        super(...arguments),
          (this.mode = exports.PlayMode.Normal),
          (this.autoplay = !1),
          (this.background = 'transparent'),
          (this.controls = !1),
          (this.direction = 1),
          (this.hover = !1),
          (this.loop = !1),
          (this.renderer = 'svg'),
          (this.speed = 1),
          (this.currentState = exports.PlayerState.Loading),
          (this.intermission = 1),
          (this._counter = 0);
      }
      _onVisibilityChange() {
        document.hidden && this.currentState === exports.PlayerState.Playing
          ? this.freeze()
          : this.currentState === exports.PlayerState.Frozen && this.play();
      }
      _handleSeekChange(t) {
        this._lottie &&
          !isNaN(t.target.value) &&
          ((t = (t.target.value / 100) * this._lottie.totalFrames),
          this.seek(t));
      }
      async load(t) {
        if (this.shadowRoot) {
          var e = {
            container: this.container,
            loop: !1,
            autoplay: !1,
            renderer: this.renderer,
            rendererSettings: {
              scaleMode: 'noScale',
              clearCanvas: !1,
              progressiveLoad: !0,
              hideOnTransparent: !0,
            },
          };
          try {
            var r = await fetchPath(t);
            this._lottie && this._lottie.destroy(),
              (this._lottie = lottie_svg.loadAnimation(
                Object.assign(Object.assign({}, e), { animationData: r })
              ));
          } catch (t) {
            return (
              (this.currentState = exports.PlayerState.Error),
              void this.dispatchEvent(
                new CustomEvent(exports.PlayerEvents.Error)
              )
            );
          }
          this._lottie &&
            (this._lottie.addEventListener('enterFrame', () => {
              (this.seeker =
                (this._lottie.currentFrame / this._lottie.totalFrames) * 100),
                this.dispatchEvent(
                  new CustomEvent(exports.PlayerEvents.Frame, {
                    detail: {
                      frame: this._lottie.currentFrame,
                      seeker: this.seeker,
                    },
                  })
                );
            }),
            this._lottie.addEventListener('complete', () => {
              this.currentState !== exports.PlayerState.Playing ||
              !this.loop ||
              (this.count && this._counter >= this.count)
                ? this.dispatchEvent(
                    new CustomEvent(exports.PlayerEvents.Complete)
                  )
                : this.mode === exports.PlayMode.Bounce
                  ? (this.count && (this._counter += 0.5),
                    setTimeout(() => {
                      this.dispatchEvent(
                        new CustomEvent(exports.PlayerEvents.Loop)
                      ),
                        this.currentState === exports.PlayerState.Playing &&
                          (this._lottie.setDirection(
                            -1 * this._lottie.playDirection
                          ),
                          this._lottie.play());
                    }, this.intermission))
                  : (this.count && (this._counter += 1),
                    window.setTimeout(() => {
                      this.dispatchEvent(
                        new CustomEvent(exports.PlayerEvents.Loop)
                      ),
                        this.currentState === exports.PlayerState.Playing &&
                          (this._lottie.stop(), this._lottie.play());
                    }, this.intermission));
            }),
            this._lottie.addEventListener('DOMLoaded', () => {
              this.dispatchEvent(new CustomEvent(exports.PlayerEvents.Ready));
            }),
            this._lottie.addEventListener('data_ready', () => {
              this.dispatchEvent(new CustomEvent(exports.PlayerEvents.Load));
            }),
            this._lottie.addEventListener('data_failed', () => {
              (this.currentState = exports.PlayerState.Error),
                this.dispatchEvent(new CustomEvent(exports.PlayerEvents.Error));
            }),
            this.container.addEventListener('mouseenter', () => {
              this.hover &&
                this.currentState !== exports.PlayerState.Playing &&
                this.play();
            }),
            this.container.addEventListener('mouseleave', () => {
              this.hover &&
                this.currentState === exports.PlayerState.Playing &&
                this.stop();
            }),
            this.setSpeed(this.speed),
            this.setDirection(this.direction),
            this.autoplay) &&
            this.play();
        }
      }
      getLottie() {
        return this._lottie;
      }
      play() {
        this._lottie &&
          (this._lottie.play(),
          (this.currentState = exports.PlayerState.Playing),
          this.dispatchEvent(new CustomEvent(exports.PlayerEvents.Play)));
      }
      pause() {
        this._lottie &&
          (this._lottie.pause(),
          (this.currentState = exports.PlayerState.Paused),
          this.dispatchEvent(new CustomEvent(exports.PlayerEvents.Pause)));
      }
      stop() {
        this._lottie &&
          ((this._counter = 0),
          this._lottie.stop(),
          (this.currentState = exports.PlayerState.Stopped),
          this.dispatchEvent(new CustomEvent(exports.PlayerEvents.Stop)));
      }
      seek(t) {
        this._lottie &&
          (t = t.toString().match(/^([0-9]+)(%?)$/)) &&
          ((t =
            '%' === t[2]
              ? (this._lottie.totalFrames * Number(t[1])) / 100
              : t[1]),
          (this.seeker = t),
          this.currentState === exports.PlayerState.Playing
            ? this._lottie.goToAndPlay(t, !0)
            : (this._lottie.goToAndStop(t, !0), this._lottie.pause()));
      }
      snapshot() {
        let t =
          !(0 < arguments.length && void 0 !== arguments[0]) || arguments[0];
        if (this.shadowRoot) {
          var e = this.shadowRoot.querySelector('.animation svg'),
            e = new XMLSerializer().serializeToString(e);
          if (t) {
            const t = document.createElement('a');
            (t.href =
              'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(e)),
              (t.download = 'download_' + this.seeker + '.svg'),
              document.body.appendChild(t),
              t.click(),
              document.body.removeChild(t);
          }
          return e;
        }
      }
      freeze() {
        this._lottie &&
          (this._lottie.pause(),
          (this.currentState = exports.PlayerState.Frozen),
          this.dispatchEvent(new CustomEvent(exports.PlayerEvents.Freeze)));
      }
      setSpeed() {
        this._lottie &&
          this._lottie.setSpeed(
            0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 1
          );
      }
      setDirection(t) {
        this._lottie && this._lottie.setDirection(t);
      }
      setLooping(t) {
        this._lottie && ((this.loop = t), (this._lottie.loop = t));
      }
      togglePlay() {
        return this.currentState === exports.PlayerState.Playing
          ? this.pause()
          : this.play();
      }
      toggleLooping() {
        this.setLooping(!this.loop);
      }
      static get styles() {
        return styles;
      }
      async firstUpdated() {
        'IntersectionObserver' in window &&
          ((this._io = new IntersectionObserver((t) => {
            t[0].isIntersecting
              ? this.currentState === exports.PlayerState.Frozen && this.play()
              : this.currentState === exports.PlayerState.Playing &&
                this.freeze();
          })),
          this._io.observe(this.container)),
          void 0 !== document.hidden &&
            document.addEventListener('visibilitychange', () =>
              this._onVisibilityChange()
            ),
          this.src && (await this.load(this.src));
      }
      disconnectedCallback() {
        this._io && (this._io.disconnect(), (this._io = void 0)),
          document.removeEventListener('visibilitychange', () =>
            this._onVisibilityChange()
          );
      }
      renderControls() {
        var t = this.currentState === exports.PlayerState.Playing,
          e = this.currentState === exports.PlayerState.Paused,
          r = this.currentState === exports.PlayerState.Stopped;
        return html(
          _templateObject$1(),
          this.togglePlay,
          t || e ? 'active' : '',
          html((t ? _templateObject2 : _templateObject3)()),
          this.stop,
          r ? 'active' : '',
          this.seeker,
          this._handleSeekChange,
          () => {
            (this._prevState = this.currentState), this.freeze();
          },
          () => {
            this._prevState === exports.PlayerState.Playing && this.play();
          },
          this.toggleLooping,
          this.loop ? 'active' : ''
        );
      }
      render() {
        var t = this.controls ? 'controls' : '';
        return html(
          _templateObject4(),
          'main ' + t,
          'background:' + this.background,
          this.currentState === exports.PlayerState.Error
            ? html(_templateObject5())
            : void 0,
          this.controls ? this.renderControls() : void 0
        );
      }
    }),
    __decorate(
      [query('.animation')],
      exports.DotLottiePlayer.prototype,
      'container',
      void 0
    ),
    __decorate([property()], exports.DotLottiePlayer.prototype, 'mode', void 0),
    __decorate(
      [property({ type: Boolean })],
      exports.DotLottiePlayer.prototype,
      'autoplay',
      void 0
    ),
    __decorate(
      [property({ type: String, reflect: !0 })],
      exports.DotLottiePlayer.prototype,
      'background',
      void 0
    ),
    __decorate(
      [property({ type: Boolean })],
      exports.DotLottiePlayer.prototype,
      'controls',
      void 0
    ),
    __decorate(
      [property({ type: Number })],
      exports.DotLottiePlayer.prototype,
      'count',
      void 0
    ),
    __decorate(
      [property({ type: Number })],
      exports.DotLottiePlayer.prototype,
      'direction',
      void 0
    ),
    __decorate(
      [property({ type: Boolean })],
      exports.DotLottiePlayer.prototype,
      'hover',
      void 0
    ),
    __decorate(
      [property({ type: Boolean, reflect: !0 })],
      exports.DotLottiePlayer.prototype,
      'loop',
      void 0
    ),
    __decorate(
      [property({ type: String })],
      exports.DotLottiePlayer.prototype,
      'renderer',
      void 0
    ),
    __decorate(
      [property({ type: Number })],
      exports.DotLottiePlayer.prototype,
      'speed',
      void 0
    ),
    __decorate(
      [property({ type: String })],
      exports.DotLottiePlayer.prototype,
      'src',
      void 0
    ),
    __decorate(
      [property({ type: String })],
      exports.DotLottiePlayer.prototype,
      'currentState',
      void 0
    ),
    __decorate(
      [property()],
      exports.DotLottiePlayer.prototype,
      'seeker',
      void 0
    ),
    __decorate(
      [property()],
      exports.DotLottiePlayer.prototype,
      'intermission',
      void 0
    ),
    (exports.DotLottiePlayer = __decorate(
      [customElement('dotlottie-player')],
      exports.DotLottiePlayer
    )),
    (exports.fetchPath = fetchPath),
    Object.defineProperty(exports, '__esModule', { value: !0 });
});
