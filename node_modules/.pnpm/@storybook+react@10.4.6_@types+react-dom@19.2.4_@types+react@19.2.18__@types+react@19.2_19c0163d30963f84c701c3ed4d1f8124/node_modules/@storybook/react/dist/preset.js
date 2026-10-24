import CJS_COMPAT_NODE_URL_n05tuqjc26 from 'node:url';
import CJS_COMPAT_NODE_PATH_n05tuqjc26 from 'node:path';
import CJS_COMPAT_NODE_MODULE_n05tuqjc26 from "node:module";

var __filename = CJS_COMPAT_NODE_URL_n05tuqjc26.fileURLToPath(import.meta.url);
var __dirname = CJS_COMPAT_NODE_PATH_n05tuqjc26.dirname(__filename);
var require = CJS_COMPAT_NODE_MODULE_n05tuqjc26.createRequire(import.meta.url);

// ------------------------------------------------------------
// end of CJS compatibility banner, injected by Storybook's esbuild configuration
// ------------------------------------------------------------
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf, __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require < "u" ? require : typeof Proxy < "u" ? new Proxy(x, {
  get: (a, b) => (typeof require < "u" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require < "u") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res, err) => function() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __commonJS = (cb, mod) => function() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
}, __copyProps = (to, from, except, desc) => {
  if (from && typeof from == "object" || typeof from == "function")
    for (let key of __getOwnPropNames(from))
      !__hasOwnProp.call(to, key) && key !== except && __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: !0 }) : target,
  mod
)), __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: !0 }), mod);

// ../../../node_modules/estraverse/estraverse.js
var require_estraverse = __commonJS({
  "../../../node_modules/estraverse/estraverse.js"(exports) {
    (function clone(exports2) {
      "use strict";
      var Syntax, VisitorOption, VisitorKeys, BREAK, SKIP, REMOVE;
      function deepCopy(obj) {
        var ret = {}, key, val;
        for (key in obj)
          obj.hasOwnProperty(key) && (val = obj[key], typeof val == "object" && val !== null ? ret[key] = deepCopy(val) : ret[key] = val);
        return ret;
      }
      function upperBound(array, func) {
        var diff, len, i2, current2;
        for (len = array.length, i2 = 0; len; )
          diff = len >>> 1, current2 = i2 + diff, func(array[current2]) ? len = diff : (i2 = current2 + 1, len -= diff + 1);
        return i2;
      }
      Syntax = {
        AssignmentExpression: "AssignmentExpression",
        AssignmentPattern: "AssignmentPattern",
        ArrayExpression: "ArrayExpression",
        ArrayPattern: "ArrayPattern",
        ArrowFunctionExpression: "ArrowFunctionExpression",
        AwaitExpression: "AwaitExpression",
        // CAUTION: It's deferred to ES7.
        BlockStatement: "BlockStatement",
        BinaryExpression: "BinaryExpression",
        BreakStatement: "BreakStatement",
        CallExpression: "CallExpression",
        CatchClause: "CatchClause",
        ChainExpression: "ChainExpression",
        ClassBody: "ClassBody",
        ClassDeclaration: "ClassDeclaration",
        ClassExpression: "ClassExpression",
        ComprehensionBlock: "ComprehensionBlock",
        // CAUTION: It's deferred to ES7.
        ComprehensionExpression: "ComprehensionExpression",
        // CAUTION: It's deferred to ES7.
        ConditionalExpression: "ConditionalExpression",
        ContinueStatement: "ContinueStatement",
        DebuggerStatement: "DebuggerStatement",
        DirectiveStatement: "DirectiveStatement",
        DoWhileStatement: "DoWhileStatement",
        EmptyStatement: "EmptyStatement",
        ExportAllDeclaration: "ExportAllDeclaration",
        ExportDefaultDeclaration: "ExportDefaultDeclaration",
        ExportNamedDeclaration: "ExportNamedDeclaration",
        ExportSpecifier: "ExportSpecifier",
        ExpressionStatement: "ExpressionStatement",
        ForStatement: "ForStatement",
        ForInStatement: "ForInStatement",
        ForOfStatement: "ForOfStatement",
        FunctionDeclaration: "FunctionDeclaration",
        FunctionExpression: "FunctionExpression",
        GeneratorExpression: "GeneratorExpression",
        // CAUTION: It's deferred to ES7.
        Identifier: "Identifier",
        IfStatement: "IfStatement",
        ImportExpression: "ImportExpression",
        ImportDeclaration: "ImportDeclaration",
        ImportDefaultSpecifier: "ImportDefaultSpecifier",
        ImportNamespaceSpecifier: "ImportNamespaceSpecifier",
        ImportSpecifier: "ImportSpecifier",
        Literal: "Literal",
        LabeledStatement: "LabeledStatement",
        LogicalExpression: "LogicalExpression",
        MemberExpression: "MemberExpression",
        MetaProperty: "MetaProperty",
        MethodDefinition: "MethodDefinition",
        ModuleSpecifier: "ModuleSpecifier",
        NewExpression: "NewExpression",
        ObjectExpression: "ObjectExpression",
        ObjectPattern: "ObjectPattern",
        PrivateIdentifier: "PrivateIdentifier",
        Program: "Program",
        Property: "Property",
        PropertyDefinition: "PropertyDefinition",
        RestElement: "RestElement",
        ReturnStatement: "ReturnStatement",
        SequenceExpression: "SequenceExpression",
        SpreadElement: "SpreadElement",
        Super: "Super",
        SwitchStatement: "SwitchStatement",
        SwitchCase: "SwitchCase",
        TaggedTemplateExpression: "TaggedTemplateExpression",
        TemplateElement: "TemplateElement",
        TemplateLiteral: "TemplateLiteral",
        ThisExpression: "ThisExpression",
        ThrowStatement: "ThrowStatement",
        TryStatement: "TryStatement",
        UnaryExpression: "UnaryExpression",
        UpdateExpression: "UpdateExpression",
        VariableDeclaration: "VariableDeclaration",
        VariableDeclarator: "VariableDeclarator",
        WhileStatement: "WhileStatement",
        WithStatement: "WithStatement",
        YieldExpression: "YieldExpression"
      }, VisitorKeys = {
        AssignmentExpression: ["left", "right"],
        AssignmentPattern: ["left", "right"],
        ArrayExpression: ["elements"],
        ArrayPattern: ["elements"],
        ArrowFunctionExpression: ["params", "body"],
        AwaitExpression: ["argument"],
        // CAUTION: It's deferred to ES7.
        BlockStatement: ["body"],
        BinaryExpression: ["left", "right"],
        BreakStatement: ["label"],
        CallExpression: ["callee", "arguments"],
        CatchClause: ["param", "body"],
        ChainExpression: ["expression"],
        ClassBody: ["body"],
        ClassDeclaration: ["id", "superClass", "body"],
        ClassExpression: ["id", "superClass", "body"],
        ComprehensionBlock: ["left", "right"],
        // CAUTION: It's deferred to ES7.
        ComprehensionExpression: ["blocks", "filter", "body"],
        // CAUTION: It's deferred to ES7.
        ConditionalExpression: ["test", "consequent", "alternate"],
        ContinueStatement: ["label"],
        DebuggerStatement: [],
        DirectiveStatement: [],
        DoWhileStatement: ["body", "test"],
        EmptyStatement: [],
        ExportAllDeclaration: ["source"],
        ExportDefaultDeclaration: ["declaration"],
        ExportNamedDeclaration: ["declaration", "specifiers", "source"],
        ExportSpecifier: ["exported", "local"],
        ExpressionStatement: ["expression"],
        ForStatement: ["init", "test", "update", "body"],
        ForInStatement: ["left", "right", "body"],
        ForOfStatement: ["left", "right", "body"],
        FunctionDeclaration: ["id", "params", "body"],
        FunctionExpression: ["id", "params", "body"],
        GeneratorExpression: ["blocks", "filter", "body"],
        // CAUTION: It's deferred to ES7.
        Identifier: [],
        IfStatement: ["test", "consequent", "alternate"],
        ImportExpression: ["source"],
        ImportDeclaration: ["specifiers", "source"],
        ImportDefaultSpecifier: ["local"],
        ImportNamespaceSpecifier: ["local"],
        ImportSpecifier: ["imported", "local"],
        Literal: [],
        LabeledStatement: ["label", "body"],
        LogicalExpression: ["left", "right"],
        MemberExpression: ["object", "property"],
        MetaProperty: ["meta", "property"],
        MethodDefinition: ["key", "value"],
        ModuleSpecifier: [],
        NewExpression: ["callee", "arguments"],
        ObjectExpression: ["properties"],
        ObjectPattern: ["properties"],
        PrivateIdentifier: [],
        Program: ["body"],
        Property: ["key", "value"],
        PropertyDefinition: ["key", "value"],
        RestElement: ["argument"],
        ReturnStatement: ["argument"],
        SequenceExpression: ["expressions"],
        SpreadElement: ["argument"],
        Super: [],
        SwitchStatement: ["discriminant", "cases"],
        SwitchCase: ["test", "consequent"],
        TaggedTemplateExpression: ["tag", "quasi"],
        TemplateElement: [],
        TemplateLiteral: ["quasis", "expressions"],
        ThisExpression: [],
        ThrowStatement: ["argument"],
        TryStatement: ["block", "handler", "finalizer"],
        UnaryExpression: ["argument"],
        UpdateExpression: ["argument"],
        VariableDeclaration: ["declarations"],
        VariableDeclarator: ["id", "init"],
        WhileStatement: ["test", "body"],
        WithStatement: ["object", "body"],
        YieldExpression: ["argument"]
      }, BREAK = {}, SKIP = {}, REMOVE = {}, VisitorOption = {
        Break: BREAK,
        Skip: SKIP,
        Remove: REMOVE
      };
      function Reference(parent, key) {
        this.parent = parent, this.key = key;
      }
      Reference.prototype.replace = function(node) {
        this.parent[this.key] = node;
      }, Reference.prototype.remove = function() {
        return Array.isArray(this.parent) ? (this.parent.splice(this.key, 1), !0) : (this.replace(null), !1);
      };
      function Element(node, path5, wrap, ref2) {
        this.node = node, this.path = path5, this.wrap = wrap, this.ref = ref2;
      }
      function Controller() {
      }
      Controller.prototype.path = function() {
        var i2, iz, j, jz, result, element;
        function addToPath(result2, path6) {
          if (Array.isArray(path6))
            for (j = 0, jz = path6.length; j < jz; ++j)
              result2.push(path6[j]);
          else
            result2.push(path6);
        }
        if (!this.__current.path)
          return null;
        for (result = [], i2 = 2, iz = this.__leavelist.length; i2 < iz; ++i2)
          element = this.__leavelist[i2], addToPath(result, element.path);
        return addToPath(result, this.__current.path), result;
      }, Controller.prototype.type = function() {
        var node = this.current();
        return node.type || this.__current.wrap;
      }, Controller.prototype.parents = function() {
        var i2, iz, result;
        for (result = [], i2 = 1, iz = this.__leavelist.length; i2 < iz; ++i2)
          result.push(this.__leavelist[i2].node);
        return result;
      }, Controller.prototype.current = function() {
        return this.__current.node;
      }, Controller.prototype.__execute = function(callback, element) {
        var previous, result;
        return result = void 0, previous = this.__current, this.__current = element, this.__state = null, callback && (result = callback.call(this, element.node, this.__leavelist[this.__leavelist.length - 1].node)), this.__current = previous, result;
      }, Controller.prototype.notify = function(flag) {
        this.__state = flag;
      }, Controller.prototype.skip = function() {
        this.notify(SKIP);
      }, Controller.prototype.break = function() {
        this.notify(BREAK);
      }, Controller.prototype.remove = function() {
        this.notify(REMOVE);
      }, Controller.prototype.__initialize = function(root, visitor) {
        this.visitor = visitor, this.root = root, this.__worklist = [], this.__leavelist = [], this.__current = null, this.__state = null, this.__fallback = null, visitor.fallback === "iteration" ? this.__fallback = Object.keys : typeof visitor.fallback == "function" && (this.__fallback = visitor.fallback), this.__keys = VisitorKeys, visitor.keys && (this.__keys = Object.assign(Object.create(this.__keys), visitor.keys));
      };
      function isNode2(node) {
        return node == null ? !1 : typeof node == "object" && typeof node.type == "string";
      }
      function isProperty(nodeType, key) {
        return (nodeType === Syntax.ObjectExpression || nodeType === Syntax.ObjectPattern) && key === "properties";
      }
      function candidateExistsInLeaveList(leavelist, candidate) {
        for (var i2 = leavelist.length - 1; i2 >= 0; --i2)
          if (leavelist[i2].node === candidate)
            return !0;
        return !1;
      }
      Controller.prototype.traverse = function(root, visitor) {
        var worklist, leavelist, element, node, nodeType, ret, key, current2, current22, candidates, candidate, sentinel;
        for (this.__initialize(root, visitor), sentinel = {}, worklist = this.__worklist, leavelist = this.__leavelist, worklist.push(new Element(root, null, null, null)), leavelist.push(new Element(null, null, null, null)); worklist.length; ) {
          if (element = worklist.pop(), element === sentinel) {
            if (element = leavelist.pop(), ret = this.__execute(visitor.leave, element), this.__state === BREAK || ret === BREAK)
              return;
            continue;
          }
          if (element.node) {
            if (ret = this.__execute(visitor.enter, element), this.__state === BREAK || ret === BREAK)
              return;
            if (worklist.push(sentinel), leavelist.push(element), this.__state === SKIP || ret === SKIP)
              continue;
            if (node = element.node, nodeType = node.type || element.wrap, candidates = this.__keys[nodeType], !candidates)
              if (this.__fallback)
                candidates = this.__fallback(node);
              else
                throw new Error("Unknown node type " + nodeType + ".");
            for (current2 = candidates.length; (current2 -= 1) >= 0; )
              if (key = candidates[current2], candidate = node[key], !!candidate) {
                if (Array.isArray(candidate)) {
                  for (current22 = candidate.length; (current22 -= 1) >= 0; )
                    if (candidate[current22] && !candidateExistsInLeaveList(leavelist, candidate[current22])) {
                      if (isProperty(nodeType, candidates[current2]))
                        element = new Element(candidate[current22], [key, current22], "Property", null);
                      else if (isNode2(candidate[current22]))
                        element = new Element(candidate[current22], [key, current22], null, null);
                      else
                        continue;
                      worklist.push(element);
                    }
                } else if (isNode2(candidate)) {
                  if (candidateExistsInLeaveList(leavelist, candidate))
                    continue;
                  worklist.push(new Element(candidate, key, null, null));
                }
              }
          }
        }
      }, Controller.prototype.replace = function(root, visitor) {
        var worklist, leavelist, node, nodeType, target, element, current2, current22, candidates, candidate, sentinel, outer, key;
        function removeElem(element2) {
          var i2, key2, nextElem, parent;
          if (element2.ref.remove()) {
            for (key2 = element2.ref.key, parent = element2.ref.parent, i2 = worklist.length; i2--; )
              if (nextElem = worklist[i2], nextElem.ref && nextElem.ref.parent === parent) {
                if (nextElem.ref.key < key2)
                  break;
                --nextElem.ref.key;
              }
          }
        }
        for (this.__initialize(root, visitor), sentinel = {}, worklist = this.__worklist, leavelist = this.__leavelist, outer = {
          root
        }, element = new Element(root, null, null, new Reference(outer, "root")), worklist.push(element), leavelist.push(element); worklist.length; ) {
          if (element = worklist.pop(), element === sentinel) {
            if (element = leavelist.pop(), target = this.__execute(visitor.leave, element), target !== void 0 && target !== BREAK && target !== SKIP && target !== REMOVE && element.ref.replace(target), (this.__state === REMOVE || target === REMOVE) && removeElem(element), this.__state === BREAK || target === BREAK)
              return outer.root;
            continue;
          }
          if (target = this.__execute(visitor.enter, element), target !== void 0 && target !== BREAK && target !== SKIP && target !== REMOVE && (element.ref.replace(target), element.node = target), (this.__state === REMOVE || target === REMOVE) && (removeElem(element), element.node = null), this.__state === BREAK || target === BREAK)
            return outer.root;
          if (node = element.node, !!node && (worklist.push(sentinel), leavelist.push(element), !(this.__state === SKIP || target === SKIP))) {
            if (nodeType = node.type || element.wrap, candidates = this.__keys[nodeType], !candidates)
              if (this.__fallback)
                candidates = this.__fallback(node);
              else
                throw new Error("Unknown node type " + nodeType + ".");
            for (current2 = candidates.length; (current2 -= 1) >= 0; )
              if (key = candidates[current2], candidate = node[key], !!candidate)
                if (Array.isArray(candidate)) {
                  for (current22 = candidate.length; (current22 -= 1) >= 0; )
                    if (candidate[current22]) {
                      if (isProperty(nodeType, candidates[current2]))
                        element = new Element(candidate[current22], [key, current22], "Property", new Reference(candidate, current22));
                      else if (isNode2(candidate[current22]))
                        element = new Element(candidate[current22], [key, current22], null, new Reference(candidate, current22));
                      else
                        continue;
                      worklist.push(element);
                    }
                } else isNode2(candidate) && worklist.push(new Element(candidate, key, null, new Reference(node, key)));
          }
        }
        return outer.root;
      };
      function traverse(root, visitor) {
        var controller = new Controller();
        return controller.traverse(root, visitor);
      }
      function replace(root, visitor) {
        var controller = new Controller();
        return controller.replace(root, visitor);
      }
      function extendCommentRange(comment, tokens) {
        var target;
        return target = upperBound(tokens, function(token) {
          return token.range[0] > comment.range[0];
        }), comment.extendedRange = [comment.range[0], comment.range[1]], target !== tokens.length && (comment.extendedRange[1] = tokens[target].range[0]), target -= 1, target >= 0 && (comment.extendedRange[0] = tokens[target].range[1]), comment;
      }
      function attachComments(tree, providedComments, tokens) {
        var comments = [], comment, len, i2, cursor;
        if (!tree.range)
          throw new Error("attachComments needs range information");
        if (!tokens.length) {
          if (providedComments.length) {
            for (i2 = 0, len = providedComments.length; i2 < len; i2 += 1)
              comment = deepCopy(providedComments[i2]), comment.extendedRange = [0, tree.range[0]], comments.push(comment);
            tree.leadingComments = comments;
          }
          return tree;
        }
        for (i2 = 0, len = providedComments.length; i2 < len; i2 += 1)
          comments.push(extendCommentRange(deepCopy(providedComments[i2]), tokens));
        return cursor = 0, traverse(tree, {
          enter: function(node) {
            for (var comment2; cursor < comments.length && (comment2 = comments[cursor], !(comment2.extendedRange[1] > node.range[0])); )
              comment2.extendedRange[1] === node.range[0] ? (node.leadingComments || (node.leadingComments = []), node.leadingComments.push(comment2), comments.splice(cursor, 1)) : cursor += 1;
            if (cursor === comments.length)
              return VisitorOption.Break;
            if (comments[cursor].extendedRange[0] > node.range[1])
              return VisitorOption.Skip;
          }
        }), cursor = 0, traverse(tree, {
          leave: function(node) {
            for (var comment2; cursor < comments.length && (comment2 = comments[cursor], !(node.range[1] < comment2.extendedRange[0])); )
              node.range[1] === comment2.extendedRange[0] ? (node.trailingComments || (node.trailingComments = []), node.trailingComments.push(comment2), comments.splice(cursor, 1)) : cursor += 1;
            if (cursor === comments.length)
              return VisitorOption.Break;
            if (comments[cursor].extendedRange[0] > node.range[1])
              return VisitorOption.Skip;
          }
        }), tree;
      }
      return exports2.Syntax = Syntax, exports2.traverse = traverse, exports2.replace = replace, exports2.attachComments = attachComments, exports2.VisitorKeys = VisitorKeys, exports2.VisitorOption = VisitorOption, exports2.Controller = Controller, exports2.cloneEnvironment = function() {
        return clone({});
      }, exports2;
    })(exports);
  }
});

// ../../../node_modules/esutils/lib/ast.js
var require_ast = __commonJS({
  "../../../node_modules/esutils/lib/ast.js"(exports, module) {
    (function() {
      "use strict";
      function isExpression(node) {
        if (node == null)
          return !1;
        switch (node.type) {
          case "ArrayExpression":
          case "AssignmentExpression":
          case "BinaryExpression":
          case "CallExpression":
          case "ConditionalExpression":
          case "FunctionExpression":
          case "Identifier":
          case "Literal":
          case "LogicalExpression":
          case "MemberExpression":
          case "NewExpression":
          case "ObjectExpression":
          case "SequenceExpression":
          case "ThisExpression":
          case "UnaryExpression":
          case "UpdateExpression":
            return !0;
        }
        return !1;
      }
      function isIterationStatement(node) {
        if (node == null)
          return !1;
        switch (node.type) {
          case "DoWhileStatement":
          case "ForInStatement":
          case "ForStatement":
          case "WhileStatement":
            return !0;
        }
        return !1;
      }
      function isStatement(node) {
        if (node == null)
          return !1;
        switch (node.type) {
          case "BlockStatement":
          case "BreakStatement":
          case "ContinueStatement":
          case "DebuggerStatement":
          case "DoWhileStatement":
          case "EmptyStatement":
          case "ExpressionStatement":
          case "ForInStatement":
          case "ForStatement":
          case "IfStatement":
          case "LabeledStatement":
          case "ReturnStatement":
          case "SwitchStatement":
          case "ThrowStatement":
          case "TryStatement":
          case "VariableDeclaration":
          case "WhileStatement":
          case "WithStatement":
            return !0;
        }
        return !1;
      }
      function isSourceElement(node) {
        return isStatement(node) || node != null && node.type === "FunctionDeclaration";
      }
      function trailingStatement(node) {
        switch (node.type) {
          case "IfStatement":
            return node.alternate != null ? node.alternate : node.consequent;
          case "LabeledStatement":
          case "ForStatement":
          case "ForInStatement":
          case "WhileStatement":
          case "WithStatement":
            return node.body;
        }
        return null;
      }
      function isProblematicIfStatement(node) {
        var current2;
        if (node.type !== "IfStatement" || node.alternate == null)
          return !1;
        current2 = node.consequent;
        do {
          if (current2.type === "IfStatement" && current2.alternate == null)
            return !0;
          current2 = trailingStatement(current2);
        } while (current2);
        return !1;
      }
      module.exports = {
        isExpression,
        isStatement,
        isIterationStatement,
        isSourceElement,
        isProblematicIfStatement,
        trailingStatement
      };
    })();
  }
});

// ../../../node_modules/esutils/lib/code.js
var require_code = __commonJS({
  "../../../node_modules/esutils/lib/code.js"(exports, module) {
    (function() {
      "use strict";
      var ES6Regex, ES5Regex, NON_ASCII_WHITESPACES, IDENTIFIER_START, IDENTIFIER_PART, ch;
      ES5Regex = {
        // ECMAScript 5.1/Unicode v9.0.0 NonAsciiIdentifierStart:
        NonAsciiIdentifierStart: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,
        // ECMAScript 5.1/Unicode v9.0.0 NonAsciiIdentifierPart:
        NonAsciiIdentifierPart: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B4\u08B6-\u08BD\u08D4-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFB-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/
      }, ES6Regex = {
        // ECMAScript 6/Unicode v9.0.0 NonAsciiIdentifierStart:
        NonAsciiIdentifierStart: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F\uDFE0]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]/,
        // ECMAScript 6/Unicode v9.0.0 NonAsciiIdentifierPart:
        NonAsciiIdentifierPart: /[\xAA\xB5\xB7\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B4\u08B6-\u08BD\u08D4-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1369-\u1371\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFB-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE3E\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC00-\uDC4A\uDC50-\uDC59\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC36\uDC38-\uDC40\uDC50-\uDC59\uDC72-\uDC8F\uDC92-\uDCA7\uDCA9-\uDCB6]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F\uDFE0]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6\uDD00-\uDD4A\uDD50-\uDD59]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/
      };
      function isDecimalDigit2(ch2) {
        return 48 <= ch2 && ch2 <= 57;
      }
      function isHexDigit2(ch2) {
        return 48 <= ch2 && ch2 <= 57 || // 0..9
        97 <= ch2 && ch2 <= 102 || // a..f
        65 <= ch2 && ch2 <= 70;
      }
      function isOctalDigit2(ch2) {
        return ch2 >= 48 && ch2 <= 55;
      }
      NON_ASCII_WHITESPACES = [
        5760,
        8192,
        8193,
        8194,
        8195,
        8196,
        8197,
        8198,
        8199,
        8200,
        8201,
        8202,
        8239,
        8287,
        12288,
        65279
      ];
      function isWhiteSpace(ch2) {
        return ch2 === 32 || ch2 === 9 || ch2 === 11 || ch2 === 12 || ch2 === 160 || ch2 >= 5760 && NON_ASCII_WHITESPACES.indexOf(ch2) >= 0;
      }
      function isLineTerminator(ch2) {
        return ch2 === 10 || ch2 === 13 || ch2 === 8232 || ch2 === 8233;
      }
      function fromCodePoint(cp) {
        if (cp <= 65535)
          return String.fromCharCode(cp);
        var cu1 = String.fromCharCode(Math.floor((cp - 65536) / 1024) + 55296), cu2 = String.fromCharCode((cp - 65536) % 1024 + 56320);
        return cu1 + cu2;
      }
      for (IDENTIFIER_START = new Array(128), ch = 0; ch < 128; ++ch)
        IDENTIFIER_START[ch] = ch >= 97 && ch <= 122 || // a..z
        ch >= 65 && ch <= 90 || // A..Z
        ch === 36 || ch === 95;
      for (IDENTIFIER_PART = new Array(128), ch = 0; ch < 128; ++ch)
        IDENTIFIER_PART[ch] = ch >= 97 && ch <= 122 || // a..z
        ch >= 65 && ch <= 90 || // A..Z
        ch >= 48 && ch <= 57 || // 0..9
        ch === 36 || ch === 95;
      function isIdentifierStartES5(ch2) {
        return ch2 < 128 ? IDENTIFIER_START[ch2] : ES5Regex.NonAsciiIdentifierStart.test(fromCodePoint(ch2));
      }
      function isIdentifierPartES5(ch2) {
        return ch2 < 128 ? IDENTIFIER_PART[ch2] : ES5Regex.NonAsciiIdentifierPart.test(fromCodePoint(ch2));
      }
      function isIdentifierStartES6(ch2) {
        return ch2 < 128 ? IDENTIFIER_START[ch2] : ES6Regex.NonAsciiIdentifierStart.test(fromCodePoint(ch2));
      }
      function isIdentifierPartES6(ch2) {
        return ch2 < 128 ? IDENTIFIER_PART[ch2] : ES6Regex.NonAsciiIdentifierPart.test(fromCodePoint(ch2));
      }
      module.exports = {
        isDecimalDigit: isDecimalDigit2,
        isHexDigit: isHexDigit2,
        isOctalDigit: isOctalDigit2,
        isWhiteSpace,
        isLineTerminator,
        isIdentifierStartES5,
        isIdentifierPartES5,
        isIdentifierStartES6,
        isIdentifierPartES6
      };
    })();
  }
});

// ../../../node_modules/esutils/lib/keyword.js
var require_keyword = __commonJS({
  "../../../node_modules/esutils/lib/keyword.js"(exports, module) {
    (function() {
      "use strict";
      var code = require_code();
      function isStrictModeReservedWordES6(id) {
        switch (id) {
          case "implements":
          case "interface":
          case "package":
          case "private":
          case "protected":
          case "public":
          case "static":
          case "let":
            return !0;
          default:
            return !1;
        }
      }
      function isKeywordES5(id, strict) {
        return !strict && id === "yield" ? !1 : isKeywordES6(id, strict);
      }
      function isKeywordES6(id, strict) {
        if (strict && isStrictModeReservedWordES6(id))
          return !0;
        switch (id.length) {
          case 2:
            return id === "if" || id === "in" || id === "do";
          case 3:
            return id === "var" || id === "for" || id === "new" || id === "try";
          case 4:
            return id === "this" || id === "else" || id === "case" || id === "void" || id === "with" || id === "enum";
          case 5:
            return id === "while" || id === "break" || id === "catch" || id === "throw" || id === "const" || id === "yield" || id === "class" || id === "super";
          case 6:
            return id === "return" || id === "typeof" || id === "delete" || id === "switch" || id === "export" || id === "import";
          case 7:
            return id === "default" || id === "finally" || id === "extends";
          case 8:
            return id === "function" || id === "continue" || id === "debugger";
          case 10:
            return id === "instanceof";
          default:
            return !1;
        }
      }
      function isReservedWordES5(id, strict) {
        return id === "null" || id === "true" || id === "false" || isKeywordES5(id, strict);
      }
      function isReservedWordES6(id, strict) {
        return id === "null" || id === "true" || id === "false" || isKeywordES6(id, strict);
      }
      function isRestrictedWord(id) {
        return id === "eval" || id === "arguments";
      }
      function isIdentifierNameES5(id) {
        var i2, iz, ch;
        if (id.length === 0 || (ch = id.charCodeAt(0), !code.isIdentifierStartES5(ch)))
          return !1;
        for (i2 = 1, iz = id.length; i2 < iz; ++i2)
          if (ch = id.charCodeAt(i2), !code.isIdentifierPartES5(ch))
            return !1;
        return !0;
      }
      function decodeUtf16(lead, trail) {
        return (lead - 55296) * 1024 + (trail - 56320) + 65536;
      }
      function isIdentifierNameES6(id) {
        var i2, iz, ch, lowCh, check;
        if (id.length === 0)
          return !1;
        for (check = code.isIdentifierStartES6, i2 = 0, iz = id.length; i2 < iz; ++i2) {
          if (ch = id.charCodeAt(i2), 55296 <= ch && ch <= 56319) {
            if (++i2, i2 >= iz || (lowCh = id.charCodeAt(i2), !(56320 <= lowCh && lowCh <= 57343)))
              return !1;
            ch = decodeUtf16(ch, lowCh);
          }
          if (!check(ch))
            return !1;
          check = code.isIdentifierPartES6;
        }
        return !0;
      }
      function isIdentifierES5(id, strict) {
        return isIdentifierNameES5(id) && !isReservedWordES5(id, strict);
      }
      function isIdentifierES6(id, strict) {
        return isIdentifierNameES6(id) && !isReservedWordES6(id, strict);
      }
      module.exports = {
        isKeywordES5,
        isKeywordES6,
        isReservedWordES5,
        isReservedWordES6,
        isRestrictedWord,
        isIdentifierNameES5,
        isIdentifierNameES6,
        isIdentifierES5,
        isIdentifierES6
      };
    })();
  }
});

// ../../../node_modules/esutils/lib/utils.js
var require_utils = __commonJS({
  "../../../node_modules/esutils/lib/utils.js"(exports) {
    (function() {
      "use strict";
      exports.ast = require_ast(), exports.code = require_code(), exports.keyword = require_keyword();
    })();
  }
});

// ../../../node_modules/escodegen/node_modules/source-map/lib/base64.js
var require_base64 = __commonJS({
  "../../../node_modules/escodegen/node_modules/source-map/lib/base64.js"(exports) {
    var intToCharMap = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
    exports.encode = function(number) {
      if (0 <= number && number < intToCharMap.length)
        return intToCharMap[number];
      throw new TypeError("Must be between 0 and 63: " + number);
    };
    exports.decode = function(charCode) {
      var bigA = 65, bigZ = 90, littleA = 97, littleZ = 122, zero = 48, nine = 57, plus = 43, slash = 47, littleOffset = 26, numberOffset = 52;
      return bigA <= charCode && charCode <= bigZ ? charCode - bigA : littleA <= charCode && charCode <= littleZ ? charCode - littleA + littleOffset : zero <= charCode && charCode <= nine ? charCode - zero + numberOffset : charCode == plus ? 62 : charCode == slash ? 63 : -1;
    };
  }
});

// ../../../node_modules/escodegen/node_modules/source-map/lib/base64-vlq.js
var require_base64_vlq = __commonJS({
  "../../../node_modules/escodegen/node_modules/source-map/lib/base64-vlq.js"(exports) {
    var base64 = require_base64(), VLQ_BASE_SHIFT = 5, VLQ_BASE = 1 << VLQ_BASE_SHIFT, VLQ_BASE_MASK = VLQ_BASE - 1, VLQ_CONTINUATION_BIT = VLQ_BASE;
    function toVLQSigned(aValue) {
      return aValue < 0 ? (-aValue << 1) + 1 : (aValue << 1) + 0;
    }
    function fromVLQSigned(aValue) {
      var isNegative = (aValue & 1) === 1, shifted = aValue >> 1;
      return isNegative ? -shifted : shifted;
    }
    exports.encode = function(aValue) {
      var encoded = "", digit, vlq = toVLQSigned(aValue);
      do
        digit = vlq & VLQ_BASE_MASK, vlq >>>= VLQ_BASE_SHIFT, vlq > 0 && (digit |= VLQ_CONTINUATION_BIT), encoded += base64.encode(digit);
      while (vlq > 0);
      return encoded;
    };
    exports.decode = function(aStr, aIndex, aOutParam) {
      var strLen = aStr.length, result = 0, shift = 0, continuation, digit;
      do {
        if (aIndex >= strLen)
          throw new Error("Expected more digits in base 64 VLQ value.");
        if (digit = base64.decode(aStr.charCodeAt(aIndex++)), digit === -1)
          throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
        continuation = !!(digit & VLQ_CONTINUATION_BIT), digit &= VLQ_BASE_MASK, result = result + (digit << shift), shift += VLQ_BASE_SHIFT;
      } while (continuation);
      aOutParam.value = fromVLQSigned(result), aOutParam.rest = aIndex;
    };
  }
});

// ../../../node_modules/escodegen/node_modules/source-map/lib/util.js
var require_util = __commonJS({
  "../../../node_modules/escodegen/node_modules/source-map/lib/util.js"(exports) {
    function getArg(aArgs, aName, aDefaultValue) {
      if (aName in aArgs)
        return aArgs[aName];
      if (arguments.length === 3)
        return aDefaultValue;
      throw new Error('"' + aName + '" is a required argument.');
    }
    exports.getArg = getArg;
    var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/, dataUrlRegexp = /^data:.+\,.+$/;
    function urlParse(aUrl) {
      var match = aUrl.match(urlRegexp);
      return match ? {
        scheme: match[1],
        auth: match[2],
        host: match[3],
        port: match[4],
        path: match[5]
      } : null;
    }
    exports.urlParse = urlParse;
    function urlGenerate(aParsedUrl) {
      var url = "";
      return aParsedUrl.scheme && (url += aParsedUrl.scheme + ":"), url += "//", aParsedUrl.auth && (url += aParsedUrl.auth + "@"), aParsedUrl.host && (url += aParsedUrl.host), aParsedUrl.port && (url += ":" + aParsedUrl.port), aParsedUrl.path && (url += aParsedUrl.path), url;
    }
    exports.urlGenerate = urlGenerate;
    function normalize2(aPath) {
      var path5 = aPath, url = urlParse(aPath);
      if (url) {
        if (!url.path)
          return aPath;
        path5 = url.path;
      }
      for (var isAbsolute4 = exports.isAbsolute(path5), parts = path5.split(/\/+/), part, up3 = 0, i2 = parts.length - 1; i2 >= 0; i2--)
        part = parts[i2], part === "." ? parts.splice(i2, 1) : part === ".." ? up3++ : up3 > 0 && (part === "" ? (parts.splice(i2 + 1, up3), up3 = 0) : (parts.splice(i2, 2), up3--));
      return path5 = parts.join("/"), path5 === "" && (path5 = isAbsolute4 ? "/" : "."), url ? (url.path = path5, urlGenerate(url)) : path5;
    }
    exports.normalize = normalize2;
    function join7(aRoot, aPath) {
      aRoot === "" && (aRoot = "."), aPath === "" && (aPath = ".");
      var aPathUrl = urlParse(aPath), aRootUrl = urlParse(aRoot);
      if (aRootUrl && (aRoot = aRootUrl.path || "/"), aPathUrl && !aPathUrl.scheme)
        return aRootUrl && (aPathUrl.scheme = aRootUrl.scheme), urlGenerate(aPathUrl);
      if (aPathUrl || aPath.match(dataUrlRegexp))
        return aPath;
      if (aRootUrl && !aRootUrl.host && !aRootUrl.path)
        return aRootUrl.host = aPath, urlGenerate(aRootUrl);
      var joined = aPath.charAt(0) === "/" ? aPath : normalize2(aRoot.replace(/\/+$/, "") + "/" + aPath);
      return aRootUrl ? (aRootUrl.path = joined, urlGenerate(aRootUrl)) : joined;
    }
    exports.join = join7;
    exports.isAbsolute = function(aPath) {
      return aPath.charAt(0) === "/" || urlRegexp.test(aPath);
    };
    function relative3(aRoot, aPath) {
      aRoot === "" && (aRoot = "."), aRoot = aRoot.replace(/\/$/, "");
      for (var level = 0; aPath.indexOf(aRoot + "/") !== 0; ) {
        var index = aRoot.lastIndexOf("/");
        if (index < 0 || (aRoot = aRoot.slice(0, index), aRoot.match(/^([^\/]+:\/)?\/*$/)))
          return aPath;
        ++level;
      }
      return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
    }
    exports.relative = relative3;
    var supportsNullProto = (function() {
      var obj = /* @__PURE__ */ Object.create(null);
      return !("__proto__" in obj);
    })();
    function identity(s) {
      return s;
    }
    function toSetString(aStr) {
      return isProtoString(aStr) ? "$" + aStr : aStr;
    }
    exports.toSetString = supportsNullProto ? identity : toSetString;
    function fromSetString(aStr) {
      return isProtoString(aStr) ? aStr.slice(1) : aStr;
    }
    exports.fromSetString = supportsNullProto ? identity : fromSetString;
    function isProtoString(s) {
      if (!s)
        return !1;
      var length = s.length;
      if (length < 9 || s.charCodeAt(length - 1) !== 95 || s.charCodeAt(length - 2) !== 95 || s.charCodeAt(length - 3) !== 111 || s.charCodeAt(length - 4) !== 116 || s.charCodeAt(length - 5) !== 111 || s.charCodeAt(length - 6) !== 114 || s.charCodeAt(length - 7) !== 112 || s.charCodeAt(length - 8) !== 95 || s.charCodeAt(length - 9) !== 95)
        return !1;
      for (var i2 = length - 10; i2 >= 0; i2--)
        if (s.charCodeAt(i2) !== 36)
          return !1;
      return !0;
    }
    function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
      var cmp = strcmp(mappingA.source, mappingB.source);
      return cmp !== 0 || (cmp = mappingA.originalLine - mappingB.originalLine, cmp !== 0) || (cmp = mappingA.originalColumn - mappingB.originalColumn, cmp !== 0 || onlyCompareOriginal) || (cmp = mappingA.generatedColumn - mappingB.generatedColumn, cmp !== 0) || (cmp = mappingA.generatedLine - mappingB.generatedLine, cmp !== 0) ? cmp : strcmp(mappingA.name, mappingB.name);
    }
    exports.compareByOriginalPositions = compareByOriginalPositions;
    function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
      var cmp = mappingA.generatedLine - mappingB.generatedLine;
      return cmp !== 0 || (cmp = mappingA.generatedColumn - mappingB.generatedColumn, cmp !== 0 || onlyCompareGenerated) || (cmp = strcmp(mappingA.source, mappingB.source), cmp !== 0) || (cmp = mappingA.originalLine - mappingB.originalLine, cmp !== 0) || (cmp = mappingA.originalColumn - mappingB.originalColumn, cmp !== 0) ? cmp : strcmp(mappingA.name, mappingB.name);
    }
    exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;
    function strcmp(aStr1, aStr2) {
      return aStr1 === aStr2 ? 0 : aStr1 === null ? 1 : aStr2 === null ? -1 : aStr1 > aStr2 ? 1 : -1;
    }
    function compareByGeneratedPositionsInflated(mappingA, mappingB) {
      var cmp = mappingA.generatedLine - mappingB.generatedLine;
      return cmp !== 0 || (cmp = mappingA.generatedColumn - mappingB.generatedColumn, cmp !== 0) || (cmp = strcmp(mappingA.source, mappingB.source), cmp !== 0) || (cmp = mappingA.originalLine - mappingB.originalLine, cmp !== 0) || (cmp = mappingA.originalColumn - mappingB.originalColumn, cmp !== 0) ? cmp : strcmp(mappingA.name, mappingB.name);
    }
    exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;
    function parseSourceMapInput(str) {
      return JSON.parse(str.replace(/^\)]}'[^\n]*\n/, ""));
    }
    exports.parseSourceMapInput = parseSourceMapInput;
    function computeSourceURL(sourceRoot, sourceURL, sourceMapURL) {
      if (sourceURL = sourceURL || "", sourceRoot && (sourceRoot[sourceRoot.length - 1] !== "/" && sourceURL[0] !== "/" && (sourceRoot += "/"), sourceURL = sourceRoot + sourceURL), sourceMapURL) {
        var parsed = urlParse(sourceMapURL);
        if (!parsed)
          throw new Error("sourceMapURL could not be parsed");
        if (parsed.path) {
          var index = parsed.path.lastIndexOf("/");
          index >= 0 && (parsed.path = parsed.path.substring(0, index + 1));
        }
        sourceURL = join7(urlGenerate(parsed), sourceURL);
      }
      return normalize2(sourceURL);
    }
    exports.computeSourceURL = computeSourceURL;
  }
});

// ../../../node_modules/escodegen/node_modules/source-map/lib/array-set.js
var require_array_set = __commonJS({
  "../../../node_modules/escodegen/node_modules/source-map/lib/array-set.js"(exports) {
    var util = require_util(), has = Object.prototype.hasOwnProperty, hasNativeMap = typeof Map < "u";
    function ArraySet() {
      this._array = [], this._set = hasNativeMap ? /* @__PURE__ */ new Map() : /* @__PURE__ */ Object.create(null);
    }
    ArraySet.fromArray = function(aArray, aAllowDuplicates) {
      for (var set = new ArraySet(), i2 = 0, len = aArray.length; i2 < len; i2++)
        set.add(aArray[i2], aAllowDuplicates);
      return set;
    };
    ArraySet.prototype.size = function() {
      return hasNativeMap ? this._set.size : Object.getOwnPropertyNames(this._set).length;
    };
    ArraySet.prototype.add = function(aStr, aAllowDuplicates) {
      var sStr = hasNativeMap ? aStr : util.toSetString(aStr), isDuplicate = hasNativeMap ? this.has(aStr) : has.call(this._set, sStr), idx = this._array.length;
      (!isDuplicate || aAllowDuplicates) && this._array.push(aStr), isDuplicate || (hasNativeMap ? this._set.set(aStr, idx) : this._set[sStr] = idx);
    };
    ArraySet.prototype.has = function(aStr) {
      if (hasNativeMap)
        return this._set.has(aStr);
      var sStr = util.toSetString(aStr);
      return has.call(this._set, sStr);
    };
    ArraySet.prototype.indexOf = function(aStr) {
      if (hasNativeMap) {
        var idx = this._set.get(aStr);
        if (idx >= 0)
          return idx;
      } else {
        var sStr = util.toSetString(aStr);
        if (has.call(this._set, sStr))
          return this._set[sStr];
      }
      throw new Error('"' + aStr + '" is not in the set.');
    };
    ArraySet.prototype.at = function(aIdx) {
      if (aIdx >= 0 && aIdx < this._array.length)
        return this._array[aIdx];
      throw new Error("No element indexed by " + aIdx);
    };
    ArraySet.prototype.toArray = function() {
      return this._array.slice();
    };
    exports.ArraySet = ArraySet;
  }
});

// ../../../node_modules/escodegen/node_modules/source-map/lib/mapping-list.js
var require_mapping_list = __commonJS({
  "../../../node_modules/escodegen/node_modules/source-map/lib/mapping-list.js"(exports) {
    var util = require_util();
    function generatedPositionAfter(mappingA, mappingB) {
      var lineA = mappingA.generatedLine, lineB = mappingB.generatedLine, columnA = mappingA.generatedColumn, columnB = mappingB.generatedColumn;
      return lineB > lineA || lineB == lineA && columnB >= columnA || util.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
    }
    function MappingList() {
      this._array = [], this._sorted = !0, this._last = { generatedLine: -1, generatedColumn: 0 };
    }
    MappingList.prototype.unsortedForEach = function(aCallback, aThisArg) {
      this._array.forEach(aCallback, aThisArg);
    };
    MappingList.prototype.add = function(aMapping) {
      generatedPositionAfter(this._last, aMapping) ? (this._last = aMapping, this._array.push(aMapping)) : (this._sorted = !1, this._array.push(aMapping));
    };
    MappingList.prototype.toArray = function() {
      return this._sorted || (this._array.sort(util.compareByGeneratedPositionsInflated), this._sorted = !0), this._array;
    };
    exports.MappingList = MappingList;
  }
});

// ../../../node_modules/escodegen/node_modules/source-map/lib/source-map-generator.js
var require_source_map_generator = __commonJS({
  "../../../node_modules/escodegen/node_modules/source-map/lib/source-map-generator.js"(exports) {
    var base64VLQ = require_base64_vlq(), util = require_util(), ArraySet = require_array_set().ArraySet, MappingList = require_mapping_list().MappingList;
    function SourceMapGenerator(aArgs) {
      aArgs || (aArgs = {}), this._file = util.getArg(aArgs, "file", null), this._sourceRoot = util.getArg(aArgs, "sourceRoot", null), this._skipValidation = util.getArg(aArgs, "skipValidation", !1), this._sources = new ArraySet(), this._names = new ArraySet(), this._mappings = new MappingList(), this._sourcesContents = null;
    }
    SourceMapGenerator.prototype._version = 3;
    SourceMapGenerator.fromSourceMap = function(aSourceMapConsumer) {
      var sourceRoot = aSourceMapConsumer.sourceRoot, generator = new SourceMapGenerator({
        file: aSourceMapConsumer.file,
        sourceRoot
      });
      return aSourceMapConsumer.eachMapping(function(mapping) {
        var newMapping = {
          generated: {
            line: mapping.generatedLine,
            column: mapping.generatedColumn
          }
        };
        mapping.source != null && (newMapping.source = mapping.source, sourceRoot != null && (newMapping.source = util.relative(sourceRoot, newMapping.source)), newMapping.original = {
          line: mapping.originalLine,
          column: mapping.originalColumn
        }, mapping.name != null && (newMapping.name = mapping.name)), generator.addMapping(newMapping);
      }), aSourceMapConsumer.sources.forEach(function(sourceFile) {
        var sourceRelative = sourceFile;
        sourceRoot !== null && (sourceRelative = util.relative(sourceRoot, sourceFile)), generator._sources.has(sourceRelative) || generator._sources.add(sourceRelative);
        var content = aSourceMapConsumer.sourceContentFor(sourceFile);
        content != null && generator.setSourceContent(sourceFile, content);
      }), generator;
    };
    SourceMapGenerator.prototype.addMapping = function(aArgs) {
      var generated = util.getArg(aArgs, "generated"), original = util.getArg(aArgs, "original", null), source = util.getArg(aArgs, "source", null), name = util.getArg(aArgs, "name", null);
      this._skipValidation || this._validateMapping(generated, original, source, name), source != null && (source = String(source), this._sources.has(source) || this._sources.add(source)), name != null && (name = String(name), this._names.has(name) || this._names.add(name)), this._mappings.add({
        generatedLine: generated.line,
        generatedColumn: generated.column,
        originalLine: original != null && original.line,
        originalColumn: original != null && original.column,
        source,
        name
      });
    };
    SourceMapGenerator.prototype.setSourceContent = function(aSourceFile, aSourceContent) {
      var source = aSourceFile;
      this._sourceRoot != null && (source = util.relative(this._sourceRoot, source)), aSourceContent != null ? (this._sourcesContents || (this._sourcesContents = /* @__PURE__ */ Object.create(null)), this._sourcesContents[util.toSetString(source)] = aSourceContent) : this._sourcesContents && (delete this._sourcesContents[util.toSetString(source)], Object.keys(this._sourcesContents).length === 0 && (this._sourcesContents = null));
    };
    SourceMapGenerator.prototype.applySourceMap = function(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
      var sourceFile = aSourceFile;
      if (aSourceFile == null) {
        if (aSourceMapConsumer.file == null)
          throw new Error(
            `SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, or the source map's "file" property. Both were omitted.`
          );
        sourceFile = aSourceMapConsumer.file;
      }
      var sourceRoot = this._sourceRoot;
      sourceRoot != null && (sourceFile = util.relative(sourceRoot, sourceFile));
      var newSources = new ArraySet(), newNames = new ArraySet();
      this._mappings.unsortedForEach(function(mapping) {
        if (mapping.source === sourceFile && mapping.originalLine != null) {
          var original = aSourceMapConsumer.originalPositionFor({
            line: mapping.originalLine,
            column: mapping.originalColumn
          });
          original.source != null && (mapping.source = original.source, aSourceMapPath != null && (mapping.source = util.join(aSourceMapPath, mapping.source)), sourceRoot != null && (mapping.source = util.relative(sourceRoot, mapping.source)), mapping.originalLine = original.line, mapping.originalColumn = original.column, original.name != null && (mapping.name = original.name));
        }
        var source = mapping.source;
        source != null && !newSources.has(source) && newSources.add(source);
        var name = mapping.name;
        name != null && !newNames.has(name) && newNames.add(name);
      }, this), this._sources = newSources, this._names = newNames, aSourceMapConsumer.sources.forEach(function(sourceFile2) {
        var content = aSourceMapConsumer.sourceContentFor(sourceFile2);
        content != null && (aSourceMapPath != null && (sourceFile2 = util.join(aSourceMapPath, sourceFile2)), sourceRoot != null && (sourceFile2 = util.relative(sourceRoot, sourceFile2)), this.setSourceContent(sourceFile2, content));
      }, this);
    };
    SourceMapGenerator.prototype._validateMapping = function(aGenerated, aOriginal, aSource, aName) {
      if (aOriginal && typeof aOriginal.line != "number" && typeof aOriginal.column != "number")
        throw new Error(
          "original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values."
        );
      if (!(aGenerated && "line" in aGenerated && "column" in aGenerated && aGenerated.line > 0 && aGenerated.column >= 0 && !aOriginal && !aSource && !aName)) {
        if (aGenerated && "line" in aGenerated && "column" in aGenerated && aOriginal && "line" in aOriginal && "column" in aOriginal && aGenerated.line > 0 && aGenerated.column >= 0 && aOriginal.line > 0 && aOriginal.column >= 0 && aSource)
          return;
        throw new Error("Invalid mapping: " + JSON.stringify({
          generated: aGenerated,
          source: aSource,
          original: aOriginal,
          name: aName
        }));
      }
    };
    SourceMapGenerator.prototype._serializeMappings = function() {
      for (var previousGeneratedColumn = 0, previousGeneratedLine = 1, previousOriginalColumn = 0, previousOriginalLine = 0, previousName = 0, previousSource = 0, result = "", next, mapping, nameIdx, sourceIdx, mappings = this._mappings.toArray(), i2 = 0, len = mappings.length; i2 < len; i2++) {
        if (mapping = mappings[i2], next = "", mapping.generatedLine !== previousGeneratedLine)
          for (previousGeneratedColumn = 0; mapping.generatedLine !== previousGeneratedLine; )
            next += ";", previousGeneratedLine++;
        else if (i2 > 0) {
          if (!util.compareByGeneratedPositionsInflated(mapping, mappings[i2 - 1]))
            continue;
          next += ",";
        }
        next += base64VLQ.encode(mapping.generatedColumn - previousGeneratedColumn), previousGeneratedColumn = mapping.generatedColumn, mapping.source != null && (sourceIdx = this._sources.indexOf(mapping.source), next += base64VLQ.encode(sourceIdx - previousSource), previousSource = sourceIdx, next += base64VLQ.encode(mapping.originalLine - 1 - previousOriginalLine), previousOriginalLine = mapping.originalLine - 1, next += base64VLQ.encode(mapping.originalColumn - previousOriginalColumn), previousOriginalColumn = mapping.originalColumn, mapping.name != null && (nameIdx = this._names.indexOf(mapping.name), next += base64VLQ.encode(nameIdx - previousName), previousName = nameIdx)), result += next;
      }
      return result;
    };
    SourceMapGenerator.prototype._generateSourcesContent = function(aSources, aSourceRoot) {
      return aSources.map(function(source) {
        if (!this._sourcesContents)
          return null;
        aSourceRoot != null && (source = util.relative(aSourceRoot, source));
        var key = util.toSetString(source);
        return Object.prototype.hasOwnProperty.call(this._sourcesContents, key) ? this._sourcesContents[key] : null;
      }, this);
    };
    SourceMapGenerator.prototype.toJSON = function() {
      var map = {
        version: this._version,
        sources: this._sources.toArray(),
        names: this._names.toArray(),
        mappings: this._serializeMappings()
      };
      return this._file != null && (map.file = this._file), this._sourceRoot != null && (map.sourceRoot = this._sourceRoot), this._sourcesContents && (map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot)), map;
    };
    SourceMapGenerator.prototype.toString = function() {
      return JSON.stringify(this.toJSON());
    };
    exports.SourceMapGenerator = SourceMapGenerator;
  }
});

// ../../../node_modules/escodegen/node_modules/source-map/lib/binary-search.js
var require_binary_search = __commonJS({
  "../../../node_modules/escodegen/node_modules/source-map/lib/binary-search.js"(exports) {
    exports.GREATEST_LOWER_BOUND = 1;
    exports.LEAST_UPPER_BOUND = 2;
    function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
      var mid = Math.floor((aHigh - aLow) / 2) + aLow, cmp = aCompare(aNeedle, aHaystack[mid], !0);
      return cmp === 0 ? mid : cmp > 0 ? aHigh - mid > 1 ? recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias) : aBias == exports.LEAST_UPPER_BOUND ? aHigh < aHaystack.length ? aHigh : -1 : mid : mid - aLow > 1 ? recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias) : aBias == exports.LEAST_UPPER_BOUND ? mid : aLow < 0 ? -1 : aLow;
    }
    exports.search = function(aNeedle, aHaystack, aCompare, aBias) {
      if (aHaystack.length === 0)
        return -1;
      var index = recursiveSearch(
        -1,
        aHaystack.length,
        aNeedle,
        aHaystack,
        aCompare,
        aBias || exports.GREATEST_LOWER_BOUND
      );
      if (index < 0)
        return -1;
      for (; index - 1 >= 0 && aCompare(aHaystack[index], aHaystack[index - 1], !0) === 0; )
        --index;
      return index;
    };
  }
});

// ../../../node_modules/escodegen/node_modules/source-map/lib/quick-sort.js
var require_quick_sort = __commonJS({
  "../../../node_modules/escodegen/node_modules/source-map/lib/quick-sort.js"(exports) {
    function swap(ary, x, y) {
      var temp = ary[x];
      ary[x] = ary[y], ary[y] = temp;
    }
    function randomIntInRange(low, high) {
      return Math.round(low + Math.random() * (high - low));
    }
    function doQuickSort(ary, comparator, p, r) {
      if (p < r) {
        var pivotIndex = randomIntInRange(p, r), i2 = p - 1;
        swap(ary, pivotIndex, r);
        for (var pivot = ary[r], j = p; j < r; j++)
          comparator(ary[j], pivot) <= 0 && (i2 += 1, swap(ary, i2, j));
        swap(ary, i2 + 1, j);
        var q = i2 + 1;
        doQuickSort(ary, comparator, p, q - 1), doQuickSort(ary, comparator, q + 1, r);
      }
    }
    exports.quickSort = function(ary, comparator) {
      doQuickSort(ary, comparator, 0, ary.length - 1);
    };
  }
});

// ../../../node_modules/escodegen/node_modules/source-map/lib/source-map-consumer.js
var require_source_map_consumer = __commonJS({
  "../../../node_modules/escodegen/node_modules/source-map/lib/source-map-consumer.js"(exports) {
    var util = require_util(), binarySearch = require_binary_search(), ArraySet = require_array_set().ArraySet, base64VLQ = require_base64_vlq(), quickSort = require_quick_sort().quickSort;
    function SourceMapConsumer(aSourceMap, aSourceMapURL) {
      var sourceMap = aSourceMap;
      return typeof aSourceMap == "string" && (sourceMap = util.parseSourceMapInput(aSourceMap)), sourceMap.sections != null ? new IndexedSourceMapConsumer(sourceMap, aSourceMapURL) : new BasicSourceMapConsumer(sourceMap, aSourceMapURL);
    }
    SourceMapConsumer.fromSourceMap = function(aSourceMap, aSourceMapURL) {
      return BasicSourceMapConsumer.fromSourceMap(aSourceMap, aSourceMapURL);
    };
    SourceMapConsumer.prototype._version = 3;
    SourceMapConsumer.prototype.__generatedMappings = null;
    Object.defineProperty(SourceMapConsumer.prototype, "_generatedMappings", {
      configurable: !0,
      enumerable: !0,
      get: function() {
        return this.__generatedMappings || this._parseMappings(this._mappings, this.sourceRoot), this.__generatedMappings;
      }
    });
    SourceMapConsumer.prototype.__originalMappings = null;
    Object.defineProperty(SourceMapConsumer.prototype, "_originalMappings", {
      configurable: !0,
      enumerable: !0,
      get: function() {
        return this.__originalMappings || this._parseMappings(this._mappings, this.sourceRoot), this.__originalMappings;
      }
    });
    SourceMapConsumer.prototype._charIsMappingSeparator = function(aStr, index) {
      var c = aStr.charAt(index);
      return c === ";" || c === ",";
    };
    SourceMapConsumer.prototype._parseMappings = function(aStr, aSourceRoot) {
      throw new Error("Subclasses must implement _parseMappings");
    };
    SourceMapConsumer.GENERATED_ORDER = 1;
    SourceMapConsumer.ORIGINAL_ORDER = 2;
    SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
    SourceMapConsumer.LEAST_UPPER_BOUND = 2;
    SourceMapConsumer.prototype.eachMapping = function(aCallback, aContext, aOrder) {
      var context = aContext || null, order = aOrder || SourceMapConsumer.GENERATED_ORDER, mappings;
      switch (order) {
        case SourceMapConsumer.GENERATED_ORDER:
          mappings = this._generatedMappings;
          break;
        case SourceMapConsumer.ORIGINAL_ORDER:
          mappings = this._originalMappings;
          break;
        default:
          throw new Error("Unknown order of iteration.");
      }
      var sourceRoot = this.sourceRoot;
      mappings.map(function(mapping) {
        var source = mapping.source === null ? null : this._sources.at(mapping.source);
        return source = util.computeSourceURL(sourceRoot, source, this._sourceMapURL), {
          source,
          generatedLine: mapping.generatedLine,
          generatedColumn: mapping.generatedColumn,
          originalLine: mapping.originalLine,
          originalColumn: mapping.originalColumn,
          name: mapping.name === null ? null : this._names.at(mapping.name)
        };
      }, this).forEach(aCallback, context);
    };
    SourceMapConsumer.prototype.allGeneratedPositionsFor = function(aArgs) {
      var line = util.getArg(aArgs, "line"), needle = {
        source: util.getArg(aArgs, "source"),
        originalLine: line,
        originalColumn: util.getArg(aArgs, "column", 0)
      };
      if (needle.source = this._findSourceIndex(needle.source), needle.source < 0)
        return [];
      var mappings = [], index = this._findMapping(
        needle,
        this._originalMappings,
        "originalLine",
        "originalColumn",
        util.compareByOriginalPositions,
        binarySearch.LEAST_UPPER_BOUND
      );
      if (index >= 0) {
        var mapping = this._originalMappings[index];
        if (aArgs.column === void 0)
          for (var originalLine = mapping.originalLine; mapping && mapping.originalLine === originalLine; )
            mappings.push({
              line: util.getArg(mapping, "generatedLine", null),
              column: util.getArg(mapping, "generatedColumn", null),
              lastColumn: util.getArg(mapping, "lastGeneratedColumn", null)
            }), mapping = this._originalMappings[++index];
        else
          for (var originalColumn = mapping.originalColumn; mapping && mapping.originalLine === line && mapping.originalColumn == originalColumn; )
            mappings.push({
              line: util.getArg(mapping, "generatedLine", null),
              column: util.getArg(mapping, "generatedColumn", null),
              lastColumn: util.getArg(mapping, "lastGeneratedColumn", null)
            }), mapping = this._originalMappings[++index];
      }
      return mappings;
    };
    exports.SourceMapConsumer = SourceMapConsumer;
    function BasicSourceMapConsumer(aSourceMap, aSourceMapURL) {
      var sourceMap = aSourceMap;
      typeof aSourceMap == "string" && (sourceMap = util.parseSourceMapInput(aSourceMap));
      var version2 = util.getArg(sourceMap, "version"), sources = util.getArg(sourceMap, "sources"), names = util.getArg(sourceMap, "names", []), sourceRoot = util.getArg(sourceMap, "sourceRoot", null), sourcesContent = util.getArg(sourceMap, "sourcesContent", null), mappings = util.getArg(sourceMap, "mappings"), file = util.getArg(sourceMap, "file", null);
      if (version2 != this._version)
        throw new Error("Unsupported version: " + version2);
      sourceRoot && (sourceRoot = util.normalize(sourceRoot)), sources = sources.map(String).map(util.normalize).map(function(source) {
        return sourceRoot && util.isAbsolute(sourceRoot) && util.isAbsolute(source) ? util.relative(sourceRoot, source) : source;
      }), this._names = ArraySet.fromArray(names.map(String), !0), this._sources = ArraySet.fromArray(sources, !0), this._absoluteSources = this._sources.toArray().map(function(s) {
        return util.computeSourceURL(sourceRoot, s, aSourceMapURL);
      }), this.sourceRoot = sourceRoot, this.sourcesContent = sourcesContent, this._mappings = mappings, this._sourceMapURL = aSourceMapURL, this.file = file;
    }
    BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
    BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;
    BasicSourceMapConsumer.prototype._findSourceIndex = function(aSource) {
      var relativeSource = aSource;
      if (this.sourceRoot != null && (relativeSource = util.relative(this.sourceRoot, relativeSource)), this._sources.has(relativeSource))
        return this._sources.indexOf(relativeSource);
      var i2;
      for (i2 = 0; i2 < this._absoluteSources.length; ++i2)
        if (this._absoluteSources[i2] == aSource)
          return i2;
      return -1;
    };
    BasicSourceMapConsumer.fromSourceMap = function(aSourceMap, aSourceMapURL) {
      var smc = Object.create(BasicSourceMapConsumer.prototype), names = smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), !0), sources = smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), !0);
      smc.sourceRoot = aSourceMap._sourceRoot, smc.sourcesContent = aSourceMap._generateSourcesContent(
        smc._sources.toArray(),
        smc.sourceRoot
      ), smc.file = aSourceMap._file, smc._sourceMapURL = aSourceMapURL, smc._absoluteSources = smc._sources.toArray().map(function(s) {
        return util.computeSourceURL(smc.sourceRoot, s, aSourceMapURL);
      });
      for (var generatedMappings = aSourceMap._mappings.toArray().slice(), destGeneratedMappings = smc.__generatedMappings = [], destOriginalMappings = smc.__originalMappings = [], i2 = 0, length = generatedMappings.length; i2 < length; i2++) {
        var srcMapping = generatedMappings[i2], destMapping = new Mapping();
        destMapping.generatedLine = srcMapping.generatedLine, destMapping.generatedColumn = srcMapping.generatedColumn, srcMapping.source && (destMapping.source = sources.indexOf(srcMapping.source), destMapping.originalLine = srcMapping.originalLine, destMapping.originalColumn = srcMapping.originalColumn, srcMapping.name && (destMapping.name = names.indexOf(srcMapping.name)), destOriginalMappings.push(destMapping)), destGeneratedMappings.push(destMapping);
      }
      return quickSort(smc.__originalMappings, util.compareByOriginalPositions), smc;
    };
    BasicSourceMapConsumer.prototype._version = 3;
    Object.defineProperty(BasicSourceMapConsumer.prototype, "sources", {
      get: function() {
        return this._absoluteSources.slice();
      }
    });
    function Mapping() {
      this.generatedLine = 0, this.generatedColumn = 0, this.source = null, this.originalLine = null, this.originalColumn = null, this.name = null;
    }
    BasicSourceMapConsumer.prototype._parseMappings = function(aStr, aSourceRoot) {
      for (var generatedLine = 1, previousGeneratedColumn = 0, previousOriginalLine = 0, previousOriginalColumn = 0, previousSource = 0, previousName = 0, length = aStr.length, index = 0, cachedSegments = {}, temp = {}, originalMappings = [], generatedMappings = [], mapping, str, segment, end, value; index < length; )
        if (aStr.charAt(index) === ";")
          generatedLine++, index++, previousGeneratedColumn = 0;
        else if (aStr.charAt(index) === ",")
          index++;
        else {
          for (mapping = new Mapping(), mapping.generatedLine = generatedLine, end = index; end < length && !this._charIsMappingSeparator(aStr, end); end++)
            ;
          if (str = aStr.slice(index, end), segment = cachedSegments[str], segment)
            index += str.length;
          else {
            for (segment = []; index < end; )
              base64VLQ.decode(aStr, index, temp), value = temp.value, index = temp.rest, segment.push(value);
            if (segment.length === 2)
              throw new Error("Found a source, but no line and column");
            if (segment.length === 3)
              throw new Error("Found a source and line, but no column");
            cachedSegments[str] = segment;
          }
          mapping.generatedColumn = previousGeneratedColumn + segment[0], previousGeneratedColumn = mapping.generatedColumn, segment.length > 1 && (mapping.source = previousSource + segment[1], previousSource += segment[1], mapping.originalLine = previousOriginalLine + segment[2], previousOriginalLine = mapping.originalLine, mapping.originalLine += 1, mapping.originalColumn = previousOriginalColumn + segment[3], previousOriginalColumn = mapping.originalColumn, segment.length > 4 && (mapping.name = previousName + segment[4], previousName += segment[4])), generatedMappings.push(mapping), typeof mapping.originalLine == "number" && originalMappings.push(mapping);
        }
      quickSort(generatedMappings, util.compareByGeneratedPositionsDeflated), this.__generatedMappings = generatedMappings, quickSort(originalMappings, util.compareByOriginalPositions), this.__originalMappings = originalMappings;
    };
    BasicSourceMapConsumer.prototype._findMapping = function(aNeedle, aMappings, aLineName, aColumnName, aComparator, aBias) {
      if (aNeedle[aLineName] <= 0)
        throw new TypeError("Line must be greater than or equal to 1, got " + aNeedle[aLineName]);
      if (aNeedle[aColumnName] < 0)
        throw new TypeError("Column must be greater than or equal to 0, got " + aNeedle[aColumnName]);
      return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
    };
    BasicSourceMapConsumer.prototype.computeColumnSpans = function() {
      for (var index = 0; index < this._generatedMappings.length; ++index) {
        var mapping = this._generatedMappings[index];
        if (index + 1 < this._generatedMappings.length) {
          var nextMapping = this._generatedMappings[index + 1];
          if (mapping.generatedLine === nextMapping.generatedLine) {
            mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
            continue;
          }
        }
        mapping.lastGeneratedColumn = 1 / 0;
      }
    };
    BasicSourceMapConsumer.prototype.originalPositionFor = function(aArgs) {
      var needle = {
        generatedLine: util.getArg(aArgs, "line"),
        generatedColumn: util.getArg(aArgs, "column")
      }, index = this._findMapping(
        needle,
        this._generatedMappings,
        "generatedLine",
        "generatedColumn",
        util.compareByGeneratedPositionsDeflated,
        util.getArg(aArgs, "bias", SourceMapConsumer.GREATEST_LOWER_BOUND)
      );
      if (index >= 0) {
        var mapping = this._generatedMappings[index];
        if (mapping.generatedLine === needle.generatedLine) {
          var source = util.getArg(mapping, "source", null);
          source !== null && (source = this._sources.at(source), source = util.computeSourceURL(this.sourceRoot, source, this._sourceMapURL));
          var name = util.getArg(mapping, "name", null);
          return name !== null && (name = this._names.at(name)), {
            source,
            line: util.getArg(mapping, "originalLine", null),
            column: util.getArg(mapping, "originalColumn", null),
            name
          };
        }
      }
      return {
        source: null,
        line: null,
        column: null,
        name: null
      };
    };
    BasicSourceMapConsumer.prototype.hasContentsOfAllSources = function() {
      return this.sourcesContent ? this.sourcesContent.length >= this._sources.size() && !this.sourcesContent.some(function(sc) {
        return sc == null;
      }) : !1;
    };
    BasicSourceMapConsumer.prototype.sourceContentFor = function(aSource, nullOnMissing) {
      if (!this.sourcesContent)
        return null;
      var index = this._findSourceIndex(aSource);
      if (index >= 0)
        return this.sourcesContent[index];
      var relativeSource = aSource;
      this.sourceRoot != null && (relativeSource = util.relative(this.sourceRoot, relativeSource));
      var url;
      if (this.sourceRoot != null && (url = util.urlParse(this.sourceRoot))) {
        var fileUriAbsPath = relativeSource.replace(/^file:\/\//, "");
        if (url.scheme == "file" && this._sources.has(fileUriAbsPath))
          return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)];
        if ((!url.path || url.path == "/") && this._sources.has("/" + relativeSource))
          return this.sourcesContent[this._sources.indexOf("/" + relativeSource)];
      }
      if (nullOnMissing)
        return null;
      throw new Error('"' + relativeSource + '" is not in the SourceMap.');
    };
    BasicSourceMapConsumer.prototype.generatedPositionFor = function(aArgs) {
      var source = util.getArg(aArgs, "source");
      if (source = this._findSourceIndex(source), source < 0)
        return {
          line: null,
          column: null,
          lastColumn: null
        };
      var needle = {
        source,
        originalLine: util.getArg(aArgs, "line"),
        originalColumn: util.getArg(aArgs, "column")
      }, index = this._findMapping(
        needle,
        this._originalMappings,
        "originalLine",
        "originalColumn",
        util.compareByOriginalPositions,
        util.getArg(aArgs, "bias", SourceMapConsumer.GREATEST_LOWER_BOUND)
      );
      if (index >= 0) {
        var mapping = this._originalMappings[index];
        if (mapping.source === needle.source)
          return {
            line: util.getArg(mapping, "generatedLine", null),
            column: util.getArg(mapping, "generatedColumn", null),
            lastColumn: util.getArg(mapping, "lastGeneratedColumn", null)
          };
      }
      return {
        line: null,
        column: null,
        lastColumn: null
      };
    };
    exports.BasicSourceMapConsumer = BasicSourceMapConsumer;
    function IndexedSourceMapConsumer(aSourceMap, aSourceMapURL) {
      var sourceMap = aSourceMap;
      typeof aSourceMap == "string" && (sourceMap = util.parseSourceMapInput(aSourceMap));
      var version2 = util.getArg(sourceMap, "version"), sections = util.getArg(sourceMap, "sections");
      if (version2 != this._version)
        throw new Error("Unsupported version: " + version2);
      this._sources = new ArraySet(), this._names = new ArraySet();
      var lastOffset = {
        line: -1,
        column: 0
      };
      this._sections = sections.map(function(s) {
        if (s.url)
          throw new Error("Support for url field in sections not implemented.");
        var offset2 = util.getArg(s, "offset"), offsetLine = util.getArg(offset2, "line"), offsetColumn = util.getArg(offset2, "column");
        if (offsetLine < lastOffset.line || offsetLine === lastOffset.line && offsetColumn < lastOffset.column)
          throw new Error("Section offsets must be ordered and non-overlapping.");
        return lastOffset = offset2, {
          generatedOffset: {
            // The offset fields are 0-based, but we use 1-based indices when
            // encoding/decoding from VLQ.
            generatedLine: offsetLine + 1,
            generatedColumn: offsetColumn + 1
          },
          consumer: new SourceMapConsumer(util.getArg(s, "map"), aSourceMapURL)
        };
      });
    }
    IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
    IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;
    IndexedSourceMapConsumer.prototype._version = 3;
    Object.defineProperty(IndexedSourceMapConsumer.prototype, "sources", {
      get: function() {
        for (var sources = [], i2 = 0; i2 < this._sections.length; i2++)
          for (var j = 0; j < this._sections[i2].consumer.sources.length; j++)
            sources.push(this._sections[i2].consumer.sources[j]);
        return sources;
      }
    });
    IndexedSourceMapConsumer.prototype.originalPositionFor = function(aArgs) {
      var needle = {
        generatedLine: util.getArg(aArgs, "line"),
        generatedColumn: util.getArg(aArgs, "column")
      }, sectionIndex = binarySearch.search(
        needle,
        this._sections,
        function(needle2, section2) {
          var cmp = needle2.generatedLine - section2.generatedOffset.generatedLine;
          return cmp || needle2.generatedColumn - section2.generatedOffset.generatedColumn;
        }
      ), section = this._sections[sectionIndex];
      return section ? section.consumer.originalPositionFor({
        line: needle.generatedLine - (section.generatedOffset.generatedLine - 1),
        column: needle.generatedColumn - (section.generatedOffset.generatedLine === needle.generatedLine ? section.generatedOffset.generatedColumn - 1 : 0),
        bias: aArgs.bias
      }) : {
        source: null,
        line: null,
        column: null,
        name: null
      };
    };
    IndexedSourceMapConsumer.prototype.hasContentsOfAllSources = function() {
      return this._sections.every(function(s) {
        return s.consumer.hasContentsOfAllSources();
      });
    };
    IndexedSourceMapConsumer.prototype.sourceContentFor = function(aSource, nullOnMissing) {
      for (var i2 = 0; i2 < this._sections.length; i2++) {
        var section = this._sections[i2], content = section.consumer.sourceContentFor(aSource, !0);
        if (content)
          return content;
      }
      if (nullOnMissing)
        return null;
      throw new Error('"' + aSource + '" is not in the SourceMap.');
    };
    IndexedSourceMapConsumer.prototype.generatedPositionFor = function(aArgs) {
      for (var i2 = 0; i2 < this._sections.length; i2++) {
        var section = this._sections[i2];
        if (section.consumer._findSourceIndex(util.getArg(aArgs, "source")) !== -1) {
          var generatedPosition = section.consumer.generatedPositionFor(aArgs);
          if (generatedPosition) {
            var ret = {
              line: generatedPosition.line + (section.generatedOffset.generatedLine - 1),
              column: generatedPosition.column + (section.generatedOffset.generatedLine === generatedPosition.line ? section.generatedOffset.generatedColumn - 1 : 0)
            };
            return ret;
          }
        }
      }
      return {
        line: null,
        column: null
      };
    };
    IndexedSourceMapConsumer.prototype._parseMappings = function(aStr, aSourceRoot) {
      this.__generatedMappings = [], this.__originalMappings = [];
      for (var i2 = 0; i2 < this._sections.length; i2++)
        for (var section = this._sections[i2], sectionMappings = section.consumer._generatedMappings, j = 0; j < sectionMappings.length; j++) {
          var mapping = sectionMappings[j], source = section.consumer._sources.at(mapping.source);
          source = util.computeSourceURL(section.consumer.sourceRoot, source, this._sourceMapURL), this._sources.add(source), source = this._sources.indexOf(source);
          var name = null;
          mapping.name && (name = section.consumer._names.at(mapping.name), this._names.add(name), name = this._names.indexOf(name));
          var adjustedMapping = {
            source,
            generatedLine: mapping.generatedLine + (section.generatedOffset.generatedLine - 1),
            generatedColumn: mapping.generatedColumn + (section.generatedOffset.generatedLine === mapping.generatedLine ? section.generatedOffset.generatedColumn - 1 : 0),
            originalLine: mapping.originalLine,
            originalColumn: mapping.originalColumn,
            name
          };
          this.__generatedMappings.push(adjustedMapping), typeof adjustedMapping.originalLine == "number" && this.__originalMappings.push(adjustedMapping);
        }
      quickSort(this.__generatedMappings, util.compareByGeneratedPositionsDeflated), quickSort(this.__originalMappings, util.compareByOriginalPositions);
    };
    exports.IndexedSourceMapConsumer = IndexedSourceMapConsumer;
  }
});

// ../../../node_modules/escodegen/node_modules/source-map/lib/source-node.js
var require_source_node = __commonJS({
  "../../../node_modules/escodegen/node_modules/source-map/lib/source-node.js"(exports) {
    var SourceMapGenerator = require_source_map_generator().SourceMapGenerator, util = require_util(), REGEX_NEWLINE = /(\r?\n)/, NEWLINE_CODE = 10, isSourceNode = "$$$isSourceNode$$$";
    function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
      this.children = [], this.sourceContents = {}, this.line = aLine ?? null, this.column = aColumn ?? null, this.source = aSource ?? null, this.name = aName ?? null, this[isSourceNode] = !0, aChunks != null && this.add(aChunks);
    }
    SourceNode.fromStringWithSourceMap = function(aGeneratedCode, aSourceMapConsumer, aRelativePath) {
      var node = new SourceNode(), remainingLines = aGeneratedCode.split(REGEX_NEWLINE), remainingLinesIndex = 0, shiftNextLine = function() {
        var lineContents = getNextLine(), newLine = getNextLine() || "";
        return lineContents + newLine;
        function getNextLine() {
          return remainingLinesIndex < remainingLines.length ? remainingLines[remainingLinesIndex++] : void 0;
        }
      }, lastGeneratedLine = 1, lastGeneratedColumn = 0, lastMapping = null;
      return aSourceMapConsumer.eachMapping(function(mapping) {
        if (lastMapping !== null)
          if (lastGeneratedLine < mapping.generatedLine)
            addMappingWithCode(lastMapping, shiftNextLine()), lastGeneratedLine++, lastGeneratedColumn = 0;
          else {
            var nextLine = remainingLines[remainingLinesIndex] || "", code = nextLine.substr(0, mapping.generatedColumn - lastGeneratedColumn);
            remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn - lastGeneratedColumn), lastGeneratedColumn = mapping.generatedColumn, addMappingWithCode(lastMapping, code), lastMapping = mapping;
            return;
          }
        for (; lastGeneratedLine < mapping.generatedLine; )
          node.add(shiftNextLine()), lastGeneratedLine++;
        if (lastGeneratedColumn < mapping.generatedColumn) {
          var nextLine = remainingLines[remainingLinesIndex] || "";
          node.add(nextLine.substr(0, mapping.generatedColumn)), remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn), lastGeneratedColumn = mapping.generatedColumn;
        }
        lastMapping = mapping;
      }, this), remainingLinesIndex < remainingLines.length && (lastMapping && addMappingWithCode(lastMapping, shiftNextLine()), node.add(remainingLines.splice(remainingLinesIndex).join(""))), aSourceMapConsumer.sources.forEach(function(sourceFile) {
        var content = aSourceMapConsumer.sourceContentFor(sourceFile);
        content != null && (aRelativePath != null && (sourceFile = util.join(aRelativePath, sourceFile)), node.setSourceContent(sourceFile, content));
      }), node;
      function addMappingWithCode(mapping, code) {
        if (mapping === null || mapping.source === void 0)
          node.add(code);
        else {
          var source = aRelativePath ? util.join(aRelativePath, mapping.source) : mapping.source;
          node.add(new SourceNode(
            mapping.originalLine,
            mapping.originalColumn,
            source,
            code,
            mapping.name
          ));
        }
      }
    };
    SourceNode.prototype.add = function(aChunk) {
      if (Array.isArray(aChunk))
        aChunk.forEach(function(chunk) {
          this.add(chunk);
        }, this);
      else if (aChunk[isSourceNode] || typeof aChunk == "string")
        aChunk && this.children.push(aChunk);
      else
        throw new TypeError(
          "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
        );
      return this;
    };
    SourceNode.prototype.prepend = function(aChunk) {
      if (Array.isArray(aChunk))
        for (var i2 = aChunk.length - 1; i2 >= 0; i2--)
          this.prepend(aChunk[i2]);
      else if (aChunk[isSourceNode] || typeof aChunk == "string")
        this.children.unshift(aChunk);
      else
        throw new TypeError(
          "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
        );
      return this;
    };
    SourceNode.prototype.walk = function(aFn) {
      for (var chunk, i2 = 0, len = this.children.length; i2 < len; i2++)
        chunk = this.children[i2], chunk[isSourceNode] ? chunk.walk(aFn) : chunk !== "" && aFn(chunk, {
          source: this.source,
          line: this.line,
          column: this.column,
          name: this.name
        });
    };
    SourceNode.prototype.join = function(aSep) {
      var newChildren, i2, len = this.children.length;
      if (len > 0) {
        for (newChildren = [], i2 = 0; i2 < len - 1; i2++)
          newChildren.push(this.children[i2]), newChildren.push(aSep);
        newChildren.push(this.children[i2]), this.children = newChildren;
      }
      return this;
    };
    SourceNode.prototype.replaceRight = function(aPattern, aReplacement) {
      var lastChild = this.children[this.children.length - 1];
      return lastChild[isSourceNode] ? lastChild.replaceRight(aPattern, aReplacement) : typeof lastChild == "string" ? this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement) : this.children.push("".replace(aPattern, aReplacement)), this;
    };
    SourceNode.prototype.setSourceContent = function(aSourceFile, aSourceContent) {
      this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
    };
    SourceNode.prototype.walkSourceContents = function(aFn) {
      for (var i2 = 0, len = this.children.length; i2 < len; i2++)
        this.children[i2][isSourceNode] && this.children[i2].walkSourceContents(aFn);
      for (var sources = Object.keys(this.sourceContents), i2 = 0, len = sources.length; i2 < len; i2++)
        aFn(util.fromSetString(sources[i2]), this.sourceContents[sources[i2]]);
    };
    SourceNode.prototype.toString = function() {
      var str = "";
      return this.walk(function(chunk) {
        str += chunk;
      }), str;
    };
    SourceNode.prototype.toStringWithSourceMap = function(aArgs) {
      var generated = {
        code: "",
        line: 1,
        column: 0
      }, map = new SourceMapGenerator(aArgs), sourceMappingActive = !1, lastOriginalSource = null, lastOriginalLine = null, lastOriginalColumn = null, lastOriginalName = null;
      return this.walk(function(chunk, original) {
        generated.code += chunk, original.source !== null && original.line !== null && original.column !== null ? ((lastOriginalSource !== original.source || lastOriginalLine !== original.line || lastOriginalColumn !== original.column || lastOriginalName !== original.name) && map.addMapping({
          source: original.source,
          original: {
            line: original.line,
            column: original.column
          },
          generated: {
            line: generated.line,
            column: generated.column
          },
          name: original.name
        }), lastOriginalSource = original.source, lastOriginalLine = original.line, lastOriginalColumn = original.column, lastOriginalName = original.name, sourceMappingActive = !0) : sourceMappingActive && (map.addMapping({
          generated: {
            line: generated.line,
            column: generated.column
          }
        }), lastOriginalSource = null, sourceMappingActive = !1);
        for (var idx = 0, length = chunk.length; idx < length; idx++)
          chunk.charCodeAt(idx) === NEWLINE_CODE ? (generated.line++, generated.column = 0, idx + 1 === length ? (lastOriginalSource = null, sourceMappingActive = !1) : sourceMappingActive && map.addMapping({
            source: original.source,
            original: {
              line: original.line,
              column: original.column
            },
            generated: {
              line: generated.line,
              column: generated.column
            },
            name: original.name
          })) : generated.column++;
      }), this.walkSourceContents(function(sourceFile, sourceContent) {
        map.setSourceContent(sourceFile, sourceContent);
      }), { code: generated.code, map };
    };
    exports.SourceNode = SourceNode;
  }
});

// ../../../node_modules/escodegen/node_modules/source-map/source-map.js
var require_source_map = __commonJS({
  "../../../node_modules/escodegen/node_modules/source-map/source-map.js"(exports) {
    exports.SourceMapGenerator = require_source_map_generator().SourceMapGenerator;
    exports.SourceMapConsumer = require_source_map_consumer().SourceMapConsumer;
    exports.SourceNode = require_source_node().SourceNode;
  }
});

// ../../../node_modules/escodegen/package.json
var require_package = __commonJS({
  "../../../node_modules/escodegen/package.json"(exports, module) {
    module.exports = {
      name: "escodegen",
      description: "ECMAScript code generator",
      homepage: "http://github.com/estools/escodegen",
      main: "escodegen.js",
      bin: {
        esgenerate: "./bin/esgenerate.js",
        escodegen: "./bin/escodegen.js"
      },
      files: [
        "LICENSE.BSD",
        "README.md",
        "bin",
        "escodegen.js",
        "package.json"
      ],
      version: "2.1.0",
      engines: {
        node: ">=6.0"
      },
      maintainers: [
        {
          name: "Yusuke Suzuki",
          email: "utatane.tea@gmail.com",
          web: "http://github.com/Constellation"
        }
      ],
      repository: {
        type: "git",
        url: "http://github.com/estools/escodegen.git"
      },
      dependencies: {
        estraverse: "^5.2.0",
        esutils: "^2.0.2",
        esprima: "^4.0.1"
      },
      optionalDependencies: {
        "source-map": "~0.6.1"
      },
      devDependencies: {
        acorn: "^8.0.4",
        bluebird: "^3.4.7",
        "bower-registry-client": "^1.0.0",
        chai: "^4.2.0",
        "chai-exclude": "^2.0.2",
        "commonjs-everywhere": "^0.9.7",
        gulp: "^4.0.2",
        "gulp-eslint": "^6.0.0",
        "gulp-mocha": "^7.0.2",
        minimist: "^1.2.5",
        optionator: "^0.9.1",
        semver: "^7.3.4"
      },
      license: "BSD-2-Clause",
      scripts: {
        test: "gulp travis",
        "unit-test": "gulp test",
        lint: "gulp lint",
        release: "node tools/release.js",
        "build-min": "./node_modules/.bin/cjsify -ma path: tools/entry-point.js > escodegen.browser.min.js",
        build: "./node_modules/.bin/cjsify -a path: tools/entry-point.js > escodegen.browser.js"
      }
    };
  }
});

// ../../../node_modules/escodegen/escodegen.js
var require_escodegen = __commonJS({
  "../../../node_modules/escodegen/escodegen.js"(exports) {
    (function() {
      "use strict";
      var Syntax, Precedence, BinaryPrecedence, SourceNode, estraverse, esutils, base2, indent2, json, renumber, hexadecimal, quotes, escapeless, newline, space, parentheses, semicolons, safeConcatenation, directive, extra, parse8, sourceMap, sourceCode, preserveBlankLines, FORMAT_MINIFY, FORMAT_DEFAULTS;
      estraverse = require_estraverse(), esutils = require_utils(), Syntax = estraverse.Syntax;
      function isExpression(node) {
        return CodeGenerator.Expression.hasOwnProperty(node.type);
      }
      function isStatement(node) {
        return CodeGenerator.Statement.hasOwnProperty(node.type);
      }
      Precedence = {
        Sequence: 0,
        Yield: 1,
        Assignment: 1,
        Conditional: 2,
        ArrowFunction: 2,
        Coalesce: 3,
        LogicalOR: 4,
        LogicalAND: 5,
        BitwiseOR: 6,
        BitwiseXOR: 7,
        BitwiseAND: 8,
        Equality: 9,
        Relational: 10,
        BitwiseSHIFT: 11,
        Additive: 12,
        Multiplicative: 13,
        Exponentiation: 14,
        Await: 15,
        Unary: 15,
        Postfix: 16,
        OptionalChaining: 17,
        Call: 18,
        New: 19,
        TaggedTemplate: 20,
        Member: 21,
        Primary: 22
      }, BinaryPrecedence = {
        "??": Precedence.Coalesce,
        "||": Precedence.LogicalOR,
        "&&": Precedence.LogicalAND,
        "|": Precedence.BitwiseOR,
        "^": Precedence.BitwiseXOR,
        "&": Precedence.BitwiseAND,
        "==": Precedence.Equality,
        "!=": Precedence.Equality,
        "===": Precedence.Equality,
        "!==": Precedence.Equality,
        is: Precedence.Equality,
        isnt: Precedence.Equality,
        "<": Precedence.Relational,
        ">": Precedence.Relational,
        "<=": Precedence.Relational,
        ">=": Precedence.Relational,
        in: Precedence.Relational,
        instanceof: Precedence.Relational,
        "<<": Precedence.BitwiseSHIFT,
        ">>": Precedence.BitwiseSHIFT,
        ">>>": Precedence.BitwiseSHIFT,
        "+": Precedence.Additive,
        "-": Precedence.Additive,
        "*": Precedence.Multiplicative,
        "%": Precedence.Multiplicative,
        "/": Precedence.Multiplicative,
        "**": Precedence.Exponentiation
      };
      var F_ALLOW_IN = 1, F_ALLOW_CALL = 2, F_ALLOW_UNPARATH_NEW = 4, F_FUNC_BODY = 8, F_DIRECTIVE_CTX = 16, F_SEMICOLON_OPT = 32, F_FOUND_COALESCE = 64, E_FTT = F_ALLOW_CALL | F_ALLOW_UNPARATH_NEW, E_TTF = F_ALLOW_IN | F_ALLOW_CALL, E_TTT = F_ALLOW_IN | F_ALLOW_CALL | F_ALLOW_UNPARATH_NEW, E_TFF = F_ALLOW_IN, E_FFT = F_ALLOW_UNPARATH_NEW, E_TFT = F_ALLOW_IN | F_ALLOW_UNPARATH_NEW, S_TFFF = F_ALLOW_IN, S_TFFT = F_ALLOW_IN | F_SEMICOLON_OPT, S_FFFF = 0, S_TFTF = F_ALLOW_IN | F_DIRECTIVE_CTX, S_TTFF = F_ALLOW_IN | F_FUNC_BODY;
      function getDefaultOptions() {
        return {
          indent: null,
          base: null,
          parse: null,
          comment: !1,
          format: {
            indent: {
              style: "    ",
              base: 0,
              adjustMultilineComment: !1
            },
            newline: `
`,
            space: " ",
            json: !1,
            renumber: !1,
            hexadecimal: !1,
            quotes: "single",
            escapeless: !1,
            compact: !1,
            parentheses: !0,
            semicolons: !0,
            safeConcatenation: !1,
            preserveBlankLines: !1
          },
          moz: {
            comprehensionExpressionStartsWithAssignment: !1,
            starlessGenerator: !1
          },
          sourceMap: null,
          sourceMapRoot: null,
          sourceMapWithCode: !1,
          directive: !1,
          raw: !0,
          verbatim: null,
          sourceCode: null
        };
      }
      function stringRepeat(str, num) {
        var result = "";
        for (num |= 0; num > 0; num >>>= 1, str += str)
          num & 1 && (result += str);
        return result;
      }
      function hasLineTerminator(str) {
        return /[\r\n]/g.test(str);
      }
      function endsWithLineTerminator(str) {
        var len = str.length;
        return len && esutils.code.isLineTerminator(str.charCodeAt(len - 1));
      }
      function merge(target, override) {
        var key;
        for (key in override)
          override.hasOwnProperty(key) && (target[key] = override[key]);
        return target;
      }
      function updateDeeply(target, override) {
        var key, val;
        function isHashObject(target2) {
          return typeof target2 == "object" && target2 instanceof Object && !(target2 instanceof RegExp);
        }
        for (key in override)
          override.hasOwnProperty(key) && (val = override[key], isHashObject(val) ? isHashObject(target[key]) ? updateDeeply(target[key], val) : target[key] = updateDeeply({}, val) : target[key] = val);
        return target;
      }
      function generateNumber(value) {
        var result, point, temp, exponent, pos;
        if (value !== value)
          throw new Error("Numeric literal whose value is NaN");
        if (value < 0 || value === 0 && 1 / value < 0)
          throw new Error("Numeric literal whose value is negative");
        if (value === 1 / 0)
          return json ? "null" : renumber ? "1e400" : "1e+400";
        if (result = "" + value, !renumber || result.length < 3)
          return result;
        for (point = result.indexOf("."), !json && result.charCodeAt(0) === 48 && point === 1 && (point = 0, result = result.slice(1)), temp = result, result = result.replace("e+", "e"), exponent = 0, (pos = temp.indexOf("e")) > 0 && (exponent = +temp.slice(pos + 1), temp = temp.slice(0, pos)), point >= 0 && (exponent -= temp.length - point - 1, temp = +(temp.slice(0, point) + temp.slice(point + 1)) + ""), pos = 0; temp.charCodeAt(temp.length + pos - 1) === 48; )
          --pos;
        return pos !== 0 && (exponent -= pos, temp = temp.slice(0, pos)), exponent !== 0 && (temp += "e" + exponent), (temp.length < result.length || hexadecimal && value > 1e12 && Math.floor(value) === value && (temp = "0x" + value.toString(16)).length < result.length) && +temp === value && (result = temp), result;
      }
      function escapeRegExpCharacter(ch, previousIsBackslash) {
        return (ch & -2) === 8232 ? (previousIsBackslash ? "u" : "\\u") + (ch === 8232 ? "2028" : "2029") : ch === 10 || ch === 13 ? (previousIsBackslash ? "" : "\\") + (ch === 10 ? "n" : "r") : String.fromCharCode(ch);
      }
      function generateRegExp(reg) {
        var match, result, flags, i2, iz, ch, characterInBrack, previousIsBackslash;
        if (result = reg.toString(), reg.source) {
          if (match = result.match(/\/([^/]*)$/), !match)
            return result;
          for (flags = match[1], result = "", characterInBrack = !1, previousIsBackslash = !1, i2 = 0, iz = reg.source.length; i2 < iz; ++i2)
            ch = reg.source.charCodeAt(i2), previousIsBackslash ? (result += escapeRegExpCharacter(ch, previousIsBackslash), previousIsBackslash = !1) : (characterInBrack ? ch === 93 && (characterInBrack = !1) : ch === 47 ? result += "\\" : ch === 91 && (characterInBrack = !0), result += escapeRegExpCharacter(ch, previousIsBackslash), previousIsBackslash = ch === 92);
          return "/" + result + "/" + flags;
        }
        return result;
      }
      function escapeAllowedCharacter(code, next) {
        var hex;
        return code === 8 ? "\\b" : code === 12 ? "\\f" : code === 9 ? "\\t" : (hex = code.toString(16).toUpperCase(), json || code > 255 ? "\\u" + "0000".slice(hex.length) + hex : code === 0 && !esutils.code.isDecimalDigit(next) ? "\\0" : code === 11 ? "\\x0B" : "\\x" + "00".slice(hex.length) + hex);
      }
      function escapeDisallowedCharacter(code) {
        if (code === 92)
          return "\\\\";
        if (code === 10)
          return "\\n";
        if (code === 13)
          return "\\r";
        if (code === 8232)
          return "\\u2028";
        if (code === 8233)
          return "\\u2029";
        throw new Error("Incorrectly classified character");
      }
      function escapeDirective(str) {
        var i2, iz, code, quote;
        for (quote = quotes === "double" ? '"' : "'", i2 = 0, iz = str.length; i2 < iz; ++i2)
          if (code = str.charCodeAt(i2), code === 39) {
            quote = '"';
            break;
          } else if (code === 34) {
            quote = "'";
            break;
          } else code === 92 && ++i2;
        return quote + str + quote;
      }
      function escapeString(str) {
        var result = "", i2, len, code, singleQuotes = 0, doubleQuotes = 0, single, quote;
        for (i2 = 0, len = str.length; i2 < len; ++i2) {
          if (code = str.charCodeAt(i2), code === 39)
            ++singleQuotes;
          else if (code === 34)
            ++doubleQuotes;
          else if (code === 47 && json)
            result += "\\";
          else if (esutils.code.isLineTerminator(code) || code === 92) {
            result += escapeDisallowedCharacter(code);
            continue;
          } else if (!esutils.code.isIdentifierPartES5(code) && (json && code < 32 || !json && !escapeless && (code < 32 || code > 126))) {
            result += escapeAllowedCharacter(code, str.charCodeAt(i2 + 1));
            continue;
          }
          result += String.fromCharCode(code);
        }
        if (single = !(quotes === "double" || quotes === "auto" && doubleQuotes < singleQuotes), quote = single ? "'" : '"', !(single ? singleQuotes : doubleQuotes))
          return quote + result + quote;
        for (str = result, result = quote, i2 = 0, len = str.length; i2 < len; ++i2)
          code = str.charCodeAt(i2), (code === 39 && single || code === 34 && !single) && (result += "\\"), result += String.fromCharCode(code);
        return result + quote;
      }
      function flattenToString(arr) {
        var i2, iz, elem, result = "";
        for (i2 = 0, iz = arr.length; i2 < iz; ++i2)
          elem = arr[i2], result += Array.isArray(elem) ? flattenToString(elem) : elem;
        return result;
      }
      function toSourceNodeWhenNeeded(generated, node) {
        if (!sourceMap)
          return Array.isArray(generated) ? flattenToString(generated) : generated;
        if (node == null) {
          if (generated instanceof SourceNode)
            return generated;
          node = {};
        }
        return node.loc == null ? new SourceNode(null, null, sourceMap, generated, node.name || null) : new SourceNode(node.loc.start.line, node.loc.start.column, sourceMap === !0 ? node.loc.source || null : sourceMap, generated, node.name || null);
      }
      function noEmptySpace() {
        return space || " ";
      }
      function join7(left, right) {
        var leftSource, rightSource, leftCharCode, rightCharCode;
        return leftSource = toSourceNodeWhenNeeded(left).toString(), leftSource.length === 0 ? [right] : (rightSource = toSourceNodeWhenNeeded(right).toString(), rightSource.length === 0 ? [left] : (leftCharCode = leftSource.charCodeAt(leftSource.length - 1), rightCharCode = rightSource.charCodeAt(0), (leftCharCode === 43 || leftCharCode === 45) && leftCharCode === rightCharCode || esutils.code.isIdentifierPartES5(leftCharCode) && esutils.code.isIdentifierPartES5(rightCharCode) || leftCharCode === 47 && rightCharCode === 105 ? [left, noEmptySpace(), right] : esutils.code.isWhiteSpace(leftCharCode) || esutils.code.isLineTerminator(leftCharCode) || esutils.code.isWhiteSpace(rightCharCode) || esutils.code.isLineTerminator(rightCharCode) ? [left, right] : [left, space, right]));
      }
      function addIndent(stmt) {
        return [base2, stmt];
      }
      function withIndent(fn) {
        var previousBase;
        previousBase = base2, base2 += indent2, fn(base2), base2 = previousBase;
      }
      function calculateSpaces(str) {
        var i2;
        for (i2 = str.length - 1; i2 >= 0 && !esutils.code.isLineTerminator(str.charCodeAt(i2)); --i2)
          ;
        return str.length - 1 - i2;
      }
      function adjustMultilineComment(value, specialBase) {
        var array, i2, len, line, j, spaces, previousBase, sn;
        for (array = value.split(/\r\n|[\r\n]/), spaces = Number.MAX_VALUE, i2 = 1, len = array.length; i2 < len; ++i2) {
          for (line = array[i2], j = 0; j < line.length && esutils.code.isWhiteSpace(line.charCodeAt(j)); )
            ++j;
          spaces > j && (spaces = j);
        }
        for (typeof specialBase < "u" ? (previousBase = base2, array[1][spaces] === "*" && (specialBase += " "), base2 = specialBase) : (spaces & 1 && --spaces, previousBase = base2), i2 = 1, len = array.length; i2 < len; ++i2)
          sn = toSourceNodeWhenNeeded(addIndent(array[i2].slice(spaces))), array[i2] = sourceMap ? sn.join("") : sn;
        return base2 = previousBase, array.join(`
`);
      }
      function generateComment(comment, specialBase) {
        if (comment.type === "Line") {
          if (endsWithLineTerminator(comment.value))
            return "//" + comment.value;
          var result = "//" + comment.value;
          return preserveBlankLines || (result += `
`), result;
        }
        return extra.format.indent.adjustMultilineComment && /[\n\r]/.test(comment.value) ? adjustMultilineComment("/*" + comment.value + "*/", specialBase) : "/*" + comment.value + "*/";
      }
      function addComments(stmt, result) {
        var i2, len, comment, save, tailingToStatement, specialBase, fragment, extRange, range, prevRange, prefix, infix, suffix, count;
        if (stmt.leadingComments && stmt.leadingComments.length > 0) {
          if (save = result, preserveBlankLines) {
            for (comment = stmt.leadingComments[0], result = [], extRange = comment.extendedRange, range = comment.range, prefix = sourceCode.substring(extRange[0], range[0]), count = (prefix.match(/\n/g) || []).length, count > 0 ? (result.push(stringRepeat(`
`, count)), result.push(addIndent(generateComment(comment)))) : (result.push(prefix), result.push(generateComment(comment))), prevRange = range, i2 = 1, len = stmt.leadingComments.length; i2 < len; i2++)
              comment = stmt.leadingComments[i2], range = comment.range, infix = sourceCode.substring(prevRange[1], range[0]), count = (infix.match(/\n/g) || []).length, result.push(stringRepeat(`
`, count)), result.push(addIndent(generateComment(comment))), prevRange = range;
            suffix = sourceCode.substring(range[1], extRange[1]), count = (suffix.match(/\n/g) || []).length, result.push(stringRepeat(`
`, count));
          } else
            for (comment = stmt.leadingComments[0], result = [], safeConcatenation && stmt.type === Syntax.Program && stmt.body.length === 0 && result.push(`
`), result.push(generateComment(comment)), endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString()) || result.push(`
`), i2 = 1, len = stmt.leadingComments.length; i2 < len; ++i2)
              comment = stmt.leadingComments[i2], fragment = [generateComment(comment)], endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString()) || fragment.push(`
`), result.push(addIndent(fragment));
          result.push(addIndent(save));
        }
        if (stmt.trailingComments)
          if (preserveBlankLines)
            comment = stmt.trailingComments[0], extRange = comment.extendedRange, range = comment.range, prefix = sourceCode.substring(extRange[0], range[0]), count = (prefix.match(/\n/g) || []).length, count > 0 ? (result.push(stringRepeat(`
`, count)), result.push(addIndent(generateComment(comment)))) : (result.push(prefix), result.push(generateComment(comment)));
          else
            for (tailingToStatement = !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString()), specialBase = stringRepeat(" ", calculateSpaces(toSourceNodeWhenNeeded([base2, result, indent2]).toString())), i2 = 0, len = stmt.trailingComments.length; i2 < len; ++i2)
              comment = stmt.trailingComments[i2], tailingToStatement ? (i2 === 0 ? result = [result, indent2] : result = [result, specialBase], result.push(generateComment(comment, specialBase))) : result = [result, addIndent(generateComment(comment))], i2 !== len - 1 && !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString()) && (result = [result, `
`]);
        return result;
      }
      function generateBlankLines(start, end, result) {
        var j, newlineCount = 0;
        for (j = start; j < end; j++)
          sourceCode[j] === `
` && newlineCount++;
        for (j = 1; j < newlineCount; j++)
          result.push(newline);
      }
      function parenthesize(text, current2, should) {
        return current2 < should ? ["(", text, ")"] : text;
      }
      function generateVerbatimString(string) {
        var i2, iz, result;
        for (result = string.split(/\r\n|\n/), i2 = 1, iz = result.length; i2 < iz; i2++)
          result[i2] = newline + base2 + result[i2];
        return result;
      }
      function generateVerbatim(expr, precedence) {
        var verbatim, result, prec;
        return verbatim = expr[extra.verbatim], typeof verbatim == "string" ? result = parenthesize(generateVerbatimString(verbatim), Precedence.Sequence, precedence) : (result = generateVerbatimString(verbatim.content), prec = verbatim.precedence != null ? verbatim.precedence : Precedence.Sequence, result = parenthesize(result, prec, precedence)), toSourceNodeWhenNeeded(result, expr);
      }
      function CodeGenerator() {
      }
      CodeGenerator.prototype.maybeBlock = function(stmt, flags) {
        var result, noLeadingComment, that = this;
        return noLeadingComment = !extra.comment || !stmt.leadingComments, stmt.type === Syntax.BlockStatement && noLeadingComment ? [space, this.generateStatement(stmt, flags)] : stmt.type === Syntax.EmptyStatement && noLeadingComment ? ";" : (withIndent(function() {
          result = [
            newline,
            addIndent(that.generateStatement(stmt, flags))
          ];
        }), result);
      }, CodeGenerator.prototype.maybeBlockSuffix = function(stmt, result) {
        var ends = endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString());
        return stmt.type === Syntax.BlockStatement && (!extra.comment || !stmt.leadingComments) && !ends ? [result, space] : ends ? [result, base2] : [result, newline, base2];
      };
      function generateIdentifier(node) {
        return toSourceNodeWhenNeeded(node.name, node);
      }
      function generateAsyncPrefix(node, spaceRequired) {
        return node.async ? "async" + (spaceRequired ? noEmptySpace() : space) : "";
      }
      function generateStarSuffix(node) {
        var isGenerator = node.generator && !extra.moz.starlessGenerator;
        return isGenerator ? "*" + space : "";
      }
      function generateMethodPrefix(prop) {
        var func = prop.value, prefix = "";
        return func.async && (prefix += generateAsyncPrefix(func, !prop.computed)), func.generator && (prefix += generateStarSuffix(func) ? "*" : ""), prefix;
      }
      CodeGenerator.prototype.generatePattern = function(node, precedence, flags) {
        return node.type === Syntax.Identifier ? generateIdentifier(node) : this.generateExpression(node, precedence, flags);
      }, CodeGenerator.prototype.generateFunctionParams = function(node) {
        var i2, iz, result, hasDefault;
        if (hasDefault = !1, node.type === Syntax.ArrowFunctionExpression && !node.rest && (!node.defaults || node.defaults.length === 0) && node.params.length === 1 && node.params[0].type === Syntax.Identifier)
          result = [generateAsyncPrefix(node, !0), generateIdentifier(node.params[0])];
        else {
          for (result = node.type === Syntax.ArrowFunctionExpression ? [generateAsyncPrefix(node, !1)] : [], result.push("("), node.defaults && (hasDefault = !0), i2 = 0, iz = node.params.length; i2 < iz; ++i2)
            hasDefault && node.defaults[i2] ? result.push(this.generateAssignment(node.params[i2], node.defaults[i2], "=", Precedence.Assignment, E_TTT)) : result.push(this.generatePattern(node.params[i2], Precedence.Assignment, E_TTT)), i2 + 1 < iz && result.push("," + space);
          node.rest && (node.params.length && result.push("," + space), result.push("..."), result.push(generateIdentifier(node.rest))), result.push(")");
        }
        return result;
      }, CodeGenerator.prototype.generateFunctionBody = function(node) {
        var result, expr;
        return result = this.generateFunctionParams(node), node.type === Syntax.ArrowFunctionExpression && (result.push(space), result.push("=>")), node.expression ? (result.push(space), expr = this.generateExpression(node.body, Precedence.Assignment, E_TTT), expr.toString().charAt(0) === "{" && (expr = ["(", expr, ")"]), result.push(expr)) : result.push(this.maybeBlock(node.body, S_TTFF)), result;
      }, CodeGenerator.prototype.generateIterationForStatement = function(operator, stmt, flags) {
        var result = ["for" + (stmt.await ? noEmptySpace() + "await" : "") + space + "("], that = this;
        return withIndent(function() {
          stmt.left.type === Syntax.VariableDeclaration ? withIndent(function() {
            result.push(stmt.left.kind + noEmptySpace()), result.push(that.generateStatement(stmt.left.declarations[0], S_FFFF));
          }) : result.push(that.generateExpression(stmt.left, Precedence.Call, E_TTT)), result = join7(result, operator), result = [join7(
            result,
            that.generateExpression(stmt.right, Precedence.Assignment, E_TTT)
          ), ")"];
        }), result.push(this.maybeBlock(stmt.body, flags)), result;
      }, CodeGenerator.prototype.generatePropertyKey = function(expr, computed) {
        var result = [];
        return computed && result.push("["), result.push(this.generateExpression(expr, Precedence.Assignment, E_TTT)), computed && result.push("]"), result;
      }, CodeGenerator.prototype.generateAssignment = function(left, right, operator, precedence, flags) {
        return Precedence.Assignment < precedence && (flags |= F_ALLOW_IN), parenthesize(
          [
            this.generateExpression(left, Precedence.Call, flags),
            space + operator + space,
            this.generateExpression(right, Precedence.Assignment, flags)
          ],
          Precedence.Assignment,
          precedence
        );
      }, CodeGenerator.prototype.semicolon = function(flags) {
        return !semicolons && flags & F_SEMICOLON_OPT ? "" : ";";
      }, CodeGenerator.Statement = {
        BlockStatement: function(stmt, flags) {
          var range, content, result = ["{", newline], that = this;
          return withIndent(function() {
            stmt.body.length === 0 && preserveBlankLines && (range = stmt.range, range[1] - range[0] > 2 && (content = sourceCode.substring(range[0] + 1, range[1] - 1), content[0] === `
` && (result = ["{"]), result.push(content)));
            var i2, iz, fragment, bodyFlags;
            for (bodyFlags = S_TFFF, flags & F_FUNC_BODY && (bodyFlags |= F_DIRECTIVE_CTX), i2 = 0, iz = stmt.body.length; i2 < iz; ++i2)
              preserveBlankLines && (i2 === 0 && (stmt.body[0].leadingComments && (range = stmt.body[0].leadingComments[0].extendedRange, content = sourceCode.substring(range[0], range[1]), content[0] === `
` && (result = ["{"])), stmt.body[0].leadingComments || generateBlankLines(stmt.range[0], stmt.body[0].range[0], result)), i2 > 0 && !stmt.body[i2 - 1].trailingComments && !stmt.body[i2].leadingComments && generateBlankLines(stmt.body[i2 - 1].range[1], stmt.body[i2].range[0], result)), i2 === iz - 1 && (bodyFlags |= F_SEMICOLON_OPT), stmt.body[i2].leadingComments && preserveBlankLines ? fragment = that.generateStatement(stmt.body[i2], bodyFlags) : fragment = addIndent(that.generateStatement(stmt.body[i2], bodyFlags)), result.push(fragment), endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString()) || preserveBlankLines && i2 < iz - 1 && stmt.body[i2 + 1].leadingComments || result.push(newline), preserveBlankLines && i2 === iz - 1 && (stmt.body[i2].trailingComments || generateBlankLines(stmt.body[i2].range[1], stmt.range[1], result));
          }), result.push(addIndent("}")), result;
        },
        BreakStatement: function(stmt, flags) {
          return stmt.label ? "break " + stmt.label.name + this.semicolon(flags) : "break" + this.semicolon(flags);
        },
        ContinueStatement: function(stmt, flags) {
          return stmt.label ? "continue " + stmt.label.name + this.semicolon(flags) : "continue" + this.semicolon(flags);
        },
        ClassBody: function(stmt, flags) {
          var result = ["{", newline], that = this;
          return withIndent(function(indent3) {
            var i2, iz;
            for (i2 = 0, iz = stmt.body.length; i2 < iz; ++i2)
              result.push(indent3), result.push(that.generateExpression(stmt.body[i2], Precedence.Sequence, E_TTT)), i2 + 1 < iz && result.push(newline);
          }), endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString()) || result.push(newline), result.push(base2), result.push("}"), result;
        },
        ClassDeclaration: function(stmt, flags) {
          var result, fragment;
          return result = ["class"], stmt.id && (result = join7(result, this.generateExpression(stmt.id, Precedence.Sequence, E_TTT))), stmt.superClass && (fragment = join7("extends", this.generateExpression(stmt.superClass, Precedence.Unary, E_TTT)), result = join7(result, fragment)), result.push(space), result.push(this.generateStatement(stmt.body, S_TFFT)), result;
        },
        DirectiveStatement: function(stmt, flags) {
          return extra.raw && stmt.raw ? stmt.raw + this.semicolon(flags) : escapeDirective(stmt.directive) + this.semicolon(flags);
        },
        DoWhileStatement: function(stmt, flags) {
          var result = join7("do", this.maybeBlock(stmt.body, S_TFFF));
          return result = this.maybeBlockSuffix(stmt.body, result), join7(result, [
            "while" + space + "(",
            this.generateExpression(stmt.test, Precedence.Sequence, E_TTT),
            ")" + this.semicolon(flags)
          ]);
        },
        CatchClause: function(stmt, flags) {
          var result, that = this;
          return withIndent(function() {
            var guard;
            stmt.param ? (result = [
              "catch" + space + "(",
              that.generateExpression(stmt.param, Precedence.Sequence, E_TTT),
              ")"
            ], stmt.guard && (guard = that.generateExpression(stmt.guard, Precedence.Sequence, E_TTT), result.splice(2, 0, " if ", guard))) : result = ["catch"];
          }), result.push(this.maybeBlock(stmt.body, S_TFFF)), result;
        },
        DebuggerStatement: function(stmt, flags) {
          return "debugger" + this.semicolon(flags);
        },
        EmptyStatement: function(stmt, flags) {
          return ";";
        },
        ExportDefaultDeclaration: function(stmt, flags) {
          var result = ["export"], bodyFlags;
          return bodyFlags = flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF, result = join7(result, "default"), isStatement(stmt.declaration) ? result = join7(result, this.generateStatement(stmt.declaration, bodyFlags)) : result = join7(result, this.generateExpression(stmt.declaration, Precedence.Assignment, E_TTT) + this.semicolon(flags)), result;
        },
        ExportNamedDeclaration: function(stmt, flags) {
          var result = ["export"], bodyFlags, that = this;
          return bodyFlags = flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF, stmt.declaration ? join7(result, this.generateStatement(stmt.declaration, bodyFlags)) : (stmt.specifiers && (stmt.specifiers.length === 0 ? result = join7(result, "{" + space + "}") : stmt.specifiers[0].type === Syntax.ExportBatchSpecifier ? result = join7(result, this.generateExpression(stmt.specifiers[0], Precedence.Sequence, E_TTT)) : (result = join7(result, "{"), withIndent(function(indent3) {
            var i2, iz;
            for (result.push(newline), i2 = 0, iz = stmt.specifiers.length; i2 < iz; ++i2)
              result.push(indent3), result.push(that.generateExpression(stmt.specifiers[i2], Precedence.Sequence, E_TTT)), i2 + 1 < iz && result.push("," + newline);
          }), endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString()) || result.push(newline), result.push(base2 + "}")), stmt.source ? result = join7(result, [
            "from" + space,
            // ModuleSpecifier
            this.generateExpression(stmt.source, Precedence.Sequence, E_TTT),
            this.semicolon(flags)
          ]) : result.push(this.semicolon(flags))), result);
        },
        ExportAllDeclaration: function(stmt, flags) {
          return [
            "export" + space,
            "*" + space,
            "from" + space,
            // ModuleSpecifier
            this.generateExpression(stmt.source, Precedence.Sequence, E_TTT),
            this.semicolon(flags)
          ];
        },
        ExpressionStatement: function(stmt, flags) {
          var result, fragment;
          function isClassPrefixed(fragment2) {
            var code;
            return fragment2.slice(0, 5) !== "class" ? !1 : (code = fragment2.charCodeAt(5), code === 123 || esutils.code.isWhiteSpace(code) || esutils.code.isLineTerminator(code));
          }
          function isFunctionPrefixed(fragment2) {
            var code;
            return fragment2.slice(0, 8) !== "function" ? !1 : (code = fragment2.charCodeAt(8), code === 40 || esutils.code.isWhiteSpace(code) || code === 42 || esutils.code.isLineTerminator(code));
          }
          function isAsyncPrefixed(fragment2) {
            var code, i2, iz;
            if (fragment2.slice(0, 5) !== "async" || !esutils.code.isWhiteSpace(fragment2.charCodeAt(5)))
              return !1;
            for (i2 = 6, iz = fragment2.length; i2 < iz && esutils.code.isWhiteSpace(fragment2.charCodeAt(i2)); ++i2)
              ;
            return i2 === iz || fragment2.slice(i2, i2 + 8) !== "function" ? !1 : (code = fragment2.charCodeAt(i2 + 8), code === 40 || esutils.code.isWhiteSpace(code) || code === 42 || esutils.code.isLineTerminator(code));
          }
          return result = [this.generateExpression(stmt.expression, Precedence.Sequence, E_TTT)], fragment = toSourceNodeWhenNeeded(result).toString(), fragment.charCodeAt(0) === 123 || // ObjectExpression
          isClassPrefixed(fragment) || isFunctionPrefixed(fragment) || isAsyncPrefixed(fragment) || directive && flags & F_DIRECTIVE_CTX && stmt.expression.type === Syntax.Literal && typeof stmt.expression.value == "string" ? result = ["(", result, ")" + this.semicolon(flags)] : result.push(this.semicolon(flags)), result;
        },
        ImportDeclaration: function(stmt, flags) {
          var result, cursor, that = this;
          return stmt.specifiers.length === 0 ? [
            "import",
            space,
            // ModuleSpecifier
            this.generateExpression(stmt.source, Precedence.Sequence, E_TTT),
            this.semicolon(flags)
          ] : (result = [
            "import"
          ], cursor = 0, stmt.specifiers[cursor].type === Syntax.ImportDefaultSpecifier && (result = join7(result, [
            this.generateExpression(stmt.specifiers[cursor], Precedence.Sequence, E_TTT)
          ]), ++cursor), stmt.specifiers[cursor] && (cursor !== 0 && result.push(","), stmt.specifiers[cursor].type === Syntax.ImportNamespaceSpecifier ? result = join7(result, [
            space,
            this.generateExpression(stmt.specifiers[cursor], Precedence.Sequence, E_TTT)
          ]) : (result.push(space + "{"), stmt.specifiers.length - cursor === 1 ? (result.push(space), result.push(this.generateExpression(stmt.specifiers[cursor], Precedence.Sequence, E_TTT)), result.push(space + "}" + space)) : (withIndent(function(indent3) {
            var i2, iz;
            for (result.push(newline), i2 = cursor, iz = stmt.specifiers.length; i2 < iz; ++i2)
              result.push(indent3), result.push(that.generateExpression(stmt.specifiers[i2], Precedence.Sequence, E_TTT)), i2 + 1 < iz && result.push("," + newline);
          }), endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString()) || result.push(newline), result.push(base2 + "}" + space)))), result = join7(result, [
            "from" + space,
            // ModuleSpecifier
            this.generateExpression(stmt.source, Precedence.Sequence, E_TTT),
            this.semicolon(flags)
          ]), result);
        },
        VariableDeclarator: function(stmt, flags) {
          var itemFlags = flags & F_ALLOW_IN ? E_TTT : E_FTT;
          return stmt.init ? [
            this.generateExpression(stmt.id, Precedence.Assignment, itemFlags),
            space,
            "=",
            space,
            this.generateExpression(stmt.init, Precedence.Assignment, itemFlags)
          ] : this.generatePattern(stmt.id, Precedence.Assignment, itemFlags);
        },
        VariableDeclaration: function(stmt, flags) {
          var result, i2, iz, node, bodyFlags, that = this;
          result = [stmt.kind], bodyFlags = flags & F_ALLOW_IN ? S_TFFF : S_FFFF;
          function block() {
            for (node = stmt.declarations[0], extra.comment && node.leadingComments ? (result.push(`
`), result.push(addIndent(that.generateStatement(node, bodyFlags)))) : (result.push(noEmptySpace()), result.push(that.generateStatement(node, bodyFlags))), i2 = 1, iz = stmt.declarations.length; i2 < iz; ++i2)
              node = stmt.declarations[i2], extra.comment && node.leadingComments ? (result.push("," + newline), result.push(addIndent(that.generateStatement(node, bodyFlags)))) : (result.push("," + space), result.push(that.generateStatement(node, bodyFlags)));
          }
          return stmt.declarations.length > 1 ? withIndent(block) : block(), result.push(this.semicolon(flags)), result;
        },
        ThrowStatement: function(stmt, flags) {
          return [join7(
            "throw",
            this.generateExpression(stmt.argument, Precedence.Sequence, E_TTT)
          ), this.semicolon(flags)];
        },
        TryStatement: function(stmt, flags) {
          var result, i2, iz, guardedHandlers;
          if (result = ["try", this.maybeBlock(stmt.block, S_TFFF)], result = this.maybeBlockSuffix(stmt.block, result), stmt.handlers)
            for (i2 = 0, iz = stmt.handlers.length; i2 < iz; ++i2)
              result = join7(result, this.generateStatement(stmt.handlers[i2], S_TFFF)), (stmt.finalizer || i2 + 1 !== iz) && (result = this.maybeBlockSuffix(stmt.handlers[i2].body, result));
          else {
            for (guardedHandlers = stmt.guardedHandlers || [], i2 = 0, iz = guardedHandlers.length; i2 < iz; ++i2)
              result = join7(result, this.generateStatement(guardedHandlers[i2], S_TFFF)), (stmt.finalizer || i2 + 1 !== iz) && (result = this.maybeBlockSuffix(guardedHandlers[i2].body, result));
            if (stmt.handler)
              if (Array.isArray(stmt.handler))
                for (i2 = 0, iz = stmt.handler.length; i2 < iz; ++i2)
                  result = join7(result, this.generateStatement(stmt.handler[i2], S_TFFF)), (stmt.finalizer || i2 + 1 !== iz) && (result = this.maybeBlockSuffix(stmt.handler[i2].body, result));
              else
                result = join7(result, this.generateStatement(stmt.handler, S_TFFF)), stmt.finalizer && (result = this.maybeBlockSuffix(stmt.handler.body, result));
          }
          return stmt.finalizer && (result = join7(result, ["finally", this.maybeBlock(stmt.finalizer, S_TFFF)])), result;
        },
        SwitchStatement: function(stmt, flags) {
          var result, fragment, i2, iz, bodyFlags, that = this;
          if (withIndent(function() {
            result = [
              "switch" + space + "(",
              that.generateExpression(stmt.discriminant, Precedence.Sequence, E_TTT),
              ")" + space + "{" + newline
            ];
          }), stmt.cases)
            for (bodyFlags = S_TFFF, i2 = 0, iz = stmt.cases.length; i2 < iz; ++i2)
              i2 === iz - 1 && (bodyFlags |= F_SEMICOLON_OPT), fragment = addIndent(this.generateStatement(stmt.cases[i2], bodyFlags)), result.push(fragment), endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString()) || result.push(newline);
          return result.push(addIndent("}")), result;
        },
        SwitchCase: function(stmt, flags) {
          var result, fragment, i2, iz, bodyFlags, that = this;
          return withIndent(function() {
            for (stmt.test ? result = [
              join7("case", that.generateExpression(stmt.test, Precedence.Sequence, E_TTT)),
              ":"
            ] : result = ["default:"], i2 = 0, iz = stmt.consequent.length, iz && stmt.consequent[0].type === Syntax.BlockStatement && (fragment = that.maybeBlock(stmt.consequent[0], S_TFFF), result.push(fragment), i2 = 1), i2 !== iz && !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString()) && result.push(newline), bodyFlags = S_TFFF; i2 < iz; ++i2)
              i2 === iz - 1 && flags & F_SEMICOLON_OPT && (bodyFlags |= F_SEMICOLON_OPT), fragment = addIndent(that.generateStatement(stmt.consequent[i2], bodyFlags)), result.push(fragment), i2 + 1 !== iz && !endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString()) && result.push(newline);
          }), result;
        },
        IfStatement: function(stmt, flags) {
          var result, bodyFlags, semicolonOptional, that = this;
          return withIndent(function() {
            result = [
              "if" + space + "(",
              that.generateExpression(stmt.test, Precedence.Sequence, E_TTT),
              ")"
            ];
          }), semicolonOptional = flags & F_SEMICOLON_OPT, bodyFlags = S_TFFF, semicolonOptional && (bodyFlags |= F_SEMICOLON_OPT), stmt.alternate ? (result.push(this.maybeBlock(stmt.consequent, S_TFFF)), result = this.maybeBlockSuffix(stmt.consequent, result), stmt.alternate.type === Syntax.IfStatement ? result = join7(result, ["else ", this.generateStatement(stmt.alternate, bodyFlags)]) : result = join7(result, join7("else", this.maybeBlock(stmt.alternate, bodyFlags)))) : result.push(this.maybeBlock(stmt.consequent, bodyFlags)), result;
        },
        ForStatement: function(stmt, flags) {
          var result, that = this;
          return withIndent(function() {
            result = ["for" + space + "("], stmt.init ? stmt.init.type === Syntax.VariableDeclaration ? result.push(that.generateStatement(stmt.init, S_FFFF)) : (result.push(that.generateExpression(stmt.init, Precedence.Sequence, E_FTT)), result.push(";")) : result.push(";"), stmt.test && (result.push(space), result.push(that.generateExpression(stmt.test, Precedence.Sequence, E_TTT))), result.push(";"), stmt.update && (result.push(space), result.push(that.generateExpression(stmt.update, Precedence.Sequence, E_TTT))), result.push(")");
          }), result.push(this.maybeBlock(stmt.body, flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF)), result;
        },
        ForInStatement: function(stmt, flags) {
          return this.generateIterationForStatement("in", stmt, flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF);
        },
        ForOfStatement: function(stmt, flags) {
          return this.generateIterationForStatement("of", stmt, flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF);
        },
        LabeledStatement: function(stmt, flags) {
          return [stmt.label.name + ":", this.maybeBlock(stmt.body, flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF)];
        },
        Program: function(stmt, flags) {
          var result, fragment, i2, iz, bodyFlags;
          for (iz = stmt.body.length, result = [safeConcatenation && iz > 0 ? `
` : ""], bodyFlags = S_TFTF, i2 = 0; i2 < iz; ++i2)
            !safeConcatenation && i2 === iz - 1 && (bodyFlags |= F_SEMICOLON_OPT), preserveBlankLines && (i2 === 0 && (stmt.body[0].leadingComments || generateBlankLines(stmt.range[0], stmt.body[i2].range[0], result)), i2 > 0 && !stmt.body[i2 - 1].trailingComments && !stmt.body[i2].leadingComments && generateBlankLines(stmt.body[i2 - 1].range[1], stmt.body[i2].range[0], result)), fragment = addIndent(this.generateStatement(stmt.body[i2], bodyFlags)), result.push(fragment), i2 + 1 < iz && !endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString()) && (preserveBlankLines && stmt.body[i2 + 1].leadingComments || result.push(newline)), preserveBlankLines && i2 === iz - 1 && (stmt.body[i2].trailingComments || generateBlankLines(stmt.body[i2].range[1], stmt.range[1], result));
          return result;
        },
        FunctionDeclaration: function(stmt, flags) {
          return [
            generateAsyncPrefix(stmt, !0),
            "function",
            generateStarSuffix(stmt) || noEmptySpace(),
            stmt.id ? generateIdentifier(stmt.id) : "",
            this.generateFunctionBody(stmt)
          ];
        },
        ReturnStatement: function(stmt, flags) {
          return stmt.argument ? [join7(
            "return",
            this.generateExpression(stmt.argument, Precedence.Sequence, E_TTT)
          ), this.semicolon(flags)] : ["return" + this.semicolon(flags)];
        },
        WhileStatement: function(stmt, flags) {
          var result, that = this;
          return withIndent(function() {
            result = [
              "while" + space + "(",
              that.generateExpression(stmt.test, Precedence.Sequence, E_TTT),
              ")"
            ];
          }), result.push(this.maybeBlock(stmt.body, flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF)), result;
        },
        WithStatement: function(stmt, flags) {
          var result, that = this;
          return withIndent(function() {
            result = [
              "with" + space + "(",
              that.generateExpression(stmt.object, Precedence.Sequence, E_TTT),
              ")"
            ];
          }), result.push(this.maybeBlock(stmt.body, flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF)), result;
        }
      }, merge(CodeGenerator.prototype, CodeGenerator.Statement), CodeGenerator.Expression = {
        SequenceExpression: function(expr, precedence, flags) {
          var result, i2, iz;
          for (Precedence.Sequence < precedence && (flags |= F_ALLOW_IN), result = [], i2 = 0, iz = expr.expressions.length; i2 < iz; ++i2)
            result.push(this.generateExpression(expr.expressions[i2], Precedence.Assignment, flags)), i2 + 1 < iz && result.push("," + space);
          return parenthesize(result, Precedence.Sequence, precedence);
        },
        AssignmentExpression: function(expr, precedence, flags) {
          return this.generateAssignment(expr.left, expr.right, expr.operator, precedence, flags);
        },
        ArrowFunctionExpression: function(expr, precedence, flags) {
          return parenthesize(this.generateFunctionBody(expr), Precedence.ArrowFunction, precedence);
        },
        ConditionalExpression: function(expr, precedence, flags) {
          return Precedence.Conditional < precedence && (flags |= F_ALLOW_IN), parenthesize(
            [
              this.generateExpression(expr.test, Precedence.Coalesce, flags),
              space + "?" + space,
              this.generateExpression(expr.consequent, Precedence.Assignment, flags),
              space + ":" + space,
              this.generateExpression(expr.alternate, Precedence.Assignment, flags)
            ],
            Precedence.Conditional,
            precedence
          );
        },
        LogicalExpression: function(expr, precedence, flags) {
          return expr.operator === "??" && (flags |= F_FOUND_COALESCE), this.BinaryExpression(expr, precedence, flags);
        },
        BinaryExpression: function(expr, precedence, flags) {
          var result, leftPrecedence, rightPrecedence, currentPrecedence, fragment, leftSource;
          return currentPrecedence = BinaryPrecedence[expr.operator], leftPrecedence = expr.operator === "**" ? Precedence.Postfix : currentPrecedence, rightPrecedence = expr.operator === "**" ? currentPrecedence : currentPrecedence + 1, currentPrecedence < precedence && (flags |= F_ALLOW_IN), fragment = this.generateExpression(expr.left, leftPrecedence, flags), leftSource = fragment.toString(), leftSource.charCodeAt(leftSource.length - 1) === 47 && esutils.code.isIdentifierPartES5(expr.operator.charCodeAt(0)) ? result = [fragment, noEmptySpace(), expr.operator] : result = join7(fragment, expr.operator), fragment = this.generateExpression(expr.right, rightPrecedence, flags), expr.operator === "/" && fragment.toString().charAt(0) === "/" || expr.operator.slice(-1) === "<" && fragment.toString().slice(0, 3) === "!--" ? (result.push(noEmptySpace()), result.push(fragment)) : result = join7(result, fragment), expr.operator === "in" && !(flags & F_ALLOW_IN) ? ["(", result, ")"] : (expr.operator === "||" || expr.operator === "&&") && flags & F_FOUND_COALESCE ? ["(", result, ")"] : parenthesize(result, currentPrecedence, precedence);
        },
        CallExpression: function(expr, precedence, flags) {
          var result, i2, iz;
          for (result = [this.generateExpression(expr.callee, Precedence.Call, E_TTF)], expr.optional && result.push("?."), result.push("("), i2 = 0, iz = expr.arguments.length; i2 < iz; ++i2)
            result.push(this.generateExpression(expr.arguments[i2], Precedence.Assignment, E_TTT)), i2 + 1 < iz && result.push("," + space);
          return result.push(")"), flags & F_ALLOW_CALL ? parenthesize(result, Precedence.Call, precedence) : ["(", result, ")"];
        },
        ChainExpression: function(expr, precedence, flags) {
          Precedence.OptionalChaining < precedence && (flags |= F_ALLOW_CALL);
          var result = this.generateExpression(expr.expression, Precedence.OptionalChaining, flags);
          return parenthesize(result, Precedence.OptionalChaining, precedence);
        },
        NewExpression: function(expr, precedence, flags) {
          var result, length, i2, iz, itemFlags;
          if (length = expr.arguments.length, itemFlags = flags & F_ALLOW_UNPARATH_NEW && !parentheses && length === 0 ? E_TFT : E_TFF, result = join7(
            "new",
            this.generateExpression(expr.callee, Precedence.New, itemFlags)
          ), !(flags & F_ALLOW_UNPARATH_NEW) || parentheses || length > 0) {
            for (result.push("("), i2 = 0, iz = length; i2 < iz; ++i2)
              result.push(this.generateExpression(expr.arguments[i2], Precedence.Assignment, E_TTT)), i2 + 1 < iz && result.push("," + space);
            result.push(")");
          }
          return parenthesize(result, Precedence.New, precedence);
        },
        MemberExpression: function(expr, precedence, flags) {
          var result, fragment;
          return result = [this.generateExpression(expr.object, Precedence.Call, flags & F_ALLOW_CALL ? E_TTF : E_TFF)], expr.computed ? (expr.optional && result.push("?."), result.push("["), result.push(this.generateExpression(expr.property, Precedence.Sequence, flags & F_ALLOW_CALL ? E_TTT : E_TFT)), result.push("]")) : (!expr.optional && expr.object.type === Syntax.Literal && typeof expr.object.value == "number" && (fragment = toSourceNodeWhenNeeded(result).toString(), fragment.indexOf(".") < 0 && !/[eExX]/.test(fragment) && esutils.code.isDecimalDigit(fragment.charCodeAt(fragment.length - 1)) && !(fragment.length >= 2 && fragment.charCodeAt(0) === 48) && result.push(" ")), result.push(expr.optional ? "?." : "."), result.push(generateIdentifier(expr.property))), parenthesize(result, Precedence.Member, precedence);
        },
        MetaProperty: function(expr, precedence, flags) {
          var result;
          return result = [], result.push(typeof expr.meta == "string" ? expr.meta : generateIdentifier(expr.meta)), result.push("."), result.push(typeof expr.property == "string" ? expr.property : generateIdentifier(expr.property)), parenthesize(result, Precedence.Member, precedence);
        },
        UnaryExpression: function(expr, precedence, flags) {
          var result, fragment, rightCharCode, leftSource, leftCharCode;
          return fragment = this.generateExpression(expr.argument, Precedence.Unary, E_TTT), space === "" ? result = join7(expr.operator, fragment) : (result = [expr.operator], expr.operator.length > 2 ? result = join7(result, fragment) : (leftSource = toSourceNodeWhenNeeded(result).toString(), leftCharCode = leftSource.charCodeAt(leftSource.length - 1), rightCharCode = fragment.toString().charCodeAt(0), ((leftCharCode === 43 || leftCharCode === 45) && leftCharCode === rightCharCode || esutils.code.isIdentifierPartES5(leftCharCode) && esutils.code.isIdentifierPartES5(rightCharCode)) && result.push(noEmptySpace()), result.push(fragment))), parenthesize(result, Precedence.Unary, precedence);
        },
        YieldExpression: function(expr, precedence, flags) {
          var result;
          return expr.delegate ? result = "yield*" : result = "yield", expr.argument && (result = join7(
            result,
            this.generateExpression(expr.argument, Precedence.Yield, E_TTT)
          )), parenthesize(result, Precedence.Yield, precedence);
        },
        AwaitExpression: function(expr, precedence, flags) {
          var result = join7(
            expr.all ? "await*" : "await",
            this.generateExpression(expr.argument, Precedence.Await, E_TTT)
          );
          return parenthesize(result, Precedence.Await, precedence);
        },
        UpdateExpression: function(expr, precedence, flags) {
          return expr.prefix ? parenthesize(
            [
              expr.operator,
              this.generateExpression(expr.argument, Precedence.Unary, E_TTT)
            ],
            Precedence.Unary,
            precedence
          ) : parenthesize(
            [
              this.generateExpression(expr.argument, Precedence.Postfix, E_TTT),
              expr.operator
            ],
            Precedence.Postfix,
            precedence
          );
        },
        FunctionExpression: function(expr, precedence, flags) {
          var result = [
            generateAsyncPrefix(expr, !0),
            "function"
          ];
          return expr.id ? (result.push(generateStarSuffix(expr) || noEmptySpace()), result.push(generateIdentifier(expr.id))) : result.push(generateStarSuffix(expr) || space), result.push(this.generateFunctionBody(expr)), result;
        },
        ArrayPattern: function(expr, precedence, flags) {
          return this.ArrayExpression(expr, precedence, flags, !0);
        },
        ArrayExpression: function(expr, precedence, flags, isPattern) {
          var result, multiline, that = this;
          return expr.elements.length ? (multiline = isPattern ? !1 : expr.elements.length > 1, result = ["[", multiline ? newline : ""], withIndent(function(indent3) {
            var i2, iz;
            for (i2 = 0, iz = expr.elements.length; i2 < iz; ++i2)
              expr.elements[i2] ? (result.push(multiline ? indent3 : ""), result.push(that.generateExpression(expr.elements[i2], Precedence.Assignment, E_TTT))) : (multiline && result.push(indent3), i2 + 1 === iz && result.push(",")), i2 + 1 < iz && result.push("," + (multiline ? newline : space));
          }), multiline && !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString()) && result.push(newline), result.push(multiline ? base2 : ""), result.push("]"), result) : "[]";
        },
        RestElement: function(expr, precedence, flags) {
          return "..." + this.generatePattern(expr.argument);
        },
        ClassExpression: function(expr, precedence, flags) {
          var result, fragment;
          return result = ["class"], expr.id && (result = join7(result, this.generateExpression(expr.id, Precedence.Sequence, E_TTT))), expr.superClass && (fragment = join7("extends", this.generateExpression(expr.superClass, Precedence.Unary, E_TTT)), result = join7(result, fragment)), result.push(space), result.push(this.generateStatement(expr.body, S_TFFT)), result;
        },
        MethodDefinition: function(expr, precedence, flags) {
          var result, fragment;
          return expr.static ? result = ["static" + space] : result = [], expr.kind === "get" || expr.kind === "set" ? fragment = [
            join7(expr.kind, this.generatePropertyKey(expr.key, expr.computed)),
            this.generateFunctionBody(expr.value)
          ] : fragment = [
            generateMethodPrefix(expr),
            this.generatePropertyKey(expr.key, expr.computed),
            this.generateFunctionBody(expr.value)
          ], join7(result, fragment);
        },
        Property: function(expr, precedence, flags) {
          return expr.kind === "get" || expr.kind === "set" ? [
            expr.kind,
            noEmptySpace(),
            this.generatePropertyKey(expr.key, expr.computed),
            this.generateFunctionBody(expr.value)
          ] : expr.shorthand ? expr.value.type === "AssignmentPattern" ? this.AssignmentPattern(expr.value, Precedence.Sequence, E_TTT) : this.generatePropertyKey(expr.key, expr.computed) : expr.method ? [
            generateMethodPrefix(expr),
            this.generatePropertyKey(expr.key, expr.computed),
            this.generateFunctionBody(expr.value)
          ] : [
            this.generatePropertyKey(expr.key, expr.computed),
            ":" + space,
            this.generateExpression(expr.value, Precedence.Assignment, E_TTT)
          ];
        },
        ObjectExpression: function(expr, precedence, flags) {
          var multiline, result, fragment, that = this;
          return expr.properties.length ? (multiline = expr.properties.length > 1, withIndent(function() {
            fragment = that.generateExpression(expr.properties[0], Precedence.Sequence, E_TTT);
          }), !multiline && !hasLineTerminator(toSourceNodeWhenNeeded(fragment).toString()) ? ["{", space, fragment, space, "}"] : (withIndent(function(indent3) {
            var i2, iz;
            if (result = ["{", newline, indent3, fragment], multiline)
              for (result.push("," + newline), i2 = 1, iz = expr.properties.length; i2 < iz; ++i2)
                result.push(indent3), result.push(that.generateExpression(expr.properties[i2], Precedence.Sequence, E_TTT)), i2 + 1 < iz && result.push("," + newline);
          }), endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString()) || result.push(newline), result.push(base2), result.push("}"), result)) : "{}";
        },
        AssignmentPattern: function(expr, precedence, flags) {
          return this.generateAssignment(expr.left, expr.right, "=", precedence, flags);
        },
        ObjectPattern: function(expr, precedence, flags) {
          var result, i2, iz, multiline, property, that = this;
          if (!expr.properties.length)
            return "{}";
          if (multiline = !1, expr.properties.length === 1)
            property = expr.properties[0], property.type === Syntax.Property && property.value.type !== Syntax.Identifier && (multiline = !0);
          else
            for (i2 = 0, iz = expr.properties.length; i2 < iz; ++i2)
              if (property = expr.properties[i2], property.type === Syntax.Property && !property.shorthand) {
                multiline = !0;
                break;
              }
          return result = ["{", multiline ? newline : ""], withIndent(function(indent3) {
            var i3, iz2;
            for (i3 = 0, iz2 = expr.properties.length; i3 < iz2; ++i3)
              result.push(multiline ? indent3 : ""), result.push(that.generateExpression(expr.properties[i3], Precedence.Sequence, E_TTT)), i3 + 1 < iz2 && result.push("," + (multiline ? newline : space));
          }), multiline && !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString()) && result.push(newline), result.push(multiline ? base2 : ""), result.push("}"), result;
        },
        ThisExpression: function(expr, precedence, flags) {
          return "this";
        },
        Super: function(expr, precedence, flags) {
          return "super";
        },
        Identifier: function(expr, precedence, flags) {
          return generateIdentifier(expr);
        },
        ImportDefaultSpecifier: function(expr, precedence, flags) {
          return generateIdentifier(expr.id || expr.local);
        },
        ImportNamespaceSpecifier: function(expr, precedence, flags) {
          var result = ["*"], id = expr.id || expr.local;
          return id && result.push(space + "as" + noEmptySpace() + generateIdentifier(id)), result;
        },
        ImportSpecifier: function(expr, precedence, flags) {
          var imported = expr.imported, result = [imported.name], local = expr.local;
          return local && local.name !== imported.name && result.push(noEmptySpace() + "as" + noEmptySpace() + generateIdentifier(local)), result;
        },
        ExportSpecifier: function(expr, precedence, flags) {
          var local = expr.local, result = [local.name], exported = expr.exported;
          return exported && exported.name !== local.name && result.push(noEmptySpace() + "as" + noEmptySpace() + generateIdentifier(exported)), result;
        },
        Literal: function(expr, precedence, flags) {
          var raw;
          if (expr.hasOwnProperty("raw") && parse8 && extra.raw)
            try {
              if (raw = parse8(expr.raw).body[0].expression, raw.type === Syntax.Literal && raw.value === expr.value)
                return expr.raw;
            } catch {
            }
          return expr.regex ? "/" + expr.regex.pattern + "/" + expr.regex.flags : typeof expr.value == "bigint" ? expr.value.toString() + "n" : expr.bigint ? expr.bigint + "n" : expr.value === null ? "null" : typeof expr.value == "string" ? escapeString(expr.value) : typeof expr.value == "number" ? generateNumber(expr.value) : typeof expr.value == "boolean" ? expr.value ? "true" : "false" : generateRegExp(expr.value);
        },
        GeneratorExpression: function(expr, precedence, flags) {
          return this.ComprehensionExpression(expr, precedence, flags);
        },
        ComprehensionExpression: function(expr, precedence, flags) {
          var result, i2, iz, fragment, that = this;
          return result = expr.type === Syntax.GeneratorExpression ? ["("] : ["["], extra.moz.comprehensionExpressionStartsWithAssignment && (fragment = this.generateExpression(expr.body, Precedence.Assignment, E_TTT), result.push(fragment)), expr.blocks && withIndent(function() {
            for (i2 = 0, iz = expr.blocks.length; i2 < iz; ++i2)
              fragment = that.generateExpression(expr.blocks[i2], Precedence.Sequence, E_TTT), i2 > 0 || extra.moz.comprehensionExpressionStartsWithAssignment ? result = join7(result, fragment) : result.push(fragment);
          }), expr.filter && (result = join7(result, "if" + space), fragment = this.generateExpression(expr.filter, Precedence.Sequence, E_TTT), result = join7(result, ["(", fragment, ")"])), extra.moz.comprehensionExpressionStartsWithAssignment || (fragment = this.generateExpression(expr.body, Precedence.Assignment, E_TTT), result = join7(result, fragment)), result.push(expr.type === Syntax.GeneratorExpression ? ")" : "]"), result;
        },
        ComprehensionBlock: function(expr, precedence, flags) {
          var fragment;
          return expr.left.type === Syntax.VariableDeclaration ? fragment = [
            expr.left.kind,
            noEmptySpace(),
            this.generateStatement(expr.left.declarations[0], S_FFFF)
          ] : fragment = this.generateExpression(expr.left, Precedence.Call, E_TTT), fragment = join7(fragment, expr.of ? "of" : "in"), fragment = join7(fragment, this.generateExpression(expr.right, Precedence.Sequence, E_TTT)), ["for" + space + "(", fragment, ")"];
        },
        SpreadElement: function(expr, precedence, flags) {
          return [
            "...",
            this.generateExpression(expr.argument, Precedence.Assignment, E_TTT)
          ];
        },
        TaggedTemplateExpression: function(expr, precedence, flags) {
          var itemFlags = E_TTF;
          flags & F_ALLOW_CALL || (itemFlags = E_TFF);
          var result = [
            this.generateExpression(expr.tag, Precedence.Call, itemFlags),
            this.generateExpression(expr.quasi, Precedence.Primary, E_FFT)
          ];
          return parenthesize(result, Precedence.TaggedTemplate, precedence);
        },
        TemplateElement: function(expr, precedence, flags) {
          return expr.value.raw;
        },
        TemplateLiteral: function(expr, precedence, flags) {
          var result, i2, iz;
          for (result = ["`"], i2 = 0, iz = expr.quasis.length; i2 < iz; ++i2)
            result.push(this.generateExpression(expr.quasis[i2], Precedence.Primary, E_TTT)), i2 + 1 < iz && (result.push("${" + space), result.push(this.generateExpression(expr.expressions[i2], Precedence.Sequence, E_TTT)), result.push(space + "}"));
          return result.push("`"), result;
        },
        ModuleSpecifier: function(expr, precedence, flags) {
          return this.Literal(expr, precedence, flags);
        },
        ImportExpression: function(expr, precedence, flag) {
          return parenthesize([
            "import(",
            this.generateExpression(expr.source, Precedence.Assignment, E_TTT),
            ")"
          ], Precedence.Call, precedence);
        }
      }, merge(CodeGenerator.prototype, CodeGenerator.Expression), CodeGenerator.prototype.generateExpression = function(expr, precedence, flags) {
        var result, type;
        return type = expr.type || Syntax.Property, extra.verbatim && expr.hasOwnProperty(extra.verbatim) ? generateVerbatim(expr, precedence) : (result = this[type](expr, precedence, flags), extra.comment && (result = addComments(expr, result)), toSourceNodeWhenNeeded(result, expr));
      }, CodeGenerator.prototype.generateStatement = function(stmt, flags) {
        var result, fragment;
        return result = this[stmt.type](stmt, flags), extra.comment && (result = addComments(stmt, result)), fragment = toSourceNodeWhenNeeded(result).toString(), stmt.type === Syntax.Program && !safeConcatenation && newline === "" && fragment.charAt(fragment.length - 1) === `
` && (result = sourceMap ? toSourceNodeWhenNeeded(result).replaceRight(/\s+$/, "") : fragment.replace(/\s+$/, "")), toSourceNodeWhenNeeded(result, stmt);
      };
      function generateInternal(node) {
        var codegen;
        if (codegen = new CodeGenerator(), isStatement(node))
          return codegen.generateStatement(node, S_TFFF);
        if (isExpression(node))
          return codegen.generateExpression(node, Precedence.Sequence, E_TTT);
        throw new Error("Unknown node type: " + node.type);
      }
      function generate2(node, options) {
        var defaultOptions2 = getDefaultOptions(), result, pair;
        return options != null ? (typeof options.indent == "string" && (defaultOptions2.format.indent.style = options.indent), typeof options.base == "number" && (defaultOptions2.format.indent.base = options.base), options = updateDeeply(defaultOptions2, options), indent2 = options.format.indent.style, typeof options.base == "string" ? base2 = options.base : base2 = stringRepeat(indent2, options.format.indent.base)) : (options = defaultOptions2, indent2 = options.format.indent.style, base2 = stringRepeat(indent2, options.format.indent.base)), json = options.format.json, renumber = options.format.renumber, hexadecimal = json ? !1 : options.format.hexadecimal, quotes = json ? "double" : options.format.quotes, escapeless = options.format.escapeless, newline = options.format.newline, space = options.format.space, options.format.compact && (newline = space = indent2 = base2 = ""), parentheses = options.format.parentheses, semicolons = options.format.semicolons, safeConcatenation = options.format.safeConcatenation, directive = options.directive, parse8 = json ? null : options.parse, sourceMap = options.sourceMap, sourceCode = options.sourceCode, preserveBlankLines = options.format.preserveBlankLines && sourceCode !== null, extra = options, sourceMap && (exports.browser ? SourceNode = global.sourceMap.SourceNode : SourceNode = require_source_map().SourceNode), result = generateInternal(node), sourceMap ? (pair = result.toStringWithSourceMap({
          file: options.file,
          sourceRoot: options.sourceMapRoot
        }), options.sourceContent && pair.map.setSourceContent(
          options.sourceMap,
          options.sourceContent
        ), options.sourceMapWithCode ? pair : pair.map.toString()) : (pair = { code: result.toString(), map: null }, options.sourceMapWithCode ? pair : pair.code);
      }
      FORMAT_MINIFY = {
        indent: {
          style: "",
          base: 0
        },
        renumber: !0,
        hexadecimal: !0,
        quotes: "auto",
        escapeless: !0,
        compact: !0,
        parentheses: !1,
        semicolons: !1
      }, FORMAT_DEFAULTS = getDefaultOptions().format, exports.version = require_package().version, exports.generate = generate2, exports.attachComments = estraverse.attachComments, exports.Precedence = updateDeeply({}, Precedence), exports.browser = !1, exports.FORMAT_MINIFY = FORMAT_MINIFY, exports.FORMAT_DEFAULTS = FORMAT_DEFAULTS;
    })();
  }
});

// ../../../node_modules/ts-dedent/dist/index.js
var require_dist = __commonJS({
  "../../../node_modules/ts-dedent/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: !0 });
    exports.dedent = void 0;
    function dedent3(templ) {
      for (var values = [], _i = 1; _i < arguments.length; _i++)
        values[_i - 1] = arguments[_i];
      var strings = Array.from(typeof templ == "string" ? [templ] : templ);
      strings[strings.length - 1] = strings[strings.length - 1].replace(/\r?\n([\t ]*)$/, "");
      var indentLengths = strings.reduce(function(arr, str) {
        var matches = str.match(/\n([\t ]+|(?!\s).)/g);
        return matches ? arr.concat(matches.map(function(match) {
          var _a, _b;
          return (_b = (_a = match.match(/[\t ]/g)) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
        })) : arr;
      }, []);
      if (indentLengths.length) {
        var pattern_1 = new RegExp(`
[	 ]{` + Math.min.apply(Math, indentLengths) + "}", "g");
        strings = strings.map(function(str) {
          return str.replace(pattern_1, `
`);
        });
      }
      strings[0] = strings[0].replace(/^\r?\n/, "");
      var string = strings[0];
      return values.forEach(function(value, i2) {
        var endentations = string.match(/(?:^|\n)( *)$/), endentation = endentations ? endentations[1] : "", indentedValue = value;
        typeof value == "string" && value.includes(`
`) && (indentedValue = String(value).split(`
`).map(function(str, i3) {
          return i3 === 0 ? str : "" + endentation + str;
        }).join(`
`)), string += indentedValue + strings[i2 + 1];
      }), string;
    }
    exports.dedent = dedent3;
    exports.default = dedent3;
  }
});

// ../../../node_modules/acorn/dist/acorn.mjs
var acorn_exports = {};
__export(acorn_exports, {
  Node: () => Node,
  Parser: () => Parser,
  Position: () => Position,
  SourceLocation: () => SourceLocation,
  TokContext: () => TokContext,
  Token: () => Token,
  TokenType: () => TokenType,
  defaultOptions: () => defaultOptions,
  getLineInfo: () => getLineInfo,
  isIdentifierChar: () => isIdentifierChar,
  isIdentifierStart: () => isIdentifierStart,
  isNewLine: () => isNewLine,
  keywordTypes: () => keywords,
  lineBreak: () => lineBreak,
  lineBreakG: () => lineBreakG,
  nonASCIIwhitespace: () => nonASCIIwhitespace,
  parse: () => parse4,
  parseExpressionAt: () => parseExpressionAt2,
  tokContexts: () => types,
  tokTypes: () => types$1,
  tokenizer: () => tokenizer2,
  version: () => version
});
function isInAstralSet(code, set) {
  for (var pos = 65536, i2 = 0; i2 < set.length; i2 += 2) {
    if (pos += set[i2], pos > code)
      return !1;
    if (pos += set[i2 + 1], pos >= code)
      return !0;
  }
  return !1;
}
function isIdentifierStart(code, astral) {
  return code < 65 ? code === 36 : code < 91 ? !0 : code < 97 ? code === 95 : code < 123 ? !0 : code <= 65535 ? code >= 170 && nonASCIIidentifierStart.test(String.fromCharCode(code)) : astral === !1 ? !1 : isInAstralSet(code, astralIdentifierStartCodes);
}
function isIdentifierChar(code, astral) {
  return code < 48 ? code === 36 : code < 58 ? !0 : code < 65 ? !1 : code < 91 ? !0 : code < 97 ? code === 95 : code < 123 ? !0 : code <= 65535 ? code >= 170 && nonASCIIidentifier.test(String.fromCharCode(code)) : astral === !1 ? !1 : isInAstralSet(code, astralIdentifierStartCodes) || isInAstralSet(code, astralIdentifierCodes);
}
function binop(name, prec) {
  return new TokenType(name, { beforeExpr: !0, binop: prec });
}
function kw(name, options) {
  return options === void 0 && (options = {}), options.keyword = name, keywords[name] = new TokenType(name, options);
}
function isNewLine(code) {
  return code === 10 || code === 13 || code === 8232 || code === 8233;
}
function nextLineBreak(code, from, end) {
  end === void 0 && (end = code.length);
  for (var i2 = from; i2 < end; i2++) {
    var next = code.charCodeAt(i2);
    if (isNewLine(next))
      return i2 < end - 1 && next === 13 && code.charCodeAt(i2 + 1) === 10 ? i2 + 2 : i2 + 1;
  }
  return -1;
}
function wordsRegexp(words) {
  return regexpCache[words] || (regexpCache[words] = new RegExp("^(?:" + words.replace(/ /g, "|") + ")$"));
}
function codePointToString(code) {
  return code <= 65535 ? String.fromCharCode(code) : (code -= 65536, String.fromCharCode((code >> 10) + 55296, (code & 1023) + 56320));
}
function getLineInfo(input, offset2) {
  for (var line = 1, cur = 0; ; ) {
    var nextBreak = nextLineBreak(input, cur, offset2);
    if (nextBreak < 0)
      return new Position(line, offset2 - cur);
    ++line, cur = nextBreak;
  }
}
function getOptions(opts) {
  var options = {};
  for (var opt in defaultOptions)
    options[opt] = opts && hasOwn(opts, opt) ? opts[opt] : defaultOptions[opt];
  if (options.ecmaVersion === "latest" ? options.ecmaVersion = 1e8 : options.ecmaVersion == null ? (!warnedAboutEcmaVersion && typeof console == "object" && console.warn && (warnedAboutEcmaVersion = !0, console.warn(`Since Acorn 8.0.0, options.ecmaVersion is required.
Defaulting to 2020, but this will stop working in the future.`)), options.ecmaVersion = 11) : options.ecmaVersion >= 2015 && (options.ecmaVersion -= 2009), options.allowReserved == null && (options.allowReserved = options.ecmaVersion < 5), (!opts || opts.allowHashBang == null) && (options.allowHashBang = options.ecmaVersion >= 14), isArray(options.onToken)) {
    var tokens = options.onToken;
    options.onToken = function(token) {
      return tokens.push(token);
    };
  }
  return isArray(options.onComment) && (options.onComment = pushComment(options, options.onComment)), options;
}
function pushComment(options, array) {
  return function(block, text, start, end, startLoc, endLoc) {
    var comment = {
      type: block ? "Block" : "Line",
      value: text,
      start,
      end
    };
    options.locations && (comment.loc = new SourceLocation(this, startLoc, endLoc)), options.ranges && (comment.range = [start, end]), array.push(comment);
  };
}
function functionFlags(async, generator) {
  return SCOPE_FUNCTION | (async ? SCOPE_ASYNC : 0) | (generator ? SCOPE_GENERATOR : 0);
}
function isPrivateNameConflicted(privateNameMap, element) {
  var name = element.key.name, curr = privateNameMap[name], next = "true";
  return element.type === "MethodDefinition" && (element.kind === "get" || element.kind === "set") && (next = (element.static ? "s" : "i") + element.kind), curr === "iget" && next === "iset" || curr === "iset" && next === "iget" || curr === "sget" && next === "sset" || curr === "sset" && next === "sget" ? (privateNameMap[name] = "true", !1) : curr ? !0 : (privateNameMap[name] = next, !1);
}
function checkKeyName(node, name) {
  var computed = node.computed, key = node.key;
  return !computed && (key.type === "Identifier" && key.name === name || key.type === "Literal" && key.value === name);
}
function isLocalVariableAccess(node) {
  return node.type === "Identifier" || node.type === "ParenthesizedExpression" && isLocalVariableAccess(node.expression);
}
function isPrivateFieldAccess(node) {
  return node.type === "MemberExpression" && node.property.type === "PrivateIdentifier" || node.type === "ChainExpression" && isPrivateFieldAccess(node.expression) || node.type === "ParenthesizedExpression" && isPrivateFieldAccess(node.expression);
}
function finishNodeAt(node, type, pos, loc) {
  return node.type = type, node.end = pos, this.options.locations && (node.loc.end = loc), this.options.ranges && (node.range[1] = pos), node;
}
function buildUnicodeData(ecmaVersion2) {
  var d = data[ecmaVersion2] = {
    binary: wordsRegexp(unicodeBinaryProperties[ecmaVersion2] + " " + unicodeGeneralCategoryValues),
    binaryOfStrings: wordsRegexp(unicodeBinaryPropertiesOfStrings[ecmaVersion2]),
    nonBinary: {
      General_Category: wordsRegexp(unicodeGeneralCategoryValues),
      Script: wordsRegexp(unicodeScriptValues[ecmaVersion2])
    }
  };
  d.nonBinary.Script_Extensions = d.nonBinary.Script, d.nonBinary.gc = d.nonBinary.General_Category, d.nonBinary.sc = d.nonBinary.Script, d.nonBinary.scx = d.nonBinary.Script_Extensions;
}
function hasProp(obj) {
  for (var _ in obj)
    return !0;
  return !1;
}
function isRegularExpressionModifier(ch) {
  return ch === 105 || ch === 109 || ch === 115;
}
function isSyntaxCharacter(ch) {
  return ch === 36 || ch >= 40 && ch <= 43 || ch === 46 || ch === 63 || ch >= 91 && ch <= 94 || ch >= 123 && ch <= 125;
}
function isRegExpIdentifierStart(ch) {
  return isIdentifierStart(ch, !0) || ch === 36 || ch === 95;
}
function isRegExpIdentifierPart(ch) {
  return isIdentifierChar(ch, !0) || ch === 36 || ch === 95 || ch === 8204 || ch === 8205;
}
function isControlLetter(ch) {
  return ch >= 65 && ch <= 90 || ch >= 97 && ch <= 122;
}
function isValidUnicode(ch) {
  return ch >= 0 && ch <= 1114111;
}
function isCharacterClassEscape(ch) {
  return ch === 100 || ch === 68 || ch === 115 || ch === 83 || ch === 119 || ch === 87;
}
function isUnicodePropertyNameCharacter(ch) {
  return isControlLetter(ch) || ch === 95;
}
function isUnicodePropertyValueCharacter(ch) {
  return isUnicodePropertyNameCharacter(ch) || isDecimalDigit(ch);
}
function isClassSetReservedDoublePunctuatorCharacter(ch) {
  return ch === 33 || ch >= 35 && ch <= 38 || ch >= 42 && ch <= 44 || ch === 46 || ch >= 58 && ch <= 64 || ch === 94 || ch === 96 || ch === 126;
}
function isClassSetSyntaxCharacter(ch) {
  return ch === 40 || ch === 41 || ch === 45 || ch === 47 || ch >= 91 && ch <= 93 || ch >= 123 && ch <= 125;
}
function isClassSetReservedPunctuator(ch) {
  return ch === 33 || ch === 35 || ch === 37 || ch === 38 || ch === 44 || ch === 45 || ch >= 58 && ch <= 62 || ch === 64 || ch === 96 || ch === 126;
}
function isDecimalDigit(ch) {
  return ch >= 48 && ch <= 57;
}
function isHexDigit(ch) {
  return ch >= 48 && ch <= 57 || ch >= 65 && ch <= 70 || ch >= 97 && ch <= 102;
}
function hexToInt(ch) {
  return ch >= 65 && ch <= 70 ? 10 + (ch - 65) : ch >= 97 && ch <= 102 ? 10 + (ch - 97) : ch - 48;
}
function isOctalDigit(ch) {
  return ch >= 48 && ch <= 55;
}
function stringToNumber(str, isLegacyOctalNumericLiteral) {
  return isLegacyOctalNumericLiteral ? parseInt(str, 8) : parseFloat(str.replace(/_/g, ""));
}
function stringToBigInt(str) {
  return typeof BigInt != "function" ? null : BigInt(str.replace(/_/g, ""));
}
function parse4(input, options) {
  return Parser.parse(input, options);
}
function parseExpressionAt2(input, pos, options) {
  return Parser.parseExpressionAt(input, pos, options);
}
function tokenizer2(input, options) {
  return Parser.tokenizer(input, options);
}
var astralIdentifierCodes, astralIdentifierStartCodes, nonASCIIidentifierChars, nonASCIIidentifierStartChars, reservedWords, ecma5AndLessKeywords, keywords$1, keywordRelationalOperator, nonASCIIidentifierStart, nonASCIIidentifier, TokenType, beforeExpr, startsExpr, keywords, types$1, lineBreak, lineBreakG, nonASCIIwhitespace, skipWhiteSpace, ref, hasOwnProperty2, toString, hasOwn, isArray, regexpCache, loneSurrogate, Position, SourceLocation, defaultOptions, warnedAboutEcmaVersion, SCOPE_TOP, SCOPE_FUNCTION, SCOPE_ASYNC, SCOPE_GENERATOR, SCOPE_ARROW, SCOPE_SIMPLE_CATCH, SCOPE_SUPER, SCOPE_DIRECT_SUPER, SCOPE_CLASS_STATIC_BLOCK, SCOPE_CLASS_FIELD_INIT, SCOPE_VAR, BIND_NONE, BIND_VAR, BIND_LEXICAL, BIND_FUNCTION, BIND_SIMPLE_CATCH, BIND_OUTSIDE, Parser, prototypeAccessors, pp$9, literal, DestructuringErrors, pp$8, loopLabel, switchLabel, empty$1, FUNC_STATEMENT, FUNC_HANGING_STATEMENT, FUNC_NULLABLE_ID, pp$7, TokContext, types, pp$6, pp$5, empty, pp$4, pp$3, Scope, Node, pp$2, scriptValuesAddedInUnicode, ecma9BinaryProperties, ecma10BinaryProperties, ecma11BinaryProperties, ecma12BinaryProperties, ecma13BinaryProperties, ecma14BinaryProperties, unicodeBinaryProperties, ecma14BinaryPropertiesOfStrings, unicodeBinaryPropertiesOfStrings, unicodeGeneralCategoryValues, ecma9ScriptValues, ecma10ScriptValues, ecma11ScriptValues, ecma12ScriptValues, ecma13ScriptValues, ecma14ScriptValues, unicodeScriptValues, data, ecmaVersion, i, list, pp$1, BranchID, RegExpValidationState, CharSetNone, CharSetOk, CharSetString, Token, pp, INVALID_TEMPLATE_ESCAPE_ERROR, version, init_acorn = __esm({
  "../../../node_modules/acorn/dist/acorn.mjs"() {
    astralIdentifierCodes = [509, 0, 227, 0, 150, 4, 294, 9, 1368, 2, 2, 1, 6, 3, 41, 2, 5, 0, 166, 1, 574, 3, 9, 9, 7, 9, 32, 4, 318, 1, 80, 3, 71, 10, 50, 3, 123, 2, 54, 14, 32, 10, 3, 1, 11, 3, 46, 10, 8, 0, 46, 9, 7, 2, 37, 13, 2, 9, 6, 1, 45, 0, 13, 2, 49, 13, 9, 3, 2, 11, 83, 11, 7, 0, 3, 0, 158, 11, 6, 9, 7, 3, 56, 1, 2, 6, 3, 1, 3, 2, 10, 0, 11, 1, 3, 6, 4, 4, 68, 8, 2, 0, 3, 0, 2, 3, 2, 4, 2, 0, 15, 1, 83, 17, 10, 9, 5, 0, 82, 19, 13, 9, 214, 6, 3, 8, 28, 1, 83, 16, 16, 9, 82, 12, 9, 9, 7, 19, 58, 14, 5, 9, 243, 14, 166, 9, 71, 5, 2, 1, 3, 3, 2, 0, 2, 1, 13, 9, 120, 6, 3, 6, 4, 0, 29, 9, 41, 6, 2, 3, 9, 0, 10, 10, 47, 15, 343, 9, 54, 7, 2, 7, 17, 9, 57, 21, 2, 13, 123, 5, 4, 0, 2, 1, 2, 6, 2, 0, 9, 9, 49, 4, 2, 1, 2, 4, 9, 9, 330, 3, 10, 1, 2, 0, 49, 6, 4, 4, 14, 10, 5350, 0, 7, 14, 11465, 27, 2343, 9, 87, 9, 39, 4, 60, 6, 26, 9, 535, 9, 470, 0, 2, 54, 8, 3, 82, 0, 12, 1, 19628, 1, 4178, 9, 519, 45, 3, 22, 543, 4, 4, 5, 9, 7, 3, 6, 31, 3, 149, 2, 1418, 49, 513, 54, 5, 49, 9, 0, 15, 0, 23, 4, 2, 14, 1361, 6, 2, 16, 3, 6, 2, 1, 2, 4, 101, 0, 161, 6, 10, 9, 357, 0, 62, 13, 499, 13, 245, 1, 2, 9, 726, 6, 110, 6, 6, 9, 4759, 9, 787719, 239], astralIdentifierStartCodes = [0, 11, 2, 25, 2, 18, 2, 1, 2, 14, 3, 13, 35, 122, 70, 52, 268, 28, 4, 48, 48, 31, 14, 29, 6, 37, 11, 29, 3, 35, 5, 7, 2, 4, 43, 157, 19, 35, 5, 35, 5, 39, 9, 51, 13, 10, 2, 14, 2, 6, 2, 1, 2, 10, 2, 14, 2, 6, 2, 1, 4, 51, 13, 310, 10, 21, 11, 7, 25, 5, 2, 41, 2, 8, 70, 5, 3, 0, 2, 43, 2, 1, 4, 0, 3, 22, 11, 22, 10, 30, 66, 18, 2, 1, 11, 21, 11, 25, 71, 55, 7, 1, 65, 0, 16, 3, 2, 2, 2, 28, 43, 28, 4, 28, 36, 7, 2, 27, 28, 53, 11, 21, 11, 18, 14, 17, 111, 72, 56, 50, 14, 50, 14, 35, 39, 27, 10, 22, 251, 41, 7, 1, 17, 2, 60, 28, 11, 0, 9, 21, 43, 17, 47, 20, 28, 22, 13, 52, 58, 1, 3, 0, 14, 44, 33, 24, 27, 35, 30, 0, 3, 0, 9, 34, 4, 0, 13, 47, 15, 3, 22, 0, 2, 0, 36, 17, 2, 24, 20, 1, 64, 6, 2, 0, 2, 3, 2, 14, 2, 9, 8, 46, 39, 7, 3, 1, 3, 21, 2, 6, 2, 1, 2, 4, 4, 0, 19, 0, 13, 4, 31, 9, 2, 0, 3, 0, 2, 37, 2, 0, 26, 0, 2, 0, 45, 52, 19, 3, 21, 2, 31, 47, 21, 1, 2, 0, 185, 46, 42, 3, 37, 47, 21, 0, 60, 42, 14, 0, 72, 26, 38, 6, 186, 43, 117, 63, 32, 7, 3, 0, 3, 7, 2, 1, 2, 23, 16, 0, 2, 0, 95, 7, 3, 38, 17, 0, 2, 0, 29, 0, 11, 39, 8, 0, 22, 0, 12, 45, 20, 0, 19, 72, 200, 32, 32, 8, 2, 36, 18, 0, 50, 29, 113, 6, 2, 1, 2, 37, 22, 0, 26, 5, 2, 1, 2, 31, 15, 0, 328, 18, 16, 0, 2, 12, 2, 33, 125, 0, 80, 921, 103, 110, 18, 195, 2637, 96, 16, 1071, 18, 5, 26, 3994, 6, 582, 6842, 29, 1763, 568, 8, 30, 18, 78, 18, 29, 19, 47, 17, 3, 32, 20, 6, 18, 433, 44, 212, 63, 129, 74, 6, 0, 67, 12, 65, 1, 2, 0, 29, 6135, 9, 1237, 42, 9, 8936, 3, 2, 6, 2, 1, 2, 290, 16, 0, 30, 2, 3, 0, 15, 3, 9, 395, 2309, 106, 6, 12, 4, 8, 8, 9, 5991, 84, 2, 70, 2, 1, 3, 0, 3, 1, 3, 3, 2, 11, 2, 0, 2, 6, 2, 64, 2, 3, 3, 7, 2, 6, 2, 27, 2, 3, 2, 4, 2, 0, 4, 6, 2, 339, 3, 24, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 7, 1845, 30, 7, 5, 262, 61, 147, 44, 11, 6, 17, 0, 322, 29, 19, 43, 485, 27, 229, 29, 3, 0, 496, 6, 2, 3, 2, 1, 2, 14, 2, 196, 60, 67, 8, 0, 1205, 3, 2, 26, 2, 1, 2, 0, 3, 0, 2, 9, 2, 3, 2, 0, 2, 0, 7, 0, 5, 0, 2, 0, 2, 0, 2, 2, 2, 1, 2, 0, 3, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 1, 2, 0, 3, 3, 2, 6, 2, 3, 2, 3, 2, 0, 2, 9, 2, 16, 6, 2, 2, 4, 2, 16, 4421, 42719, 33, 4153, 7, 221, 3, 5761, 15, 7472, 16, 621, 2467, 541, 1507, 4938, 6, 4191], nonASCIIidentifierChars = "\u200C\u200D\xB7\u0300-\u036F\u0387\u0483-\u0487\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u0669\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u06F0-\u06F9\u0711\u0730-\u074A\u07A6-\u07B0\u07C0-\u07C9\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u0897-\u089F\u08CA-\u08E1\u08E3-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0966-\u096F\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u09E6-\u09EF\u09FE\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A66-\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0AE6-\u0AEF\u0AFA-\u0AFF\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B55-\u0B57\u0B62\u0B63\u0B66-\u0B6F\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0BE6-\u0BEF\u0C00-\u0C04\u0C3C\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0CE6-\u0CEF\u0CF3\u0D00-\u0D03\u0D3B\u0D3C\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D66-\u0D6F\u0D81-\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0E50-\u0E59\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECE\u0ED0-\u0ED9\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1040-\u1049\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F-\u109D\u135D-\u135F\u1369-\u1371\u1712-\u1715\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u17E0-\u17E9\u180B-\u180D\u180F-\u1819\u18A9\u1920-\u192B\u1930-\u193B\u1946-\u194F\u19D0-\u19DA\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AB0-\u1ABD\u1ABF-\u1ACE\u1B00-\u1B04\u1B34-\u1B44\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BB0-\u1BB9\u1BE6-\u1BF3\u1C24-\u1C37\u1C40-\u1C49\u1C50-\u1C59\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF4\u1CF7-\u1CF9\u1DC0-\u1DFF\u200C\u200D\u203F\u2040\u2054\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\u30FB\uA620-\uA629\uA66F\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA82C\uA880\uA881\uA8B4-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F1\uA8FF-\uA909\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9D0-\uA9D9\uA9E5\uA9F0-\uA9F9\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA50-\uAA59\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uABF0-\uABF9\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFF10-\uFF19\uFF3F\uFF65", nonASCIIidentifierStartChars = "\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u0870-\u0887\u0889-\u088E\u08A0-\u08C9\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C5D\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u1711\u171F-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4C\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C8A\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7CD\uA7D0\uA7D1\uA7D3\uA7D5-\uA7DC\uA7F2-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC", reservedWords = {
      3: "abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile",
      5: "class enum extends super const export import",
      6: "enum",
      strict: "implements interface let package private protected public static yield",
      strictBind: "eval arguments"
    }, ecma5AndLessKeywords = "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this", keywords$1 = {
      5: ecma5AndLessKeywords,
      "5module": ecma5AndLessKeywords + " export import",
      6: ecma5AndLessKeywords + " const class extends export import super"
    }, keywordRelationalOperator = /^in(stanceof)?$/, nonASCIIidentifierStart = new RegExp("[" + nonASCIIidentifierStartChars + "]"), nonASCIIidentifier = new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");
    TokenType = function(label, conf) {
      conf === void 0 && (conf = {}), this.label = label, this.keyword = conf.keyword, this.beforeExpr = !!conf.beforeExpr, this.startsExpr = !!conf.startsExpr, this.isLoop = !!conf.isLoop, this.isAssign = !!conf.isAssign, this.prefix = !!conf.prefix, this.postfix = !!conf.postfix, this.binop = conf.binop || null, this.updateContext = null;
    };
    beforeExpr = { beforeExpr: !0 }, startsExpr = { startsExpr: !0 }, keywords = {};
    types$1 = {
      num: new TokenType("num", startsExpr),
      regexp: new TokenType("regexp", startsExpr),
      string: new TokenType("string", startsExpr),
      name: new TokenType("name", startsExpr),
      privateId: new TokenType("privateId", startsExpr),
      eof: new TokenType("eof"),
      // Punctuation token types.
      bracketL: new TokenType("[", { beforeExpr: !0, startsExpr: !0 }),
      bracketR: new TokenType("]"),
      braceL: new TokenType("{", { beforeExpr: !0, startsExpr: !0 }),
      braceR: new TokenType("}"),
      parenL: new TokenType("(", { beforeExpr: !0, startsExpr: !0 }),
      parenR: new TokenType(")"),
      comma: new TokenType(",", beforeExpr),
      semi: new TokenType(";", beforeExpr),
      colon: new TokenType(":", beforeExpr),
      dot: new TokenType("."),
      question: new TokenType("?", beforeExpr),
      questionDot: new TokenType("?."),
      arrow: new TokenType("=>", beforeExpr),
      template: new TokenType("template"),
      invalidTemplate: new TokenType("invalidTemplate"),
      ellipsis: new TokenType("...", beforeExpr),
      backQuote: new TokenType("`", startsExpr),
      dollarBraceL: new TokenType("${", { beforeExpr: !0, startsExpr: !0 }),
      // Operators. These carry several kinds of properties to help the
      // parser use them properly (the presence of these properties is
      // what categorizes them as operators).
      //
      // `binop`, when present, specifies that this operator is a binary
      // operator, and will refer to its precedence.
      //
      // `prefix` and `postfix` mark the operator as a prefix or postfix
      // unary operator.
      //
      // `isAssign` marks all of `=`, `+=`, `-=` etcetera, which act as
      // binary operators with a very low precedence, that should result
      // in AssignmentExpression nodes.
      eq: new TokenType("=", { beforeExpr: !0, isAssign: !0 }),
      assign: new TokenType("_=", { beforeExpr: !0, isAssign: !0 }),
      incDec: new TokenType("++/--", { prefix: !0, postfix: !0, startsExpr: !0 }),
      prefix: new TokenType("!/~", { beforeExpr: !0, prefix: !0, startsExpr: !0 }),
      logicalOR: binop("||", 1),
      logicalAND: binop("&&", 2),
      bitwiseOR: binop("|", 3),
      bitwiseXOR: binop("^", 4),
      bitwiseAND: binop("&", 5),
      equality: binop("==/!=/===/!==", 6),
      relational: binop("</>/<=/>=", 7),
      bitShift: binop("<</>>/>>>", 8),
      plusMin: new TokenType("+/-", { beforeExpr: !0, binop: 9, prefix: !0, startsExpr: !0 }),
      modulo: binop("%", 10),
      star: binop("*", 10),
      slash: binop("/", 10),
      starstar: new TokenType("**", { beforeExpr: !0 }),
      coalesce: binop("??", 1),
      // Keyword token types.
      _break: kw("break"),
      _case: kw("case", beforeExpr),
      _catch: kw("catch"),
      _continue: kw("continue"),
      _debugger: kw("debugger"),
      _default: kw("default", beforeExpr),
      _do: kw("do", { isLoop: !0, beforeExpr: !0 }),
      _else: kw("else", beforeExpr),
      _finally: kw("finally"),
      _for: kw("for", { isLoop: !0 }),
      _function: kw("function", startsExpr),
      _if: kw("if"),
      _return: kw("return", beforeExpr),
      _switch: kw("switch"),
      _throw: kw("throw", beforeExpr),
      _try: kw("try"),
      _var: kw("var"),
      _const: kw("const"),
      _while: kw("while", { isLoop: !0 }),
      _with: kw("with"),
      _new: kw("new", { beforeExpr: !0, startsExpr: !0 }),
      _this: kw("this", startsExpr),
      _super: kw("super", startsExpr),
      _class: kw("class", startsExpr),
      _extends: kw("extends", beforeExpr),
      _export: kw("export"),
      _import: kw("import", startsExpr),
      _null: kw("null", startsExpr),
      _true: kw("true", startsExpr),
      _false: kw("false", startsExpr),
      _in: kw("in", { beforeExpr: !0, binop: 7 }),
      _instanceof: kw("instanceof", { beforeExpr: !0, binop: 7 }),
      _typeof: kw("typeof", { beforeExpr: !0, prefix: !0, startsExpr: !0 }),
      _void: kw("void", { beforeExpr: !0, prefix: !0, startsExpr: !0 }),
      _delete: kw("delete", { beforeExpr: !0, prefix: !0, startsExpr: !0 })
    }, lineBreak = /\r\n?|\n|\u2028|\u2029/, lineBreakG = new RegExp(lineBreak.source, "g");
    nonASCIIwhitespace = /[\u1680\u2000-\u200a\u202f\u205f\u3000\ufeff]/, skipWhiteSpace = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g, ref = Object.prototype, hasOwnProperty2 = ref.hasOwnProperty, toString = ref.toString, hasOwn = Object.hasOwn || (function(obj, propName) {
      return hasOwnProperty2.call(obj, propName);
    }), isArray = Array.isArray || (function(obj) {
      return toString.call(obj) === "[object Array]";
    }), regexpCache = /* @__PURE__ */ Object.create(null);
    loneSurrogate = /(?:[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/, Position = function(line, col) {
      this.line = line, this.column = col;
    };
    Position.prototype.offset = function(n) {
      return new Position(this.line, this.column + n);
    };
    SourceLocation = function(p, start, end) {
      this.start = start, this.end = end, p.sourceFile !== null && (this.source = p.sourceFile);
    };
    defaultOptions = {
      // `ecmaVersion` indicates the ECMAScript version to parse. Must be
      // either 3, 5, 6 (or 2015), 7 (2016), 8 (2017), 9 (2018), 10
      // (2019), 11 (2020), 12 (2021), 13 (2022), 14 (2023), or `"latest"`
      // (the latest version the library supports). This influences
      // support for strict mode, the set of reserved words, and support
      // for new syntax features.
      ecmaVersion: null,
      // `sourceType` indicates the mode the code should be parsed in.
      // Can be either `"script"` or `"module"`. This influences global
      // strict mode and parsing of `import` and `export` declarations.
      sourceType: "script",
      // `onInsertedSemicolon` can be a callback that will be called when
      // a semicolon is automatically inserted. It will be passed the
      // position of the inserted semicolon as an offset, and if
      // `locations` is enabled, it is given the location as a `{line,
      // column}` object as second argument.
      onInsertedSemicolon: null,
      // `onTrailingComma` is similar to `onInsertedSemicolon`, but for
      // trailing commas.
      onTrailingComma: null,
      // By default, reserved words are only enforced if ecmaVersion >= 5.
      // Set `allowReserved` to a boolean value to explicitly turn this on
      // an off. When this option has the value "never", reserved words
      // and keywords can also not be used as property names.
      allowReserved: null,
      // When enabled, a return at the top level is not considered an
      // error.
      allowReturnOutsideFunction: !1,
      // When enabled, import/export statements are not constrained to
      // appearing at the top of the program, and an import.meta expression
      // in a script isn't considered an error.
      allowImportExportEverywhere: !1,
      // By default, await identifiers are allowed to appear at the top-level scope only if ecmaVersion >= 2022.
      // When enabled, await identifiers are allowed to appear at the top-level scope,
      // but they are still not allowed in non-async functions.
      allowAwaitOutsideFunction: null,
      // When enabled, super identifiers are not constrained to
      // appearing in methods and do not raise an error when they appear elsewhere.
      allowSuperOutsideMethod: null,
      // When enabled, hashbang directive in the beginning of file is
      // allowed and treated as a line comment. Enabled by default when
      // `ecmaVersion` >= 2023.
      allowHashBang: !1,
      // By default, the parser will verify that private properties are
      // only used in places where they are valid and have been declared.
      // Set this to false to turn such checks off.
      checkPrivateFields: !0,
      // When `locations` is on, `loc` properties holding objects with
      // `start` and `end` properties in `{line, column}` form (with
      // line being 1-based and column 0-based) will be attached to the
      // nodes.
      locations: !1,
      // A function can be passed as `onToken` option, which will
      // cause Acorn to call that function with object in the same
      // format as tokens returned from `tokenizer().getToken()`. Note
      // that you are not allowed to call the parser from the
      // callback—that will corrupt its internal state.
      onToken: null,
      // A function can be passed as `onComment` option, which will
      // cause Acorn to call that function with `(block, text, start,
      // end)` parameters whenever a comment is skipped. `block` is a
      // boolean indicating whether this is a block (`/* */`) comment,
      // `text` is the content of the comment, and `start` and `end` are
      // character offsets that denote the start and end of the comment.
      // When the `locations` option is on, two more parameters are
      // passed, the full `{line, column}` locations of the start and
      // end of the comments. Note that you are not allowed to call the
      // parser from the callback—that will corrupt its internal state.
      // When this option has an array as value, objects representing the
      // comments are pushed to it.
      onComment: null,
      // Nodes have their start and end characters offsets recorded in
      // `start` and `end` properties (directly on the node, rather than
      // the `loc` object, which holds line/column data. To also add a
      // [semi-standardized][range] `range` property holding a `[start,
      // end]` array with the same numbers, set the `ranges` option to
      // `true`.
      //
      // [range]: https://bugzilla.mozilla.org/show_bug.cgi?id=745678
      ranges: !1,
      // It is possible to parse multiple files into a single AST by
      // passing the tree produced by parsing the first file as
      // `program` option in subsequent parses. This will add the
      // toplevel forms of the parsed file to the `Program` (top) node
      // of an existing parse tree.
      program: null,
      // When `locations` is on, you can pass this to record the source
      // file in every node's `loc` object.
      sourceFile: null,
      // This value, if given, is stored in every node, whether
      // `locations` is on or off.
      directSourceFile: null,
      // When enabled, parenthesized expressions are represented by
      // (non-standard) ParenthesizedExpression nodes
      preserveParens: !1
    }, warnedAboutEcmaVersion = !1;
    SCOPE_TOP = 1, SCOPE_FUNCTION = 2, SCOPE_ASYNC = 4, SCOPE_GENERATOR = 8, SCOPE_ARROW = 16, SCOPE_SIMPLE_CATCH = 32, SCOPE_SUPER = 64, SCOPE_DIRECT_SUPER = 128, SCOPE_CLASS_STATIC_BLOCK = 256, SCOPE_CLASS_FIELD_INIT = 512, SCOPE_VAR = SCOPE_TOP | SCOPE_FUNCTION | SCOPE_CLASS_STATIC_BLOCK;
    BIND_NONE = 0, BIND_VAR = 1, BIND_LEXICAL = 2, BIND_FUNCTION = 3, BIND_SIMPLE_CATCH = 4, BIND_OUTSIDE = 5, Parser = function(options, input, startPos) {
      this.options = options = getOptions(options), this.sourceFile = options.sourceFile, this.keywords = wordsRegexp(keywords$1[options.ecmaVersion >= 6 ? 6 : options.sourceType === "module" ? "5module" : 5]);
      var reserved = "";
      options.allowReserved !== !0 && (reserved = reservedWords[options.ecmaVersion >= 6 ? 6 : options.ecmaVersion === 5 ? 5 : 3], options.sourceType === "module" && (reserved += " await")), this.reservedWords = wordsRegexp(reserved);
      var reservedStrict = (reserved ? reserved + " " : "") + reservedWords.strict;
      this.reservedWordsStrict = wordsRegexp(reservedStrict), this.reservedWordsStrictBind = wordsRegexp(reservedStrict + " " + reservedWords.strictBind), this.input = String(input), this.containsEsc = !1, startPos ? (this.pos = startPos, this.lineStart = this.input.lastIndexOf(`
`, startPos - 1) + 1, this.curLine = this.input.slice(0, this.lineStart).split(lineBreak).length) : (this.pos = this.lineStart = 0, this.curLine = 1), this.type = types$1.eof, this.value = null, this.start = this.end = this.pos, this.startLoc = this.endLoc = this.curPosition(), this.lastTokEndLoc = this.lastTokStartLoc = null, this.lastTokStart = this.lastTokEnd = this.pos, this.context = this.initialContext(), this.exprAllowed = !0, this.inModule = options.sourceType === "module", this.strict = this.inModule || this.strictDirective(this.pos), this.potentialArrowAt = -1, this.potentialArrowInForAwait = !1, this.yieldPos = this.awaitPos = this.awaitIdentPos = 0, this.labels = [], this.undefinedExports = /* @__PURE__ */ Object.create(null), this.pos === 0 && options.allowHashBang && this.input.slice(0, 2) === "#!" && this.skipLineComment(2), this.scopeStack = [], this.enterScope(SCOPE_TOP), this.regexpState = null, this.privateNameStack = [];
    }, prototypeAccessors = { inFunction: { configurable: !0 }, inGenerator: { configurable: !0 }, inAsync: { configurable: !0 }, canAwait: { configurable: !0 }, allowSuper: { configurable: !0 }, allowDirectSuper: { configurable: !0 }, treatFunctionsAsVar: { configurable: !0 }, allowNewDotTarget: { configurable: !0 }, inClassStaticBlock: { configurable: !0 } };
    Parser.prototype.parse = function() {
      var node = this.options.program || this.startNode();
      return this.nextToken(), this.parseTopLevel(node);
    };
    prototypeAccessors.inFunction.get = function() {
      return (this.currentVarScope().flags & SCOPE_FUNCTION) > 0;
    };
    prototypeAccessors.inGenerator.get = function() {
      return (this.currentVarScope().flags & SCOPE_GENERATOR) > 0;
    };
    prototypeAccessors.inAsync.get = function() {
      return (this.currentVarScope().flags & SCOPE_ASYNC) > 0;
    };
    prototypeAccessors.canAwait.get = function() {
      for (var i2 = this.scopeStack.length - 1; i2 >= 0; i2--) {
        var ref2 = this.scopeStack[i2], flags = ref2.flags;
        if (flags & (SCOPE_CLASS_STATIC_BLOCK | SCOPE_CLASS_FIELD_INIT))
          return !1;
        if (flags & SCOPE_FUNCTION)
          return (flags & SCOPE_ASYNC) > 0;
      }
      return this.inModule && this.options.ecmaVersion >= 13 || this.options.allowAwaitOutsideFunction;
    };
    prototypeAccessors.allowSuper.get = function() {
      var ref2 = this.currentThisScope(), flags = ref2.flags;
      return (flags & SCOPE_SUPER) > 0 || this.options.allowSuperOutsideMethod;
    };
    prototypeAccessors.allowDirectSuper.get = function() {
      return (this.currentThisScope().flags & SCOPE_DIRECT_SUPER) > 0;
    };
    prototypeAccessors.treatFunctionsAsVar.get = function() {
      return this.treatFunctionsAsVarInScope(this.currentScope());
    };
    prototypeAccessors.allowNewDotTarget.get = function() {
      for (var i2 = this.scopeStack.length - 1; i2 >= 0; i2--) {
        var ref2 = this.scopeStack[i2], flags = ref2.flags;
        if (flags & (SCOPE_CLASS_STATIC_BLOCK | SCOPE_CLASS_FIELD_INIT) || flags & SCOPE_FUNCTION && !(flags & SCOPE_ARROW))
          return !0;
      }
      return !1;
    };
    prototypeAccessors.inClassStaticBlock.get = function() {
      return (this.currentVarScope().flags & SCOPE_CLASS_STATIC_BLOCK) > 0;
    };
    Parser.extend = function() {
      for (var plugins = [], len = arguments.length; len--; ) plugins[len] = arguments[len];
      for (var cls = this, i2 = 0; i2 < plugins.length; i2++)
        cls = plugins[i2](cls);
      return cls;
    };
    Parser.parse = function(input, options) {
      return new this(options, input).parse();
    };
    Parser.parseExpressionAt = function(input, pos, options) {
      var parser2 = new this(options, input, pos);
      return parser2.nextToken(), parser2.parseExpression();
    };
    Parser.tokenizer = function(input, options) {
      return new this(options, input);
    };
    Object.defineProperties(Parser.prototype, prototypeAccessors);
    pp$9 = Parser.prototype, literal = /^(?:'((?:\\[^]|[^'\\])*?)'|"((?:\\[^]|[^"\\])*?)")/;
    pp$9.strictDirective = function(start) {
      if (this.options.ecmaVersion < 5)
        return !1;
      for (; ; ) {
        skipWhiteSpace.lastIndex = start, start += skipWhiteSpace.exec(this.input)[0].length;
        var match = literal.exec(this.input.slice(start));
        if (!match)
          return !1;
        if ((match[1] || match[2]) === "use strict") {
          skipWhiteSpace.lastIndex = start + match[0].length;
          var spaceAfter = skipWhiteSpace.exec(this.input), end = spaceAfter.index + spaceAfter[0].length, next = this.input.charAt(end);
          return next === ";" || next === "}" || lineBreak.test(spaceAfter[0]) && !(/[(`.[+\-/*%<>=,?^&]/.test(next) || next === "!" && this.input.charAt(end + 1) === "=");
        }
        start += match[0].length, skipWhiteSpace.lastIndex = start, start += skipWhiteSpace.exec(this.input)[0].length, this.input[start] === ";" && start++;
      }
    };
    pp$9.eat = function(type) {
      return this.type === type ? (this.next(), !0) : !1;
    };
    pp$9.isContextual = function(name) {
      return this.type === types$1.name && this.value === name && !this.containsEsc;
    };
    pp$9.eatContextual = function(name) {
      return this.isContextual(name) ? (this.next(), !0) : !1;
    };
    pp$9.expectContextual = function(name) {
      this.eatContextual(name) || this.unexpected();
    };
    pp$9.canInsertSemicolon = function() {
      return this.type === types$1.eof || this.type === types$1.braceR || lineBreak.test(this.input.slice(this.lastTokEnd, this.start));
    };
    pp$9.insertSemicolon = function() {
      if (this.canInsertSemicolon())
        return this.options.onInsertedSemicolon && this.options.onInsertedSemicolon(this.lastTokEnd, this.lastTokEndLoc), !0;
    };
    pp$9.semicolon = function() {
      !this.eat(types$1.semi) && !this.insertSemicolon() && this.unexpected();
    };
    pp$9.afterTrailingComma = function(tokType, notNext) {
      if (this.type === tokType)
        return this.options.onTrailingComma && this.options.onTrailingComma(this.lastTokStart, this.lastTokStartLoc), notNext || this.next(), !0;
    };
    pp$9.expect = function(type) {
      this.eat(type) || this.unexpected();
    };
    pp$9.unexpected = function(pos) {
      this.raise(pos ?? this.start, "Unexpected token");
    };
    DestructuringErrors = function() {
      this.shorthandAssign = this.trailingComma = this.parenthesizedAssign = this.parenthesizedBind = this.doubleProto = -1;
    };
    pp$9.checkPatternErrors = function(refDestructuringErrors, isAssign) {
      if (refDestructuringErrors) {
        refDestructuringErrors.trailingComma > -1 && this.raiseRecoverable(refDestructuringErrors.trailingComma, "Comma is not permitted after the rest element");
        var parens = isAssign ? refDestructuringErrors.parenthesizedAssign : refDestructuringErrors.parenthesizedBind;
        parens > -1 && this.raiseRecoverable(parens, isAssign ? "Assigning to rvalue" : "Parenthesized pattern");
      }
    };
    pp$9.checkExpressionErrors = function(refDestructuringErrors, andThrow) {
      if (!refDestructuringErrors)
        return !1;
      var shorthandAssign = refDestructuringErrors.shorthandAssign, doubleProto = refDestructuringErrors.doubleProto;
      if (!andThrow)
        return shorthandAssign >= 0 || doubleProto >= 0;
      shorthandAssign >= 0 && this.raise(shorthandAssign, "Shorthand property assignments are valid only in destructuring patterns"), doubleProto >= 0 && this.raiseRecoverable(doubleProto, "Redefinition of __proto__ property");
    };
    pp$9.checkYieldAwaitInDefaultParams = function() {
      this.yieldPos && (!this.awaitPos || this.yieldPos < this.awaitPos) && this.raise(this.yieldPos, "Yield expression cannot be a default value"), this.awaitPos && this.raise(this.awaitPos, "Await expression cannot be a default value");
    };
    pp$9.isSimpleAssignTarget = function(expr) {
      return expr.type === "ParenthesizedExpression" ? this.isSimpleAssignTarget(expr.expression) : expr.type === "Identifier" || expr.type === "MemberExpression";
    };
    pp$8 = Parser.prototype;
    pp$8.parseTopLevel = function(node) {
      var exports = /* @__PURE__ */ Object.create(null);
      for (node.body || (node.body = []); this.type !== types$1.eof; ) {
        var stmt = this.parseStatement(null, !0, exports);
        node.body.push(stmt);
      }
      if (this.inModule)
        for (var i2 = 0, list2 = Object.keys(this.undefinedExports); i2 < list2.length; i2 += 1) {
          var name = list2[i2];
          this.raiseRecoverable(this.undefinedExports[name].start, "Export '" + name + "' is not defined");
        }
      return this.adaptDirectivePrologue(node.body), this.next(), node.sourceType = this.options.sourceType, this.finishNode(node, "Program");
    };
    loopLabel = { kind: "loop" }, switchLabel = { kind: "switch" };
    pp$8.isLet = function(context) {
      if (this.options.ecmaVersion < 6 || !this.isContextual("let"))
        return !1;
      skipWhiteSpace.lastIndex = this.pos;
      var skip = skipWhiteSpace.exec(this.input), next = this.pos + skip[0].length, nextCh = this.input.charCodeAt(next);
      if (nextCh === 91 || nextCh === 92)
        return !0;
      if (context)
        return !1;
      if (nextCh === 123 || nextCh > 55295 && nextCh < 56320)
        return !0;
      if (isIdentifierStart(nextCh, !0)) {
        for (var pos = next + 1; isIdentifierChar(nextCh = this.input.charCodeAt(pos), !0); )
          ++pos;
        if (nextCh === 92 || nextCh > 55295 && nextCh < 56320)
          return !0;
        var ident = this.input.slice(next, pos);
        if (!keywordRelationalOperator.test(ident))
          return !0;
      }
      return !1;
    };
    pp$8.isAsyncFunction = function() {
      if (this.options.ecmaVersion < 8 || !this.isContextual("async"))
        return !1;
      skipWhiteSpace.lastIndex = this.pos;
      var skip = skipWhiteSpace.exec(this.input), next = this.pos + skip[0].length, after;
      return !lineBreak.test(this.input.slice(this.pos, next)) && this.input.slice(next, next + 8) === "function" && (next + 8 === this.input.length || !(isIdentifierChar(after = this.input.charCodeAt(next + 8)) || after > 55295 && after < 56320));
    };
    pp$8.isUsingKeyword = function(isAwaitUsing, isFor) {
      if (this.options.ecmaVersion < 17 || !this.isContextual(isAwaitUsing ? "await" : "using"))
        return !1;
      skipWhiteSpace.lastIndex = this.pos;
      var skip = skipWhiteSpace.exec(this.input), next = this.pos + skip[0].length;
      if (lineBreak.test(this.input.slice(this.pos, next)))
        return !1;
      if (isAwaitUsing) {
        var awaitEndPos = next + 5, after;
        if (this.input.slice(next, awaitEndPos) !== "using" || awaitEndPos === this.input.length || isIdentifierChar(after = this.input.charCodeAt(awaitEndPos)) || after > 55295 && after < 56320)
          return !1;
        skipWhiteSpace.lastIndex = awaitEndPos;
        var skipAfterUsing = skipWhiteSpace.exec(this.input);
        if (skipAfterUsing && lineBreak.test(this.input.slice(awaitEndPos, awaitEndPos + skipAfterUsing[0].length)))
          return !1;
      }
      if (isFor) {
        var ofEndPos = next + 2, after$1;
        if (this.input.slice(next, ofEndPos) === "of" && (ofEndPos === this.input.length || !isIdentifierChar(after$1 = this.input.charCodeAt(ofEndPos)) && !(after$1 > 55295 && after$1 < 56320)))
          return !1;
      }
      var ch = this.input.charCodeAt(next);
      return isIdentifierStart(ch, !0) || ch === 92;
    };
    pp$8.isAwaitUsing = function(isFor) {
      return this.isUsingKeyword(!0, isFor);
    };
    pp$8.isUsing = function(isFor) {
      return this.isUsingKeyword(!1, isFor);
    };
    pp$8.parseStatement = function(context, topLevel, exports) {
      var starttype = this.type, node = this.startNode(), kind;
      switch (this.isLet(context) && (starttype = types$1._var, kind = "let"), starttype) {
        case types$1._break:
        case types$1._continue:
          return this.parseBreakContinueStatement(node, starttype.keyword);
        case types$1._debugger:
          return this.parseDebuggerStatement(node);
        case types$1._do:
          return this.parseDoStatement(node);
        case types$1._for:
          return this.parseForStatement(node);
        case types$1._function:
          return context && (this.strict || context !== "if" && context !== "label") && this.options.ecmaVersion >= 6 && this.unexpected(), this.parseFunctionStatement(node, !1, !context);
        case types$1._class:
          return context && this.unexpected(), this.parseClass(node, !0);
        case types$1._if:
          return this.parseIfStatement(node);
        case types$1._return:
          return this.parseReturnStatement(node);
        case types$1._switch:
          return this.parseSwitchStatement(node);
        case types$1._throw:
          return this.parseThrowStatement(node);
        case types$1._try:
          return this.parseTryStatement(node);
        case types$1._const:
        case types$1._var:
          return kind = kind || this.value, context && kind !== "var" && this.unexpected(), this.parseVarStatement(node, kind);
        case types$1._while:
          return this.parseWhileStatement(node);
        case types$1._with:
          return this.parseWithStatement(node);
        case types$1.braceL:
          return this.parseBlock(!0, node);
        case types$1.semi:
          return this.parseEmptyStatement(node);
        case types$1._export:
        case types$1._import:
          if (this.options.ecmaVersion > 10 && starttype === types$1._import) {
            skipWhiteSpace.lastIndex = this.pos;
            var skip = skipWhiteSpace.exec(this.input), next = this.pos + skip[0].length, nextCh = this.input.charCodeAt(next);
            if (nextCh === 40 || nextCh === 46)
              return this.parseExpressionStatement(node, this.parseExpression());
          }
          return this.options.allowImportExportEverywhere || (topLevel || this.raise(this.start, "'import' and 'export' may only appear at the top level"), this.inModule || this.raise(this.start, "'import' and 'export' may appear only with 'sourceType: module'")), starttype === types$1._import ? this.parseImport(node) : this.parseExport(node, exports);
        // If the statement does not start with a statement keyword or a
        // brace, it's an ExpressionStatement or LabeledStatement. We
        // simply start parsing an expression, and afterwards, if the
        // next token is a colon and the expression was a simple
        // Identifier node, we switch to interpreting it as a label.
        default:
          if (this.isAsyncFunction())
            return context && this.unexpected(), this.next(), this.parseFunctionStatement(node, !0, !context);
          var usingKind = this.isAwaitUsing(!1) ? "await using" : this.isUsing(!1) ? "using" : null;
          if (usingKind)
            return topLevel && this.options.sourceType === "script" && this.raise(this.start, "Using declaration cannot appear in the top level when source type is `script`"), usingKind === "await using" && (this.canAwait || this.raise(this.start, "Await using cannot appear outside of async function"), this.next()), this.next(), this.parseVar(node, !1, usingKind), this.semicolon(), this.finishNode(node, "VariableDeclaration");
          var maybeName = this.value, expr = this.parseExpression();
          return starttype === types$1.name && expr.type === "Identifier" && this.eat(types$1.colon) ? this.parseLabeledStatement(node, maybeName, expr, context) : this.parseExpressionStatement(node, expr);
      }
    };
    pp$8.parseBreakContinueStatement = function(node, keyword) {
      var isBreak = keyword === "break";
      this.next(), this.eat(types$1.semi) || this.insertSemicolon() ? node.label = null : this.type !== types$1.name ? this.unexpected() : (node.label = this.parseIdent(), this.semicolon());
      for (var i2 = 0; i2 < this.labels.length; ++i2) {
        var lab = this.labels[i2];
        if ((node.label == null || lab.name === node.label.name) && (lab.kind != null && (isBreak || lab.kind === "loop") || node.label && isBreak))
          break;
      }
      return i2 === this.labels.length && this.raise(node.start, "Unsyntactic " + keyword), this.finishNode(node, isBreak ? "BreakStatement" : "ContinueStatement");
    };
    pp$8.parseDebuggerStatement = function(node) {
      return this.next(), this.semicolon(), this.finishNode(node, "DebuggerStatement");
    };
    pp$8.parseDoStatement = function(node) {
      return this.next(), this.labels.push(loopLabel), node.body = this.parseStatement("do"), this.labels.pop(), this.expect(types$1._while), node.test = this.parseParenExpression(), this.options.ecmaVersion >= 6 ? this.eat(types$1.semi) : this.semicolon(), this.finishNode(node, "DoWhileStatement");
    };
    pp$8.parseForStatement = function(node) {
      this.next();
      var awaitAt = this.options.ecmaVersion >= 9 && this.canAwait && this.eatContextual("await") ? this.lastTokStart : -1;
      if (this.labels.push(loopLabel), this.enterScope(0), this.expect(types$1.parenL), this.type === types$1.semi)
        return awaitAt > -1 && this.unexpected(awaitAt), this.parseFor(node, null);
      var isLet = this.isLet();
      if (this.type === types$1._var || this.type === types$1._const || isLet) {
        var init$1 = this.startNode(), kind = isLet ? "let" : this.value;
        return this.next(), this.parseVar(init$1, !0, kind), this.finishNode(init$1, "VariableDeclaration"), this.parseForAfterInit(node, init$1, awaitAt);
      }
      var startsWithLet = this.isContextual("let"), isForOf = !1, usingKind = this.isUsing(!0) ? "using" : this.isAwaitUsing(!0) ? "await using" : null;
      if (usingKind) {
        var init$2 = this.startNode();
        return this.next(), usingKind === "await using" && this.next(), this.parseVar(init$2, !0, usingKind), this.finishNode(init$2, "VariableDeclaration"), this.parseForAfterInit(node, init$2, awaitAt);
      }
      var containsEsc = this.containsEsc, refDestructuringErrors = new DestructuringErrors(), initPos = this.start, init = awaitAt > -1 ? this.parseExprSubscripts(refDestructuringErrors, "await") : this.parseExpression(!0, refDestructuringErrors);
      return this.type === types$1._in || (isForOf = this.options.ecmaVersion >= 6 && this.isContextual("of")) ? (awaitAt > -1 ? (this.type === types$1._in && this.unexpected(awaitAt), node.await = !0) : isForOf && this.options.ecmaVersion >= 8 && (init.start === initPos && !containsEsc && init.type === "Identifier" && init.name === "async" ? this.unexpected() : this.options.ecmaVersion >= 9 && (node.await = !1)), startsWithLet && isForOf && this.raise(init.start, "The left-hand side of a for-of loop may not start with 'let'."), this.toAssignable(init, !1, refDestructuringErrors), this.checkLValPattern(init), this.parseForIn(node, init)) : (this.checkExpressionErrors(refDestructuringErrors, !0), awaitAt > -1 && this.unexpected(awaitAt), this.parseFor(node, init));
    };
    pp$8.parseForAfterInit = function(node, init, awaitAt) {
      return (this.type === types$1._in || this.options.ecmaVersion >= 6 && this.isContextual("of")) && init.declarations.length === 1 ? (this.options.ecmaVersion >= 9 && (this.type === types$1._in ? awaitAt > -1 && this.unexpected(awaitAt) : node.await = awaitAt > -1), this.parseForIn(node, init)) : (awaitAt > -1 && this.unexpected(awaitAt), this.parseFor(node, init));
    };
    pp$8.parseFunctionStatement = function(node, isAsync, declarationPosition) {
      return this.next(), this.parseFunction(node, FUNC_STATEMENT | (declarationPosition ? 0 : FUNC_HANGING_STATEMENT), !1, isAsync);
    };
    pp$8.parseIfStatement = function(node) {
      return this.next(), node.test = this.parseParenExpression(), node.consequent = this.parseStatement("if"), node.alternate = this.eat(types$1._else) ? this.parseStatement("if") : null, this.finishNode(node, "IfStatement");
    };
    pp$8.parseReturnStatement = function(node) {
      return !this.inFunction && !this.options.allowReturnOutsideFunction && this.raise(this.start, "'return' outside of function"), this.next(), this.eat(types$1.semi) || this.insertSemicolon() ? node.argument = null : (node.argument = this.parseExpression(), this.semicolon()), this.finishNode(node, "ReturnStatement");
    };
    pp$8.parseSwitchStatement = function(node) {
      this.next(), node.discriminant = this.parseParenExpression(), node.cases = [], this.expect(types$1.braceL), this.labels.push(switchLabel), this.enterScope(0);
      for (var cur, sawDefault = !1; this.type !== types$1.braceR; )
        if (this.type === types$1._case || this.type === types$1._default) {
          var isCase = this.type === types$1._case;
          cur && this.finishNode(cur, "SwitchCase"), node.cases.push(cur = this.startNode()), cur.consequent = [], this.next(), isCase ? cur.test = this.parseExpression() : (sawDefault && this.raiseRecoverable(this.lastTokStart, "Multiple default clauses"), sawDefault = !0, cur.test = null), this.expect(types$1.colon);
        } else
          cur || this.unexpected(), cur.consequent.push(this.parseStatement(null));
      return this.exitScope(), cur && this.finishNode(cur, "SwitchCase"), this.next(), this.labels.pop(), this.finishNode(node, "SwitchStatement");
    };
    pp$8.parseThrowStatement = function(node) {
      return this.next(), lineBreak.test(this.input.slice(this.lastTokEnd, this.start)) && this.raise(this.lastTokEnd, "Illegal newline after throw"), node.argument = this.parseExpression(), this.semicolon(), this.finishNode(node, "ThrowStatement");
    };
    empty$1 = [];
    pp$8.parseCatchClauseParam = function() {
      var param = this.parseBindingAtom(), simple2 = param.type === "Identifier";
      return this.enterScope(simple2 ? SCOPE_SIMPLE_CATCH : 0), this.checkLValPattern(param, simple2 ? BIND_SIMPLE_CATCH : BIND_LEXICAL), this.expect(types$1.parenR), param;
    };
    pp$8.parseTryStatement = function(node) {
      if (this.next(), node.block = this.parseBlock(), node.handler = null, this.type === types$1._catch) {
        var clause = this.startNode();
        this.next(), this.eat(types$1.parenL) ? clause.param = this.parseCatchClauseParam() : (this.options.ecmaVersion < 10 && this.unexpected(), clause.param = null, this.enterScope(0)), clause.body = this.parseBlock(!1), this.exitScope(), node.handler = this.finishNode(clause, "CatchClause");
      }
      return node.finalizer = this.eat(types$1._finally) ? this.parseBlock() : null, !node.handler && !node.finalizer && this.raise(node.start, "Missing catch or finally clause"), this.finishNode(node, "TryStatement");
    };
    pp$8.parseVarStatement = function(node, kind, allowMissingInitializer) {
      return this.next(), this.parseVar(node, !1, kind, allowMissingInitializer), this.semicolon(), this.finishNode(node, "VariableDeclaration");
    };
    pp$8.parseWhileStatement = function(node) {
      return this.next(), node.test = this.parseParenExpression(), this.labels.push(loopLabel), node.body = this.parseStatement("while"), this.labels.pop(), this.finishNode(node, "WhileStatement");
    };
    pp$8.parseWithStatement = function(node) {
      return this.strict && this.raise(this.start, "'with' in strict mode"), this.next(), node.object = this.parseParenExpression(), node.body = this.parseStatement("with"), this.finishNode(node, "WithStatement");
    };
    pp$8.parseEmptyStatement = function(node) {
      return this.next(), this.finishNode(node, "EmptyStatement");
    };
    pp$8.parseLabeledStatement = function(node, maybeName, expr, context) {
      for (var i$1 = 0, list2 = this.labels; i$1 < list2.length; i$1 += 1) {
        var label = list2[i$1];
        label.name === maybeName && this.raise(expr.start, "Label '" + maybeName + "' is already declared");
      }
      for (var kind = this.type.isLoop ? "loop" : this.type === types$1._switch ? "switch" : null, i2 = this.labels.length - 1; i2 >= 0; i2--) {
        var label$1 = this.labels[i2];
        if (label$1.statementStart === node.start)
          label$1.statementStart = this.start, label$1.kind = kind;
        else
          break;
      }
      return this.labels.push({ name: maybeName, kind, statementStart: this.start }), node.body = this.parseStatement(context ? context.indexOf("label") === -1 ? context + "label" : context : "label"), this.labels.pop(), node.label = expr, this.finishNode(node, "LabeledStatement");
    };
    pp$8.parseExpressionStatement = function(node, expr) {
      return node.expression = expr, this.semicolon(), this.finishNode(node, "ExpressionStatement");
    };
    pp$8.parseBlock = function(createNewLexicalScope, node, exitStrict) {
      for (createNewLexicalScope === void 0 && (createNewLexicalScope = !0), node === void 0 && (node = this.startNode()), node.body = [], this.expect(types$1.braceL), createNewLexicalScope && this.enterScope(0); this.type !== types$1.braceR; ) {
        var stmt = this.parseStatement(null);
        node.body.push(stmt);
      }
      return exitStrict && (this.strict = !1), this.next(), createNewLexicalScope && this.exitScope(), this.finishNode(node, "BlockStatement");
    };
    pp$8.parseFor = function(node, init) {
      return node.init = init, this.expect(types$1.semi), node.test = this.type === types$1.semi ? null : this.parseExpression(), this.expect(types$1.semi), node.update = this.type === types$1.parenR ? null : this.parseExpression(), this.expect(types$1.parenR), node.body = this.parseStatement("for"), this.exitScope(), this.labels.pop(), this.finishNode(node, "ForStatement");
    };
    pp$8.parseForIn = function(node, init) {
      var isForIn = this.type === types$1._in;
      return this.next(), init.type === "VariableDeclaration" && init.declarations[0].init != null && (!isForIn || this.options.ecmaVersion < 8 || this.strict || init.kind !== "var" || init.declarations[0].id.type !== "Identifier") && this.raise(
        init.start,
        (isForIn ? "for-in" : "for-of") + " loop variable declaration may not have an initializer"
      ), node.left = init, node.right = isForIn ? this.parseExpression() : this.parseMaybeAssign(), this.expect(types$1.parenR), node.body = this.parseStatement("for"), this.exitScope(), this.labels.pop(), this.finishNode(node, isForIn ? "ForInStatement" : "ForOfStatement");
    };
    pp$8.parseVar = function(node, isFor, kind, allowMissingInitializer) {
      for (node.declarations = [], node.kind = kind; ; ) {
        var decl = this.startNode();
        if (this.parseVarId(decl, kind), this.eat(types$1.eq) ? decl.init = this.parseMaybeAssign(isFor) : !allowMissingInitializer && kind === "const" && !(this.type === types$1._in || this.options.ecmaVersion >= 6 && this.isContextual("of")) ? this.unexpected() : !allowMissingInitializer && (kind === "using" || kind === "await using") && this.options.ecmaVersion >= 17 && this.type !== types$1._in && !this.isContextual("of") ? this.raise(this.lastTokEnd, "Missing initializer in " + kind + " declaration") : !allowMissingInitializer && decl.id.type !== "Identifier" && !(isFor && (this.type === types$1._in || this.isContextual("of"))) ? this.raise(this.lastTokEnd, "Complex binding patterns require an initialization value") : decl.init = null, node.declarations.push(this.finishNode(decl, "VariableDeclarator")), !this.eat(types$1.comma))
          break;
      }
      return node;
    };
    pp$8.parseVarId = function(decl, kind) {
      decl.id = kind === "using" || kind === "await using" ? this.parseIdent() : this.parseBindingAtom(), this.checkLValPattern(decl.id, kind === "var" ? BIND_VAR : BIND_LEXICAL, !1);
    };
    FUNC_STATEMENT = 1, FUNC_HANGING_STATEMENT = 2, FUNC_NULLABLE_ID = 4;
    pp$8.parseFunction = function(node, statement, allowExpressionBody, isAsync, forInit) {
      this.initFunction(node), (this.options.ecmaVersion >= 9 || this.options.ecmaVersion >= 6 && !isAsync) && (this.type === types$1.star && statement & FUNC_HANGING_STATEMENT && this.unexpected(), node.generator = this.eat(types$1.star)), this.options.ecmaVersion >= 8 && (node.async = !!isAsync), statement & FUNC_STATEMENT && (node.id = statement & FUNC_NULLABLE_ID && this.type !== types$1.name ? null : this.parseIdent(), node.id && !(statement & FUNC_HANGING_STATEMENT) && this.checkLValSimple(node.id, this.strict || node.generator || node.async ? this.treatFunctionsAsVar ? BIND_VAR : BIND_LEXICAL : BIND_FUNCTION));
      var oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
      return this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0, this.enterScope(functionFlags(node.async, node.generator)), statement & FUNC_STATEMENT || (node.id = this.type === types$1.name ? this.parseIdent() : null), this.parseFunctionParams(node), this.parseFunctionBody(node, allowExpressionBody, !1, forInit), this.yieldPos = oldYieldPos, this.awaitPos = oldAwaitPos, this.awaitIdentPos = oldAwaitIdentPos, this.finishNode(node, statement & FUNC_STATEMENT ? "FunctionDeclaration" : "FunctionExpression");
    };
    pp$8.parseFunctionParams = function(node) {
      this.expect(types$1.parenL), node.params = this.parseBindingList(types$1.parenR, !1, this.options.ecmaVersion >= 8), this.checkYieldAwaitInDefaultParams();
    };
    pp$8.parseClass = function(node, isStatement) {
      this.next();
      var oldStrict = this.strict;
      this.strict = !0, this.parseClassId(node, isStatement), this.parseClassSuper(node);
      var privateNameMap = this.enterClassBody(), classBody = this.startNode(), hadConstructor = !1;
      for (classBody.body = [], this.expect(types$1.braceL); this.type !== types$1.braceR; ) {
        var element = this.parseClassElement(node.superClass !== null);
        element && (classBody.body.push(element), element.type === "MethodDefinition" && element.kind === "constructor" ? (hadConstructor && this.raiseRecoverable(element.start, "Duplicate constructor in the same class"), hadConstructor = !0) : element.key && element.key.type === "PrivateIdentifier" && isPrivateNameConflicted(privateNameMap, element) && this.raiseRecoverable(element.key.start, "Identifier '#" + element.key.name + "' has already been declared"));
      }
      return this.strict = oldStrict, this.next(), node.body = this.finishNode(classBody, "ClassBody"), this.exitClassBody(), this.finishNode(node, isStatement ? "ClassDeclaration" : "ClassExpression");
    };
    pp$8.parseClassElement = function(constructorAllowsSuper) {
      if (this.eat(types$1.semi))
        return null;
      var ecmaVersion2 = this.options.ecmaVersion, node = this.startNode(), keyName = "", isGenerator = !1, isAsync = !1, kind = "method", isStatic = !1;
      if (this.eatContextual("static")) {
        if (ecmaVersion2 >= 13 && this.eat(types$1.braceL))
          return this.parseClassStaticBlock(node), node;
        this.isClassElementNameStart() || this.type === types$1.star ? isStatic = !0 : keyName = "static";
      }
      if (node.static = isStatic, !keyName && ecmaVersion2 >= 8 && this.eatContextual("async") && ((this.isClassElementNameStart() || this.type === types$1.star) && !this.canInsertSemicolon() ? isAsync = !0 : keyName = "async"), !keyName && (ecmaVersion2 >= 9 || !isAsync) && this.eat(types$1.star) && (isGenerator = !0), !keyName && !isAsync && !isGenerator) {
        var lastValue = this.value;
        (this.eatContextual("get") || this.eatContextual("set")) && (this.isClassElementNameStart() ? kind = lastValue : keyName = lastValue);
      }
      if (keyName ? (node.computed = !1, node.key = this.startNodeAt(this.lastTokStart, this.lastTokStartLoc), node.key.name = keyName, this.finishNode(node.key, "Identifier")) : this.parseClassElementName(node), ecmaVersion2 < 13 || this.type === types$1.parenL || kind !== "method" || isGenerator || isAsync) {
        var isConstructor = !node.static && checkKeyName(node, "constructor"), allowsDirectSuper = isConstructor && constructorAllowsSuper;
        isConstructor && kind !== "method" && this.raise(node.key.start, "Constructor can't have get/set modifier"), node.kind = isConstructor ? "constructor" : kind, this.parseClassMethod(node, isGenerator, isAsync, allowsDirectSuper);
      } else
        this.parseClassField(node);
      return node;
    };
    pp$8.isClassElementNameStart = function() {
      return this.type === types$1.name || this.type === types$1.privateId || this.type === types$1.num || this.type === types$1.string || this.type === types$1.bracketL || this.type.keyword;
    };
    pp$8.parseClassElementName = function(element) {
      this.type === types$1.privateId ? (this.value === "constructor" && this.raise(this.start, "Classes can't have an element named '#constructor'"), element.computed = !1, element.key = this.parsePrivateIdent()) : this.parsePropertyName(element);
    };
    pp$8.parseClassMethod = function(method, isGenerator, isAsync, allowsDirectSuper) {
      var key = method.key;
      method.kind === "constructor" ? (isGenerator && this.raise(key.start, "Constructor can't be a generator"), isAsync && this.raise(key.start, "Constructor can't be an async method")) : method.static && checkKeyName(method, "prototype") && this.raise(key.start, "Classes may not have a static property named prototype");
      var value = method.value = this.parseMethod(isGenerator, isAsync, allowsDirectSuper);
      return method.kind === "get" && value.params.length !== 0 && this.raiseRecoverable(value.start, "getter should have no params"), method.kind === "set" && value.params.length !== 1 && this.raiseRecoverable(value.start, "setter should have exactly one param"), method.kind === "set" && value.params[0].type === "RestElement" && this.raiseRecoverable(value.params[0].start, "Setter cannot use rest params"), this.finishNode(method, "MethodDefinition");
    };
    pp$8.parseClassField = function(field) {
      return checkKeyName(field, "constructor") ? this.raise(field.key.start, "Classes can't have a field named 'constructor'") : field.static && checkKeyName(field, "prototype") && this.raise(field.key.start, "Classes can't have a static field named 'prototype'"), this.eat(types$1.eq) ? (this.enterScope(SCOPE_CLASS_FIELD_INIT | SCOPE_SUPER), field.value = this.parseMaybeAssign(), this.exitScope()) : field.value = null, this.semicolon(), this.finishNode(field, "PropertyDefinition");
    };
    pp$8.parseClassStaticBlock = function(node) {
      node.body = [];
      var oldLabels = this.labels;
      for (this.labels = [], this.enterScope(SCOPE_CLASS_STATIC_BLOCK | SCOPE_SUPER); this.type !== types$1.braceR; ) {
        var stmt = this.parseStatement(null);
        node.body.push(stmt);
      }
      return this.next(), this.exitScope(), this.labels = oldLabels, this.finishNode(node, "StaticBlock");
    };
    pp$8.parseClassId = function(node, isStatement) {
      this.type === types$1.name ? (node.id = this.parseIdent(), isStatement && this.checkLValSimple(node.id, BIND_LEXICAL, !1)) : (isStatement === !0 && this.unexpected(), node.id = null);
    };
    pp$8.parseClassSuper = function(node) {
      node.superClass = this.eat(types$1._extends) ? this.parseExprSubscripts(null, !1) : null;
    };
    pp$8.enterClassBody = function() {
      var element = { declared: /* @__PURE__ */ Object.create(null), used: [] };
      return this.privateNameStack.push(element), element.declared;
    };
    pp$8.exitClassBody = function() {
      var ref2 = this.privateNameStack.pop(), declared = ref2.declared, used = ref2.used;
      if (this.options.checkPrivateFields)
        for (var len = this.privateNameStack.length, parent = len === 0 ? null : this.privateNameStack[len - 1], i2 = 0; i2 < used.length; ++i2) {
          var id = used[i2];
          hasOwn(declared, id.name) || (parent ? parent.used.push(id) : this.raiseRecoverable(id.start, "Private field '#" + id.name + "' must be declared in an enclosing class"));
        }
    };
    pp$8.parseExportAllDeclaration = function(node, exports) {
      return this.options.ecmaVersion >= 11 && (this.eatContextual("as") ? (node.exported = this.parseModuleExportName(), this.checkExport(exports, node.exported, this.lastTokStart)) : node.exported = null), this.expectContextual("from"), this.type !== types$1.string && this.unexpected(), node.source = this.parseExprAtom(), this.options.ecmaVersion >= 16 && (node.attributes = this.parseWithClause()), this.semicolon(), this.finishNode(node, "ExportAllDeclaration");
    };
    pp$8.parseExport = function(node, exports) {
      if (this.next(), this.eat(types$1.star))
        return this.parseExportAllDeclaration(node, exports);
      if (this.eat(types$1._default))
        return this.checkExport(exports, "default", this.lastTokStart), node.declaration = this.parseExportDefaultDeclaration(), this.finishNode(node, "ExportDefaultDeclaration");
      if (this.shouldParseExportStatement())
        node.declaration = this.parseExportDeclaration(node), node.declaration.type === "VariableDeclaration" ? this.checkVariableExport(exports, node.declaration.declarations) : this.checkExport(exports, node.declaration.id, node.declaration.id.start), node.specifiers = [], node.source = null, this.options.ecmaVersion >= 16 && (node.attributes = []);
      else {
        if (node.declaration = null, node.specifiers = this.parseExportSpecifiers(exports), this.eatContextual("from"))
          this.type !== types$1.string && this.unexpected(), node.source = this.parseExprAtom(), this.options.ecmaVersion >= 16 && (node.attributes = this.parseWithClause());
        else {
          for (var i2 = 0, list2 = node.specifiers; i2 < list2.length; i2 += 1) {
            var spec = list2[i2];
            this.checkUnreserved(spec.local), this.checkLocalExport(spec.local), spec.local.type === "Literal" && this.raise(spec.local.start, "A string literal cannot be used as an exported binding without `from`.");
          }
          node.source = null, this.options.ecmaVersion >= 16 && (node.attributes = []);
        }
        this.semicolon();
      }
      return this.finishNode(node, "ExportNamedDeclaration");
    };
    pp$8.parseExportDeclaration = function(node) {
      return this.parseStatement(null);
    };
    pp$8.parseExportDefaultDeclaration = function() {
      var isAsync;
      if (this.type === types$1._function || (isAsync = this.isAsyncFunction())) {
        var fNode = this.startNode();
        return this.next(), isAsync && this.next(), this.parseFunction(fNode, FUNC_STATEMENT | FUNC_NULLABLE_ID, !1, isAsync);
      } else if (this.type === types$1._class) {
        var cNode = this.startNode();
        return this.parseClass(cNode, "nullableID");
      } else {
        var declaration = this.parseMaybeAssign();
        return this.semicolon(), declaration;
      }
    };
    pp$8.checkExport = function(exports, name, pos) {
      exports && (typeof name != "string" && (name = name.type === "Identifier" ? name.name : name.value), hasOwn(exports, name) && this.raiseRecoverable(pos, "Duplicate export '" + name + "'"), exports[name] = !0);
    };
    pp$8.checkPatternExport = function(exports, pat) {
      var type = pat.type;
      if (type === "Identifier")
        this.checkExport(exports, pat, pat.start);
      else if (type === "ObjectPattern")
        for (var i2 = 0, list2 = pat.properties; i2 < list2.length; i2 += 1) {
          var prop = list2[i2];
          this.checkPatternExport(exports, prop);
        }
      else if (type === "ArrayPattern")
        for (var i$1 = 0, list$1 = pat.elements; i$1 < list$1.length; i$1 += 1) {
          var elt = list$1[i$1];
          elt && this.checkPatternExport(exports, elt);
        }
      else type === "Property" ? this.checkPatternExport(exports, pat.value) : type === "AssignmentPattern" ? this.checkPatternExport(exports, pat.left) : type === "RestElement" && this.checkPatternExport(exports, pat.argument);
    };
    pp$8.checkVariableExport = function(exports, decls) {
      if (exports)
        for (var i2 = 0, list2 = decls; i2 < list2.length; i2 += 1) {
          var decl = list2[i2];
          this.checkPatternExport(exports, decl.id);
        }
    };
    pp$8.shouldParseExportStatement = function() {
      return this.type.keyword === "var" || this.type.keyword === "const" || this.type.keyword === "class" || this.type.keyword === "function" || this.isLet() || this.isAsyncFunction();
    };
    pp$8.parseExportSpecifier = function(exports) {
      var node = this.startNode();
      return node.local = this.parseModuleExportName(), node.exported = this.eatContextual("as") ? this.parseModuleExportName() : node.local, this.checkExport(
        exports,
        node.exported,
        node.exported.start
      ), this.finishNode(node, "ExportSpecifier");
    };
    pp$8.parseExportSpecifiers = function(exports) {
      var nodes = [], first = !0;
      for (this.expect(types$1.braceL); !this.eat(types$1.braceR); ) {
        if (first)
          first = !1;
        else if (this.expect(types$1.comma), this.afterTrailingComma(types$1.braceR))
          break;
        nodes.push(this.parseExportSpecifier(exports));
      }
      return nodes;
    };
    pp$8.parseImport = function(node) {
      return this.next(), this.type === types$1.string ? (node.specifiers = empty$1, node.source = this.parseExprAtom()) : (node.specifiers = this.parseImportSpecifiers(), this.expectContextual("from"), node.source = this.type === types$1.string ? this.parseExprAtom() : this.unexpected()), this.options.ecmaVersion >= 16 && (node.attributes = this.parseWithClause()), this.semicolon(), this.finishNode(node, "ImportDeclaration");
    };
    pp$8.parseImportSpecifier = function() {
      var node = this.startNode();
      return node.imported = this.parseModuleExportName(), this.eatContextual("as") ? node.local = this.parseIdent() : (this.checkUnreserved(node.imported), node.local = node.imported), this.checkLValSimple(node.local, BIND_LEXICAL), this.finishNode(node, "ImportSpecifier");
    };
    pp$8.parseImportDefaultSpecifier = function() {
      var node = this.startNode();
      return node.local = this.parseIdent(), this.checkLValSimple(node.local, BIND_LEXICAL), this.finishNode(node, "ImportDefaultSpecifier");
    };
    pp$8.parseImportNamespaceSpecifier = function() {
      var node = this.startNode();
      return this.next(), this.expectContextual("as"), node.local = this.parseIdent(), this.checkLValSimple(node.local, BIND_LEXICAL), this.finishNode(node, "ImportNamespaceSpecifier");
    };
    pp$8.parseImportSpecifiers = function() {
      var nodes = [], first = !0;
      if (this.type === types$1.name && (nodes.push(this.parseImportDefaultSpecifier()), !this.eat(types$1.comma)))
        return nodes;
      if (this.type === types$1.star)
        return nodes.push(this.parseImportNamespaceSpecifier()), nodes;
      for (this.expect(types$1.braceL); !this.eat(types$1.braceR); ) {
        if (first)
          first = !1;
        else if (this.expect(types$1.comma), this.afterTrailingComma(types$1.braceR))
          break;
        nodes.push(this.parseImportSpecifier());
      }
      return nodes;
    };
    pp$8.parseWithClause = function() {
      var nodes = [];
      if (!this.eat(types$1._with))
        return nodes;
      this.expect(types$1.braceL);
      for (var attributeKeys = {}, first = !0; !this.eat(types$1.braceR); ) {
        if (first)
          first = !1;
        else if (this.expect(types$1.comma), this.afterTrailingComma(types$1.braceR))
          break;
        var attr = this.parseImportAttribute(), keyName = attr.key.type === "Identifier" ? attr.key.name : attr.key.value;
        hasOwn(attributeKeys, keyName) && this.raiseRecoverable(attr.key.start, "Duplicate attribute key '" + keyName + "'"), attributeKeys[keyName] = !0, nodes.push(attr);
      }
      return nodes;
    };
    pp$8.parseImportAttribute = function() {
      var node = this.startNode();
      return node.key = this.type === types$1.string ? this.parseExprAtom() : this.parseIdent(this.options.allowReserved !== "never"), this.expect(types$1.colon), this.type !== types$1.string && this.unexpected(), node.value = this.parseExprAtom(), this.finishNode(node, "ImportAttribute");
    };
    pp$8.parseModuleExportName = function() {
      if (this.options.ecmaVersion >= 13 && this.type === types$1.string) {
        var stringLiteral = this.parseLiteral(this.value);
        return loneSurrogate.test(stringLiteral.value) && this.raise(stringLiteral.start, "An export name cannot include a lone surrogate."), stringLiteral;
      }
      return this.parseIdent(!0);
    };
    pp$8.adaptDirectivePrologue = function(statements) {
      for (var i2 = 0; i2 < statements.length && this.isDirectiveCandidate(statements[i2]); ++i2)
        statements[i2].directive = statements[i2].expression.raw.slice(1, -1);
    };
    pp$8.isDirectiveCandidate = function(statement) {
      return this.options.ecmaVersion >= 5 && statement.type === "ExpressionStatement" && statement.expression.type === "Literal" && typeof statement.expression.value == "string" && // Reject parenthesized strings.
      (this.input[statement.start] === '"' || this.input[statement.start] === "'");
    };
    pp$7 = Parser.prototype;
    pp$7.toAssignable = function(node, isBinding, refDestructuringErrors) {
      if (this.options.ecmaVersion >= 6 && node)
        switch (node.type) {
          case "Identifier":
            this.inAsync && node.name === "await" && this.raise(node.start, "Cannot use 'await' as identifier inside an async function");
            break;
          case "ObjectPattern":
          case "ArrayPattern":
          case "AssignmentPattern":
          case "RestElement":
            break;
          case "ObjectExpression":
            node.type = "ObjectPattern", refDestructuringErrors && this.checkPatternErrors(refDestructuringErrors, !0);
            for (var i2 = 0, list2 = node.properties; i2 < list2.length; i2 += 1) {
              var prop = list2[i2];
              this.toAssignable(prop, isBinding), prop.type === "RestElement" && (prop.argument.type === "ArrayPattern" || prop.argument.type === "ObjectPattern") && this.raise(prop.argument.start, "Unexpected token");
            }
            break;
          case "Property":
            node.kind !== "init" && this.raise(node.key.start, "Object pattern can't contain getter or setter"), this.toAssignable(node.value, isBinding);
            break;
          case "ArrayExpression":
            node.type = "ArrayPattern", refDestructuringErrors && this.checkPatternErrors(refDestructuringErrors, !0), this.toAssignableList(node.elements, isBinding);
            break;
          case "SpreadElement":
            node.type = "RestElement", this.toAssignable(node.argument, isBinding), node.argument.type === "AssignmentPattern" && this.raise(node.argument.start, "Rest elements cannot have a default value");
            break;
          case "AssignmentExpression":
            node.operator !== "=" && this.raise(node.left.end, "Only '=' operator can be used for specifying default value."), node.type = "AssignmentPattern", delete node.operator, this.toAssignable(node.left, isBinding);
            break;
          case "ParenthesizedExpression":
            this.toAssignable(node.expression, isBinding, refDestructuringErrors);
            break;
          case "ChainExpression":
            this.raiseRecoverable(node.start, "Optional chaining cannot appear in left-hand side");
            break;
          case "MemberExpression":
            if (!isBinding)
              break;
          default:
            this.raise(node.start, "Assigning to rvalue");
        }
      else refDestructuringErrors && this.checkPatternErrors(refDestructuringErrors, !0);
      return node;
    };
    pp$7.toAssignableList = function(exprList, isBinding) {
      for (var end = exprList.length, i2 = 0; i2 < end; i2++) {
        var elt = exprList[i2];
        elt && this.toAssignable(elt, isBinding);
      }
      if (end) {
        var last = exprList[end - 1];
        this.options.ecmaVersion === 6 && isBinding && last && last.type === "RestElement" && last.argument.type !== "Identifier" && this.unexpected(last.argument.start);
      }
      return exprList;
    };
    pp$7.parseSpread = function(refDestructuringErrors) {
      var node = this.startNode();
      return this.next(), node.argument = this.parseMaybeAssign(!1, refDestructuringErrors), this.finishNode(node, "SpreadElement");
    };
    pp$7.parseRestBinding = function() {
      var node = this.startNode();
      return this.next(), this.options.ecmaVersion === 6 && this.type !== types$1.name && this.unexpected(), node.argument = this.parseBindingAtom(), this.finishNode(node, "RestElement");
    };
    pp$7.parseBindingAtom = function() {
      if (this.options.ecmaVersion >= 6)
        switch (this.type) {
          case types$1.bracketL:
            var node = this.startNode();
            return this.next(), node.elements = this.parseBindingList(types$1.bracketR, !0, !0), this.finishNode(node, "ArrayPattern");
          case types$1.braceL:
            return this.parseObj(!0);
        }
      return this.parseIdent();
    };
    pp$7.parseBindingList = function(close, allowEmpty, allowTrailingComma, allowModifiers) {
      for (var elts = [], first = !0; !this.eat(close); )
        if (first ? first = !1 : this.expect(types$1.comma), allowEmpty && this.type === types$1.comma)
          elts.push(null);
        else {
          if (allowTrailingComma && this.afterTrailingComma(close))
            break;
          if (this.type === types$1.ellipsis) {
            var rest = this.parseRestBinding();
            this.parseBindingListItem(rest), elts.push(rest), this.type === types$1.comma && this.raiseRecoverable(this.start, "Comma is not permitted after the rest element"), this.expect(close);
            break;
          } else
            elts.push(this.parseAssignableListItem(allowModifiers));
        }
      return elts;
    };
    pp$7.parseAssignableListItem = function(allowModifiers) {
      var elem = this.parseMaybeDefault(this.start, this.startLoc);
      return this.parseBindingListItem(elem), elem;
    };
    pp$7.parseBindingListItem = function(param) {
      return param;
    };
    pp$7.parseMaybeDefault = function(startPos, startLoc, left) {
      if (left = left || this.parseBindingAtom(), this.options.ecmaVersion < 6 || !this.eat(types$1.eq))
        return left;
      var node = this.startNodeAt(startPos, startLoc);
      return node.left = left, node.right = this.parseMaybeAssign(), this.finishNode(node, "AssignmentPattern");
    };
    pp$7.checkLValSimple = function(expr, bindingType, checkClashes) {
      bindingType === void 0 && (bindingType = BIND_NONE);
      var isBind = bindingType !== BIND_NONE;
      switch (expr.type) {
        case "Identifier":
          this.strict && this.reservedWordsStrictBind.test(expr.name) && this.raiseRecoverable(expr.start, (isBind ? "Binding " : "Assigning to ") + expr.name + " in strict mode"), isBind && (bindingType === BIND_LEXICAL && expr.name === "let" && this.raiseRecoverable(expr.start, "let is disallowed as a lexically bound name"), checkClashes && (hasOwn(checkClashes, expr.name) && this.raiseRecoverable(expr.start, "Argument name clash"), checkClashes[expr.name] = !0), bindingType !== BIND_OUTSIDE && this.declareName(expr.name, bindingType, expr.start));
          break;
        case "ChainExpression":
          this.raiseRecoverable(expr.start, "Optional chaining cannot appear in left-hand side");
          break;
        case "MemberExpression":
          isBind && this.raiseRecoverable(expr.start, "Binding member expression");
          break;
        case "ParenthesizedExpression":
          return isBind && this.raiseRecoverable(expr.start, "Binding parenthesized expression"), this.checkLValSimple(expr.expression, bindingType, checkClashes);
        default:
          this.raise(expr.start, (isBind ? "Binding" : "Assigning to") + " rvalue");
      }
    };
    pp$7.checkLValPattern = function(expr, bindingType, checkClashes) {
      switch (bindingType === void 0 && (bindingType = BIND_NONE), expr.type) {
        case "ObjectPattern":
          for (var i2 = 0, list2 = expr.properties; i2 < list2.length; i2 += 1) {
            var prop = list2[i2];
            this.checkLValInnerPattern(prop, bindingType, checkClashes);
          }
          break;
        case "ArrayPattern":
          for (var i$1 = 0, list$1 = expr.elements; i$1 < list$1.length; i$1 += 1) {
            var elem = list$1[i$1];
            elem && this.checkLValInnerPattern(elem, bindingType, checkClashes);
          }
          break;
        default:
          this.checkLValSimple(expr, bindingType, checkClashes);
      }
    };
    pp$7.checkLValInnerPattern = function(expr, bindingType, checkClashes) {
      switch (bindingType === void 0 && (bindingType = BIND_NONE), expr.type) {
        case "Property":
          this.checkLValInnerPattern(expr.value, bindingType, checkClashes);
          break;
        case "AssignmentPattern":
          this.checkLValPattern(expr.left, bindingType, checkClashes);
          break;
        case "RestElement":
          this.checkLValPattern(expr.argument, bindingType, checkClashes);
          break;
        default:
          this.checkLValPattern(expr, bindingType, checkClashes);
      }
    };
    TokContext = function(token, isExpr, preserveSpace, override, generator) {
      this.token = token, this.isExpr = !!isExpr, this.preserveSpace = !!preserveSpace, this.override = override, this.generator = !!generator;
    }, types = {
      b_stat: new TokContext("{", !1),
      b_expr: new TokContext("{", !0),
      b_tmpl: new TokContext("${", !1),
      p_stat: new TokContext("(", !1),
      p_expr: new TokContext("(", !0),
      q_tmpl: new TokContext("`", !0, !0, function(p) {
        return p.tryReadTemplateToken();
      }),
      f_stat: new TokContext("function", !1),
      f_expr: new TokContext("function", !0),
      f_expr_gen: new TokContext("function", !0, !1, null, !0),
      f_gen: new TokContext("function", !1, !1, null, !0)
    }, pp$6 = Parser.prototype;
    pp$6.initialContext = function() {
      return [types.b_stat];
    };
    pp$6.curContext = function() {
      return this.context[this.context.length - 1];
    };
    pp$6.braceIsBlock = function(prevType) {
      var parent = this.curContext();
      return parent === types.f_expr || parent === types.f_stat ? !0 : prevType === types$1.colon && (parent === types.b_stat || parent === types.b_expr) ? !parent.isExpr : prevType === types$1._return || prevType === types$1.name && this.exprAllowed ? lineBreak.test(this.input.slice(this.lastTokEnd, this.start)) : prevType === types$1._else || prevType === types$1.semi || prevType === types$1.eof || prevType === types$1.parenR || prevType === types$1.arrow ? !0 : prevType === types$1.braceL ? parent === types.b_stat : prevType === types$1._var || prevType === types$1._const || prevType === types$1.name ? !1 : !this.exprAllowed;
    };
    pp$6.inGeneratorContext = function() {
      for (var i2 = this.context.length - 1; i2 >= 1; i2--) {
        var context = this.context[i2];
        if (context.token === "function")
          return context.generator;
      }
      return !1;
    };
    pp$6.updateContext = function(prevType) {
      var update, type = this.type;
      type.keyword && prevType === types$1.dot ? this.exprAllowed = !1 : (update = type.updateContext) ? update.call(this, prevType) : this.exprAllowed = type.beforeExpr;
    };
    pp$6.overrideContext = function(tokenCtx) {
      this.curContext() !== tokenCtx && (this.context[this.context.length - 1] = tokenCtx);
    };
    types$1.parenR.updateContext = types$1.braceR.updateContext = function() {
      if (this.context.length === 1) {
        this.exprAllowed = !0;
        return;
      }
      var out = this.context.pop();
      out === types.b_stat && this.curContext().token === "function" && (out = this.context.pop()), this.exprAllowed = !out.isExpr;
    };
    types$1.braceL.updateContext = function(prevType) {
      this.context.push(this.braceIsBlock(prevType) ? types.b_stat : types.b_expr), this.exprAllowed = !0;
    };
    types$1.dollarBraceL.updateContext = function() {
      this.context.push(types.b_tmpl), this.exprAllowed = !0;
    };
    types$1.parenL.updateContext = function(prevType) {
      var statementParens = prevType === types$1._if || prevType === types$1._for || prevType === types$1._with || prevType === types$1._while;
      this.context.push(statementParens ? types.p_stat : types.p_expr), this.exprAllowed = !0;
    };
    types$1.incDec.updateContext = function() {
    };
    types$1._function.updateContext = types$1._class.updateContext = function(prevType) {
      prevType.beforeExpr && prevType !== types$1._else && !(prevType === types$1.semi && this.curContext() !== types.p_stat) && !(prevType === types$1._return && lineBreak.test(this.input.slice(this.lastTokEnd, this.start))) && !((prevType === types$1.colon || prevType === types$1.braceL) && this.curContext() === types.b_stat) ? this.context.push(types.f_expr) : this.context.push(types.f_stat), this.exprAllowed = !1;
    };
    types$1.colon.updateContext = function() {
      this.curContext().token === "function" && this.context.pop(), this.exprAllowed = !0;
    };
    types$1.backQuote.updateContext = function() {
      this.curContext() === types.q_tmpl ? this.context.pop() : this.context.push(types.q_tmpl), this.exprAllowed = !1;
    };
    types$1.star.updateContext = function(prevType) {
      if (prevType === types$1._function) {
        var index = this.context.length - 1;
        this.context[index] === types.f_expr ? this.context[index] = types.f_expr_gen : this.context[index] = types.f_gen;
      }
      this.exprAllowed = !0;
    };
    types$1.name.updateContext = function(prevType) {
      var allowed = !1;
      this.options.ecmaVersion >= 6 && prevType !== types$1.dot && (this.value === "of" && !this.exprAllowed || this.value === "yield" && this.inGeneratorContext()) && (allowed = !0), this.exprAllowed = allowed;
    };
    pp$5 = Parser.prototype;
    pp$5.checkPropClash = function(prop, propHash, refDestructuringErrors) {
      if (!(this.options.ecmaVersion >= 9 && prop.type === "SpreadElement") && !(this.options.ecmaVersion >= 6 && (prop.computed || prop.method || prop.shorthand))) {
        var key = prop.key, name;
        switch (key.type) {
          case "Identifier":
            name = key.name;
            break;
          case "Literal":
            name = String(key.value);
            break;
          default:
            return;
        }
        var kind = prop.kind;
        if (this.options.ecmaVersion >= 6) {
          name === "__proto__" && kind === "init" && (propHash.proto && (refDestructuringErrors ? refDestructuringErrors.doubleProto < 0 && (refDestructuringErrors.doubleProto = key.start) : this.raiseRecoverable(key.start, "Redefinition of __proto__ property")), propHash.proto = !0);
          return;
        }
        name = "$" + name;
        var other = propHash[name];
        if (other) {
          var redefinition;
          kind === "init" ? redefinition = this.strict && other.init || other.get || other.set : redefinition = other.init || other[kind], redefinition && this.raiseRecoverable(key.start, "Redefinition of property");
        } else
          other = propHash[name] = {
            init: !1,
            get: !1,
            set: !1
          };
        other[kind] = !0;
      }
    };
    pp$5.parseExpression = function(forInit, refDestructuringErrors) {
      var startPos = this.start, startLoc = this.startLoc, expr = this.parseMaybeAssign(forInit, refDestructuringErrors);
      if (this.type === types$1.comma) {
        var node = this.startNodeAt(startPos, startLoc);
        for (node.expressions = [expr]; this.eat(types$1.comma); )
          node.expressions.push(this.parseMaybeAssign(forInit, refDestructuringErrors));
        return this.finishNode(node, "SequenceExpression");
      }
      return expr;
    };
    pp$5.parseMaybeAssign = function(forInit, refDestructuringErrors, afterLeftParse) {
      if (this.isContextual("yield")) {
        if (this.inGenerator)
          return this.parseYield(forInit);
        this.exprAllowed = !1;
      }
      var ownDestructuringErrors = !1, oldParenAssign = -1, oldTrailingComma = -1, oldDoubleProto = -1;
      refDestructuringErrors ? (oldParenAssign = refDestructuringErrors.parenthesizedAssign, oldTrailingComma = refDestructuringErrors.trailingComma, oldDoubleProto = refDestructuringErrors.doubleProto, refDestructuringErrors.parenthesizedAssign = refDestructuringErrors.trailingComma = -1) : (refDestructuringErrors = new DestructuringErrors(), ownDestructuringErrors = !0);
      var startPos = this.start, startLoc = this.startLoc;
      (this.type === types$1.parenL || this.type === types$1.name) && (this.potentialArrowAt = this.start, this.potentialArrowInForAwait = forInit === "await");
      var left = this.parseMaybeConditional(forInit, refDestructuringErrors);
      if (afterLeftParse && (left = afterLeftParse.call(this, left, startPos, startLoc)), this.type.isAssign) {
        var node = this.startNodeAt(startPos, startLoc);
        return node.operator = this.value, this.type === types$1.eq && (left = this.toAssignable(left, !1, refDestructuringErrors)), ownDestructuringErrors || (refDestructuringErrors.parenthesizedAssign = refDestructuringErrors.trailingComma = refDestructuringErrors.doubleProto = -1), refDestructuringErrors.shorthandAssign >= left.start && (refDestructuringErrors.shorthandAssign = -1), this.type === types$1.eq ? this.checkLValPattern(left) : this.checkLValSimple(left), node.left = left, this.next(), node.right = this.parseMaybeAssign(forInit), oldDoubleProto > -1 && (refDestructuringErrors.doubleProto = oldDoubleProto), this.finishNode(node, "AssignmentExpression");
      } else
        ownDestructuringErrors && this.checkExpressionErrors(refDestructuringErrors, !0);
      return oldParenAssign > -1 && (refDestructuringErrors.parenthesizedAssign = oldParenAssign), oldTrailingComma > -1 && (refDestructuringErrors.trailingComma = oldTrailingComma), left;
    };
    pp$5.parseMaybeConditional = function(forInit, refDestructuringErrors) {
      var startPos = this.start, startLoc = this.startLoc, expr = this.parseExprOps(forInit, refDestructuringErrors);
      if (this.checkExpressionErrors(refDestructuringErrors))
        return expr;
      if (this.eat(types$1.question)) {
        var node = this.startNodeAt(startPos, startLoc);
        return node.test = expr, node.consequent = this.parseMaybeAssign(), this.expect(types$1.colon), node.alternate = this.parseMaybeAssign(forInit), this.finishNode(node, "ConditionalExpression");
      }
      return expr;
    };
    pp$5.parseExprOps = function(forInit, refDestructuringErrors) {
      var startPos = this.start, startLoc = this.startLoc, expr = this.parseMaybeUnary(refDestructuringErrors, !1, !1, forInit);
      return this.checkExpressionErrors(refDestructuringErrors) || expr.start === startPos && expr.type === "ArrowFunctionExpression" ? expr : this.parseExprOp(expr, startPos, startLoc, -1, forInit);
    };
    pp$5.parseExprOp = function(left, leftStartPos, leftStartLoc, minPrec, forInit) {
      var prec = this.type.binop;
      if (prec != null && (!forInit || this.type !== types$1._in) && prec > minPrec) {
        var logical = this.type === types$1.logicalOR || this.type === types$1.logicalAND, coalesce = this.type === types$1.coalesce;
        coalesce && (prec = types$1.logicalAND.binop);
        var op = this.value;
        this.next();
        var startPos = this.start, startLoc = this.startLoc, right = this.parseExprOp(this.parseMaybeUnary(null, !1, !1, forInit), startPos, startLoc, prec, forInit), node = this.buildBinary(leftStartPos, leftStartLoc, left, right, op, logical || coalesce);
        return (logical && this.type === types$1.coalesce || coalesce && (this.type === types$1.logicalOR || this.type === types$1.logicalAND)) && this.raiseRecoverable(this.start, "Logical expressions and coalesce expressions cannot be mixed. Wrap either by parentheses"), this.parseExprOp(node, leftStartPos, leftStartLoc, minPrec, forInit);
      }
      return left;
    };
    pp$5.buildBinary = function(startPos, startLoc, left, right, op, logical) {
      right.type === "PrivateIdentifier" && this.raise(right.start, "Private identifier can only be left side of binary expression");
      var node = this.startNodeAt(startPos, startLoc);
      return node.left = left, node.operator = op, node.right = right, this.finishNode(node, logical ? "LogicalExpression" : "BinaryExpression");
    };
    pp$5.parseMaybeUnary = function(refDestructuringErrors, sawUnary, incDec, forInit) {
      var startPos = this.start, startLoc = this.startLoc, expr;
      if (this.isContextual("await") && this.canAwait)
        expr = this.parseAwait(forInit), sawUnary = !0;
      else if (this.type.prefix) {
        var node = this.startNode(), update = this.type === types$1.incDec;
        node.operator = this.value, node.prefix = !0, this.next(), node.argument = this.parseMaybeUnary(null, !0, update, forInit), this.checkExpressionErrors(refDestructuringErrors, !0), update ? this.checkLValSimple(node.argument) : this.strict && node.operator === "delete" && isLocalVariableAccess(node.argument) ? this.raiseRecoverable(node.start, "Deleting local variable in strict mode") : node.operator === "delete" && isPrivateFieldAccess(node.argument) ? this.raiseRecoverable(node.start, "Private fields can not be deleted") : sawUnary = !0, expr = this.finishNode(node, update ? "UpdateExpression" : "UnaryExpression");
      } else if (!sawUnary && this.type === types$1.privateId)
        (forInit || this.privateNameStack.length === 0) && this.options.checkPrivateFields && this.unexpected(), expr = this.parsePrivateIdent(), this.type !== types$1._in && this.unexpected();
      else {
        if (expr = this.parseExprSubscripts(refDestructuringErrors, forInit), this.checkExpressionErrors(refDestructuringErrors))
          return expr;
        for (; this.type.postfix && !this.canInsertSemicolon(); ) {
          var node$1 = this.startNodeAt(startPos, startLoc);
          node$1.operator = this.value, node$1.prefix = !1, node$1.argument = expr, this.checkLValSimple(expr), this.next(), expr = this.finishNode(node$1, "UpdateExpression");
        }
      }
      if (!incDec && this.eat(types$1.starstar))
        if (sawUnary)
          this.unexpected(this.lastTokStart);
        else
          return this.buildBinary(startPos, startLoc, expr, this.parseMaybeUnary(null, !1, !1, forInit), "**", !1);
      else
        return expr;
    };
    pp$5.parseExprSubscripts = function(refDestructuringErrors, forInit) {
      var startPos = this.start, startLoc = this.startLoc, expr = this.parseExprAtom(refDestructuringErrors, forInit);
      if (expr.type === "ArrowFunctionExpression" && this.input.slice(this.lastTokStart, this.lastTokEnd) !== ")")
        return expr;
      var result = this.parseSubscripts(expr, startPos, startLoc, !1, forInit);
      return refDestructuringErrors && result.type === "MemberExpression" && (refDestructuringErrors.parenthesizedAssign >= result.start && (refDestructuringErrors.parenthesizedAssign = -1), refDestructuringErrors.parenthesizedBind >= result.start && (refDestructuringErrors.parenthesizedBind = -1), refDestructuringErrors.trailingComma >= result.start && (refDestructuringErrors.trailingComma = -1)), result;
    };
    pp$5.parseSubscripts = function(base2, startPos, startLoc, noCalls, forInit) {
      for (var maybeAsyncArrow = this.options.ecmaVersion >= 8 && base2.type === "Identifier" && base2.name === "async" && this.lastTokEnd === base2.end && !this.canInsertSemicolon() && base2.end - base2.start === 5 && this.potentialArrowAt === base2.start, optionalChained = !1; ; ) {
        var element = this.parseSubscript(base2, startPos, startLoc, noCalls, maybeAsyncArrow, optionalChained, forInit);
        if (element.optional && (optionalChained = !0), element === base2 || element.type === "ArrowFunctionExpression") {
          if (optionalChained) {
            var chainNode = this.startNodeAt(startPos, startLoc);
            chainNode.expression = element, element = this.finishNode(chainNode, "ChainExpression");
          }
          return element;
        }
        base2 = element;
      }
    };
    pp$5.shouldParseAsyncArrow = function() {
      return !this.canInsertSemicolon() && this.eat(types$1.arrow);
    };
    pp$5.parseSubscriptAsyncArrow = function(startPos, startLoc, exprList, forInit) {
      return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), exprList, !0, forInit);
    };
    pp$5.parseSubscript = function(base2, startPos, startLoc, noCalls, maybeAsyncArrow, optionalChained, forInit) {
      var optionalSupported = this.options.ecmaVersion >= 11, optional = optionalSupported && this.eat(types$1.questionDot);
      noCalls && optional && this.raise(this.lastTokStart, "Optional chaining cannot appear in the callee of new expressions");
      var computed = this.eat(types$1.bracketL);
      if (computed || optional && this.type !== types$1.parenL && this.type !== types$1.backQuote || this.eat(types$1.dot)) {
        var node = this.startNodeAt(startPos, startLoc);
        node.object = base2, computed ? (node.property = this.parseExpression(), this.expect(types$1.bracketR)) : this.type === types$1.privateId && base2.type !== "Super" ? node.property = this.parsePrivateIdent() : node.property = this.parseIdent(this.options.allowReserved !== "never"), node.computed = !!computed, optionalSupported && (node.optional = optional), base2 = this.finishNode(node, "MemberExpression");
      } else if (!noCalls && this.eat(types$1.parenL)) {
        var refDestructuringErrors = new DestructuringErrors(), oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
        this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0;
        var exprList = this.parseExprList(types$1.parenR, this.options.ecmaVersion >= 8, !1, refDestructuringErrors);
        if (maybeAsyncArrow && !optional && this.shouldParseAsyncArrow())
          return this.checkPatternErrors(refDestructuringErrors, !1), this.checkYieldAwaitInDefaultParams(), this.awaitIdentPos > 0 && this.raise(this.awaitIdentPos, "Cannot use 'await' as identifier inside an async function"), this.yieldPos = oldYieldPos, this.awaitPos = oldAwaitPos, this.awaitIdentPos = oldAwaitIdentPos, this.parseSubscriptAsyncArrow(startPos, startLoc, exprList, forInit);
        this.checkExpressionErrors(refDestructuringErrors, !0), this.yieldPos = oldYieldPos || this.yieldPos, this.awaitPos = oldAwaitPos || this.awaitPos, this.awaitIdentPos = oldAwaitIdentPos || this.awaitIdentPos;
        var node$1 = this.startNodeAt(startPos, startLoc);
        node$1.callee = base2, node$1.arguments = exprList, optionalSupported && (node$1.optional = optional), base2 = this.finishNode(node$1, "CallExpression");
      } else if (this.type === types$1.backQuote) {
        (optional || optionalChained) && this.raise(this.start, "Optional chaining cannot appear in the tag of tagged template expressions");
        var node$2 = this.startNodeAt(startPos, startLoc);
        node$2.tag = base2, node$2.quasi = this.parseTemplate({ isTagged: !0 }), base2 = this.finishNode(node$2, "TaggedTemplateExpression");
      }
      return base2;
    };
    pp$5.parseExprAtom = function(refDestructuringErrors, forInit, forNew) {
      this.type === types$1.slash && this.readRegexp();
      var node, canBeArrow = this.potentialArrowAt === this.start;
      switch (this.type) {
        case types$1._super:
          return this.allowSuper || this.raise(this.start, "'super' keyword outside a method"), node = this.startNode(), this.next(), this.type === types$1.parenL && !this.allowDirectSuper && this.raise(node.start, "super() call outside constructor of a subclass"), this.type !== types$1.dot && this.type !== types$1.bracketL && this.type !== types$1.parenL && this.unexpected(), this.finishNode(node, "Super");
        case types$1._this:
          return node = this.startNode(), this.next(), this.finishNode(node, "ThisExpression");
        case types$1.name:
          var startPos = this.start, startLoc = this.startLoc, containsEsc = this.containsEsc, id = this.parseIdent(!1);
          if (this.options.ecmaVersion >= 8 && !containsEsc && id.name === "async" && !this.canInsertSemicolon() && this.eat(types$1._function))
            return this.overrideContext(types.f_expr), this.parseFunction(this.startNodeAt(startPos, startLoc), 0, !1, !0, forInit);
          if (canBeArrow && !this.canInsertSemicolon()) {
            if (this.eat(types$1.arrow))
              return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id], !1, forInit);
            if (this.options.ecmaVersion >= 8 && id.name === "async" && this.type === types$1.name && !containsEsc && (!this.potentialArrowInForAwait || this.value !== "of" || this.containsEsc))
              return id = this.parseIdent(!1), (this.canInsertSemicolon() || !this.eat(types$1.arrow)) && this.unexpected(), this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id], !0, forInit);
          }
          return id;
        case types$1.regexp:
          var value = this.value;
          return node = this.parseLiteral(value.value), node.regex = { pattern: value.pattern, flags: value.flags }, node;
        case types$1.num:
        case types$1.string:
          return this.parseLiteral(this.value);
        case types$1._null:
        case types$1._true:
        case types$1._false:
          return node = this.startNode(), node.value = this.type === types$1._null ? null : this.type === types$1._true, node.raw = this.type.keyword, this.next(), this.finishNode(node, "Literal");
        case types$1.parenL:
          var start = this.start, expr = this.parseParenAndDistinguishExpression(canBeArrow, forInit);
          return refDestructuringErrors && (refDestructuringErrors.parenthesizedAssign < 0 && !this.isSimpleAssignTarget(expr) && (refDestructuringErrors.parenthesizedAssign = start), refDestructuringErrors.parenthesizedBind < 0 && (refDestructuringErrors.parenthesizedBind = start)), expr;
        case types$1.bracketL:
          return node = this.startNode(), this.next(), node.elements = this.parseExprList(types$1.bracketR, !0, !0, refDestructuringErrors), this.finishNode(node, "ArrayExpression");
        case types$1.braceL:
          return this.overrideContext(types.b_expr), this.parseObj(!1, refDestructuringErrors);
        case types$1._function:
          return node = this.startNode(), this.next(), this.parseFunction(node, 0);
        case types$1._class:
          return this.parseClass(this.startNode(), !1);
        case types$1._new:
          return this.parseNew();
        case types$1.backQuote:
          return this.parseTemplate();
        case types$1._import:
          return this.options.ecmaVersion >= 11 ? this.parseExprImport(forNew) : this.unexpected();
        default:
          return this.parseExprAtomDefault();
      }
    };
    pp$5.parseExprAtomDefault = function() {
      this.unexpected();
    };
    pp$5.parseExprImport = function(forNew) {
      var node = this.startNode();
      if (this.containsEsc && this.raiseRecoverable(this.start, "Escape sequence in keyword import"), this.next(), this.type === types$1.parenL && !forNew)
        return this.parseDynamicImport(node);
      if (this.type === types$1.dot) {
        var meta = this.startNodeAt(node.start, node.loc && node.loc.start);
        return meta.name = "import", node.meta = this.finishNode(meta, "Identifier"), this.parseImportMeta(node);
      } else
        this.unexpected();
    };
    pp$5.parseDynamicImport = function(node) {
      if (this.next(), node.source = this.parseMaybeAssign(), this.options.ecmaVersion >= 16)
        this.eat(types$1.parenR) ? node.options = null : (this.expect(types$1.comma), this.afterTrailingComma(types$1.parenR) ? node.options = null : (node.options = this.parseMaybeAssign(), this.eat(types$1.parenR) || (this.expect(types$1.comma), this.afterTrailingComma(types$1.parenR) || this.unexpected())));
      else if (!this.eat(types$1.parenR)) {
        var errorPos = this.start;
        this.eat(types$1.comma) && this.eat(types$1.parenR) ? this.raiseRecoverable(errorPos, "Trailing comma is not allowed in import()") : this.unexpected(errorPos);
      }
      return this.finishNode(node, "ImportExpression");
    };
    pp$5.parseImportMeta = function(node) {
      this.next();
      var containsEsc = this.containsEsc;
      return node.property = this.parseIdent(!0), node.property.name !== "meta" && this.raiseRecoverable(node.property.start, "The only valid meta property for import is 'import.meta'"), containsEsc && this.raiseRecoverable(node.start, "'import.meta' must not contain escaped characters"), this.options.sourceType !== "module" && !this.options.allowImportExportEverywhere && this.raiseRecoverable(node.start, "Cannot use 'import.meta' outside a module"), this.finishNode(node, "MetaProperty");
    };
    pp$5.parseLiteral = function(value) {
      var node = this.startNode();
      return node.value = value, node.raw = this.input.slice(this.start, this.end), node.raw.charCodeAt(node.raw.length - 1) === 110 && (node.bigint = node.value != null ? node.value.toString() : node.raw.slice(0, -1).replace(/_/g, "")), this.next(), this.finishNode(node, "Literal");
    };
    pp$5.parseParenExpression = function() {
      this.expect(types$1.parenL);
      var val = this.parseExpression();
      return this.expect(types$1.parenR), val;
    };
    pp$5.shouldParseArrow = function(exprList) {
      return !this.canInsertSemicolon();
    };
    pp$5.parseParenAndDistinguishExpression = function(canBeArrow, forInit) {
      var startPos = this.start, startLoc = this.startLoc, val, allowTrailingComma = this.options.ecmaVersion >= 8;
      if (this.options.ecmaVersion >= 6) {
        this.next();
        var innerStartPos = this.start, innerStartLoc = this.startLoc, exprList = [], first = !0, lastIsComma = !1, refDestructuringErrors = new DestructuringErrors(), oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, spreadStart;
        for (this.yieldPos = 0, this.awaitPos = 0; this.type !== types$1.parenR; )
          if (first ? first = !1 : this.expect(types$1.comma), allowTrailingComma && this.afterTrailingComma(types$1.parenR, !0)) {
            lastIsComma = !0;
            break;
          } else if (this.type === types$1.ellipsis) {
            spreadStart = this.start, exprList.push(this.parseParenItem(this.parseRestBinding())), this.type === types$1.comma && this.raiseRecoverable(
              this.start,
              "Comma is not permitted after the rest element"
            );
            break;
          } else
            exprList.push(this.parseMaybeAssign(!1, refDestructuringErrors, this.parseParenItem));
        var innerEndPos = this.lastTokEnd, innerEndLoc = this.lastTokEndLoc;
        if (this.expect(types$1.parenR), canBeArrow && this.shouldParseArrow(exprList) && this.eat(types$1.arrow))
          return this.checkPatternErrors(refDestructuringErrors, !1), this.checkYieldAwaitInDefaultParams(), this.yieldPos = oldYieldPos, this.awaitPos = oldAwaitPos, this.parseParenArrowList(startPos, startLoc, exprList, forInit);
        (!exprList.length || lastIsComma) && this.unexpected(this.lastTokStart), spreadStart && this.unexpected(spreadStart), this.checkExpressionErrors(refDestructuringErrors, !0), this.yieldPos = oldYieldPos || this.yieldPos, this.awaitPos = oldAwaitPos || this.awaitPos, exprList.length > 1 ? (val = this.startNodeAt(innerStartPos, innerStartLoc), val.expressions = exprList, this.finishNodeAt(val, "SequenceExpression", innerEndPos, innerEndLoc)) : val = exprList[0];
      } else
        val = this.parseParenExpression();
      if (this.options.preserveParens) {
        var par = this.startNodeAt(startPos, startLoc);
        return par.expression = val, this.finishNode(par, "ParenthesizedExpression");
      } else
        return val;
    };
    pp$5.parseParenItem = function(item) {
      return item;
    };
    pp$5.parseParenArrowList = function(startPos, startLoc, exprList, forInit) {
      return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), exprList, !1, forInit);
    };
    empty = [];
    pp$5.parseNew = function() {
      this.containsEsc && this.raiseRecoverable(this.start, "Escape sequence in keyword new");
      var node = this.startNode();
      if (this.next(), this.options.ecmaVersion >= 6 && this.type === types$1.dot) {
        var meta = this.startNodeAt(node.start, node.loc && node.loc.start);
        meta.name = "new", node.meta = this.finishNode(meta, "Identifier"), this.next();
        var containsEsc = this.containsEsc;
        return node.property = this.parseIdent(!0), node.property.name !== "target" && this.raiseRecoverable(node.property.start, "The only valid meta property for new is 'new.target'"), containsEsc && this.raiseRecoverable(node.start, "'new.target' must not contain escaped characters"), this.allowNewDotTarget || this.raiseRecoverable(node.start, "'new.target' can only be used in functions and class static block"), this.finishNode(node, "MetaProperty");
      }
      var startPos = this.start, startLoc = this.startLoc;
      return node.callee = this.parseSubscripts(this.parseExprAtom(null, !1, !0), startPos, startLoc, !0, !1), this.eat(types$1.parenL) ? node.arguments = this.parseExprList(types$1.parenR, this.options.ecmaVersion >= 8, !1) : node.arguments = empty, this.finishNode(node, "NewExpression");
    };
    pp$5.parseTemplateElement = function(ref2) {
      var isTagged = ref2.isTagged, elem = this.startNode();
      return this.type === types$1.invalidTemplate ? (isTagged || this.raiseRecoverable(this.start, "Bad escape sequence in untagged template literal"), elem.value = {
        raw: this.value.replace(/\r\n?/g, `
`),
        cooked: null
      }) : elem.value = {
        raw: this.input.slice(this.start, this.end).replace(/\r\n?/g, `
`),
        cooked: this.value
      }, this.next(), elem.tail = this.type === types$1.backQuote, this.finishNode(elem, "TemplateElement");
    };
    pp$5.parseTemplate = function(ref2) {
      ref2 === void 0 && (ref2 = {});
      var isTagged = ref2.isTagged;
      isTagged === void 0 && (isTagged = !1);
      var node = this.startNode();
      this.next(), node.expressions = [];
      var curElt = this.parseTemplateElement({ isTagged });
      for (node.quasis = [curElt]; !curElt.tail; )
        this.type === types$1.eof && this.raise(this.pos, "Unterminated template literal"), this.expect(types$1.dollarBraceL), node.expressions.push(this.parseExpression()), this.expect(types$1.braceR), node.quasis.push(curElt = this.parseTemplateElement({ isTagged }));
      return this.next(), this.finishNode(node, "TemplateLiteral");
    };
    pp$5.isAsyncProp = function(prop) {
      return !prop.computed && prop.key.type === "Identifier" && prop.key.name === "async" && (this.type === types$1.name || this.type === types$1.num || this.type === types$1.string || this.type === types$1.bracketL || this.type.keyword || this.options.ecmaVersion >= 9 && this.type === types$1.star) && !lineBreak.test(this.input.slice(this.lastTokEnd, this.start));
    };
    pp$5.parseObj = function(isPattern, refDestructuringErrors) {
      var node = this.startNode(), first = !0, propHash = {};
      for (node.properties = [], this.next(); !this.eat(types$1.braceR); ) {
        if (first)
          first = !1;
        else if (this.expect(types$1.comma), this.options.ecmaVersion >= 5 && this.afterTrailingComma(types$1.braceR))
          break;
        var prop = this.parseProperty(isPattern, refDestructuringErrors);
        isPattern || this.checkPropClash(prop, propHash, refDestructuringErrors), node.properties.push(prop);
      }
      return this.finishNode(node, isPattern ? "ObjectPattern" : "ObjectExpression");
    };
    pp$5.parseProperty = function(isPattern, refDestructuringErrors) {
      var prop = this.startNode(), isGenerator, isAsync, startPos, startLoc;
      if (this.options.ecmaVersion >= 9 && this.eat(types$1.ellipsis))
        return isPattern ? (prop.argument = this.parseIdent(!1), this.type === types$1.comma && this.raiseRecoverable(this.start, "Comma is not permitted after the rest element"), this.finishNode(prop, "RestElement")) : (prop.argument = this.parseMaybeAssign(!1, refDestructuringErrors), this.type === types$1.comma && refDestructuringErrors && refDestructuringErrors.trailingComma < 0 && (refDestructuringErrors.trailingComma = this.start), this.finishNode(prop, "SpreadElement"));
      this.options.ecmaVersion >= 6 && (prop.method = !1, prop.shorthand = !1, (isPattern || refDestructuringErrors) && (startPos = this.start, startLoc = this.startLoc), isPattern || (isGenerator = this.eat(types$1.star)));
      var containsEsc = this.containsEsc;
      return this.parsePropertyName(prop), !isPattern && !containsEsc && this.options.ecmaVersion >= 8 && !isGenerator && this.isAsyncProp(prop) ? (isAsync = !0, isGenerator = this.options.ecmaVersion >= 9 && this.eat(types$1.star), this.parsePropertyName(prop)) : isAsync = !1, this.parsePropertyValue(prop, isPattern, isGenerator, isAsync, startPos, startLoc, refDestructuringErrors, containsEsc), this.finishNode(prop, "Property");
    };
    pp$5.parseGetterSetter = function(prop) {
      var kind = prop.key.name;
      this.parsePropertyName(prop), prop.value = this.parseMethod(!1), prop.kind = kind;
      var paramCount = prop.kind === "get" ? 0 : 1;
      if (prop.value.params.length !== paramCount) {
        var start = prop.value.start;
        prop.kind === "get" ? this.raiseRecoverable(start, "getter should have no params") : this.raiseRecoverable(start, "setter should have exactly one param");
      } else
        prop.kind === "set" && prop.value.params[0].type === "RestElement" && this.raiseRecoverable(prop.value.params[0].start, "Setter cannot use rest params");
    };
    pp$5.parsePropertyValue = function(prop, isPattern, isGenerator, isAsync, startPos, startLoc, refDestructuringErrors, containsEsc) {
      (isGenerator || isAsync) && this.type === types$1.colon && this.unexpected(), this.eat(types$1.colon) ? (prop.value = isPattern ? this.parseMaybeDefault(this.start, this.startLoc) : this.parseMaybeAssign(!1, refDestructuringErrors), prop.kind = "init") : this.options.ecmaVersion >= 6 && this.type === types$1.parenL ? (isPattern && this.unexpected(), prop.method = !0, prop.value = this.parseMethod(isGenerator, isAsync), prop.kind = "init") : !isPattern && !containsEsc && this.options.ecmaVersion >= 5 && !prop.computed && prop.key.type === "Identifier" && (prop.key.name === "get" || prop.key.name === "set") && this.type !== types$1.comma && this.type !== types$1.braceR && this.type !== types$1.eq ? ((isGenerator || isAsync) && this.unexpected(), this.parseGetterSetter(prop)) : this.options.ecmaVersion >= 6 && !prop.computed && prop.key.type === "Identifier" ? ((isGenerator || isAsync) && this.unexpected(), this.checkUnreserved(prop.key), prop.key.name === "await" && !this.awaitIdentPos && (this.awaitIdentPos = startPos), isPattern ? prop.value = this.parseMaybeDefault(startPos, startLoc, this.copyNode(prop.key)) : this.type === types$1.eq && refDestructuringErrors ? (refDestructuringErrors.shorthandAssign < 0 && (refDestructuringErrors.shorthandAssign = this.start), prop.value = this.parseMaybeDefault(startPos, startLoc, this.copyNode(prop.key))) : prop.value = this.copyNode(prop.key), prop.kind = "init", prop.shorthand = !0) : this.unexpected();
    };
    pp$5.parsePropertyName = function(prop) {
      if (this.options.ecmaVersion >= 6) {
        if (this.eat(types$1.bracketL))
          return prop.computed = !0, prop.key = this.parseMaybeAssign(), this.expect(types$1.bracketR), prop.key;
        prop.computed = !1;
      }
      return prop.key = this.type === types$1.num || this.type === types$1.string ? this.parseExprAtom() : this.parseIdent(this.options.allowReserved !== "never");
    };
    pp$5.initFunction = function(node) {
      node.id = null, this.options.ecmaVersion >= 6 && (node.generator = node.expression = !1), this.options.ecmaVersion >= 8 && (node.async = !1);
    };
    pp$5.parseMethod = function(isGenerator, isAsync, allowDirectSuper) {
      var node = this.startNode(), oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
      return this.initFunction(node), this.options.ecmaVersion >= 6 && (node.generator = isGenerator), this.options.ecmaVersion >= 8 && (node.async = !!isAsync), this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0, this.enterScope(functionFlags(isAsync, node.generator) | SCOPE_SUPER | (allowDirectSuper ? SCOPE_DIRECT_SUPER : 0)), this.expect(types$1.parenL), node.params = this.parseBindingList(types$1.parenR, !1, this.options.ecmaVersion >= 8), this.checkYieldAwaitInDefaultParams(), this.parseFunctionBody(node, !1, !0, !1), this.yieldPos = oldYieldPos, this.awaitPos = oldAwaitPos, this.awaitIdentPos = oldAwaitIdentPos, this.finishNode(node, "FunctionExpression");
    };
    pp$5.parseArrowExpression = function(node, params, isAsync, forInit) {
      var oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
      return this.enterScope(functionFlags(isAsync, !1) | SCOPE_ARROW), this.initFunction(node), this.options.ecmaVersion >= 8 && (node.async = !!isAsync), this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0, node.params = this.toAssignableList(params, !0), this.parseFunctionBody(node, !0, !1, forInit), this.yieldPos = oldYieldPos, this.awaitPos = oldAwaitPos, this.awaitIdentPos = oldAwaitIdentPos, this.finishNode(node, "ArrowFunctionExpression");
    };
    pp$5.parseFunctionBody = function(node, isArrowFunction, isMethod, forInit) {
      var isExpression = isArrowFunction && this.type !== types$1.braceL, oldStrict = this.strict, useStrict = !1;
      if (isExpression)
        node.body = this.parseMaybeAssign(forInit), node.expression = !0, this.checkParams(node, !1);
      else {
        var nonSimple = this.options.ecmaVersion >= 7 && !this.isSimpleParamList(node.params);
        (!oldStrict || nonSimple) && (useStrict = this.strictDirective(this.end), useStrict && nonSimple && this.raiseRecoverable(node.start, "Illegal 'use strict' directive in function with non-simple parameter list"));
        var oldLabels = this.labels;
        this.labels = [], useStrict && (this.strict = !0), this.checkParams(node, !oldStrict && !useStrict && !isArrowFunction && !isMethod && this.isSimpleParamList(node.params)), this.strict && node.id && this.checkLValSimple(node.id, BIND_OUTSIDE), node.body = this.parseBlock(!1, void 0, useStrict && !oldStrict), node.expression = !1, this.adaptDirectivePrologue(node.body.body), this.labels = oldLabels;
      }
      this.exitScope();
    };
    pp$5.isSimpleParamList = function(params) {
      for (var i2 = 0, list2 = params; i2 < list2.length; i2 += 1) {
        var param = list2[i2];
        if (param.type !== "Identifier")
          return !1;
      }
      return !0;
    };
    pp$5.checkParams = function(node, allowDuplicates) {
      for (var nameHash = /* @__PURE__ */ Object.create(null), i2 = 0, list2 = node.params; i2 < list2.length; i2 += 1) {
        var param = list2[i2];
        this.checkLValInnerPattern(param, BIND_VAR, allowDuplicates ? null : nameHash);
      }
    };
    pp$5.parseExprList = function(close, allowTrailingComma, allowEmpty, refDestructuringErrors) {
      for (var elts = [], first = !0; !this.eat(close); ) {
        if (first)
          first = !1;
        else if (this.expect(types$1.comma), allowTrailingComma && this.afterTrailingComma(close))
          break;
        var elt = void 0;
        allowEmpty && this.type === types$1.comma ? elt = null : this.type === types$1.ellipsis ? (elt = this.parseSpread(refDestructuringErrors), refDestructuringErrors && this.type === types$1.comma && refDestructuringErrors.trailingComma < 0 && (refDestructuringErrors.trailingComma = this.start)) : elt = this.parseMaybeAssign(!1, refDestructuringErrors), elts.push(elt);
      }
      return elts;
    };
    pp$5.checkUnreserved = function(ref2) {
      var start = ref2.start, end = ref2.end, name = ref2.name;
      if (this.inGenerator && name === "yield" && this.raiseRecoverable(start, "Cannot use 'yield' as identifier inside a generator"), this.inAsync && name === "await" && this.raiseRecoverable(start, "Cannot use 'await' as identifier inside an async function"), !(this.currentThisScope().flags & SCOPE_VAR) && name === "arguments" && this.raiseRecoverable(start, "Cannot use 'arguments' in class field initializer"), this.inClassStaticBlock && (name === "arguments" || name === "await") && this.raise(start, "Cannot use " + name + " in class static initialization block"), this.keywords.test(name) && this.raise(start, "Unexpected keyword '" + name + "'"), !(this.options.ecmaVersion < 6 && this.input.slice(start, end).indexOf("\\") !== -1)) {
        var re = this.strict ? this.reservedWordsStrict : this.reservedWords;
        re.test(name) && (!this.inAsync && name === "await" && this.raiseRecoverable(start, "Cannot use keyword 'await' outside an async function"), this.raiseRecoverable(start, "The keyword '" + name + "' is reserved"));
      }
    };
    pp$5.parseIdent = function(liberal) {
      var node = this.parseIdentNode();
      return this.next(!!liberal), this.finishNode(node, "Identifier"), liberal || (this.checkUnreserved(node), node.name === "await" && !this.awaitIdentPos && (this.awaitIdentPos = node.start)), node;
    };
    pp$5.parseIdentNode = function() {
      var node = this.startNode();
      return this.type === types$1.name ? node.name = this.value : this.type.keyword ? (node.name = this.type.keyword, (node.name === "class" || node.name === "function") && (this.lastTokEnd !== this.lastTokStart + 1 || this.input.charCodeAt(this.lastTokStart) !== 46) && this.context.pop(), this.type = types$1.name) : this.unexpected(), node;
    };
    pp$5.parsePrivateIdent = function() {
      var node = this.startNode();
      return this.type === types$1.privateId ? node.name = this.value : this.unexpected(), this.next(), this.finishNode(node, "PrivateIdentifier"), this.options.checkPrivateFields && (this.privateNameStack.length === 0 ? this.raise(node.start, "Private field '#" + node.name + "' must be declared in an enclosing class") : this.privateNameStack[this.privateNameStack.length - 1].used.push(node)), node;
    };
    pp$5.parseYield = function(forInit) {
      this.yieldPos || (this.yieldPos = this.start);
      var node = this.startNode();
      return this.next(), this.type === types$1.semi || this.canInsertSemicolon() || this.type !== types$1.star && !this.type.startsExpr ? (node.delegate = !1, node.argument = null) : (node.delegate = this.eat(types$1.star), node.argument = this.parseMaybeAssign(forInit)), this.finishNode(node, "YieldExpression");
    };
    pp$5.parseAwait = function(forInit) {
      this.awaitPos || (this.awaitPos = this.start);
      var node = this.startNode();
      return this.next(), node.argument = this.parseMaybeUnary(null, !0, !1, forInit), this.finishNode(node, "AwaitExpression");
    };
    pp$4 = Parser.prototype;
    pp$4.raise = function(pos, message) {
      var loc = getLineInfo(this.input, pos);
      message += " (" + loc.line + ":" + loc.column + ")", this.sourceFile && (message += " in " + this.sourceFile);
      var err = new SyntaxError(message);
      throw err.pos = pos, err.loc = loc, err.raisedAt = this.pos, err;
    };
    pp$4.raiseRecoverable = pp$4.raise;
    pp$4.curPosition = function() {
      if (this.options.locations)
        return new Position(this.curLine, this.pos - this.lineStart);
    };
    pp$3 = Parser.prototype, Scope = function(flags) {
      this.flags = flags, this.var = [], this.lexical = [], this.functions = [];
    };
    pp$3.enterScope = function(flags) {
      this.scopeStack.push(new Scope(flags));
    };
    pp$3.exitScope = function() {
      this.scopeStack.pop();
    };
    pp$3.treatFunctionsAsVarInScope = function(scope) {
      return scope.flags & SCOPE_FUNCTION || !this.inModule && scope.flags & SCOPE_TOP;
    };
    pp$3.declareName = function(name, bindingType, pos) {
      var redeclared = !1;
      if (bindingType === BIND_LEXICAL) {
        var scope = this.currentScope();
        redeclared = scope.lexical.indexOf(name) > -1 || scope.functions.indexOf(name) > -1 || scope.var.indexOf(name) > -1, scope.lexical.push(name), this.inModule && scope.flags & SCOPE_TOP && delete this.undefinedExports[name];
      } else if (bindingType === BIND_SIMPLE_CATCH) {
        var scope$1 = this.currentScope();
        scope$1.lexical.push(name);
      } else if (bindingType === BIND_FUNCTION) {
        var scope$2 = this.currentScope();
        this.treatFunctionsAsVar ? redeclared = scope$2.lexical.indexOf(name) > -1 : redeclared = scope$2.lexical.indexOf(name) > -1 || scope$2.var.indexOf(name) > -1, scope$2.functions.push(name);
      } else
        for (var i2 = this.scopeStack.length - 1; i2 >= 0; --i2) {
          var scope$3 = this.scopeStack[i2];
          if (scope$3.lexical.indexOf(name) > -1 && !(scope$3.flags & SCOPE_SIMPLE_CATCH && scope$3.lexical[0] === name) || !this.treatFunctionsAsVarInScope(scope$3) && scope$3.functions.indexOf(name) > -1) {
            redeclared = !0;
            break;
          }
          if (scope$3.var.push(name), this.inModule && scope$3.flags & SCOPE_TOP && delete this.undefinedExports[name], scope$3.flags & SCOPE_VAR)
            break;
        }
      redeclared && this.raiseRecoverable(pos, "Identifier '" + name + "' has already been declared");
    };
    pp$3.checkLocalExport = function(id) {
      this.scopeStack[0].lexical.indexOf(id.name) === -1 && this.scopeStack[0].var.indexOf(id.name) === -1 && (this.undefinedExports[id.name] = id);
    };
    pp$3.currentScope = function() {
      return this.scopeStack[this.scopeStack.length - 1];
    };
    pp$3.currentVarScope = function() {
      for (var i2 = this.scopeStack.length - 1; ; i2--) {
        var scope = this.scopeStack[i2];
        if (scope.flags & (SCOPE_VAR | SCOPE_CLASS_FIELD_INIT | SCOPE_CLASS_STATIC_BLOCK))
          return scope;
      }
    };
    pp$3.currentThisScope = function() {
      for (var i2 = this.scopeStack.length - 1; ; i2--) {
        var scope = this.scopeStack[i2];
        if (scope.flags & (SCOPE_VAR | SCOPE_CLASS_FIELD_INIT | SCOPE_CLASS_STATIC_BLOCK) && !(scope.flags & SCOPE_ARROW))
          return scope;
      }
    };
    Node = function(parser2, pos, loc) {
      this.type = "", this.start = pos, this.end = 0, parser2.options.locations && (this.loc = new SourceLocation(parser2, loc)), parser2.options.directSourceFile && (this.sourceFile = parser2.options.directSourceFile), parser2.options.ranges && (this.range = [pos, 0]);
    }, pp$2 = Parser.prototype;
    pp$2.startNode = function() {
      return new Node(this, this.start, this.startLoc);
    };
    pp$2.startNodeAt = function(pos, loc) {
      return new Node(this, pos, loc);
    };
    pp$2.finishNode = function(node, type) {
      return finishNodeAt.call(this, node, type, this.lastTokEnd, this.lastTokEndLoc);
    };
    pp$2.finishNodeAt = function(node, type, pos, loc) {
      return finishNodeAt.call(this, node, type, pos, loc);
    };
    pp$2.copyNode = function(node) {
      var newNode = new Node(this, node.start, this.startLoc);
      for (var prop in node)
        newNode[prop] = node[prop];
      return newNode;
    };
    scriptValuesAddedInUnicode = "Gara Garay Gukh Gurung_Khema Hrkt Katakana_Or_Hiragana Kawi Kirat_Rai Krai Nag_Mundari Nagm Ol_Onal Onao Sunu Sunuwar Todhri Todr Tulu_Tigalari Tutg Unknown Zzzz", ecma9BinaryProperties = "ASCII ASCII_Hex_Digit AHex Alphabetic Alpha Any Assigned Bidi_Control Bidi_C Bidi_Mirrored Bidi_M Case_Ignorable CI Cased Changes_When_Casefolded CWCF Changes_When_Casemapped CWCM Changes_When_Lowercased CWL Changes_When_NFKC_Casefolded CWKCF Changes_When_Titlecased CWT Changes_When_Uppercased CWU Dash Default_Ignorable_Code_Point DI Deprecated Dep Diacritic Dia Emoji Emoji_Component Emoji_Modifier Emoji_Modifier_Base Emoji_Presentation Extender Ext Grapheme_Base Gr_Base Grapheme_Extend Gr_Ext Hex_Digit Hex IDS_Binary_Operator IDSB IDS_Trinary_Operator IDST ID_Continue IDC ID_Start IDS Ideographic Ideo Join_Control Join_C Logical_Order_Exception LOE Lowercase Lower Math Noncharacter_Code_Point NChar Pattern_Syntax Pat_Syn Pattern_White_Space Pat_WS Quotation_Mark QMark Radical Regional_Indicator RI Sentence_Terminal STerm Soft_Dotted SD Terminal_Punctuation Term Unified_Ideograph UIdeo Uppercase Upper Variation_Selector VS White_Space space XID_Continue XIDC XID_Start XIDS", ecma10BinaryProperties = ecma9BinaryProperties + " Extended_Pictographic", ecma11BinaryProperties = ecma10BinaryProperties, ecma12BinaryProperties = ecma11BinaryProperties + " EBase EComp EMod EPres ExtPict", ecma13BinaryProperties = ecma12BinaryProperties, ecma14BinaryProperties = ecma13BinaryProperties, unicodeBinaryProperties = {
      9: ecma9BinaryProperties,
      10: ecma10BinaryProperties,
      11: ecma11BinaryProperties,
      12: ecma12BinaryProperties,
      13: ecma13BinaryProperties,
      14: ecma14BinaryProperties
    }, ecma14BinaryPropertiesOfStrings = "Basic_Emoji Emoji_Keycap_Sequence RGI_Emoji_Modifier_Sequence RGI_Emoji_Flag_Sequence RGI_Emoji_Tag_Sequence RGI_Emoji_ZWJ_Sequence RGI_Emoji", unicodeBinaryPropertiesOfStrings = {
      9: "",
      10: "",
      11: "",
      12: "",
      13: "",
      14: ecma14BinaryPropertiesOfStrings
    }, unicodeGeneralCategoryValues = "Cased_Letter LC Close_Punctuation Pe Connector_Punctuation Pc Control Cc cntrl Currency_Symbol Sc Dash_Punctuation Pd Decimal_Number Nd digit Enclosing_Mark Me Final_Punctuation Pf Format Cf Initial_Punctuation Pi Letter L Letter_Number Nl Line_Separator Zl Lowercase_Letter Ll Mark M Combining_Mark Math_Symbol Sm Modifier_Letter Lm Modifier_Symbol Sk Nonspacing_Mark Mn Number N Open_Punctuation Ps Other C Other_Letter Lo Other_Number No Other_Punctuation Po Other_Symbol So Paragraph_Separator Zp Private_Use Co Punctuation P punct Separator Z Space_Separator Zs Spacing_Mark Mc Surrogate Cs Symbol S Titlecase_Letter Lt Unassigned Cn Uppercase_Letter Lu", ecma9ScriptValues = "Adlam Adlm Ahom Anatolian_Hieroglyphs Hluw Arabic Arab Armenian Armn Avestan Avst Balinese Bali Bamum Bamu Bassa_Vah Bass Batak Batk Bengali Beng Bhaiksuki Bhks Bopomofo Bopo Brahmi Brah Braille Brai Buginese Bugi Buhid Buhd Canadian_Aboriginal Cans Carian Cari Caucasian_Albanian Aghb Chakma Cakm Cham Cham Cherokee Cher Common Zyyy Coptic Copt Qaac Cuneiform Xsux Cypriot Cprt Cyrillic Cyrl Deseret Dsrt Devanagari Deva Duployan Dupl Egyptian_Hieroglyphs Egyp Elbasan Elba Ethiopic Ethi Georgian Geor Glagolitic Glag Gothic Goth Grantha Gran Greek Grek Gujarati Gujr Gurmukhi Guru Han Hani Hangul Hang Hanunoo Hano Hatran Hatr Hebrew Hebr Hiragana Hira Imperial_Aramaic Armi Inherited Zinh Qaai Inscriptional_Pahlavi Phli Inscriptional_Parthian Prti Javanese Java Kaithi Kthi Kannada Knda Katakana Kana Kayah_Li Kali Kharoshthi Khar Khmer Khmr Khojki Khoj Khudawadi Sind Lao Laoo Latin Latn Lepcha Lepc Limbu Limb Linear_A Lina Linear_B Linb Lisu Lisu Lycian Lyci Lydian Lydi Mahajani Mahj Malayalam Mlym Mandaic Mand Manichaean Mani Marchen Marc Masaram_Gondi Gonm Meetei_Mayek Mtei Mende_Kikakui Mend Meroitic_Cursive Merc Meroitic_Hieroglyphs Mero Miao Plrd Modi Mongolian Mong Mro Mroo Multani Mult Myanmar Mymr Nabataean Nbat New_Tai_Lue Talu Newa Newa Nko Nkoo Nushu Nshu Ogham Ogam Ol_Chiki Olck Old_Hungarian Hung Old_Italic Ital Old_North_Arabian Narb Old_Permic Perm Old_Persian Xpeo Old_South_Arabian Sarb Old_Turkic Orkh Oriya Orya Osage Osge Osmanya Osma Pahawh_Hmong Hmng Palmyrene Palm Pau_Cin_Hau Pauc Phags_Pa Phag Phoenician Phnx Psalter_Pahlavi Phlp Rejang Rjng Runic Runr Samaritan Samr Saurashtra Saur Sharada Shrd Shavian Shaw Siddham Sidd SignWriting Sgnw Sinhala Sinh Sora_Sompeng Sora Soyombo Soyo Sundanese Sund Syloti_Nagri Sylo Syriac Syrc Tagalog Tglg Tagbanwa Tagb Tai_Le Tale Tai_Tham Lana Tai_Viet Tavt Takri Takr Tamil Taml Tangut Tang Telugu Telu Thaana Thaa Thai Thai Tibetan Tibt Tifinagh Tfng Tirhuta Tirh Ugaritic Ugar Vai Vaii Warang_Citi Wara Yi Yiii Zanabazar_Square Zanb", ecma10ScriptValues = ecma9ScriptValues + " Dogra Dogr Gunjala_Gondi Gong Hanifi_Rohingya Rohg Makasar Maka Medefaidrin Medf Old_Sogdian Sogo Sogdian Sogd", ecma11ScriptValues = ecma10ScriptValues + " Elymaic Elym Nandinagari Nand Nyiakeng_Puachue_Hmong Hmnp Wancho Wcho", ecma12ScriptValues = ecma11ScriptValues + " Chorasmian Chrs Diak Dives_Akuru Khitan_Small_Script Kits Yezi Yezidi", ecma13ScriptValues = ecma12ScriptValues + " Cypro_Minoan Cpmn Old_Uyghur Ougr Tangsa Tnsa Toto Vithkuqi Vith", ecma14ScriptValues = ecma13ScriptValues + " " + scriptValuesAddedInUnicode, unicodeScriptValues = {
      9: ecma9ScriptValues,
      10: ecma10ScriptValues,
      11: ecma11ScriptValues,
      12: ecma12ScriptValues,
      13: ecma13ScriptValues,
      14: ecma14ScriptValues
    }, data = {};
    for (i = 0, list = [9, 10, 11, 12, 13, 14]; i < list.length; i += 1)
      ecmaVersion = list[i], buildUnicodeData(ecmaVersion);
    pp$1 = Parser.prototype, BranchID = function(parent, base2) {
      this.parent = parent, this.base = base2 || this;
    };
    BranchID.prototype.separatedFrom = function(alt) {
      for (var self2 = this; self2; self2 = self2.parent)
        for (var other = alt; other; other = other.parent)
          if (self2.base === other.base && self2 !== other)
            return !0;
      return !1;
    };
    BranchID.prototype.sibling = function() {
      return new BranchID(this.parent, this.base);
    };
    RegExpValidationState = function(parser2) {
      this.parser = parser2, this.validFlags = "gim" + (parser2.options.ecmaVersion >= 6 ? "uy" : "") + (parser2.options.ecmaVersion >= 9 ? "s" : "") + (parser2.options.ecmaVersion >= 13 ? "d" : "") + (parser2.options.ecmaVersion >= 15 ? "v" : ""), this.unicodeProperties = data[parser2.options.ecmaVersion >= 14 ? 14 : parser2.options.ecmaVersion], this.source = "", this.flags = "", this.start = 0, this.switchU = !1, this.switchV = !1, this.switchN = !1, this.pos = 0, this.lastIntValue = 0, this.lastStringValue = "", this.lastAssertionIsQuantifiable = !1, this.numCapturingParens = 0, this.maxBackReference = 0, this.groupNames = /* @__PURE__ */ Object.create(null), this.backReferenceNames = [], this.branchID = null;
    };
    RegExpValidationState.prototype.reset = function(start, pattern, flags) {
      var unicodeSets = flags.indexOf("v") !== -1, unicode = flags.indexOf("u") !== -1;
      this.start = start | 0, this.source = pattern + "", this.flags = flags, unicodeSets && this.parser.options.ecmaVersion >= 15 ? (this.switchU = !0, this.switchV = !0, this.switchN = !0) : (this.switchU = unicode && this.parser.options.ecmaVersion >= 6, this.switchV = !1, this.switchN = unicode && this.parser.options.ecmaVersion >= 9);
    };
    RegExpValidationState.prototype.raise = function(message) {
      this.parser.raiseRecoverable(this.start, "Invalid regular expression: /" + this.source + "/: " + message);
    };
    RegExpValidationState.prototype.at = function(i2, forceU) {
      forceU === void 0 && (forceU = !1);
      var s = this.source, l = s.length;
      if (i2 >= l)
        return -1;
      var c = s.charCodeAt(i2);
      if (!(forceU || this.switchU) || c <= 55295 || c >= 57344 || i2 + 1 >= l)
        return c;
      var next = s.charCodeAt(i2 + 1);
      return next >= 56320 && next <= 57343 ? (c << 10) + next - 56613888 : c;
    };
    RegExpValidationState.prototype.nextIndex = function(i2, forceU) {
      forceU === void 0 && (forceU = !1);
      var s = this.source, l = s.length;
      if (i2 >= l)
        return l;
      var c = s.charCodeAt(i2), next;
      return !(forceU || this.switchU) || c <= 55295 || c >= 57344 || i2 + 1 >= l || (next = s.charCodeAt(i2 + 1)) < 56320 || next > 57343 ? i2 + 1 : i2 + 2;
    };
    RegExpValidationState.prototype.current = function(forceU) {
      return forceU === void 0 && (forceU = !1), this.at(this.pos, forceU);
    };
    RegExpValidationState.prototype.lookahead = function(forceU) {
      return forceU === void 0 && (forceU = !1), this.at(this.nextIndex(this.pos, forceU), forceU);
    };
    RegExpValidationState.prototype.advance = function(forceU) {
      forceU === void 0 && (forceU = !1), this.pos = this.nextIndex(this.pos, forceU);
    };
    RegExpValidationState.prototype.eat = function(ch, forceU) {
      return forceU === void 0 && (forceU = !1), this.current(forceU) === ch ? (this.advance(forceU), !0) : !1;
    };
    RegExpValidationState.prototype.eatChars = function(chs, forceU) {
      forceU === void 0 && (forceU = !1);
      for (var pos = this.pos, i2 = 0, list2 = chs; i2 < list2.length; i2 += 1) {
        var ch = list2[i2], current2 = this.at(pos, forceU);
        if (current2 === -1 || current2 !== ch)
          return !1;
        pos = this.nextIndex(pos, forceU);
      }
      return this.pos = pos, !0;
    };
    pp$1.validateRegExpFlags = function(state) {
      for (var validFlags = state.validFlags, flags = state.flags, u = !1, v = !1, i2 = 0; i2 < flags.length; i2++) {
        var flag = flags.charAt(i2);
        validFlags.indexOf(flag) === -1 && this.raise(state.start, "Invalid regular expression flag"), flags.indexOf(flag, i2 + 1) > -1 && this.raise(state.start, "Duplicate regular expression flag"), flag === "u" && (u = !0), flag === "v" && (v = !0);
      }
      this.options.ecmaVersion >= 15 && u && v && this.raise(state.start, "Invalid regular expression flag");
    };
    pp$1.validateRegExpPattern = function(state) {
      this.regexp_pattern(state), !state.switchN && this.options.ecmaVersion >= 9 && hasProp(state.groupNames) && (state.switchN = !0, this.regexp_pattern(state));
    };
    pp$1.regexp_pattern = function(state) {
      state.pos = 0, state.lastIntValue = 0, state.lastStringValue = "", state.lastAssertionIsQuantifiable = !1, state.numCapturingParens = 0, state.maxBackReference = 0, state.groupNames = /* @__PURE__ */ Object.create(null), state.backReferenceNames.length = 0, state.branchID = null, this.regexp_disjunction(state), state.pos !== state.source.length && (state.eat(
        41
        /* ) */
      ) && state.raise("Unmatched ')'"), (state.eat(
        93
        /* ] */
      ) || state.eat(
        125
        /* } */
      )) && state.raise("Lone quantifier brackets")), state.maxBackReference > state.numCapturingParens && state.raise("Invalid escape");
      for (var i2 = 0, list2 = state.backReferenceNames; i2 < list2.length; i2 += 1) {
        var name = list2[i2];
        state.groupNames[name] || state.raise("Invalid named capture referenced");
      }
    };
    pp$1.regexp_disjunction = function(state) {
      var trackDisjunction = this.options.ecmaVersion >= 16;
      for (trackDisjunction && (state.branchID = new BranchID(state.branchID, null)), this.regexp_alternative(state); state.eat(
        124
        /* | */
      ); )
        trackDisjunction && (state.branchID = state.branchID.sibling()), this.regexp_alternative(state);
      trackDisjunction && (state.branchID = state.branchID.parent), this.regexp_eatQuantifier(state, !0) && state.raise("Nothing to repeat"), state.eat(
        123
        /* { */
      ) && state.raise("Lone quantifier brackets");
    };
    pp$1.regexp_alternative = function(state) {
      for (; state.pos < state.source.length && this.regexp_eatTerm(state); )
        ;
    };
    pp$1.regexp_eatTerm = function(state) {
      return this.regexp_eatAssertion(state) ? (state.lastAssertionIsQuantifiable && this.regexp_eatQuantifier(state) && state.switchU && state.raise("Invalid quantifier"), !0) : (state.switchU ? this.regexp_eatAtom(state) : this.regexp_eatExtendedAtom(state)) ? (this.regexp_eatQuantifier(state), !0) : !1;
    };
    pp$1.regexp_eatAssertion = function(state) {
      var start = state.pos;
      if (state.lastAssertionIsQuantifiable = !1, state.eat(
        94
        /* ^ */
      ) || state.eat(
        36
        /* $ */
      ))
        return !0;
      if (state.eat(
        92
        /* \ */
      )) {
        if (state.eat(
          66
          /* B */
        ) || state.eat(
          98
          /* b */
        ))
          return !0;
        state.pos = start;
      }
      if (state.eat(
        40
        /* ( */
      ) && state.eat(
        63
        /* ? */
      )) {
        var lookbehind = !1;
        if (this.options.ecmaVersion >= 9 && (lookbehind = state.eat(
          60
          /* < */
        )), state.eat(
          61
          /* = */
        ) || state.eat(
          33
          /* ! */
        ))
          return this.regexp_disjunction(state), state.eat(
            41
            /* ) */
          ) || state.raise("Unterminated group"), state.lastAssertionIsQuantifiable = !lookbehind, !0;
      }
      return state.pos = start, !1;
    };
    pp$1.regexp_eatQuantifier = function(state, noError) {
      return noError === void 0 && (noError = !1), this.regexp_eatQuantifierPrefix(state, noError) ? (state.eat(
        63
        /* ? */
      ), !0) : !1;
    };
    pp$1.regexp_eatQuantifierPrefix = function(state, noError) {
      return state.eat(
        42
        /* * */
      ) || state.eat(
        43
        /* + */
      ) || state.eat(
        63
        /* ? */
      ) || this.regexp_eatBracedQuantifier(state, noError);
    };
    pp$1.regexp_eatBracedQuantifier = function(state, noError) {
      var start = state.pos;
      if (state.eat(
        123
        /* { */
      )) {
        var min = 0, max = -1;
        if (this.regexp_eatDecimalDigits(state) && (min = state.lastIntValue, state.eat(
          44
          /* , */
        ) && this.regexp_eatDecimalDigits(state) && (max = state.lastIntValue), state.eat(
          125
          /* } */
        )))
          return max !== -1 && max < min && !noError && state.raise("numbers out of order in {} quantifier"), !0;
        state.switchU && !noError && state.raise("Incomplete quantifier"), state.pos = start;
      }
      return !1;
    };
    pp$1.regexp_eatAtom = function(state) {
      return this.regexp_eatPatternCharacters(state) || state.eat(
        46
        /* . */
      ) || this.regexp_eatReverseSolidusAtomEscape(state) || this.regexp_eatCharacterClass(state) || this.regexp_eatUncapturingGroup(state) || this.regexp_eatCapturingGroup(state);
    };
    pp$1.regexp_eatReverseSolidusAtomEscape = function(state) {
      var start = state.pos;
      if (state.eat(
        92
        /* \ */
      )) {
        if (this.regexp_eatAtomEscape(state))
          return !0;
        state.pos = start;
      }
      return !1;
    };
    pp$1.regexp_eatUncapturingGroup = function(state) {
      var start = state.pos;
      if (state.eat(
        40
        /* ( */
      )) {
        if (state.eat(
          63
          /* ? */
        )) {
          if (this.options.ecmaVersion >= 16) {
            var addModifiers = this.regexp_eatModifiers(state), hasHyphen = state.eat(
              45
              /* - */
            );
            if (addModifiers || hasHyphen) {
              for (var i2 = 0; i2 < addModifiers.length; i2++) {
                var modifier = addModifiers.charAt(i2);
                addModifiers.indexOf(modifier, i2 + 1) > -1 && state.raise("Duplicate regular expression modifiers");
              }
              if (hasHyphen) {
                var removeModifiers = this.regexp_eatModifiers(state);
                !addModifiers && !removeModifiers && state.current() === 58 && state.raise("Invalid regular expression modifiers");
                for (var i$1 = 0; i$1 < removeModifiers.length; i$1++) {
                  var modifier$1 = removeModifiers.charAt(i$1);
                  (removeModifiers.indexOf(modifier$1, i$1 + 1) > -1 || addModifiers.indexOf(modifier$1) > -1) && state.raise("Duplicate regular expression modifiers");
                }
              }
            }
          }
          if (state.eat(
            58
            /* : */
          )) {
            if (this.regexp_disjunction(state), state.eat(
              41
              /* ) */
            ))
              return !0;
            state.raise("Unterminated group");
          }
        }
        state.pos = start;
      }
      return !1;
    };
    pp$1.regexp_eatCapturingGroup = function(state) {
      if (state.eat(
        40
        /* ( */
      )) {
        if (this.options.ecmaVersion >= 9 ? this.regexp_groupSpecifier(state) : state.current() === 63 && state.raise("Invalid group"), this.regexp_disjunction(state), state.eat(
          41
          /* ) */
        ))
          return state.numCapturingParens += 1, !0;
        state.raise("Unterminated group");
      }
      return !1;
    };
    pp$1.regexp_eatModifiers = function(state) {
      for (var modifiers = "", ch = 0; (ch = state.current()) !== -1 && isRegularExpressionModifier(ch); )
        modifiers += codePointToString(ch), state.advance();
      return modifiers;
    };
    pp$1.regexp_eatExtendedAtom = function(state) {
      return state.eat(
        46
        /* . */
      ) || this.regexp_eatReverseSolidusAtomEscape(state) || this.regexp_eatCharacterClass(state) || this.regexp_eatUncapturingGroup(state) || this.regexp_eatCapturingGroup(state) || this.regexp_eatInvalidBracedQuantifier(state) || this.regexp_eatExtendedPatternCharacter(state);
    };
    pp$1.regexp_eatInvalidBracedQuantifier = function(state) {
      return this.regexp_eatBracedQuantifier(state, !0) && state.raise("Nothing to repeat"), !1;
    };
    pp$1.regexp_eatSyntaxCharacter = function(state) {
      var ch = state.current();
      return isSyntaxCharacter(ch) ? (state.lastIntValue = ch, state.advance(), !0) : !1;
    };
    pp$1.regexp_eatPatternCharacters = function(state) {
      for (var start = state.pos, ch = 0; (ch = state.current()) !== -1 && !isSyntaxCharacter(ch); )
        state.advance();
      return state.pos !== start;
    };
    pp$1.regexp_eatExtendedPatternCharacter = function(state) {
      var ch = state.current();
      return ch !== -1 && ch !== 36 && !(ch >= 40 && ch <= 43) && ch !== 46 && ch !== 63 && ch !== 91 && ch !== 94 && ch !== 124 ? (state.advance(), !0) : !1;
    };
    pp$1.regexp_groupSpecifier = function(state) {
      if (state.eat(
        63
        /* ? */
      )) {
        this.regexp_eatGroupName(state) || state.raise("Invalid group");
        var trackDisjunction = this.options.ecmaVersion >= 16, known = state.groupNames[state.lastStringValue];
        if (known)
          if (trackDisjunction)
            for (var i2 = 0, list2 = known; i2 < list2.length; i2 += 1) {
              var altID = list2[i2];
              altID.separatedFrom(state.branchID) || state.raise("Duplicate capture group name");
            }
          else
            state.raise("Duplicate capture group name");
        trackDisjunction ? (known || (state.groupNames[state.lastStringValue] = [])).push(state.branchID) : state.groupNames[state.lastStringValue] = !0;
      }
    };
    pp$1.regexp_eatGroupName = function(state) {
      if (state.lastStringValue = "", state.eat(
        60
        /* < */
      )) {
        if (this.regexp_eatRegExpIdentifierName(state) && state.eat(
          62
          /* > */
        ))
          return !0;
        state.raise("Invalid capture group name");
      }
      return !1;
    };
    pp$1.regexp_eatRegExpIdentifierName = function(state) {
      if (state.lastStringValue = "", this.regexp_eatRegExpIdentifierStart(state)) {
        for (state.lastStringValue += codePointToString(state.lastIntValue); this.regexp_eatRegExpIdentifierPart(state); )
          state.lastStringValue += codePointToString(state.lastIntValue);
        return !0;
      }
      return !1;
    };
    pp$1.regexp_eatRegExpIdentifierStart = function(state) {
      var start = state.pos, forceU = this.options.ecmaVersion >= 11, ch = state.current(forceU);
      return state.advance(forceU), ch === 92 && this.regexp_eatRegExpUnicodeEscapeSequence(state, forceU) && (ch = state.lastIntValue), isRegExpIdentifierStart(ch) ? (state.lastIntValue = ch, !0) : (state.pos = start, !1);
    };
    pp$1.regexp_eatRegExpIdentifierPart = function(state) {
      var start = state.pos, forceU = this.options.ecmaVersion >= 11, ch = state.current(forceU);
      return state.advance(forceU), ch === 92 && this.regexp_eatRegExpUnicodeEscapeSequence(state, forceU) && (ch = state.lastIntValue), isRegExpIdentifierPart(ch) ? (state.lastIntValue = ch, !0) : (state.pos = start, !1);
    };
    pp$1.regexp_eatAtomEscape = function(state) {
      return this.regexp_eatBackReference(state) || this.regexp_eatCharacterClassEscape(state) || this.regexp_eatCharacterEscape(state) || state.switchN && this.regexp_eatKGroupName(state) ? !0 : (state.switchU && (state.current() === 99 && state.raise("Invalid unicode escape"), state.raise("Invalid escape")), !1);
    };
    pp$1.regexp_eatBackReference = function(state) {
      var start = state.pos;
      if (this.regexp_eatDecimalEscape(state)) {
        var n = state.lastIntValue;
        if (state.switchU)
          return n > state.maxBackReference && (state.maxBackReference = n), !0;
        if (n <= state.numCapturingParens)
          return !0;
        state.pos = start;
      }
      return !1;
    };
    pp$1.regexp_eatKGroupName = function(state) {
      if (state.eat(
        107
        /* k */
      )) {
        if (this.regexp_eatGroupName(state))
          return state.backReferenceNames.push(state.lastStringValue), !0;
        state.raise("Invalid named reference");
      }
      return !1;
    };
    pp$1.regexp_eatCharacterEscape = function(state) {
      return this.regexp_eatControlEscape(state) || this.regexp_eatCControlLetter(state) || this.regexp_eatZero(state) || this.regexp_eatHexEscapeSequence(state) || this.regexp_eatRegExpUnicodeEscapeSequence(state, !1) || !state.switchU && this.regexp_eatLegacyOctalEscapeSequence(state) || this.regexp_eatIdentityEscape(state);
    };
    pp$1.regexp_eatCControlLetter = function(state) {
      var start = state.pos;
      if (state.eat(
        99
        /* c */
      )) {
        if (this.regexp_eatControlLetter(state))
          return !0;
        state.pos = start;
      }
      return !1;
    };
    pp$1.regexp_eatZero = function(state) {
      return state.current() === 48 && !isDecimalDigit(state.lookahead()) ? (state.lastIntValue = 0, state.advance(), !0) : !1;
    };
    pp$1.regexp_eatControlEscape = function(state) {
      var ch = state.current();
      return ch === 116 ? (state.lastIntValue = 9, state.advance(), !0) : ch === 110 ? (state.lastIntValue = 10, state.advance(), !0) : ch === 118 ? (state.lastIntValue = 11, state.advance(), !0) : ch === 102 ? (state.lastIntValue = 12, state.advance(), !0) : ch === 114 ? (state.lastIntValue = 13, state.advance(), !0) : !1;
    };
    pp$1.regexp_eatControlLetter = function(state) {
      var ch = state.current();
      return isControlLetter(ch) ? (state.lastIntValue = ch % 32, state.advance(), !0) : !1;
    };
    pp$1.regexp_eatRegExpUnicodeEscapeSequence = function(state, forceU) {
      forceU === void 0 && (forceU = !1);
      var start = state.pos, switchU = forceU || state.switchU;
      if (state.eat(
        117
        /* u */
      )) {
        if (this.regexp_eatFixedHexDigits(state, 4)) {
          var lead = state.lastIntValue;
          if (switchU && lead >= 55296 && lead <= 56319) {
            var leadSurrogateEnd = state.pos;
            if (state.eat(
              92
              /* \ */
            ) && state.eat(
              117
              /* u */
            ) && this.regexp_eatFixedHexDigits(state, 4)) {
              var trail = state.lastIntValue;
              if (trail >= 56320 && trail <= 57343)
                return state.lastIntValue = (lead - 55296) * 1024 + (trail - 56320) + 65536, !0;
            }
            state.pos = leadSurrogateEnd, state.lastIntValue = lead;
          }
          return !0;
        }
        if (switchU && state.eat(
          123
          /* { */
        ) && this.regexp_eatHexDigits(state) && state.eat(
          125
          /* } */
        ) && isValidUnicode(state.lastIntValue))
          return !0;
        switchU && state.raise("Invalid unicode escape"), state.pos = start;
      }
      return !1;
    };
    pp$1.regexp_eatIdentityEscape = function(state) {
      if (state.switchU)
        return this.regexp_eatSyntaxCharacter(state) ? !0 : state.eat(
          47
          /* / */
        ) ? (state.lastIntValue = 47, !0) : !1;
      var ch = state.current();
      return ch !== 99 && (!state.switchN || ch !== 107) ? (state.lastIntValue = ch, state.advance(), !0) : !1;
    };
    pp$1.regexp_eatDecimalEscape = function(state) {
      state.lastIntValue = 0;
      var ch = state.current();
      if (ch >= 49 && ch <= 57) {
        do
          state.lastIntValue = 10 * state.lastIntValue + (ch - 48), state.advance();
        while ((ch = state.current()) >= 48 && ch <= 57);
        return !0;
      }
      return !1;
    };
    CharSetNone = 0, CharSetOk = 1, CharSetString = 2;
    pp$1.regexp_eatCharacterClassEscape = function(state) {
      var ch = state.current();
      if (isCharacterClassEscape(ch))
        return state.lastIntValue = -1, state.advance(), CharSetOk;
      var negate = !1;
      if (state.switchU && this.options.ecmaVersion >= 9 && ((negate = ch === 80) || ch === 112)) {
        state.lastIntValue = -1, state.advance();
        var result;
        if (state.eat(
          123
          /* { */
        ) && (result = this.regexp_eatUnicodePropertyValueExpression(state)) && state.eat(
          125
          /* } */
        ))
          return negate && result === CharSetString && state.raise("Invalid property name"), result;
        state.raise("Invalid property name");
      }
      return CharSetNone;
    };
    pp$1.regexp_eatUnicodePropertyValueExpression = function(state) {
      var start = state.pos;
      if (this.regexp_eatUnicodePropertyName(state) && state.eat(
        61
        /* = */
      )) {
        var name = state.lastStringValue;
        if (this.regexp_eatUnicodePropertyValue(state)) {
          var value = state.lastStringValue;
          return this.regexp_validateUnicodePropertyNameAndValue(state, name, value), CharSetOk;
        }
      }
      if (state.pos = start, this.regexp_eatLoneUnicodePropertyNameOrValue(state)) {
        var nameOrValue = state.lastStringValue;
        return this.regexp_validateUnicodePropertyNameOrValue(state, nameOrValue);
      }
      return CharSetNone;
    };
    pp$1.regexp_validateUnicodePropertyNameAndValue = function(state, name, value) {
      hasOwn(state.unicodeProperties.nonBinary, name) || state.raise("Invalid property name"), state.unicodeProperties.nonBinary[name].test(value) || state.raise("Invalid property value");
    };
    pp$1.regexp_validateUnicodePropertyNameOrValue = function(state, nameOrValue) {
      if (state.unicodeProperties.binary.test(nameOrValue))
        return CharSetOk;
      if (state.switchV && state.unicodeProperties.binaryOfStrings.test(nameOrValue))
        return CharSetString;
      state.raise("Invalid property name");
    };
    pp$1.regexp_eatUnicodePropertyName = function(state) {
      var ch = 0;
      for (state.lastStringValue = ""; isUnicodePropertyNameCharacter(ch = state.current()); )
        state.lastStringValue += codePointToString(ch), state.advance();
      return state.lastStringValue !== "";
    };
    pp$1.regexp_eatUnicodePropertyValue = function(state) {
      var ch = 0;
      for (state.lastStringValue = ""; isUnicodePropertyValueCharacter(ch = state.current()); )
        state.lastStringValue += codePointToString(ch), state.advance();
      return state.lastStringValue !== "";
    };
    pp$1.regexp_eatLoneUnicodePropertyNameOrValue = function(state) {
      return this.regexp_eatUnicodePropertyValue(state);
    };
    pp$1.regexp_eatCharacterClass = function(state) {
      if (state.eat(
        91
        /* [ */
      )) {
        var negate = state.eat(
          94
          /* ^ */
        ), result = this.regexp_classContents(state);
        return state.eat(
          93
          /* ] */
        ) || state.raise("Unterminated character class"), negate && result === CharSetString && state.raise("Negated character class may contain strings"), !0;
      }
      return !1;
    };
    pp$1.regexp_classContents = function(state) {
      return state.current() === 93 ? CharSetOk : state.switchV ? this.regexp_classSetExpression(state) : (this.regexp_nonEmptyClassRanges(state), CharSetOk);
    };
    pp$1.regexp_nonEmptyClassRanges = function(state) {
      for (; this.regexp_eatClassAtom(state); ) {
        var left = state.lastIntValue;
        if (state.eat(
          45
          /* - */
        ) && this.regexp_eatClassAtom(state)) {
          var right = state.lastIntValue;
          state.switchU && (left === -1 || right === -1) && state.raise("Invalid character class"), left !== -1 && right !== -1 && left > right && state.raise("Range out of order in character class");
        }
      }
    };
    pp$1.regexp_eatClassAtom = function(state) {
      var start = state.pos;
      if (state.eat(
        92
        /* \ */
      )) {
        if (this.regexp_eatClassEscape(state))
          return !0;
        if (state.switchU) {
          var ch$1 = state.current();
          (ch$1 === 99 || isOctalDigit(ch$1)) && state.raise("Invalid class escape"), state.raise("Invalid escape");
        }
        state.pos = start;
      }
      var ch = state.current();
      return ch !== 93 ? (state.lastIntValue = ch, state.advance(), !0) : !1;
    };
    pp$1.regexp_eatClassEscape = function(state) {
      var start = state.pos;
      if (state.eat(
        98
        /* b */
      ))
        return state.lastIntValue = 8, !0;
      if (state.switchU && state.eat(
        45
        /* - */
      ))
        return state.lastIntValue = 45, !0;
      if (!state.switchU && state.eat(
        99
        /* c */
      )) {
        if (this.regexp_eatClassControlLetter(state))
          return !0;
        state.pos = start;
      }
      return this.regexp_eatCharacterClassEscape(state) || this.regexp_eatCharacterEscape(state);
    };
    pp$1.regexp_classSetExpression = function(state) {
      var result = CharSetOk, subResult;
      if (!this.regexp_eatClassSetRange(state)) if (subResult = this.regexp_eatClassSetOperand(state)) {
        subResult === CharSetString && (result = CharSetString);
        for (var start = state.pos; state.eatChars(
          [38, 38]
          /* && */
        ); ) {
          if (state.current() !== 38 && (subResult = this.regexp_eatClassSetOperand(state))) {
            subResult !== CharSetString && (result = CharSetOk);
            continue;
          }
          state.raise("Invalid character in character class");
        }
        if (start !== state.pos)
          return result;
        for (; state.eatChars(
          [45, 45]
          /* -- */
        ); )
          this.regexp_eatClassSetOperand(state) || state.raise("Invalid character in character class");
        if (start !== state.pos)
          return result;
      } else
        state.raise("Invalid character in character class");
      for (; ; )
        if (!this.regexp_eatClassSetRange(state)) {
          if (subResult = this.regexp_eatClassSetOperand(state), !subResult)
            return result;
          subResult === CharSetString && (result = CharSetString);
        }
    };
    pp$1.regexp_eatClassSetRange = function(state) {
      var start = state.pos;
      if (this.regexp_eatClassSetCharacter(state)) {
        var left = state.lastIntValue;
        if (state.eat(
          45
          /* - */
        ) && this.regexp_eatClassSetCharacter(state)) {
          var right = state.lastIntValue;
          return left !== -1 && right !== -1 && left > right && state.raise("Range out of order in character class"), !0;
        }
        state.pos = start;
      }
      return !1;
    };
    pp$1.regexp_eatClassSetOperand = function(state) {
      return this.regexp_eatClassSetCharacter(state) ? CharSetOk : this.regexp_eatClassStringDisjunction(state) || this.regexp_eatNestedClass(state);
    };
    pp$1.regexp_eatNestedClass = function(state) {
      var start = state.pos;
      if (state.eat(
        91
        /* [ */
      )) {
        var negate = state.eat(
          94
          /* ^ */
        ), result = this.regexp_classContents(state);
        if (state.eat(
          93
          /* ] */
        ))
          return negate && result === CharSetString && state.raise("Negated character class may contain strings"), result;
        state.pos = start;
      }
      if (state.eat(
        92
        /* \ */
      )) {
        var result$1 = this.regexp_eatCharacterClassEscape(state);
        if (result$1)
          return result$1;
        state.pos = start;
      }
      return null;
    };
    pp$1.regexp_eatClassStringDisjunction = function(state) {
      var start = state.pos;
      if (state.eatChars(
        [92, 113]
        /* \q */
      )) {
        if (state.eat(
          123
          /* { */
        )) {
          var result = this.regexp_classStringDisjunctionContents(state);
          if (state.eat(
            125
            /* } */
          ))
            return result;
        } else
          state.raise("Invalid escape");
        state.pos = start;
      }
      return null;
    };
    pp$1.regexp_classStringDisjunctionContents = function(state) {
      for (var result = this.regexp_classString(state); state.eat(
        124
        /* | */
      ); )
        this.regexp_classString(state) === CharSetString && (result = CharSetString);
      return result;
    };
    pp$1.regexp_classString = function(state) {
      for (var count = 0; this.regexp_eatClassSetCharacter(state); )
        count++;
      return count === 1 ? CharSetOk : CharSetString;
    };
    pp$1.regexp_eatClassSetCharacter = function(state) {
      var start = state.pos;
      if (state.eat(
        92
        /* \ */
      ))
        return this.regexp_eatCharacterEscape(state) || this.regexp_eatClassSetReservedPunctuator(state) ? !0 : state.eat(
          98
          /* b */
        ) ? (state.lastIntValue = 8, !0) : (state.pos = start, !1);
      var ch = state.current();
      return ch < 0 || ch === state.lookahead() && isClassSetReservedDoublePunctuatorCharacter(ch) || isClassSetSyntaxCharacter(ch) ? !1 : (state.advance(), state.lastIntValue = ch, !0);
    };
    pp$1.regexp_eatClassSetReservedPunctuator = function(state) {
      var ch = state.current();
      return isClassSetReservedPunctuator(ch) ? (state.lastIntValue = ch, state.advance(), !0) : !1;
    };
    pp$1.regexp_eatClassControlLetter = function(state) {
      var ch = state.current();
      return isDecimalDigit(ch) || ch === 95 ? (state.lastIntValue = ch % 32, state.advance(), !0) : !1;
    };
    pp$1.regexp_eatHexEscapeSequence = function(state) {
      var start = state.pos;
      if (state.eat(
        120
        /* x */
      )) {
        if (this.regexp_eatFixedHexDigits(state, 2))
          return !0;
        state.switchU && state.raise("Invalid escape"), state.pos = start;
      }
      return !1;
    };
    pp$1.regexp_eatDecimalDigits = function(state) {
      var start = state.pos, ch = 0;
      for (state.lastIntValue = 0; isDecimalDigit(ch = state.current()); )
        state.lastIntValue = 10 * state.lastIntValue + (ch - 48), state.advance();
      return state.pos !== start;
    };
    pp$1.regexp_eatHexDigits = function(state) {
      var start = state.pos, ch = 0;
      for (state.lastIntValue = 0; isHexDigit(ch = state.current()); )
        state.lastIntValue = 16 * state.lastIntValue + hexToInt(ch), state.advance();
      return state.pos !== start;
    };
    pp$1.regexp_eatLegacyOctalEscapeSequence = function(state) {
      if (this.regexp_eatOctalDigit(state)) {
        var n1 = state.lastIntValue;
        if (this.regexp_eatOctalDigit(state)) {
          var n2 = state.lastIntValue;
          n1 <= 3 && this.regexp_eatOctalDigit(state) ? state.lastIntValue = n1 * 64 + n2 * 8 + state.lastIntValue : state.lastIntValue = n1 * 8 + n2;
        } else
          state.lastIntValue = n1;
        return !0;
      }
      return !1;
    };
    pp$1.regexp_eatOctalDigit = function(state) {
      var ch = state.current();
      return isOctalDigit(ch) ? (state.lastIntValue = ch - 48, state.advance(), !0) : (state.lastIntValue = 0, !1);
    };
    pp$1.regexp_eatFixedHexDigits = function(state, length) {
      var start = state.pos;
      state.lastIntValue = 0;
      for (var i2 = 0; i2 < length; ++i2) {
        var ch = state.current();
        if (!isHexDigit(ch))
          return state.pos = start, !1;
        state.lastIntValue = 16 * state.lastIntValue + hexToInt(ch), state.advance();
      }
      return !0;
    };
    Token = function(p) {
      this.type = p.type, this.value = p.value, this.start = p.start, this.end = p.end, p.options.locations && (this.loc = new SourceLocation(p, p.startLoc, p.endLoc)), p.options.ranges && (this.range = [p.start, p.end]);
    }, pp = Parser.prototype;
    pp.next = function(ignoreEscapeSequenceInKeyword) {
      !ignoreEscapeSequenceInKeyword && this.type.keyword && this.containsEsc && this.raiseRecoverable(this.start, "Escape sequence in keyword " + this.type.keyword), this.options.onToken && this.options.onToken(new Token(this)), this.lastTokEnd = this.end, this.lastTokStart = this.start, this.lastTokEndLoc = this.endLoc, this.lastTokStartLoc = this.startLoc, this.nextToken();
    };
    pp.getToken = function() {
      return this.next(), new Token(this);
    };
    typeof Symbol < "u" && (pp[Symbol.iterator] = function() {
      var this$1$1 = this;
      return {
        next: function() {
          var token = this$1$1.getToken();
          return {
            done: token.type === types$1.eof,
            value: token
          };
        }
      };
    });
    pp.nextToken = function() {
      var curContext = this.curContext();
      if ((!curContext || !curContext.preserveSpace) && this.skipSpace(), this.start = this.pos, this.options.locations && (this.startLoc = this.curPosition()), this.pos >= this.input.length)
        return this.finishToken(types$1.eof);
      if (curContext.override)
        return curContext.override(this);
      this.readToken(this.fullCharCodeAtPos());
    };
    pp.readToken = function(code) {
      return isIdentifierStart(code, this.options.ecmaVersion >= 6) || code === 92 ? this.readWord() : this.getTokenFromCode(code);
    };
    pp.fullCharCodeAtPos = function() {
      var code = this.input.charCodeAt(this.pos);
      if (code <= 55295 || code >= 56320)
        return code;
      var next = this.input.charCodeAt(this.pos + 1);
      return next <= 56319 || next >= 57344 ? code : (code << 10) + next - 56613888;
    };
    pp.skipBlockComment = function() {
      var startLoc = this.options.onComment && this.curPosition(), start = this.pos, end = this.input.indexOf("*/", this.pos += 2);
      if (end === -1 && this.raise(this.pos - 2, "Unterminated comment"), this.pos = end + 2, this.options.locations)
        for (var nextBreak = void 0, pos = start; (nextBreak = nextLineBreak(this.input, pos, this.pos)) > -1; )
          ++this.curLine, pos = this.lineStart = nextBreak;
      this.options.onComment && this.options.onComment(
        !0,
        this.input.slice(start + 2, end),
        start,
        this.pos,
        startLoc,
        this.curPosition()
      );
    };
    pp.skipLineComment = function(startSkip) {
      for (var start = this.pos, startLoc = this.options.onComment && this.curPosition(), ch = this.input.charCodeAt(this.pos += startSkip); this.pos < this.input.length && !isNewLine(ch); )
        ch = this.input.charCodeAt(++this.pos);
      this.options.onComment && this.options.onComment(
        !1,
        this.input.slice(start + startSkip, this.pos),
        start,
        this.pos,
        startLoc,
        this.curPosition()
      );
    };
    pp.skipSpace = function() {
      loop: for (; this.pos < this.input.length; ) {
        var ch = this.input.charCodeAt(this.pos);
        switch (ch) {
          case 32:
          case 160:
            ++this.pos;
            break;
          case 13:
            this.input.charCodeAt(this.pos + 1) === 10 && ++this.pos;
          case 10:
          case 8232:
          case 8233:
            ++this.pos, this.options.locations && (++this.curLine, this.lineStart = this.pos);
            break;
          case 47:
            switch (this.input.charCodeAt(this.pos + 1)) {
              case 42:
                this.skipBlockComment();
                break;
              case 47:
                this.skipLineComment(2);
                break;
              default:
                break loop;
            }
            break;
          default:
            if (ch > 8 && ch < 14 || ch >= 5760 && nonASCIIwhitespace.test(String.fromCharCode(ch)))
              ++this.pos;
            else
              break loop;
        }
      }
    };
    pp.finishToken = function(type, val) {
      this.end = this.pos, this.options.locations && (this.endLoc = this.curPosition());
      var prevType = this.type;
      this.type = type, this.value = val, this.updateContext(prevType);
    };
    pp.readToken_dot = function() {
      var next = this.input.charCodeAt(this.pos + 1);
      if (next >= 48 && next <= 57)
        return this.readNumber(!0);
      var next2 = this.input.charCodeAt(this.pos + 2);
      return this.options.ecmaVersion >= 6 && next === 46 && next2 === 46 ? (this.pos += 3, this.finishToken(types$1.ellipsis)) : (++this.pos, this.finishToken(types$1.dot));
    };
    pp.readToken_slash = function() {
      var next = this.input.charCodeAt(this.pos + 1);
      return this.exprAllowed ? (++this.pos, this.readRegexp()) : next === 61 ? this.finishOp(types$1.assign, 2) : this.finishOp(types$1.slash, 1);
    };
    pp.readToken_mult_modulo_exp = function(code) {
      var next = this.input.charCodeAt(this.pos + 1), size = 1, tokentype = code === 42 ? types$1.star : types$1.modulo;
      return this.options.ecmaVersion >= 7 && code === 42 && next === 42 && (++size, tokentype = types$1.starstar, next = this.input.charCodeAt(this.pos + 2)), next === 61 ? this.finishOp(types$1.assign, size + 1) : this.finishOp(tokentype, size);
    };
    pp.readToken_pipe_amp = function(code) {
      var next = this.input.charCodeAt(this.pos + 1);
      if (next === code) {
        if (this.options.ecmaVersion >= 12) {
          var next2 = this.input.charCodeAt(this.pos + 2);
          if (next2 === 61)
            return this.finishOp(types$1.assign, 3);
        }
        return this.finishOp(code === 124 ? types$1.logicalOR : types$1.logicalAND, 2);
      }
      return next === 61 ? this.finishOp(types$1.assign, 2) : this.finishOp(code === 124 ? types$1.bitwiseOR : types$1.bitwiseAND, 1);
    };
    pp.readToken_caret = function() {
      var next = this.input.charCodeAt(this.pos + 1);
      return next === 61 ? this.finishOp(types$1.assign, 2) : this.finishOp(types$1.bitwiseXOR, 1);
    };
    pp.readToken_plus_min = function(code) {
      var next = this.input.charCodeAt(this.pos + 1);
      return next === code ? next === 45 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 62 && (this.lastTokEnd === 0 || lineBreak.test(this.input.slice(this.lastTokEnd, this.pos))) ? (this.skipLineComment(3), this.skipSpace(), this.nextToken()) : this.finishOp(types$1.incDec, 2) : next === 61 ? this.finishOp(types$1.assign, 2) : this.finishOp(types$1.plusMin, 1);
    };
    pp.readToken_lt_gt = function(code) {
      var next = this.input.charCodeAt(this.pos + 1), size = 1;
      return next === code ? (size = code === 62 && this.input.charCodeAt(this.pos + 2) === 62 ? 3 : 2, this.input.charCodeAt(this.pos + size) === 61 ? this.finishOp(types$1.assign, size + 1) : this.finishOp(types$1.bitShift, size)) : next === 33 && code === 60 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 45 && this.input.charCodeAt(this.pos + 3) === 45 ? (this.skipLineComment(4), this.skipSpace(), this.nextToken()) : (next === 61 && (size = 2), this.finishOp(types$1.relational, size));
    };
    pp.readToken_eq_excl = function(code) {
      var next = this.input.charCodeAt(this.pos + 1);
      return next === 61 ? this.finishOp(types$1.equality, this.input.charCodeAt(this.pos + 2) === 61 ? 3 : 2) : code === 61 && next === 62 && this.options.ecmaVersion >= 6 ? (this.pos += 2, this.finishToken(types$1.arrow)) : this.finishOp(code === 61 ? types$1.eq : types$1.prefix, 1);
    };
    pp.readToken_question = function() {
      var ecmaVersion2 = this.options.ecmaVersion;
      if (ecmaVersion2 >= 11) {
        var next = this.input.charCodeAt(this.pos + 1);
        if (next === 46) {
          var next2 = this.input.charCodeAt(this.pos + 2);
          if (next2 < 48 || next2 > 57)
            return this.finishOp(types$1.questionDot, 2);
        }
        if (next === 63) {
          if (ecmaVersion2 >= 12) {
            var next2$1 = this.input.charCodeAt(this.pos + 2);
            if (next2$1 === 61)
              return this.finishOp(types$1.assign, 3);
          }
          return this.finishOp(types$1.coalesce, 2);
        }
      }
      return this.finishOp(types$1.question, 1);
    };
    pp.readToken_numberSign = function() {
      var ecmaVersion2 = this.options.ecmaVersion, code = 35;
      if (ecmaVersion2 >= 13 && (++this.pos, code = this.fullCharCodeAtPos(), isIdentifierStart(code, !0) || code === 92))
        return this.finishToken(types$1.privateId, this.readWord1());
      this.raise(this.pos, "Unexpected character '" + codePointToString(code) + "'");
    };
    pp.getTokenFromCode = function(code) {
      switch (code) {
        // The interpretation of a dot depends on whether it is followed
        // by a digit or another two dots.
        case 46:
          return this.readToken_dot();
        // Punctuation tokens.
        case 40:
          return ++this.pos, this.finishToken(types$1.parenL);
        case 41:
          return ++this.pos, this.finishToken(types$1.parenR);
        case 59:
          return ++this.pos, this.finishToken(types$1.semi);
        case 44:
          return ++this.pos, this.finishToken(types$1.comma);
        case 91:
          return ++this.pos, this.finishToken(types$1.bracketL);
        case 93:
          return ++this.pos, this.finishToken(types$1.bracketR);
        case 123:
          return ++this.pos, this.finishToken(types$1.braceL);
        case 125:
          return ++this.pos, this.finishToken(types$1.braceR);
        case 58:
          return ++this.pos, this.finishToken(types$1.colon);
        case 96:
          if (this.options.ecmaVersion < 6)
            break;
          return ++this.pos, this.finishToken(types$1.backQuote);
        case 48:
          var next = this.input.charCodeAt(this.pos + 1);
          if (next === 120 || next === 88)
            return this.readRadixNumber(16);
          if (this.options.ecmaVersion >= 6) {
            if (next === 111 || next === 79)
              return this.readRadixNumber(8);
            if (next === 98 || next === 66)
              return this.readRadixNumber(2);
          }
        // Anything else beginning with a digit is an integer, octal
        // number, or float.
        case 49:
        case 50:
        case 51:
        case 52:
        case 53:
        case 54:
        case 55:
        case 56:
        case 57:
          return this.readNumber(!1);
        // Quotes produce strings.
        case 34:
        case 39:
          return this.readString(code);
        // Operators are parsed inline in tiny state machines. '=' (61) is
        // often referred to. `finishOp` simply skips the amount of
        // characters it is given as second argument, and returns a token
        // of the type given by its first argument.
        case 47:
          return this.readToken_slash();
        case 37:
        case 42:
          return this.readToken_mult_modulo_exp(code);
        case 124:
        case 38:
          return this.readToken_pipe_amp(code);
        case 94:
          return this.readToken_caret();
        case 43:
        case 45:
          return this.readToken_plus_min(code);
        case 60:
        case 62:
          return this.readToken_lt_gt(code);
        case 61:
        case 33:
          return this.readToken_eq_excl(code);
        case 63:
          return this.readToken_question();
        case 126:
          return this.finishOp(types$1.prefix, 1);
        case 35:
          return this.readToken_numberSign();
      }
      this.raise(this.pos, "Unexpected character '" + codePointToString(code) + "'");
    };
    pp.finishOp = function(type, size) {
      var str = this.input.slice(this.pos, this.pos + size);
      return this.pos += size, this.finishToken(type, str);
    };
    pp.readRegexp = function() {
      for (var escaped, inClass, start = this.pos; ; ) {
        this.pos >= this.input.length && this.raise(start, "Unterminated regular expression");
        var ch = this.input.charAt(this.pos);
        if (lineBreak.test(ch) && this.raise(start, "Unterminated regular expression"), escaped)
          escaped = !1;
        else {
          if (ch === "[")
            inClass = !0;
          else if (ch === "]" && inClass)
            inClass = !1;
          else if (ch === "/" && !inClass)
            break;
          escaped = ch === "\\";
        }
        ++this.pos;
      }
      var pattern = this.input.slice(start, this.pos);
      ++this.pos;
      var flagsStart = this.pos, flags = this.readWord1();
      this.containsEsc && this.unexpected(flagsStart);
      var state = this.regexpState || (this.regexpState = new RegExpValidationState(this));
      state.reset(start, pattern, flags), this.validateRegExpFlags(state), this.validateRegExpPattern(state);
      var value = null;
      try {
        value = new RegExp(pattern, flags);
      } catch {
      }
      return this.finishToken(types$1.regexp, { pattern, flags, value });
    };
    pp.readInt = function(radix, len, maybeLegacyOctalNumericLiteral) {
      for (var allowSeparators = this.options.ecmaVersion >= 12 && len === void 0, isLegacyOctalNumericLiteral = maybeLegacyOctalNumericLiteral && this.input.charCodeAt(this.pos) === 48, start = this.pos, total = 0, lastCode = 0, i2 = 0, e = len ?? 1 / 0; i2 < e; ++i2, ++this.pos) {
        var code = this.input.charCodeAt(this.pos), val = void 0;
        if (allowSeparators && code === 95) {
          isLegacyOctalNumericLiteral && this.raiseRecoverable(this.pos, "Numeric separator is not allowed in legacy octal numeric literals"), lastCode === 95 && this.raiseRecoverable(this.pos, "Numeric separator must be exactly one underscore"), i2 === 0 && this.raiseRecoverable(this.pos, "Numeric separator is not allowed at the first of digits"), lastCode = code;
          continue;
        }
        if (code >= 97 ? val = code - 97 + 10 : code >= 65 ? val = code - 65 + 10 : code >= 48 && code <= 57 ? val = code - 48 : val = 1 / 0, val >= radix)
          break;
        lastCode = code, total = total * radix + val;
      }
      return allowSeparators && lastCode === 95 && this.raiseRecoverable(this.pos - 1, "Numeric separator is not allowed at the last of digits"), this.pos === start || len != null && this.pos - start !== len ? null : total;
    };
    pp.readRadixNumber = function(radix) {
      var start = this.pos;
      this.pos += 2;
      var val = this.readInt(radix);
      return val == null && this.raise(this.start + 2, "Expected number in radix " + radix), this.options.ecmaVersion >= 11 && this.input.charCodeAt(this.pos) === 110 ? (val = stringToBigInt(this.input.slice(start, this.pos)), ++this.pos) : isIdentifierStart(this.fullCharCodeAtPos()) && this.raise(this.pos, "Identifier directly after number"), this.finishToken(types$1.num, val);
    };
    pp.readNumber = function(startsWithDot) {
      var start = this.pos;
      !startsWithDot && this.readInt(10, void 0, !0) === null && this.raise(start, "Invalid number");
      var octal = this.pos - start >= 2 && this.input.charCodeAt(start) === 48;
      octal && this.strict && this.raise(start, "Invalid number");
      var next = this.input.charCodeAt(this.pos);
      if (!octal && !startsWithDot && this.options.ecmaVersion >= 11 && next === 110) {
        var val$1 = stringToBigInt(this.input.slice(start, this.pos));
        return ++this.pos, isIdentifierStart(this.fullCharCodeAtPos()) && this.raise(this.pos, "Identifier directly after number"), this.finishToken(types$1.num, val$1);
      }
      octal && /[89]/.test(this.input.slice(start, this.pos)) && (octal = !1), next === 46 && !octal && (++this.pos, this.readInt(10), next = this.input.charCodeAt(this.pos)), (next === 69 || next === 101) && !octal && (next = this.input.charCodeAt(++this.pos), (next === 43 || next === 45) && ++this.pos, this.readInt(10) === null && this.raise(start, "Invalid number")), isIdentifierStart(this.fullCharCodeAtPos()) && this.raise(this.pos, "Identifier directly after number");
      var val = stringToNumber(this.input.slice(start, this.pos), octal);
      return this.finishToken(types$1.num, val);
    };
    pp.readCodePoint = function() {
      var ch = this.input.charCodeAt(this.pos), code;
      if (ch === 123) {
        this.options.ecmaVersion < 6 && this.unexpected();
        var codePos = ++this.pos;
        code = this.readHexChar(this.input.indexOf("}", this.pos) - this.pos), ++this.pos, code > 1114111 && this.invalidStringToken(codePos, "Code point out of bounds");
      } else
        code = this.readHexChar(4);
      return code;
    };
    pp.readString = function(quote) {
      for (var out = "", chunkStart = ++this.pos; ; ) {
        this.pos >= this.input.length && this.raise(this.start, "Unterminated string constant");
        var ch = this.input.charCodeAt(this.pos);
        if (ch === quote)
          break;
        ch === 92 ? (out += this.input.slice(chunkStart, this.pos), out += this.readEscapedChar(!1), chunkStart = this.pos) : ch === 8232 || ch === 8233 ? (this.options.ecmaVersion < 10 && this.raise(this.start, "Unterminated string constant"), ++this.pos, this.options.locations && (this.curLine++, this.lineStart = this.pos)) : (isNewLine(ch) && this.raise(this.start, "Unterminated string constant"), ++this.pos);
      }
      return out += this.input.slice(chunkStart, this.pos++), this.finishToken(types$1.string, out);
    };
    INVALID_TEMPLATE_ESCAPE_ERROR = {};
    pp.tryReadTemplateToken = function() {
      this.inTemplateElement = !0;
      try {
        this.readTmplToken();
      } catch (err) {
        if (err === INVALID_TEMPLATE_ESCAPE_ERROR)
          this.readInvalidTemplateToken();
        else
          throw err;
      }
      this.inTemplateElement = !1;
    };
    pp.invalidStringToken = function(position, message) {
      if (this.inTemplateElement && this.options.ecmaVersion >= 9)
        throw INVALID_TEMPLATE_ESCAPE_ERROR;
      this.raise(position, message);
    };
    pp.readTmplToken = function() {
      for (var out = "", chunkStart = this.pos; ; ) {
        this.pos >= this.input.length && this.raise(this.start, "Unterminated template");
        var ch = this.input.charCodeAt(this.pos);
        if (ch === 96 || ch === 36 && this.input.charCodeAt(this.pos + 1) === 123)
          return this.pos === this.start && (this.type === types$1.template || this.type === types$1.invalidTemplate) ? ch === 36 ? (this.pos += 2, this.finishToken(types$1.dollarBraceL)) : (++this.pos, this.finishToken(types$1.backQuote)) : (out += this.input.slice(chunkStart, this.pos), this.finishToken(types$1.template, out));
        if (ch === 92)
          out += this.input.slice(chunkStart, this.pos), out += this.readEscapedChar(!0), chunkStart = this.pos;
        else if (isNewLine(ch)) {
          switch (out += this.input.slice(chunkStart, this.pos), ++this.pos, ch) {
            case 13:
              this.input.charCodeAt(this.pos) === 10 && ++this.pos;
            case 10:
              out += `
`;
              break;
            default:
              out += String.fromCharCode(ch);
              break;
          }
          this.options.locations && (++this.curLine, this.lineStart = this.pos), chunkStart = this.pos;
        } else
          ++this.pos;
      }
    };
    pp.readInvalidTemplateToken = function() {
      for (; this.pos < this.input.length; this.pos++)
        switch (this.input[this.pos]) {
          case "\\":
            ++this.pos;
            break;
          case "$":
            if (this.input[this.pos + 1] !== "{")
              break;
          // fall through
          case "`":
            return this.finishToken(types$1.invalidTemplate, this.input.slice(this.start, this.pos));
          case "\r":
            this.input[this.pos + 1] === `
` && ++this.pos;
          // fall through
          case `
`:
          case "\u2028":
          case "\u2029":
            ++this.curLine, this.lineStart = this.pos + 1;
            break;
        }
      this.raise(this.start, "Unterminated template");
    };
    pp.readEscapedChar = function(inTemplate) {
      var ch = this.input.charCodeAt(++this.pos);
      switch (++this.pos, ch) {
        case 110:
          return `
`;
        // 'n' -> '\n'
        case 114:
          return "\r";
        // 'r' -> '\r'
        case 120:
          return String.fromCharCode(this.readHexChar(2));
        // 'x'
        case 117:
          return codePointToString(this.readCodePoint());
        // 'u'
        case 116:
          return "	";
        // 't' -> '\t'
        case 98:
          return "\b";
        // 'b' -> '\b'
        case 118:
          return "\v";
        // 'v' -> '\u000b'
        case 102:
          return "\f";
        // 'f' -> '\f'
        case 13:
          this.input.charCodeAt(this.pos) === 10 && ++this.pos;
        // '\r\n'
        case 10:
          return this.options.locations && (this.lineStart = this.pos, ++this.curLine), "";
        case 56:
        case 57:
          if (this.strict && this.invalidStringToken(
            this.pos - 1,
            "Invalid escape sequence"
          ), inTemplate) {
            var codePos = this.pos - 1;
            this.invalidStringToken(
              codePos,
              "Invalid escape sequence in template string"
            );
          }
        default:
          if (ch >= 48 && ch <= 55) {
            var octalStr = this.input.substr(this.pos - 1, 3).match(/^[0-7]+/)[0], octal = parseInt(octalStr, 8);
            return octal > 255 && (octalStr = octalStr.slice(0, -1), octal = parseInt(octalStr, 8)), this.pos += octalStr.length - 1, ch = this.input.charCodeAt(this.pos), (octalStr !== "0" || ch === 56 || ch === 57) && (this.strict || inTemplate) && this.invalidStringToken(
              this.pos - 1 - octalStr.length,
              inTemplate ? "Octal literal in template string" : "Octal literal in strict mode"
            ), String.fromCharCode(octal);
          }
          return isNewLine(ch) ? (this.options.locations && (this.lineStart = this.pos, ++this.curLine), "") : String.fromCharCode(ch);
      }
    };
    pp.readHexChar = function(len) {
      var codePos = this.pos, n = this.readInt(16, len);
      return n === null && this.invalidStringToken(codePos, "Bad character escape sequence"), n;
    };
    pp.readWord1 = function() {
      this.containsEsc = !1;
      for (var word = "", first = !0, chunkStart = this.pos, astral = this.options.ecmaVersion >= 6; this.pos < this.input.length; ) {
        var ch = this.fullCharCodeAtPos();
        if (isIdentifierChar(ch, astral))
          this.pos += ch <= 65535 ? 1 : 2;
        else if (ch === 92) {
          this.containsEsc = !0, word += this.input.slice(chunkStart, this.pos);
          var escStart = this.pos;
          this.input.charCodeAt(++this.pos) !== 117 && this.invalidStringToken(this.pos, "Expecting Unicode escape sequence \\uXXXX"), ++this.pos;
          var esc = this.readCodePoint();
          (first ? isIdentifierStart : isIdentifierChar)(esc, astral) || this.invalidStringToken(escStart, "Invalid Unicode escape"), word += codePointToString(esc), chunkStart = this.pos;
        } else
          break;
        first = !1;
      }
      return word + this.input.slice(chunkStart, this.pos);
    };
    pp.readWord = function() {
      var word = this.readWord1(), type = types$1.name;
      return this.keywords.test(word) && (type = keywords[word]), this.finishToken(type, word);
    };
    version = "8.15.0";
    Parser.acorn = {
      Parser,
      version,
      defaultOptions,
      Position,
      SourceLocation,
      getLineInfo,
      Node,
      TokenType,
      tokTypes: types$1,
      keywordTypes: keywords,
      TokContext,
      tokContexts: types,
      isIdentifierChar,
      isIdentifierStart,
      Token,
      isNewLine,
      lineBreak,
      lineBreakG,
      nonASCIIwhitespace
    };
  }
});

// node_modules/acorn-jsx/xhtml.js
var require_xhtml = __commonJS({
  "node_modules/acorn-jsx/xhtml.js"(exports, module) {
    module.exports = {
      quot: '"',
      amp: "&",
      apos: "'",
      lt: "<",
      gt: ">",
      nbsp: "\xA0",
      iexcl: "\xA1",
      cent: "\xA2",
      pound: "\xA3",
      curren: "\xA4",
      yen: "\xA5",
      brvbar: "\xA6",
      sect: "\xA7",
      uml: "\xA8",
      copy: "\xA9",
      ordf: "\xAA",
      laquo: "\xAB",
      not: "\xAC",
      shy: "\xAD",
      reg: "\xAE",
      macr: "\xAF",
      deg: "\xB0",
      plusmn: "\xB1",
      sup2: "\xB2",
      sup3: "\xB3",
      acute: "\xB4",
      micro: "\xB5",
      para: "\xB6",
      middot: "\xB7",
      cedil: "\xB8",
      sup1: "\xB9",
      ordm: "\xBA",
      raquo: "\xBB",
      frac14: "\xBC",
      frac12: "\xBD",
      frac34: "\xBE",
      iquest: "\xBF",
      Agrave: "\xC0",
      Aacute: "\xC1",
      Acirc: "\xC2",
      Atilde: "\xC3",
      Auml: "\xC4",
      Aring: "\xC5",
      AElig: "\xC6",
      Ccedil: "\xC7",
      Egrave: "\xC8",
      Eacute: "\xC9",
      Ecirc: "\xCA",
      Euml: "\xCB",
      Igrave: "\xCC",
      Iacute: "\xCD",
      Icirc: "\xCE",
      Iuml: "\xCF",
      ETH: "\xD0",
      Ntilde: "\xD1",
      Ograve: "\xD2",
      Oacute: "\xD3",
      Ocirc: "\xD4",
      Otilde: "\xD5",
      Ouml: "\xD6",
      times: "\xD7",
      Oslash: "\xD8",
      Ugrave: "\xD9",
      Uacute: "\xDA",
      Ucirc: "\xDB",
      Uuml: "\xDC",
      Yacute: "\xDD",
      THORN: "\xDE",
      szlig: "\xDF",
      agrave: "\xE0",
      aacute: "\xE1",
      acirc: "\xE2",
      atilde: "\xE3",
      auml: "\xE4",
      aring: "\xE5",
      aelig: "\xE6",
      ccedil: "\xE7",
      egrave: "\xE8",
      eacute: "\xE9",
      ecirc: "\xEA",
      euml: "\xEB",
      igrave: "\xEC",
      iacute: "\xED",
      icirc: "\xEE",
      iuml: "\xEF",
      eth: "\xF0",
      ntilde: "\xF1",
      ograve: "\xF2",
      oacute: "\xF3",
      ocirc: "\xF4",
      otilde: "\xF5",
      ouml: "\xF6",
      divide: "\xF7",
      oslash: "\xF8",
      ugrave: "\xF9",
      uacute: "\xFA",
      ucirc: "\xFB",
      uuml: "\xFC",
      yacute: "\xFD",
      thorn: "\xFE",
      yuml: "\xFF",
      OElig: "\u0152",
      oelig: "\u0153",
      Scaron: "\u0160",
      scaron: "\u0161",
      Yuml: "\u0178",
      fnof: "\u0192",
      circ: "\u02C6",
      tilde: "\u02DC",
      Alpha: "\u0391",
      Beta: "\u0392",
      Gamma: "\u0393",
      Delta: "\u0394",
      Epsilon: "\u0395",
      Zeta: "\u0396",
      Eta: "\u0397",
      Theta: "\u0398",
      Iota: "\u0399",
      Kappa: "\u039A",
      Lambda: "\u039B",
      Mu: "\u039C",
      Nu: "\u039D",
      Xi: "\u039E",
      Omicron: "\u039F",
      Pi: "\u03A0",
      Rho: "\u03A1",
      Sigma: "\u03A3",
      Tau: "\u03A4",
      Upsilon: "\u03A5",
      Phi: "\u03A6",
      Chi: "\u03A7",
      Psi: "\u03A8",
      Omega: "\u03A9",
      alpha: "\u03B1",
      beta: "\u03B2",
      gamma: "\u03B3",
      delta: "\u03B4",
      epsilon: "\u03B5",
      zeta: "\u03B6",
      eta: "\u03B7",
      theta: "\u03B8",
      iota: "\u03B9",
      kappa: "\u03BA",
      lambda: "\u03BB",
      mu: "\u03BC",
      nu: "\u03BD",
      xi: "\u03BE",
      omicron: "\u03BF",
      pi: "\u03C0",
      rho: "\u03C1",
      sigmaf: "\u03C2",
      sigma: "\u03C3",
      tau: "\u03C4",
      upsilon: "\u03C5",
      phi: "\u03C6",
      chi: "\u03C7",
      psi: "\u03C8",
      omega: "\u03C9",
      thetasym: "\u03D1",
      upsih: "\u03D2",
      piv: "\u03D6",
      ensp: "\u2002",
      emsp: "\u2003",
      thinsp: "\u2009",
      zwnj: "\u200C",
      zwj: "\u200D",
      lrm: "\u200E",
      rlm: "\u200F",
      ndash: "\u2013",
      mdash: "\u2014",
      lsquo: "\u2018",
      rsquo: "\u2019",
      sbquo: "\u201A",
      ldquo: "\u201C",
      rdquo: "\u201D",
      bdquo: "\u201E",
      dagger: "\u2020",
      Dagger: "\u2021",
      bull: "\u2022",
      hellip: "\u2026",
      permil: "\u2030",
      prime: "\u2032",
      Prime: "\u2033",
      lsaquo: "\u2039",
      rsaquo: "\u203A",
      oline: "\u203E",
      frasl: "\u2044",
      euro: "\u20AC",
      image: "\u2111",
      weierp: "\u2118",
      real: "\u211C",
      trade: "\u2122",
      alefsym: "\u2135",
      larr: "\u2190",
      uarr: "\u2191",
      rarr: "\u2192",
      darr: "\u2193",
      harr: "\u2194",
      crarr: "\u21B5",
      lArr: "\u21D0",
      uArr: "\u21D1",
      rArr: "\u21D2",
      dArr: "\u21D3",
      hArr: "\u21D4",
      forall: "\u2200",
      part: "\u2202",
      exist: "\u2203",
      empty: "\u2205",
      nabla: "\u2207",
      isin: "\u2208",
      notin: "\u2209",
      ni: "\u220B",
      prod: "\u220F",
      sum: "\u2211",
      minus: "\u2212",
      lowast: "\u2217",
      radic: "\u221A",
      prop: "\u221D",
      infin: "\u221E",
      ang: "\u2220",
      and: "\u2227",
      or: "\u2228",
      cap: "\u2229",
      cup: "\u222A",
      int: "\u222B",
      there4: "\u2234",
      sim: "\u223C",
      cong: "\u2245",
      asymp: "\u2248",
      ne: "\u2260",
      equiv: "\u2261",
      le: "\u2264",
      ge: "\u2265",
      sub: "\u2282",
      sup: "\u2283",
      nsub: "\u2284",
      sube: "\u2286",
      supe: "\u2287",
      oplus: "\u2295",
      otimes: "\u2297",
      perp: "\u22A5",
      sdot: "\u22C5",
      lceil: "\u2308",
      rceil: "\u2309",
      lfloor: "\u230A",
      rfloor: "\u230B",
      lang: "\u2329",
      rang: "\u232A",
      loz: "\u25CA",
      spades: "\u2660",
      clubs: "\u2663",
      hearts: "\u2665",
      diams: "\u2666"
    };
  }
});

// node_modules/acorn-jsx/index.js
var require_acorn_jsx = __commonJS({
  "node_modules/acorn-jsx/index.js"(exports, module) {
    "use strict";
    var XHTMLEntities = require_xhtml(), hexNumber = /^[\da-fA-F]+$/, decimalNumber = /^\d+$/, acornJsxMap = /* @__PURE__ */ new WeakMap();
    function getJsxTokens(acorn) {
      acorn = acorn.Parser.acorn || acorn;
      let acornJsx = acornJsxMap.get(acorn);
      if (!acornJsx) {
        let tt = acorn.tokTypes, TokContext3 = acorn.TokContext, TokenType3 = acorn.TokenType, tc_oTag = new TokContext3("<tag", !1), tc_cTag = new TokContext3("</tag", !1), tc_expr = new TokContext3("<tag>...</tag>", !0, !0), tokContexts = {
          tc_oTag,
          tc_cTag,
          tc_expr
        }, tokTypes = {
          jsxName: new TokenType3("jsxName"),
          jsxText: new TokenType3("jsxText", { beforeExpr: !0 }),
          jsxTagStart: new TokenType3("jsxTagStart", { startsExpr: !0 }),
          jsxTagEnd: new TokenType3("jsxTagEnd")
        };
        tokTypes.jsxTagStart.updateContext = function() {
          this.context.push(tc_expr), this.context.push(tc_oTag), this.exprAllowed = !1;
        }, tokTypes.jsxTagEnd.updateContext = function(prevType) {
          let out = this.context.pop();
          out === tc_oTag && prevType === tt.slash || out === tc_cTag ? (this.context.pop(), this.exprAllowed = this.curContext() === tc_expr) : this.exprAllowed = !0;
        }, acornJsx = { tokContexts, tokTypes }, acornJsxMap.set(acorn, acornJsx);
      }
      return acornJsx;
    }
    function getQualifiedJSXName(object) {
      if (!object)
        return object;
      if (object.type === "JSXIdentifier")
        return object.name;
      if (object.type === "JSXNamespacedName")
        return object.namespace.name + ":" + object.name.name;
      if (object.type === "JSXMemberExpression")
        return getQualifiedJSXName(object.object) + "." + getQualifiedJSXName(object.property);
    }
    module.exports = function(options) {
      return options = options || {}, function(Parser3) {
        return plugin({
          allowNamespaces: options.allowNamespaces !== !1,
          allowNamespacedObjects: !!options.allowNamespacedObjects
        }, Parser3);
      };
    };
    Object.defineProperty(module.exports, "tokTypes", {
      get: function() {
        return getJsxTokens((init_acorn(), __toCommonJS(acorn_exports))).tokTypes;
      },
      configurable: !0,
      enumerable: !0
    });
    function plugin(options, Parser3) {
      let acorn = Parser3.acorn || (init_acorn(), __toCommonJS(acorn_exports)), acornJsx = getJsxTokens(acorn), tt = acorn.tokTypes, tok = acornJsx.tokTypes, tokContexts = acorn.tokContexts, tc_oTag = acornJsx.tokContexts.tc_oTag, tc_cTag = acornJsx.tokContexts.tc_cTag, tc_expr = acornJsx.tokContexts.tc_expr, isNewLine2 = acorn.isNewLine, isIdentifierStart2 = acorn.isIdentifierStart, isIdentifierChar2 = acorn.isIdentifierChar;
      return class extends Parser3 {
        // Expose actual `tokTypes` and `tokContexts` to other plugins.
        static get acornJsx() {
          return acornJsx;
        }
        // Reads inline JSX contents token.
        jsx_readToken() {
          let out = "", chunkStart = this.pos;
          for (; ; ) {
            this.pos >= this.input.length && this.raise(this.start, "Unterminated JSX contents");
            let ch = this.input.charCodeAt(this.pos);
            switch (ch) {
              case 60:
              // '<'
              case 123:
                return this.pos === this.start ? ch === 60 && this.exprAllowed ? (++this.pos, this.finishToken(tok.jsxTagStart)) : this.getTokenFromCode(ch) : (out += this.input.slice(chunkStart, this.pos), this.finishToken(tok.jsxText, out));
              case 38:
                out += this.input.slice(chunkStart, this.pos), out += this.jsx_readEntity(), chunkStart = this.pos;
                break;
              case 62:
              // '>'
              case 125:
                this.raise(
                  this.pos,
                  "Unexpected token `" + this.input[this.pos] + "`. Did you mean `" + (ch === 62 ? "&gt;" : "&rbrace;") + '` or `{"' + this.input[this.pos] + '"}`?'
                );
              default:
                isNewLine2(ch) ? (out += this.input.slice(chunkStart, this.pos), out += this.jsx_readNewLine(!0), chunkStart = this.pos) : ++this.pos;
            }
          }
        }
        jsx_readNewLine(normalizeCRLF) {
          let ch = this.input.charCodeAt(this.pos), out;
          return ++this.pos, ch === 13 && this.input.charCodeAt(this.pos) === 10 ? (++this.pos, out = normalizeCRLF ? `
` : `\r
`) : out = String.fromCharCode(ch), this.options.locations && (++this.curLine, this.lineStart = this.pos), out;
        }
        jsx_readString(quote) {
          let out = "", chunkStart = ++this.pos;
          for (; ; ) {
            this.pos >= this.input.length && this.raise(this.start, "Unterminated string constant");
            let ch = this.input.charCodeAt(this.pos);
            if (ch === quote) break;
            ch === 38 ? (out += this.input.slice(chunkStart, this.pos), out += this.jsx_readEntity(), chunkStart = this.pos) : isNewLine2(ch) ? (out += this.input.slice(chunkStart, this.pos), out += this.jsx_readNewLine(!1), chunkStart = this.pos) : ++this.pos;
          }
          return out += this.input.slice(chunkStart, this.pos++), this.finishToken(tt.string, out);
        }
        jsx_readEntity() {
          let str = "", count = 0, entity, ch = this.input[this.pos];
          ch !== "&" && this.raise(this.pos, "Entity must start with an ampersand");
          let startPos = ++this.pos;
          for (; this.pos < this.input.length && count++ < 10; ) {
            if (ch = this.input[this.pos++], ch === ";") {
              str[0] === "#" ? str[1] === "x" ? (str = str.substr(2), hexNumber.test(str) && (entity = String.fromCharCode(parseInt(str, 16)))) : (str = str.substr(1), decimalNumber.test(str) && (entity = String.fromCharCode(parseInt(str, 10)))) : entity = XHTMLEntities[str];
              break;
            }
            str += ch;
          }
          return entity || (this.pos = startPos, "&");
        }
        // Read a JSX identifier (valid tag or attribute name).
        //
        // Optimized version since JSX identifiers can't contain
        // escape characters and so can be read as single slice.
        // Also assumes that first character was already checked
        // by isIdentifierStart in readToken.
        jsx_readWord() {
          let ch, start = this.pos;
          do
            ch = this.input.charCodeAt(++this.pos);
          while (isIdentifierChar2(ch) || ch === 45);
          return this.finishToken(tok.jsxName, this.input.slice(start, this.pos));
        }
        // Parse next token as JSX identifier
        jsx_parseIdentifier() {
          let node = this.startNode();
          return this.type === tok.jsxName ? node.name = this.value : this.type.keyword ? node.name = this.type.keyword : this.unexpected(), this.next(), this.finishNode(node, "JSXIdentifier");
        }
        // Parse namespaced identifier.
        jsx_parseNamespacedName() {
          let startPos = this.start, startLoc = this.startLoc, name = this.jsx_parseIdentifier();
          if (!options.allowNamespaces || !this.eat(tt.colon)) return name;
          var node = this.startNodeAt(startPos, startLoc);
          return node.namespace = name, node.name = this.jsx_parseIdentifier(), this.finishNode(node, "JSXNamespacedName");
        }
        // Parses element name in any form - namespaced, member
        // or single identifier.
        jsx_parseElementName() {
          if (this.type === tok.jsxTagEnd) return "";
          let startPos = this.start, startLoc = this.startLoc, node = this.jsx_parseNamespacedName();
          for (this.type === tt.dot && node.type === "JSXNamespacedName" && !options.allowNamespacedObjects && this.unexpected(); this.eat(tt.dot); ) {
            let newNode = this.startNodeAt(startPos, startLoc);
            newNode.object = node, newNode.property = this.jsx_parseIdentifier(), node = this.finishNode(newNode, "JSXMemberExpression");
          }
          return node;
        }
        // Parses any type of JSX attribute value.
        jsx_parseAttributeValue() {
          switch (this.type) {
            case tt.braceL:
              let node = this.jsx_parseExpressionContainer();
              return node.expression.type === "JSXEmptyExpression" && this.raise(node.start, "JSX attributes must only be assigned a non-empty expression"), node;
            case tok.jsxTagStart:
            case tt.string:
              return this.parseExprAtom();
            default:
              this.raise(this.start, "JSX value should be either an expression or a quoted JSX text");
          }
        }
        // JSXEmptyExpression is unique type since it doesn't actually parse anything,
        // and so it should start at the end of last read token (left brace) and finish
        // at the beginning of the next one (right brace).
        jsx_parseEmptyExpression() {
          let node = this.startNodeAt(this.lastTokEnd, this.lastTokEndLoc);
          return this.finishNodeAt(node, "JSXEmptyExpression", this.start, this.startLoc);
        }
        // Parses JSX expression enclosed into curly brackets.
        jsx_parseExpressionContainer() {
          let node = this.startNode();
          return this.next(), node.expression = this.type === tt.braceR ? this.jsx_parseEmptyExpression() : this.parseExpression(), this.expect(tt.braceR), this.finishNode(node, "JSXExpressionContainer");
        }
        // Parses following JSX attribute name-value pair.
        jsx_parseAttribute() {
          let node = this.startNode();
          return this.eat(tt.braceL) ? (this.expect(tt.ellipsis), node.argument = this.parseMaybeAssign(), this.expect(tt.braceR), this.finishNode(node, "JSXSpreadAttribute")) : (node.name = this.jsx_parseNamespacedName(), node.value = this.eat(tt.eq) ? this.jsx_parseAttributeValue() : null, this.finishNode(node, "JSXAttribute"));
        }
        // Parses JSX opening tag starting after '<'.
        jsx_parseOpeningElementAt(startPos, startLoc) {
          let node = this.startNodeAt(startPos, startLoc);
          node.attributes = [];
          let nodeName = this.jsx_parseElementName();
          for (nodeName && (node.name = nodeName); this.type !== tt.slash && this.type !== tok.jsxTagEnd; )
            node.attributes.push(this.jsx_parseAttribute());
          return node.selfClosing = this.eat(tt.slash), this.expect(tok.jsxTagEnd), this.finishNode(node, nodeName ? "JSXOpeningElement" : "JSXOpeningFragment");
        }
        // Parses JSX closing tag starting after '</'.
        jsx_parseClosingElementAt(startPos, startLoc) {
          let node = this.startNodeAt(startPos, startLoc), nodeName = this.jsx_parseElementName();
          return nodeName && (node.name = nodeName), this.expect(tok.jsxTagEnd), this.finishNode(node, nodeName ? "JSXClosingElement" : "JSXClosingFragment");
        }
        // Parses entire JSX element, including it's opening tag
        // (starting after '<'), attributes, contents and closing tag.
        jsx_parseElementAt(startPos, startLoc) {
          let node = this.startNodeAt(startPos, startLoc), children = [], openingElement = this.jsx_parseOpeningElementAt(startPos, startLoc), closingElement = null;
          if (!openingElement.selfClosing) {
            contents: for (; ; )
              switch (this.type) {
                case tok.jsxTagStart:
                  if (startPos = this.start, startLoc = this.startLoc, this.next(), this.eat(tt.slash)) {
                    closingElement = this.jsx_parseClosingElementAt(startPos, startLoc);
                    break contents;
                  }
                  children.push(this.jsx_parseElementAt(startPos, startLoc));
                  break;
                case tok.jsxText:
                  children.push(this.parseExprAtom());
                  break;
                case tt.braceL:
                  children.push(this.jsx_parseExpressionContainer());
                  break;
                default:
                  this.unexpected();
              }
            getQualifiedJSXName(closingElement.name) !== getQualifiedJSXName(openingElement.name) && this.raise(
              closingElement.start,
              "Expected corresponding JSX closing tag for <" + getQualifiedJSXName(openingElement.name) + ">"
            );
          }
          let fragmentOrElement = openingElement.name ? "Element" : "Fragment";
          return node["opening" + fragmentOrElement] = openingElement, node["closing" + fragmentOrElement] = closingElement, node.children = children, this.type === tt.relational && this.value === "<" && this.raise(this.start, "Adjacent JSX elements must be wrapped in an enclosing tag"), this.finishNode(node, "JSX" + fragmentOrElement);
        }
        // Parse JSX text
        jsx_parseText() {
          let node = this.parseLiteral(this.value);
          return node.type = "JSXText", node;
        }
        // Parses entire JSX element from current position.
        jsx_parseElement() {
          let startPos = this.start, startLoc = this.startLoc;
          return this.next(), this.jsx_parseElementAt(startPos, startLoc);
        }
        parseExprAtom(refShortHandDefaultPos) {
          return this.type === tok.jsxText ? this.jsx_parseText() : this.type === tok.jsxTagStart ? this.jsx_parseElement() : super.parseExprAtom(refShortHandDefaultPos);
        }
        readToken(code) {
          let context = this.curContext();
          if (context === tc_expr) return this.jsx_readToken();
          if (context === tc_oTag || context === tc_cTag) {
            if (isIdentifierStart2(code)) return this.jsx_readWord();
            if (code == 62)
              return ++this.pos, this.finishToken(tok.jsxTagEnd);
            if ((code === 34 || code === 39) && context == tc_oTag)
              return this.jsx_readString(code);
          }
          return code === 60 && this.exprAllowed && this.input.charCodeAt(this.pos + 1) !== 33 ? (++this.pos, this.finishToken(tok.jsxTagStart)) : super.readToken(code);
        }
        updateContext(prevType) {
          if (this.type == tt.braceL) {
            var curContext = this.curContext();
            curContext == tc_oTag ? this.context.push(tokContexts.b_expr) : curContext == tc_expr ? this.context.push(tokContexts.b_tmpl) : super.updateContext(prevType), this.exprAllowed = !0;
          } else if (this.type === tt.slash && prevType === tok.jsxTagStart)
            this.context.length -= 2, this.context.push(tc_cTag), this.exprAllowed = !1;
          else
            return super.updateContext(prevType);
        }
      };
    }
  }
});

// ../../../node_modules/acorn-walk/dist/walk.js
var require_walk = __commonJS({
  "../../../node_modules/acorn-walk/dist/walk.js"(exports, module) {
    (function(global2, factory) {
      typeof exports == "object" && typeof module < "u" ? factory(exports) : typeof define == "function" && define.amd ? define(["exports"], factory) : (global2 = global2 || self, factory((global2.acorn = global2.acorn || {}, global2.acorn.walk = {})));
    })(exports, (function(exports2) {
      "use strict";
      function simple2(node, visitors, baseVisitor, state, override) {
        baseVisitor || (baseVisitor = base2), (function c(node2, st, override2) {
          var type = override2 || node2.type, found = visitors[type];
          baseVisitor[type](node2, st, c), found && found(node2, st);
        })(node, state, override);
      }
      function ancestor2(node, visitors, baseVisitor, state, override) {
        var ancestors = [];
        baseVisitor || (baseVisitor = base2), (function c(node2, st, override2) {
          var type = override2 || node2.type, found = visitors[type], isNew = node2 !== ancestors[ancestors.length - 1];
          isNew && ancestors.push(node2), baseVisitor[type](node2, st, c), found && found(node2, st || ancestors, ancestors), isNew && ancestors.pop();
        })(node, state, override);
      }
      function recursive(node, state, funcs, baseVisitor, override) {
        var visitor = funcs ? make(funcs, baseVisitor || void 0) : baseVisitor;
        (function c(node2, st, override2) {
          visitor[override2 || node2.type](node2, st, c);
        })(node, state, override);
      }
      function makeTest(test) {
        return typeof test == "string" ? function(type) {
          return type === test;
        } : test || function() {
          return !0;
        };
      }
      var Found = function(node, state) {
        this.node = node, this.state = state;
      };
      function full(node, callback, baseVisitor, state, override) {
        baseVisitor || (baseVisitor = base2), (function c(node2, st, override2) {
          var type = override2 || node2.type;
          baseVisitor[type](node2, st, c), override2 || callback(node2, st, type);
        })(node, state, override);
      }
      function fullAncestor(node, callback, baseVisitor, state) {
        baseVisitor || (baseVisitor = base2);
        var ancestors = [];
        (function c(node2, st, override) {
          var type = override || node2.type, isNew = node2 !== ancestors[ancestors.length - 1];
          isNew && ancestors.push(node2), baseVisitor[type](node2, st, c), override || callback(node2, st || ancestors, ancestors, type), isNew && ancestors.pop();
        })(node, state);
      }
      function findNodeAt(node, start, end, test, baseVisitor, state) {
        baseVisitor || (baseVisitor = base2), test = makeTest(test);
        try {
          (function c(node2, st, override) {
            var type = override || node2.type;
            if ((start == null || node2.start <= start) && (end == null || node2.end >= end) && baseVisitor[type](node2, st, c), (start == null || node2.start === start) && (end == null || node2.end === end) && test(type, node2))
              throw new Found(node2, st);
          })(node, state);
        } catch (e) {
          if (e instanceof Found)
            return e;
          throw e;
        }
      }
      function findNodeAround(node, pos, test, baseVisitor, state) {
        test = makeTest(test), baseVisitor || (baseVisitor = base2);
        try {
          (function c(node2, st, override) {
            var type = override || node2.type;
            if (!(node2.start > pos || node2.end < pos) && (baseVisitor[type](node2, st, c), test(type, node2)))
              throw new Found(node2, st);
          })(node, state);
        } catch (e) {
          if (e instanceof Found)
            return e;
          throw e;
        }
      }
      function findNodeAfter(node, pos, test, baseVisitor, state) {
        test = makeTest(test), baseVisitor || (baseVisitor = base2);
        try {
          (function c(node2, st, override) {
            if (!(node2.end < pos)) {
              var type = override || node2.type;
              if (node2.start >= pos && test(type, node2))
                throw new Found(node2, st);
              baseVisitor[type](node2, st, c);
            }
          })(node, state);
        } catch (e) {
          if (e instanceof Found)
            return e;
          throw e;
        }
      }
      function findNodeBefore(node, pos, test, baseVisitor, state) {
        test = makeTest(test), baseVisitor || (baseVisitor = base2);
        var max;
        return (function c(node2, st, override) {
          if (!(node2.start > pos)) {
            var type = override || node2.type;
            node2.end <= pos && (!max || max.node.end < node2.end) && test(type, node2) && (max = new Found(node2, st)), baseVisitor[type](node2, st, c);
          }
        })(node, state), max;
      }
      var create = Object.create || function(proto) {
        function Ctor() {
        }
        return Ctor.prototype = proto, new Ctor();
      };
      function make(funcs, baseVisitor) {
        var visitor = create(baseVisitor || base2);
        for (var type in funcs)
          visitor[type] = funcs[type];
        return visitor;
      }
      function skipThrough(node, st, c) {
        c(node, st);
      }
      function ignore(_node, _st, _c) {
      }
      var base2 = {};
      base2.Program = base2.BlockStatement = function(node, st, c) {
        for (var i2 = 0, list2 = node.body; i2 < list2.length; i2 += 1) {
          var stmt = list2[i2];
          c(stmt, st, "Statement");
        }
      }, base2.Statement = skipThrough, base2.EmptyStatement = ignore, base2.ExpressionStatement = base2.ParenthesizedExpression = base2.ChainExpression = function(node, st, c) {
        return c(node.expression, st, "Expression");
      }, base2.IfStatement = function(node, st, c) {
        c(node.test, st, "Expression"), c(node.consequent, st, "Statement"), node.alternate && c(node.alternate, st, "Statement");
      }, base2.LabeledStatement = function(node, st, c) {
        return c(node.body, st, "Statement");
      }, base2.BreakStatement = base2.ContinueStatement = ignore, base2.WithStatement = function(node, st, c) {
        c(node.object, st, "Expression"), c(node.body, st, "Statement");
      }, base2.SwitchStatement = function(node, st, c) {
        c(node.discriminant, st, "Expression");
        for (var i$1 = 0, list$1 = node.cases; i$1 < list$1.length; i$1 += 1) {
          var cs = list$1[i$1];
          cs.test && c(cs.test, st, "Expression");
          for (var i2 = 0, list2 = cs.consequent; i2 < list2.length; i2 += 1) {
            var cons = list2[i2];
            c(cons, st, "Statement");
          }
        }
      }, base2.SwitchCase = function(node, st, c) {
        node.test && c(node.test, st, "Expression");
        for (var i2 = 0, list2 = node.consequent; i2 < list2.length; i2 += 1) {
          var cons = list2[i2];
          c(cons, st, "Statement");
        }
      }, base2.ReturnStatement = base2.YieldExpression = base2.AwaitExpression = function(node, st, c) {
        node.argument && c(node.argument, st, "Expression");
      }, base2.ThrowStatement = base2.SpreadElement = function(node, st, c) {
        return c(node.argument, st, "Expression");
      }, base2.TryStatement = function(node, st, c) {
        c(node.block, st, "Statement"), node.handler && c(node.handler, st), node.finalizer && c(node.finalizer, st, "Statement");
      }, base2.CatchClause = function(node, st, c) {
        node.param && c(node.param, st, "Pattern"), c(node.body, st, "Statement");
      }, base2.WhileStatement = base2.DoWhileStatement = function(node, st, c) {
        c(node.test, st, "Expression"), c(node.body, st, "Statement");
      }, base2.ForStatement = function(node, st, c) {
        node.init && c(node.init, st, "ForInit"), node.test && c(node.test, st, "Expression"), node.update && c(node.update, st, "Expression"), c(node.body, st, "Statement");
      }, base2.ForInStatement = base2.ForOfStatement = function(node, st, c) {
        c(node.left, st, "ForInit"), c(node.right, st, "Expression"), c(node.body, st, "Statement");
      }, base2.ForInit = function(node, st, c) {
        node.type === "VariableDeclaration" ? c(node, st) : c(node, st, "Expression");
      }, base2.DebuggerStatement = ignore, base2.FunctionDeclaration = function(node, st, c) {
        return c(node, st, "Function");
      }, base2.VariableDeclaration = function(node, st, c) {
        for (var i2 = 0, list2 = node.declarations; i2 < list2.length; i2 += 1) {
          var decl = list2[i2];
          c(decl, st);
        }
      }, base2.VariableDeclarator = function(node, st, c) {
        c(node.id, st, "Pattern"), node.init && c(node.init, st, "Expression");
      }, base2.Function = function(node, st, c) {
        node.id && c(node.id, st, "Pattern");
        for (var i2 = 0, list2 = node.params; i2 < list2.length; i2 += 1) {
          var param = list2[i2];
          c(param, st, "Pattern");
        }
        c(node.body, st, node.expression ? "Expression" : "Statement");
      }, base2.Pattern = function(node, st, c) {
        node.type === "Identifier" ? c(node, st, "VariablePattern") : node.type === "MemberExpression" ? c(node, st, "MemberPattern") : c(node, st);
      }, base2.VariablePattern = ignore, base2.MemberPattern = skipThrough, base2.RestElement = function(node, st, c) {
        return c(node.argument, st, "Pattern");
      }, base2.ArrayPattern = function(node, st, c) {
        for (var i2 = 0, list2 = node.elements; i2 < list2.length; i2 += 1) {
          var elt = list2[i2];
          elt && c(elt, st, "Pattern");
        }
      }, base2.ObjectPattern = function(node, st, c) {
        for (var i2 = 0, list2 = node.properties; i2 < list2.length; i2 += 1) {
          var prop = list2[i2];
          prop.type === "Property" ? (prop.computed && c(prop.key, st, "Expression"), c(prop.value, st, "Pattern")) : prop.type === "RestElement" && c(prop.argument, st, "Pattern");
        }
      }, base2.Expression = skipThrough, base2.ThisExpression = base2.Super = base2.MetaProperty = ignore, base2.ArrayExpression = function(node, st, c) {
        for (var i2 = 0, list2 = node.elements; i2 < list2.length; i2 += 1) {
          var elt = list2[i2];
          elt && c(elt, st, "Expression");
        }
      }, base2.ObjectExpression = function(node, st, c) {
        for (var i2 = 0, list2 = node.properties; i2 < list2.length; i2 += 1) {
          var prop = list2[i2];
          c(prop, st);
        }
      }, base2.FunctionExpression = base2.ArrowFunctionExpression = base2.FunctionDeclaration, base2.SequenceExpression = function(node, st, c) {
        for (var i2 = 0, list2 = node.expressions; i2 < list2.length; i2 += 1) {
          var expr = list2[i2];
          c(expr, st, "Expression");
        }
      }, base2.TemplateLiteral = function(node, st, c) {
        for (var i2 = 0, list2 = node.quasis; i2 < list2.length; i2 += 1) {
          var quasi = list2[i2];
          c(quasi, st);
        }
        for (var i$1 = 0, list$1 = node.expressions; i$1 < list$1.length; i$1 += 1) {
          var expr = list$1[i$1];
          c(expr, st, "Expression");
        }
      }, base2.TemplateElement = ignore, base2.UnaryExpression = base2.UpdateExpression = function(node, st, c) {
        c(node.argument, st, "Expression");
      }, base2.BinaryExpression = base2.LogicalExpression = function(node, st, c) {
        c(node.left, st, "Expression"), c(node.right, st, "Expression");
      }, base2.AssignmentExpression = base2.AssignmentPattern = function(node, st, c) {
        c(node.left, st, "Pattern"), c(node.right, st, "Expression");
      }, base2.ConditionalExpression = function(node, st, c) {
        c(node.test, st, "Expression"), c(node.consequent, st, "Expression"), c(node.alternate, st, "Expression");
      }, base2.NewExpression = base2.CallExpression = function(node, st, c) {
        if (c(node.callee, st, "Expression"), node.arguments)
          for (var i2 = 0, list2 = node.arguments; i2 < list2.length; i2 += 1) {
            var arg = list2[i2];
            c(arg, st, "Expression");
          }
      }, base2.MemberExpression = function(node, st, c) {
        c(node.object, st, "Expression"), node.computed && c(node.property, st, "Expression");
      }, base2.ExportNamedDeclaration = base2.ExportDefaultDeclaration = function(node, st, c) {
        node.declaration && c(node.declaration, st, node.type === "ExportNamedDeclaration" || node.declaration.id ? "Statement" : "Expression"), node.source && c(node.source, st, "Expression");
      }, base2.ExportAllDeclaration = function(node, st, c) {
        node.exported && c(node.exported, st), c(node.source, st, "Expression");
      }, base2.ImportDeclaration = function(node, st, c) {
        for (var i2 = 0, list2 = node.specifiers; i2 < list2.length; i2 += 1) {
          var spec = list2[i2];
          c(spec, st);
        }
        c(node.source, st, "Expression");
      }, base2.ImportExpression = function(node, st, c) {
        c(node.source, st, "Expression");
      }, base2.ImportSpecifier = base2.ImportDefaultSpecifier = base2.ImportNamespaceSpecifier = base2.Identifier = base2.Literal = ignore, base2.TaggedTemplateExpression = function(node, st, c) {
        c(node.tag, st, "Expression"), c(node.quasi, st, "Expression");
      }, base2.ClassDeclaration = base2.ClassExpression = function(node, st, c) {
        return c(node, st, "Class");
      }, base2.Class = function(node, st, c) {
        node.id && c(node.id, st, "Pattern"), node.superClass && c(node.superClass, st, "Expression"), c(node.body, st);
      }, base2.ClassBody = function(node, st, c) {
        for (var i2 = 0, list2 = node.body; i2 < list2.length; i2 += 1) {
          var elt = list2[i2];
          c(elt, st);
        }
      }, base2.MethodDefinition = base2.Property = function(node, st, c) {
        node.computed && c(node.key, st, "Expression"), c(node.value, st, "Expression");
      }, exports2.ancestor = ancestor2, exports2.base = base2, exports2.findNodeAfter = findNodeAfter, exports2.findNodeAround = findNodeAround, exports2.findNodeAt = findNodeAt, exports2.findNodeBefore = findNodeBefore, exports2.full = full, exports2.fullAncestor = fullAncestor, exports2.make = make, exports2.recursive = recursive, exports2.simple = simple2, Object.defineProperty(exports2, "__esModule", { value: !0 });
    }));
  }
});

// ../../../node_modules/html-tags/html-tags.json
var require_html_tags = __commonJS({
  "../../../node_modules/html-tags/html-tags.json"(exports, module) {
    module.exports = [
      "a",
      "abbr",
      "address",
      "area",
      "article",
      "aside",
      "audio",
      "b",
      "base",
      "bdi",
      "bdo",
      "blockquote",
      "body",
      "br",
      "button",
      "canvas",
      "caption",
      "cite",
      "code",
      "col",
      "colgroup",
      "data",
      "datalist",
      "dd",
      "del",
      "details",
      "dfn",
      "dialog",
      "div",
      "dl",
      "dt",
      "em",
      "embed",
      "fieldset",
      "figcaption",
      "figure",
      "footer",
      "form",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "head",
      "header",
      "hgroup",
      "hr",
      "html",
      "i",
      "iframe",
      "img",
      "input",
      "ins",
      "kbd",
      "label",
      "legend",
      "li",
      "link",
      "main",
      "map",
      "mark",
      "math",
      "menu",
      "menuitem",
      "meta",
      "meter",
      "nav",
      "noscript",
      "object",
      "ol",
      "optgroup",
      "option",
      "output",
      "p",
      "param",
      "picture",
      "pre",
      "progress",
      "q",
      "rb",
      "rp",
      "rt",
      "rtc",
      "ruby",
      "s",
      "samp",
      "script",
      "search",
      "section",
      "select",
      "slot",
      "small",
      "source",
      "span",
      "strong",
      "style",
      "sub",
      "summary",
      "sup",
      "svg",
      "table",
      "tbody",
      "td",
      "template",
      "textarea",
      "tfoot",
      "th",
      "thead",
      "time",
      "title",
      "tr",
      "track",
      "u",
      "ul",
      "var",
      "video",
      "wbr"
    ];
  }
});

// ../../../node_modules/html-tags/index.js
var require_html_tags2 = __commonJS({
  "../../../node_modules/html-tags/index.js"(exports, module) {
    "use strict";
    module.exports = require_html_tags();
  }
});

// ../../../node_modules/@base2/pretty-print-object/dist/index.js
var require_dist2 = __commonJS({
  "../../../node_modules/@base2/pretty-print-object/dist/index.js"(exports) {
    "use strict";
    var __assign = exports && exports.__assign || function() {
      return __assign = Object.assign || function(t6) {
        for (var s, i2 = 1, n = arguments.length; i2 < n; i2++) {
          s = arguments[i2];
          for (var p in s) Object.prototype.hasOwnProperty.call(s, p) && (t6[p] = s[p]);
        }
        return t6;
      }, __assign.apply(this, arguments);
    }, __spreadArrays = exports && exports.__spreadArrays || function() {
      for (var s = 0, i2 = 0, il = arguments.length; i2 < il; i2++) s += arguments[i2].length;
      for (var r = Array(s), k = 0, i2 = 0; i2 < il; i2++)
        for (var a = arguments[i2], j = 0, jl = a.length; j < jl; j++, k++)
          r[k] = a[j];
      return r;
    };
    Object.defineProperty(exports, "__esModule", { value: !0 });
    var seen = [];
    function isObj(value) {
      var type = typeof value;
      return value !== null && (type === "object" || type === "function");
    }
    function isRegexp(value) {
      return Object.prototype.toString.call(value) === "[object RegExp]";
    }
    function getOwnEnumPropSymbols(object) {
      return Object.getOwnPropertySymbols(object).filter(function(keySymbol) {
        return Object.prototype.propertyIsEnumerable.call(object, keySymbol);
      });
    }
    function prettyPrint2(input, options, pad) {
      pad === void 0 && (pad = "");
      var defaultOptions2 = {
        indent: "	",
        singleQuotes: !0
      }, combinedOptions = __assign(__assign({}, defaultOptions2), options), tokens;
      combinedOptions.inlineCharacterLimit === void 0 ? tokens = {
        newLine: `
`,
        newLineOrSpace: `
`,
        pad,
        indent: pad + combinedOptions.indent
      } : tokens = {
        newLine: "@@__PRETTY_PRINT_NEW_LINE__@@",
        newLineOrSpace: "@@__PRETTY_PRINT_NEW_LINE_OR_SPACE__@@",
        pad: "@@__PRETTY_PRINT_PAD__@@",
        indent: "@@__PRETTY_PRINT_INDENT__@@"
      };
      var expandWhiteSpace = function(string) {
        if (combinedOptions.inlineCharacterLimit === void 0)
          return string;
        var oneLined = string.replace(new RegExp(tokens.newLine, "g"), "").replace(new RegExp(tokens.newLineOrSpace, "g"), " ").replace(new RegExp(tokens.pad + "|" + tokens.indent, "g"), "");
        return oneLined.length <= combinedOptions.inlineCharacterLimit ? oneLined : string.replace(new RegExp(tokens.newLine + "|" + tokens.newLineOrSpace, "g"), `
`).replace(new RegExp(tokens.pad, "g"), pad).replace(new RegExp(tokens.indent, "g"), pad + combinedOptions.indent);
      };
      if (seen.indexOf(input) !== -1)
        return '"[Circular]"';
      if (input == null || typeof input == "number" || typeof input == "boolean" || typeof input == "function" || typeof input == "symbol" || isRegexp(input))
        return String(input);
      if (input instanceof Date)
        return "new Date('" + input.toISOString() + "')";
      if (Array.isArray(input)) {
        if (input.length === 0)
          return "[]";
        seen.push(input);
        var ret = "[" + tokens.newLine + input.map(function(el, i2) {
          var eol = input.length - 1 === i2 ? tokens.newLine : "," + tokens.newLineOrSpace, value = prettyPrint2(el, combinedOptions, pad + combinedOptions.indent);
          return combinedOptions.transform && (value = combinedOptions.transform(input, i2, value)), tokens.indent + value + eol;
        }).join("") + tokens.pad + "]";
        return seen.pop(), expandWhiteSpace(ret);
      }
      if (isObj(input)) {
        var objKeys_1 = __spreadArrays(Object.keys(input), getOwnEnumPropSymbols(input));
        if (combinedOptions.filter && (objKeys_1 = objKeys_1.filter(function(el) {
          return combinedOptions.filter && combinedOptions.filter(input, el);
        })), objKeys_1.length === 0)
          return "{}";
        seen.push(input);
        var ret = "{" + tokens.newLine + objKeys_1.map(function(el, i2) {
          var eol = objKeys_1.length - 1 === i2 ? tokens.newLine : "," + tokens.newLineOrSpace, isSymbol2 = typeof el == "symbol", isClassic = !isSymbol2 && /^[a-z$_][a-z$_0-9]*$/i.test(el.toString()), key = isSymbol2 || isClassic ? el : prettyPrint2(el, combinedOptions), value = prettyPrint2(input[el], combinedOptions, pad + combinedOptions.indent);
          return combinedOptions.transform && (value = combinedOptions.transform(input, el, value)), tokens.indent + String(key) + ": " + value + eol;
        }).join("") + tokens.pad + "}";
        return seen.pop(), expandWhiteSpace(ret);
      }
      return input = String(input).replace(/[\r\n]/g, function(x) {
        return x === `
` ? "\\n" : "\\r";
      }), combinedOptions.singleQuotes ? (input = input.replace(/\\?'/g, "\\'"), "'" + input + "'") : (input = input.replace(/"/g, '\\"'), '"' + input + '"');
    }
    exports.prettyPrint = prettyPrint2;
  }
});

// ../../../node_modules/react-element-to-jsx-string/node_modules/react-is/cjs/react-is.production.min.js
var require_react_is_production_min = __commonJS({
  "../../../node_modules/react-element-to-jsx-string/node_modules/react-is/cjs/react-is.production.min.js"(exports) {
    "use strict";
    var b = /* @__PURE__ */ Symbol.for("react.element"), c = /* @__PURE__ */ Symbol.for("react.portal"), d = /* @__PURE__ */ Symbol.for("react.fragment"), e = /* @__PURE__ */ Symbol.for("react.strict_mode"), f = /* @__PURE__ */ Symbol.for("react.profiler"), g = /* @__PURE__ */ Symbol.for("react.provider"), h = /* @__PURE__ */ Symbol.for("react.context"), k = /* @__PURE__ */ Symbol.for("react.server_context"), l = /* @__PURE__ */ Symbol.for("react.forward_ref"), m = /* @__PURE__ */ Symbol.for("react.suspense"), n = /* @__PURE__ */ Symbol.for("react.suspense_list"), p = /* @__PURE__ */ Symbol.for("react.memo"), q = /* @__PURE__ */ Symbol.for("react.lazy"), t6 = /* @__PURE__ */ Symbol.for("react.offscreen"), u;
    u = /* @__PURE__ */ Symbol.for("react.module.reference");
    function v(a) {
      if (typeof a == "object" && a !== null) {
        var r = a.$$typeof;
        switch (r) {
          case b:
            switch (a = a.type, a) {
              case d:
              case f:
              case e:
              case m:
              case n:
                return a;
              default:
                switch (a = a && a.$$typeof, a) {
                  case k:
                  case h:
                  case l:
                  case q:
                  case p:
                  case g:
                    return a;
                  default:
                    return r;
                }
            }
          case c:
            return r;
        }
      }
    }
    exports.ContextConsumer = h;
    exports.ContextProvider = g;
    exports.Element = b;
    exports.ForwardRef = l;
    exports.Fragment = d;
    exports.Lazy = q;
    exports.Memo = p;
    exports.Portal = c;
    exports.Profiler = f;
    exports.StrictMode = e;
    exports.Suspense = m;
    exports.SuspenseList = n;
    exports.isAsyncMode = function() {
      return !1;
    };
    exports.isConcurrentMode = function() {
      return !1;
    };
    exports.isContextConsumer = function(a) {
      return v(a) === h;
    };
    exports.isContextProvider = function(a) {
      return v(a) === g;
    };
    exports.isElement = function(a) {
      return typeof a == "object" && a !== null && a.$$typeof === b;
    };
    exports.isForwardRef = function(a) {
      return v(a) === l;
    };
    exports.isFragment = function(a) {
      return v(a) === d;
    };
    exports.isLazy = function(a) {
      return v(a) === q;
    };
    exports.isMemo = function(a) {
      return v(a) === p;
    };
    exports.isPortal = function(a) {
      return v(a) === c;
    };
    exports.isProfiler = function(a) {
      return v(a) === f;
    };
    exports.isStrictMode = function(a) {
      return v(a) === e;
    };
    exports.isSuspense = function(a) {
      return v(a) === m;
    };
    exports.isSuspenseList = function(a) {
      return v(a) === n;
    };
    exports.isValidElementType = function(a) {
      return typeof a == "string" || typeof a == "function" || a === d || a === f || a === e || a === m || a === n || a === t6 || typeof a == "object" && a !== null && (a.$$typeof === q || a.$$typeof === p || a.$$typeof === g || a.$$typeof === h || a.$$typeof === l || a.$$typeof === u || a.getModuleId !== void 0);
    };
    exports.typeOf = v;
  }
});

// ../../../node_modules/react-element-to-jsx-string/node_modules/react-is/cjs/react-is.development.js
var require_react_is_development = __commonJS({
  "../../../node_modules/react-element-to-jsx-string/node_modules/react-is/cjs/react-is.development.js"(exports) {
    "use strict";
    process.env.NODE_ENV !== "production" && (function() {
      "use strict";
      var enableScopeAPI = !1, enableCacheElement = !1, enableTransitionTracing = !1, enableLegacyHidden = !1, enableDebugTracing = !1, REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.element"), REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler"), REACT_PROVIDER_TYPE = /* @__PURE__ */ Symbol.for("react.provider"), REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context"), REACT_SERVER_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.server_context"), REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = /* @__PURE__ */ Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo"), REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy"), REACT_OFFSCREEN_TYPE = /* @__PURE__ */ Symbol.for("react.offscreen"), REACT_MODULE_REFERENCE;
      REACT_MODULE_REFERENCE = /* @__PURE__ */ Symbol.for("react.module.reference");
      function isValidElementType(type) {
        return !!(typeof type == "string" || typeof type == "function" || type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || enableDebugTracing || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || enableLegacyHidden || type === REACT_OFFSCREEN_TYPE || enableScopeAPI || enableCacheElement || enableTransitionTracing || typeof type == "object" && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || // This needs to include all possible module reference object
        // types supported by any Flight configuration anywhere since
        // we don't know which Flight build this will end up being used
        // with.
        type.$$typeof === REACT_MODULE_REFERENCE || type.getModuleId !== void 0));
      }
      function typeOf(object) {
        if (typeof object == "object" && object !== null) {
          var $$typeof = object.$$typeof;
          switch ($$typeof) {
            case REACT_ELEMENT_TYPE:
              var type = object.type;
              switch (type) {
                case REACT_FRAGMENT_TYPE:
                case REACT_PROFILER_TYPE:
                case REACT_STRICT_MODE_TYPE:
                case REACT_SUSPENSE_TYPE:
                case REACT_SUSPENSE_LIST_TYPE:
                  return type;
                default:
                  var $$typeofType = type && type.$$typeof;
                  switch ($$typeofType) {
                    case REACT_SERVER_CONTEXT_TYPE:
                    case REACT_CONTEXT_TYPE:
                    case REACT_FORWARD_REF_TYPE:
                    case REACT_LAZY_TYPE:
                    case REACT_MEMO_TYPE:
                    case REACT_PROVIDER_TYPE:
                      return $$typeofType;
                    default:
                      return $$typeof;
                  }
              }
            case REACT_PORTAL_TYPE:
              return $$typeof;
          }
        }
      }
      var ContextConsumer = REACT_CONTEXT_TYPE, ContextProvider = REACT_PROVIDER_TYPE, Element = REACT_ELEMENT_TYPE, ForwardRef2 = REACT_FORWARD_REF_TYPE, Fragment2 = REACT_FRAGMENT_TYPE, Lazy = REACT_LAZY_TYPE, Memo2 = REACT_MEMO_TYPE, Portal = REACT_PORTAL_TYPE, Profiler = REACT_PROFILER_TYPE, StrictMode = REACT_STRICT_MODE_TYPE, Suspense = REACT_SUSPENSE_TYPE, SuspenseList = REACT_SUSPENSE_LIST_TYPE, hasWarnedAboutDeprecatedIsAsyncMode = !1, hasWarnedAboutDeprecatedIsConcurrentMode = !1;
      function isAsyncMode(object) {
        return hasWarnedAboutDeprecatedIsAsyncMode || (hasWarnedAboutDeprecatedIsAsyncMode = !0, console.warn("The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 18+.")), !1;
      }
      function isConcurrentMode(object) {
        return hasWarnedAboutDeprecatedIsConcurrentMode || (hasWarnedAboutDeprecatedIsConcurrentMode = !0, console.warn("The ReactIs.isConcurrentMode() alias has been deprecated, and will be removed in React 18+.")), !1;
      }
      function isContextConsumer2(object) {
        return typeOf(object) === REACT_CONTEXT_TYPE;
      }
      function isContextProvider2(object) {
        return typeOf(object) === REACT_PROVIDER_TYPE;
      }
      function isElement(object) {
        return typeof object == "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
      }
      function isForwardRef2(object) {
        return typeOf(object) === REACT_FORWARD_REF_TYPE;
      }
      function isFragment(object) {
        return typeOf(object) === REACT_FRAGMENT_TYPE;
      }
      function isLazy2(object) {
        return typeOf(object) === REACT_LAZY_TYPE;
      }
      function isMemo3(object) {
        return typeOf(object) === REACT_MEMO_TYPE;
      }
      function isPortal(object) {
        return typeOf(object) === REACT_PORTAL_TYPE;
      }
      function isProfiler2(object) {
        return typeOf(object) === REACT_PROFILER_TYPE;
      }
      function isStrictMode2(object) {
        return typeOf(object) === REACT_STRICT_MODE_TYPE;
      }
      function isSuspense2(object) {
        return typeOf(object) === REACT_SUSPENSE_TYPE;
      }
      function isSuspenseList(object) {
        return typeOf(object) === REACT_SUSPENSE_LIST_TYPE;
      }
      exports.ContextConsumer = ContextConsumer, exports.ContextProvider = ContextProvider, exports.Element = Element, exports.ForwardRef = ForwardRef2, exports.Fragment = Fragment2, exports.Lazy = Lazy, exports.Memo = Memo2, exports.Portal = Portal, exports.Profiler = Profiler, exports.StrictMode = StrictMode, exports.Suspense = Suspense, exports.SuspenseList = SuspenseList, exports.isAsyncMode = isAsyncMode, exports.isConcurrentMode = isConcurrentMode, exports.isContextConsumer = isContextConsumer2, exports.isContextProvider = isContextProvider2, exports.isElement = isElement, exports.isForwardRef = isForwardRef2, exports.isFragment = isFragment, exports.isLazy = isLazy2, exports.isMemo = isMemo3, exports.isPortal = isPortal, exports.isProfiler = isProfiler2, exports.isStrictMode = isStrictMode2, exports.isSuspense = isSuspense2, exports.isSuspenseList = isSuspenseList, exports.isValidElementType = isValidElementType, exports.typeOf = typeOf;
    })();
  }
});

// ../../../node_modules/react-element-to-jsx-string/node_modules/react-is/index.js
var require_react_is = __commonJS({
  "../../../node_modules/react-element-to-jsx-string/node_modules/react-is/index.js"(exports, module) {
    "use strict";
    process.env.NODE_ENV === "production" ? module.exports = require_react_is_production_min() : module.exports = require_react_is_development();
  }
});

// ../../../node_modules/tsconfig-paths/lib/filesystem.js
var require_filesystem = __commonJS({
  "../../../node_modules/tsconfig-paths/lib/filesystem.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: !0 });
    exports.removeExtension = exports.fileExistsAsync = exports.readJsonFromDiskAsync = exports.readJsonFromDiskSync = exports.fileExistsSync = void 0;
    var fs = __require("fs");
    function fileExistsSync(path5) {
      if (!fs.existsSync(path5))
        return !1;
      try {
        var stats = fs.statSync(path5);
        return stats.isFile();
      } catch {
        return !1;
      }
    }
    exports.fileExistsSync = fileExistsSync;
    function readJsonFromDiskSync(packageJsonPath) {
      if (fs.existsSync(packageJsonPath))
        return __require(packageJsonPath);
    }
    exports.readJsonFromDiskSync = readJsonFromDiskSync;
    function readJsonFromDiskAsync(path5, callback) {
      fs.readFile(path5, "utf8", function(err, result) {
        if (err || !result)
          return callback();
        var json = JSON.parse(result);
        return callback(void 0, json);
      });
    }
    exports.readJsonFromDiskAsync = readJsonFromDiskAsync;
    function fileExistsAsync(path22, callback2) {
      fs.stat(path22, function(err, stats) {
        if (err)
          return callback2(void 0, !1);
        callback2(void 0, stats ? stats.isFile() : !1);
      });
    }
    exports.fileExistsAsync = fileExistsAsync;
    function removeExtension(path5) {
      return path5.substring(0, path5.lastIndexOf(".")) || path5;
    }
    exports.removeExtension = removeExtension;
  }
});

// ../../../node_modules/tsconfig-paths/lib/mapping-entry.js
var require_mapping_entry = __commonJS({
  "../../../node_modules/tsconfig-paths/lib/mapping-entry.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: !0 });
    exports.getAbsoluteMappingEntries = void 0;
    var path5 = __require("path");
    function getAbsoluteMappingEntries(absoluteBaseUrl, paths, addMatchAll) {
      for (var sortedKeys = sortByLongestPrefix(Object.keys(paths)), absolutePaths = [], _i = 0, sortedKeys_1 = sortedKeys; _i < sortedKeys_1.length; _i++) {
        var key = sortedKeys_1[_i];
        absolutePaths.push({
          pattern: key,
          paths: paths[key].map(function(pathToResolve) {
            return path5.resolve(absoluteBaseUrl, pathToResolve);
          })
        });
      }
      return !paths["*"] && addMatchAll && absolutePaths.push({
        pattern: "*",
        paths: ["".concat(absoluteBaseUrl.replace(/\/$/, ""), "/*")]
      }), absolutePaths;
    }
    exports.getAbsoluteMappingEntries = getAbsoluteMappingEntries;
    function sortByLongestPrefix(arr) {
      return arr.concat().sort(function(a, b) {
        return getPrefixLength(b) - getPrefixLength(a);
      });
    }
    function getPrefixLength(pattern) {
      var prefixLength = pattern.indexOf("*");
      return pattern.substr(0, prefixLength).length;
    }
  }
});

// ../../../node_modules/tsconfig-paths/lib/try-path.js
var require_try_path = __commonJS({
  "../../../node_modules/tsconfig-paths/lib/try-path.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: !0 });
    exports.exhaustiveTypeException = exports.getStrippedPath = exports.getPathsToTry = void 0;
    var path5 = __require("path"), path_1 = __require("path"), filesystem_1 = require_filesystem();
    function getPathsToTry(extensions, absolutePathMappings, requestedModule) {
      if (!(!absolutePathMappings || !requestedModule || requestedModule[0] === ".")) {
        for (var pathsToTry = [], _i = 0, absolutePathMappings_1 = absolutePathMappings; _i < absolutePathMappings_1.length; _i++) {
          var entry = absolutePathMappings_1[_i], starMatch = entry.pattern === requestedModule ? "" : matchStar(entry.pattern, requestedModule);
          if (starMatch !== void 0)
            for (var _loop_1 = function(physicalPathPattern2) {
              var physicalPath = physicalPathPattern2.replace("*", starMatch);
              pathsToTry.push({ type: "file", path: physicalPath }), pathsToTry.push.apply(pathsToTry, extensions.map(function(e) {
                return { type: "extension", path: physicalPath + e };
              })), pathsToTry.push({
                type: "package",
                path: path5.join(physicalPath, "/package.json")
              });
              var indexPath = path5.join(physicalPath, "/index");
              pathsToTry.push.apply(pathsToTry, extensions.map(function(e) {
                return { type: "index", path: indexPath + e };
              }));
            }, _a = 0, _b = entry.paths; _a < _b.length; _a++) {
              var physicalPathPattern = _b[_a];
              _loop_1(physicalPathPattern);
            }
        }
        return pathsToTry.length === 0 ? void 0 : pathsToTry;
      }
    }
    exports.getPathsToTry = getPathsToTry;
    function getStrippedPath(tryPath) {
      return tryPath.type === "index" ? (0, path_1.dirname)(tryPath.path) : tryPath.type === "file" ? tryPath.path : tryPath.type === "extension" ? (0, filesystem_1.removeExtension)(tryPath.path) : tryPath.type === "package" ? tryPath.path : exhaustiveTypeException(tryPath.type);
    }
    exports.getStrippedPath = getStrippedPath;
    function exhaustiveTypeException(check) {
      throw new Error("Unknown type ".concat(check));
    }
    exports.exhaustiveTypeException = exhaustiveTypeException;
    function matchStar(pattern, search) {
      if (!(search.length < pattern.length)) {
        if (pattern === "*")
          return search;
        var star = pattern.indexOf("*");
        if (star !== -1) {
          var part1 = pattern.substring(0, star), part2 = pattern.substring(star + 1);
          if (search.substr(0, star) === part1 && search.substr(search.length - part2.length) === part2)
            return search.substr(star, search.length - part2.length);
        }
      }
    }
  }
});

// ../../../node_modules/tsconfig-paths/lib/match-path-sync.js
var require_match_path_sync = __commonJS({
  "../../../node_modules/tsconfig-paths/lib/match-path-sync.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: !0 });
    exports.matchFromAbsolutePaths = exports.createMatchPath = void 0;
    var path5 = __require("path"), Filesystem = require_filesystem(), MappingEntry = require_mapping_entry(), TryPath = require_try_path();
    function createMatchPath2(absoluteBaseUrl, paths, mainFields, addMatchAll) {
      mainFields === void 0 && (mainFields = ["main"]), addMatchAll === void 0 && (addMatchAll = !0);
      var absolutePaths = MappingEntry.getAbsoluteMappingEntries(absoluteBaseUrl, paths, addMatchAll);
      return function(requestedModule, readJson, fileExists, extensions) {
        return matchFromAbsolutePaths(absolutePaths, requestedModule, readJson, fileExists, extensions, mainFields);
      };
    }
    exports.createMatchPath = createMatchPath2;
    function matchFromAbsolutePaths(absolutePathMappings, requestedModule, readJson, fileExists, extensions, mainFields) {
      readJson === void 0 && (readJson = Filesystem.readJsonFromDiskSync), fileExists === void 0 && (fileExists = Filesystem.fileExistsSync), extensions === void 0 && (extensions = Object.keys(__require.extensions)), mainFields === void 0 && (mainFields = ["main"]);
      var tryPaths = TryPath.getPathsToTry(extensions, absolutePathMappings, requestedModule);
      if (tryPaths)
        return findFirstExistingPath(tryPaths, readJson, fileExists, mainFields);
    }
    exports.matchFromAbsolutePaths = matchFromAbsolutePaths;
    function findFirstExistingMainFieldMappedFile(packageJson, mainFields, packageJsonPath, fileExists) {
      for (var index = 0; index < mainFields.length; index++) {
        var mainFieldSelector = mainFields[index], candidateMapping = typeof mainFieldSelector == "string" ? packageJson[mainFieldSelector] : mainFieldSelector.reduce(function(obj, key) {
          return obj[key];
        }, packageJson);
        if (candidateMapping && typeof candidateMapping == "string") {
          var candidateFilePath = path5.join(path5.dirname(packageJsonPath), candidateMapping);
          if (fileExists(candidateFilePath))
            return candidateFilePath;
        }
      }
    }
    function findFirstExistingPath(tryPaths, readJson, fileExists, mainFields) {
      readJson === void 0 && (readJson = Filesystem.readJsonFromDiskSync), mainFields === void 0 && (mainFields = ["main"]);
      for (var _i = 0, tryPaths_1 = tryPaths; _i < tryPaths_1.length; _i++) {
        var tryPath = tryPaths_1[_i];
        if (tryPath.type === "file" || tryPath.type === "extension" || tryPath.type === "index") {
          if (fileExists(tryPath.path))
            return TryPath.getStrippedPath(tryPath);
        } else if (tryPath.type === "package") {
          var packageJson = readJson(tryPath.path);
          if (packageJson) {
            var mainFieldMappedFile = findFirstExistingMainFieldMappedFile(packageJson, mainFields, tryPath.path, fileExists);
            if (mainFieldMappedFile)
              return mainFieldMappedFile;
          }
        } else
          TryPath.exhaustiveTypeException(tryPath.type);
      }
    }
  }
});

// ../../../node_modules/tsconfig-paths/lib/match-path-async.js
var require_match_path_async = __commonJS({
  "../../../node_modules/tsconfig-paths/lib/match-path-async.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: !0 });
    exports.matchFromAbsolutePathsAsync = exports.createMatchPathAsync = void 0;
    var path5 = __require("path"), TryPath = require_try_path(), MappingEntry = require_mapping_entry(), Filesystem = require_filesystem();
    function createMatchPathAsync(absoluteBaseUrl, paths, mainFields, addMatchAll) {
      mainFields === void 0 && (mainFields = ["main"]), addMatchAll === void 0 && (addMatchAll = !0);
      var absolutePaths = MappingEntry.getAbsoluteMappingEntries(absoluteBaseUrl, paths, addMatchAll);
      return function(requestedModule, readJson, fileExists, extensions, callback) {
        return matchFromAbsolutePathsAsync(absolutePaths, requestedModule, readJson, fileExists, extensions, callback, mainFields);
      };
    }
    exports.createMatchPathAsync = createMatchPathAsync;
    function matchFromAbsolutePathsAsync(absolutePathMappings, requestedModule, readJson, fileExists, extensions, callback, mainFields) {
      readJson === void 0 && (readJson = Filesystem.readJsonFromDiskAsync), fileExists === void 0 && (fileExists = Filesystem.fileExistsAsync), extensions === void 0 && (extensions = Object.keys(__require.extensions)), mainFields === void 0 && (mainFields = ["main"]);
      var tryPaths = TryPath.getPathsToTry(extensions, absolutePathMappings, requestedModule);
      if (!tryPaths)
        return callback();
      findFirstExistingPath(tryPaths, readJson, fileExists, callback, 0, mainFields);
    }
    exports.matchFromAbsolutePathsAsync = matchFromAbsolutePathsAsync;
    function findFirstExistingMainFieldMappedFile(packageJson, mainFields, packageJsonPath, fileExistsAsync, doneCallback, index) {
      if (index === void 0 && (index = 0), index >= mainFields.length)
        return doneCallback(void 0, void 0);
      var tryNext = function() {
        return findFirstExistingMainFieldMappedFile(packageJson, mainFields, packageJsonPath, fileExistsAsync, doneCallback, index + 1);
      }, mainFieldSelector = mainFields[index], mainFieldMapping = typeof mainFieldSelector == "string" ? packageJson[mainFieldSelector] : mainFieldSelector.reduce(function(obj, key) {
        return obj[key];
      }, packageJson);
      if (typeof mainFieldMapping != "string")
        return tryNext();
      var mappedFilePath = path5.join(path5.dirname(packageJsonPath), mainFieldMapping);
      fileExistsAsync(mappedFilePath, function(err, exists) {
        return err ? doneCallback(err) : exists ? doneCallback(void 0, mappedFilePath) : tryNext();
      });
    }
    function findFirstExistingPath(tryPaths, readJson, fileExists, doneCallback, index, mainFields) {
      index === void 0 && (index = 0), mainFields === void 0 && (mainFields = ["main"]);
      var tryPath = tryPaths[index];
      tryPath.type === "file" || tryPath.type === "extension" || tryPath.type === "index" ? fileExists(tryPath.path, function(err, exists) {
        return err ? doneCallback(err) : exists ? doneCallback(void 0, TryPath.getStrippedPath(tryPath)) : index === tryPaths.length - 1 ? doneCallback() : findFirstExistingPath(tryPaths, readJson, fileExists, doneCallback, index + 1, mainFields);
      }) : tryPath.type === "package" ? readJson(tryPath.path, function(err, packageJson) {
        return err ? doneCallback(err) : packageJson ? findFirstExistingMainFieldMappedFile(packageJson, mainFields, tryPath.path, fileExists, function(mainFieldErr, mainFieldMappedFile) {
          return mainFieldErr ? doneCallback(mainFieldErr) : mainFieldMappedFile ? doneCallback(void 0, mainFieldMappedFile) : findFirstExistingPath(tryPaths, readJson, fileExists, doneCallback, index + 1, mainFields);
        }) : findFirstExistingPath(tryPaths, readJson, fileExists, doneCallback, index + 1, mainFields);
      }) : TryPath.exhaustiveTypeException(tryPath.type);
    }
  }
});

// ../../../node_modules/json5/lib/unicode.js
var require_unicode = __commonJS({
  "../../../node_modules/json5/lib/unicode.js"(exports, module) {
    module.exports.Space_Separator = /[\u1680\u2000-\u200A\u202F\u205F\u3000]/;
    module.exports.ID_Start = /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312E\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEA\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE83\uDE86-\uDE89\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F\uDFE0\uDFE1]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]/;
    module.exports.ID_Continue = /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u08D4-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u09FC\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9-\u0AFF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D00-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1CD0-\u1CD2\u1CD4-\u1CF9\u1D00-\u1DF9\u1DFB-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312E\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEA\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE3E\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC00-\uDC4A\uDC50-\uDC59\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDE00-\uDE3E\uDE47\uDE50-\uDE83\uDE86-\uDE99\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC36\uDC38-\uDC40\uDC50-\uDC59\uDC72-\uDC8F\uDC92-\uDCA7\uDCA9-\uDCB6\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD47\uDD50-\uDD59]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F\uDFE0\uDFE1]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6\uDD00-\uDD4A\uDD50-\uDD59]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/;
  }
});

// ../../../node_modules/json5/lib/util.js
var require_util2 = __commonJS({
  "../../../node_modules/json5/lib/util.js"(exports, module) {
    var unicode = require_unicode();
    module.exports = {
      isSpaceSeparator(c) {
        return typeof c == "string" && unicode.Space_Separator.test(c);
      },
      isIdStartChar(c) {
        return typeof c == "string" && (c >= "a" && c <= "z" || c >= "A" && c <= "Z" || c === "$" || c === "_" || unicode.ID_Start.test(c));
      },
      isIdContinueChar(c) {
        return typeof c == "string" && (c >= "a" && c <= "z" || c >= "A" && c <= "Z" || c >= "0" && c <= "9" || c === "$" || c === "_" || c === "\u200C" || c === "\u200D" || unicode.ID_Continue.test(c));
      },
      isDigit(c) {
        return typeof c == "string" && /[0-9]/.test(c);
      },
      isHexDigit(c) {
        return typeof c == "string" && /[0-9A-Fa-f]/.test(c);
      }
    };
  }
});

// ../../../node_modules/json5/lib/parse.js
var require_parse = __commonJS({
  "../../../node_modules/json5/lib/parse.js"(exports, module) {
    var util = require_util2(), source, parseState, stack, pos, line, column, token, key, root;
    module.exports = function(text, reviver) {
      source = String(text), parseState = "start", stack = [], pos = 0, line = 1, column = 0, token = void 0, key = void 0, root = void 0;
      do
        token = lex(), parseStates[parseState]();
      while (token.type !== "eof");
      return typeof reviver == "function" ? internalize({ "": root }, "", reviver) : root;
    };
    function internalize(holder, name, reviver) {
      let value = holder[name];
      if (value != null && typeof value == "object")
        if (Array.isArray(value))
          for (let i2 = 0; i2 < value.length; i2++) {
            let key2 = String(i2), replacement = internalize(value, key2, reviver);
            replacement === void 0 ? delete value[key2] : Object.defineProperty(value, key2, {
              value: replacement,
              writable: !0,
              enumerable: !0,
              configurable: !0
            });
          }
        else
          for (let key2 in value) {
            let replacement = internalize(value, key2, reviver);
            replacement === void 0 ? delete value[key2] : Object.defineProperty(value, key2, {
              value: replacement,
              writable: !0,
              enumerable: !0,
              configurable: !0
            });
          }
      return reviver.call(holder, name, value);
    }
    var lexState, buffer, doubleQuote, sign, c;
    function lex() {
      for (lexState = "default", buffer = "", doubleQuote = !1, sign = 1; ; ) {
        c = peek();
        let token2 = lexStates[lexState]();
        if (token2)
          return token2;
      }
    }
    function peek() {
      if (source[pos])
        return String.fromCodePoint(source.codePointAt(pos));
    }
    function read() {
      let c2 = peek();
      return c2 === `
` ? (line++, column = 0) : c2 ? column += c2.length : column++, c2 && (pos += c2.length), c2;
    }
    var lexStates = {
      default() {
        switch (c) {
          case "	":
          case "\v":
          case "\f":
          case " ":
          case "\xA0":
          case "\uFEFF":
          case `
`:
          case "\r":
          case "\u2028":
          case "\u2029":
            read();
            return;
          case "/":
            read(), lexState = "comment";
            return;
          case void 0:
            return read(), newToken("eof");
        }
        if (util.isSpaceSeparator(c)) {
          read();
          return;
        }
        return lexStates[parseState]();
      },
      comment() {
        switch (c) {
          case "*":
            read(), lexState = "multiLineComment";
            return;
          case "/":
            read(), lexState = "singleLineComment";
            return;
        }
        throw invalidChar(read());
      },
      multiLineComment() {
        switch (c) {
          case "*":
            read(), lexState = "multiLineCommentAsterisk";
            return;
          case void 0:
            throw invalidChar(read());
        }
        read();
      },
      multiLineCommentAsterisk() {
        switch (c) {
          case "*":
            read();
            return;
          case "/":
            read(), lexState = "default";
            return;
          case void 0:
            throw invalidChar(read());
        }
        read(), lexState = "multiLineComment";
      },
      singleLineComment() {
        switch (c) {
          case `
`:
          case "\r":
          case "\u2028":
          case "\u2029":
            read(), lexState = "default";
            return;
          case void 0:
            return read(), newToken("eof");
        }
        read();
      },
      value() {
        switch (c) {
          case "{":
          case "[":
            return newToken("punctuator", read());
          case "n":
            return read(), literal2("ull"), newToken("null", null);
          case "t":
            return read(), literal2("rue"), newToken("boolean", !0);
          case "f":
            return read(), literal2("alse"), newToken("boolean", !1);
          case "-":
          case "+":
            read() === "-" && (sign = -1), lexState = "sign";
            return;
          case ".":
            buffer = read(), lexState = "decimalPointLeading";
            return;
          case "0":
            buffer = read(), lexState = "zero";
            return;
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
          case "9":
            buffer = read(), lexState = "decimalInteger";
            return;
          case "I":
            return read(), literal2("nfinity"), newToken("numeric", 1 / 0);
          case "N":
            return read(), literal2("aN"), newToken("numeric", NaN);
          case '"':
          case "'":
            doubleQuote = read() === '"', buffer = "", lexState = "string";
            return;
        }
        throw invalidChar(read());
      },
      identifierNameStartEscape() {
        if (c !== "u")
          throw invalidChar(read());
        read();
        let u = unicodeEscape();
        switch (u) {
          case "$":
          case "_":
            break;
          default:
            if (!util.isIdStartChar(u))
              throw invalidIdentifier();
            break;
        }
        buffer += u, lexState = "identifierName";
      },
      identifierName() {
        switch (c) {
          case "$":
          case "_":
          case "\u200C":
          case "\u200D":
            buffer += read();
            return;
          case "\\":
            read(), lexState = "identifierNameEscape";
            return;
        }
        if (util.isIdContinueChar(c)) {
          buffer += read();
          return;
        }
        return newToken("identifier", buffer);
      },
      identifierNameEscape() {
        if (c !== "u")
          throw invalidChar(read());
        read();
        let u = unicodeEscape();
        switch (u) {
          case "$":
          case "_":
          case "\u200C":
          case "\u200D":
            break;
          default:
            if (!util.isIdContinueChar(u))
              throw invalidIdentifier();
            break;
        }
        buffer += u, lexState = "identifierName";
      },
      sign() {
        switch (c) {
          case ".":
            buffer = read(), lexState = "decimalPointLeading";
            return;
          case "0":
            buffer = read(), lexState = "zero";
            return;
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
          case "9":
            buffer = read(), lexState = "decimalInteger";
            return;
          case "I":
            return read(), literal2("nfinity"), newToken("numeric", sign * (1 / 0));
          case "N":
            return read(), literal2("aN"), newToken("numeric", NaN);
        }
        throw invalidChar(read());
      },
      zero() {
        switch (c) {
          case ".":
            buffer += read(), lexState = "decimalPoint";
            return;
          case "e":
          case "E":
            buffer += read(), lexState = "decimalExponent";
            return;
          case "x":
          case "X":
            buffer += read(), lexState = "hexadecimal";
            return;
        }
        return newToken("numeric", sign * 0);
      },
      decimalInteger() {
        switch (c) {
          case ".":
            buffer += read(), lexState = "decimalPoint";
            return;
          case "e":
          case "E":
            buffer += read(), lexState = "decimalExponent";
            return;
        }
        if (util.isDigit(c)) {
          buffer += read();
          return;
        }
        return newToken("numeric", sign * Number(buffer));
      },
      decimalPointLeading() {
        if (util.isDigit(c)) {
          buffer += read(), lexState = "decimalFraction";
          return;
        }
        throw invalidChar(read());
      },
      decimalPoint() {
        switch (c) {
          case "e":
          case "E":
            buffer += read(), lexState = "decimalExponent";
            return;
        }
        if (util.isDigit(c)) {
          buffer += read(), lexState = "decimalFraction";
          return;
        }
        return newToken("numeric", sign * Number(buffer));
      },
      decimalFraction() {
        switch (c) {
          case "e":
          case "E":
            buffer += read(), lexState = "decimalExponent";
            return;
        }
        if (util.isDigit(c)) {
          buffer += read();
          return;
        }
        return newToken("numeric", sign * Number(buffer));
      },
      decimalExponent() {
        switch (c) {
          case "+":
          case "-":
            buffer += read(), lexState = "decimalExponentSign";
            return;
        }
        if (util.isDigit(c)) {
          buffer += read(), lexState = "decimalExponentInteger";
          return;
        }
        throw invalidChar(read());
      },
      decimalExponentSign() {
        if (util.isDigit(c)) {
          buffer += read(), lexState = "decimalExponentInteger";
          return;
        }
        throw invalidChar(read());
      },
      decimalExponentInteger() {
        if (util.isDigit(c)) {
          buffer += read();
          return;
        }
        return newToken("numeric", sign * Number(buffer));
      },
      hexadecimal() {
        if (util.isHexDigit(c)) {
          buffer += read(), lexState = "hexadecimalInteger";
          return;
        }
        throw invalidChar(read());
      },
      hexadecimalInteger() {
        if (util.isHexDigit(c)) {
          buffer += read();
          return;
        }
        return newToken("numeric", sign * Number(buffer));
      },
      string() {
        switch (c) {
          case "\\":
            read(), buffer += escape4();
            return;
          case '"':
            if (doubleQuote)
              return read(), newToken("string", buffer);
            buffer += read();
            return;
          case "'":
            if (!doubleQuote)
              return read(), newToken("string", buffer);
            buffer += read();
            return;
          case `
`:
          case "\r":
            throw invalidChar(read());
          case "\u2028":
          case "\u2029":
            separatorChar(c);
            break;
          case void 0:
            throw invalidChar(read());
        }
        buffer += read();
      },
      start() {
        switch (c) {
          case "{":
          case "[":
            return newToken("punctuator", read());
        }
        lexState = "value";
      },
      beforePropertyName() {
        switch (c) {
          case "$":
          case "_":
            buffer = read(), lexState = "identifierName";
            return;
          case "\\":
            read(), lexState = "identifierNameStartEscape";
            return;
          case "}":
            return newToken("punctuator", read());
          case '"':
          case "'":
            doubleQuote = read() === '"', lexState = "string";
            return;
        }
        if (util.isIdStartChar(c)) {
          buffer += read(), lexState = "identifierName";
          return;
        }
        throw invalidChar(read());
      },
      afterPropertyName() {
        if (c === ":")
          return newToken("punctuator", read());
        throw invalidChar(read());
      },
      beforePropertyValue() {
        lexState = "value";
      },
      afterPropertyValue() {
        switch (c) {
          case ",":
          case "}":
            return newToken("punctuator", read());
        }
        throw invalidChar(read());
      },
      beforeArrayValue() {
        if (c === "]")
          return newToken("punctuator", read());
        lexState = "value";
      },
      afterArrayValue() {
        switch (c) {
          case ",":
          case "]":
            return newToken("punctuator", read());
        }
        throw invalidChar(read());
      },
      end() {
        throw invalidChar(read());
      }
    };
    function newToken(type, value) {
      return {
        type,
        value,
        line,
        column
      };
    }
    function literal2(s) {
      for (let c2 of s) {
        if (peek() !== c2)
          throw invalidChar(read());
        read();
      }
    }
    function escape4() {
      switch (peek()) {
        case "b":
          return read(), "\b";
        case "f":
          return read(), "\f";
        case "n":
          return read(), `
`;
        case "r":
          return read(), "\r";
        case "t":
          return read(), "	";
        case "v":
          return read(), "\v";
        case "0":
          if (read(), util.isDigit(peek()))
            throw invalidChar(read());
          return "\0";
        case "x":
          return read(), hexEscape();
        case "u":
          return read(), unicodeEscape();
        case `
`:
        case "\u2028":
        case "\u2029":
          return read(), "";
        case "\r":
          return read(), peek() === `
` && read(), "";
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          throw invalidChar(read());
        case void 0:
          throw invalidChar(read());
      }
      return read();
    }
    function hexEscape() {
      let buffer2 = "", c2 = peek();
      if (!util.isHexDigit(c2) || (buffer2 += read(), c2 = peek(), !util.isHexDigit(c2)))
        throw invalidChar(read());
      return buffer2 += read(), String.fromCodePoint(parseInt(buffer2, 16));
    }
    function unicodeEscape() {
      let buffer2 = "", count = 4;
      for (; count-- > 0; ) {
        let c2 = peek();
        if (!util.isHexDigit(c2))
          throw invalidChar(read());
        buffer2 += read();
      }
      return String.fromCodePoint(parseInt(buffer2, 16));
    }
    var parseStates = {
      start() {
        if (token.type === "eof")
          throw invalidEOF();
        push();
      },
      beforePropertyName() {
        switch (token.type) {
          case "identifier":
          case "string":
            key = token.value, parseState = "afterPropertyName";
            return;
          case "punctuator":
            pop();
            return;
          case "eof":
            throw invalidEOF();
        }
      },
      afterPropertyName() {
        if (token.type === "eof")
          throw invalidEOF();
        parseState = "beforePropertyValue";
      },
      beforePropertyValue() {
        if (token.type === "eof")
          throw invalidEOF();
        push();
      },
      beforeArrayValue() {
        if (token.type === "eof")
          throw invalidEOF();
        if (token.type === "punctuator" && token.value === "]") {
          pop();
          return;
        }
        push();
      },
      afterPropertyValue() {
        if (token.type === "eof")
          throw invalidEOF();
        switch (token.value) {
          case ",":
            parseState = "beforePropertyName";
            return;
          case "}":
            pop();
        }
      },
      afterArrayValue() {
        if (token.type === "eof")
          throw invalidEOF();
        switch (token.value) {
          case ",":
            parseState = "beforeArrayValue";
            return;
          case "]":
            pop();
        }
      },
      end() {
      }
    };
    function push() {
      let value;
      switch (token.type) {
        case "punctuator":
          switch (token.value) {
            case "{":
              value = {};
              break;
            case "[":
              value = [];
              break;
          }
          break;
        case "null":
        case "boolean":
        case "numeric":
        case "string":
          value = token.value;
          break;
      }
      if (root === void 0)
        root = value;
      else {
        let parent = stack[stack.length - 1];
        Array.isArray(parent) ? parent.push(value) : Object.defineProperty(parent, key, {
          value,
          writable: !0,
          enumerable: !0,
          configurable: !0
        });
      }
      if (value !== null && typeof value == "object")
        stack.push(value), Array.isArray(value) ? parseState = "beforeArrayValue" : parseState = "beforePropertyName";
      else {
        let current2 = stack[stack.length - 1];
        current2 == null ? parseState = "end" : Array.isArray(current2) ? parseState = "afterArrayValue" : parseState = "afterPropertyValue";
      }
    }
    function pop() {
      stack.pop();
      let current2 = stack[stack.length - 1];
      current2 == null ? parseState = "end" : Array.isArray(current2) ? parseState = "afterArrayValue" : parseState = "afterPropertyValue";
    }
    function invalidChar(c2) {
      return syntaxError(c2 === void 0 ? `JSON5: invalid end of input at ${line}:${column}` : `JSON5: invalid character '${formatChar(c2)}' at ${line}:${column}`);
    }
    function invalidEOF() {
      return syntaxError(`JSON5: invalid end of input at ${line}:${column}`);
    }
    function invalidIdentifier() {
      return column -= 5, syntaxError(`JSON5: invalid identifier character at ${line}:${column}`);
    }
    function separatorChar(c2) {
      console.warn(`JSON5: '${formatChar(c2)}' in strings is not valid ECMAScript; consider escaping`);
    }
    function formatChar(c2) {
      let replacements = {
        "'": "\\'",
        '"': '\\"',
        "\\": "\\\\",
        "\b": "\\b",
        "\f": "\\f",
        "\n": "\\n",
        "\r": "\\r",
        "	": "\\t",
        "\v": "\\v",
        "\0": "\\0",
        "\u2028": "\\u2028",
        "\u2029": "\\u2029"
      };
      if (replacements[c2])
        return replacements[c2];
      if (c2 < " ") {
        let hexString = c2.charCodeAt(0).toString(16);
        return "\\x" + ("00" + hexString).substring(hexString.length);
      }
      return c2;
    }
    function syntaxError(message) {
      let err = new SyntaxError(message);
      return err.lineNumber = line, err.columnNumber = column, err;
    }
  }
});

// ../../../node_modules/json5/lib/stringify.js
var require_stringify = __commonJS({
  "../../../node_modules/json5/lib/stringify.js"(exports, module) {
    var util = require_util2();
    module.exports = function(value, replacer, space) {
      let stack = [], indent2 = "", propertyList, replacerFunc, gap = "", quote;
      if (replacer != null && typeof replacer == "object" && !Array.isArray(replacer) && (space = replacer.space, quote = replacer.quote, replacer = replacer.replacer), typeof replacer == "function")
        replacerFunc = replacer;
      else if (Array.isArray(replacer)) {
        propertyList = [];
        for (let v of replacer) {
          let item;
          typeof v == "string" ? item = v : (typeof v == "number" || v instanceof String || v instanceof Number) && (item = String(v)), item !== void 0 && propertyList.indexOf(item) < 0 && propertyList.push(item);
        }
      }
      return space instanceof Number ? space = Number(space) : space instanceof String && (space = String(space)), typeof space == "number" ? space > 0 && (space = Math.min(10, Math.floor(space)), gap = "          ".substr(0, space)) : typeof space == "string" && (gap = space.substr(0, 10)), serializeProperty("", { "": value });
      function serializeProperty(key, holder) {
        let value2 = holder[key];
        switch (value2 != null && (typeof value2.toJSON5 == "function" ? value2 = value2.toJSON5(key) : typeof value2.toJSON == "function" && (value2 = value2.toJSON(key))), replacerFunc && (value2 = replacerFunc.call(holder, key, value2)), value2 instanceof Number ? value2 = Number(value2) : value2 instanceof String ? value2 = String(value2) : value2 instanceof Boolean && (value2 = value2.valueOf()), value2) {
          case null:
            return "null";
          case !0:
            return "true";
          case !1:
            return "false";
        }
        if (typeof value2 == "string")
          return quoteString(value2, !1);
        if (typeof value2 == "number")
          return String(value2);
        if (typeof value2 == "object")
          return Array.isArray(value2) ? serializeArray(value2) : serializeObject(value2);
      }
      function quoteString(value2) {
        let quotes = {
          "'": 0.1,
          '"': 0.2
        }, replacements = {
          "'": "\\'",
          '"': '\\"',
          "\\": "\\\\",
          "\b": "\\b",
          "\f": "\\f",
          "\n": "\\n",
          "\r": "\\r",
          "	": "\\t",
          "\v": "\\v",
          "\0": "\\0",
          "\u2028": "\\u2028",
          "\u2029": "\\u2029"
        }, product = "";
        for (let i2 = 0; i2 < value2.length; i2++) {
          let c = value2[i2];
          switch (c) {
            case "'":
            case '"':
              quotes[c]++, product += c;
              continue;
            case "\0":
              if (util.isDigit(value2[i2 + 1])) {
                product += "\\x00";
                continue;
              }
          }
          if (replacements[c]) {
            product += replacements[c];
            continue;
          }
          if (c < " ") {
            let hexString = c.charCodeAt(0).toString(16);
            product += "\\x" + ("00" + hexString).substring(hexString.length);
            continue;
          }
          product += c;
        }
        let quoteChar = quote || Object.keys(quotes).reduce((a, b) => quotes[a] < quotes[b] ? a : b);
        return product = product.replace(new RegExp(quoteChar, "g"), replacements[quoteChar]), quoteChar + product + quoteChar;
      }
      function serializeObject(value2) {
        if (stack.indexOf(value2) >= 0)
          throw TypeError("Converting circular structure to JSON5");
        stack.push(value2);
        let stepback = indent2;
        indent2 = indent2 + gap;
        let keys = propertyList || Object.keys(value2), partial = [];
        for (let key of keys) {
          let propertyString = serializeProperty(key, value2);
          if (propertyString !== void 0) {
            let member = serializeKey(key) + ":";
            gap !== "" && (member += " "), member += propertyString, partial.push(member);
          }
        }
        let final;
        if (partial.length === 0)
          final = "{}";
        else {
          let properties;
          if (gap === "")
            properties = partial.join(","), final = "{" + properties + "}";
          else {
            let separator = `,
` + indent2;
            properties = partial.join(separator), final = `{
` + indent2 + properties + `,
` + stepback + "}";
          }
        }
        return stack.pop(), indent2 = stepback, final;
      }
      function serializeKey(key) {
        if (key.length === 0)
          return quoteString(key, !0);
        let firstChar = String.fromCodePoint(key.codePointAt(0));
        if (!util.isIdStartChar(firstChar))
          return quoteString(key, !0);
        for (let i2 = firstChar.length; i2 < key.length; i2++)
          if (!util.isIdContinueChar(String.fromCodePoint(key.codePointAt(i2))))
            return quoteString(key, !0);
        return key;
      }
      function serializeArray(value2) {
        if (stack.indexOf(value2) >= 0)
          throw TypeError("Converting circular structure to JSON5");
        stack.push(value2);
        let stepback = indent2;
        indent2 = indent2 + gap;
        let partial = [];
        for (let i2 = 0; i2 < value2.length; i2++) {
          let propertyString = serializeProperty(String(i2), value2);
          partial.push(propertyString !== void 0 ? propertyString : "null");
        }
        let final;
        if (partial.length === 0)
          final = "[]";
        else if (gap === "")
          final = "[" + partial.join(",") + "]";
        else {
          let separator = `,
` + indent2, properties = partial.join(separator);
          final = `[
` + indent2 + properties + `,
` + stepback + "]";
        }
        return stack.pop(), indent2 = stepback, final;
      }
    };
  }
});

// ../../../node_modules/json5/lib/index.js
var require_lib = __commonJS({
  "../../../node_modules/json5/lib/index.js"(exports, module) {
    var parse8 = require_parse(), stringify2 = require_stringify(), JSON5 = {
      parse: parse8,
      stringify: stringify2
    };
    module.exports = JSON5;
  }
});

// ../../../node_modules/strip-bom/index.js
var require_strip_bom = __commonJS({
  "../../../node_modules/strip-bom/index.js"(exports, module) {
    "use strict";
    module.exports = (x) => {
      if (typeof x != "string")
        throw new TypeError("Expected a string, got " + typeof x);
      return x.charCodeAt(0) === 65279 ? x.slice(1) : x;
    };
  }
});

// ../../../node_modules/tsconfig-paths/lib/tsconfig-loader.js
var require_tsconfig_loader = __commonJS({
  "../../../node_modules/tsconfig-paths/lib/tsconfig-loader.js"(exports) {
    "use strict";
    var __assign = exports && exports.__assign || function() {
      return __assign = Object.assign || function(t6) {
        for (var s, i2 = 1, n = arguments.length; i2 < n; i2++) {
          s = arguments[i2];
          for (var p in s) Object.prototype.hasOwnProperty.call(s, p) && (t6[p] = s[p]);
        }
        return t6;
      }, __assign.apply(this, arguments);
    };
    Object.defineProperty(exports, "__esModule", { value: !0 });
    exports.loadTsconfig = exports.walkForTsConfig = exports.tsConfigLoader = void 0;
    var path5 = __require("path"), fs = __require("fs"), JSON5 = require_lib(), StripBom = require_strip_bom();
    function tsConfigLoader(_a) {
      var getEnv = _a.getEnv, cwd2 = _a.cwd, _b = _a.loadSync, loadSync = _b === void 0 ? loadSyncDefault : _b, TS_NODE_PROJECT = getEnv("TS_NODE_PROJECT"), TS_NODE_BASEURL = getEnv("TS_NODE_BASEURL"), loadResult = loadSync(cwd2, TS_NODE_PROJECT, TS_NODE_BASEURL);
      return loadResult;
    }
    exports.tsConfigLoader = tsConfigLoader;
    function loadSyncDefault(cwd2, filename, baseUrl) {
      var configPath = resolveConfigPath(cwd2, filename);
      if (!configPath)
        return {
          tsConfigPath: void 0,
          baseUrl: void 0,
          paths: void 0
        };
      var config = loadTsconfig(configPath);
      return {
        tsConfigPath: configPath,
        baseUrl: baseUrl || config && config.compilerOptions && config.compilerOptions.baseUrl,
        paths: config && config.compilerOptions && config.compilerOptions.paths
      };
    }
    function resolveConfigPath(cwd2, filename) {
      if (filename) {
        var absolutePath = fs.lstatSync(filename).isDirectory() ? path5.resolve(filename, "./tsconfig.json") : path5.resolve(cwd2, filename);
        return absolutePath;
      }
      if (fs.statSync(cwd2).isFile())
        return path5.resolve(cwd2);
      var configAbsolutePath = walkForTsConfig(cwd2);
      return configAbsolutePath ? path5.resolve(configAbsolutePath) : void 0;
    }
    function walkForTsConfig(directory, readdirSync) {
      readdirSync === void 0 && (readdirSync = fs.readdirSync);
      for (var files = readdirSync(directory), filesToCheck = ["tsconfig.json", "jsconfig.json"], _i = 0, filesToCheck_1 = filesToCheck; _i < filesToCheck_1.length; _i++) {
        var fileToCheck = filesToCheck_1[_i];
        if (files.indexOf(fileToCheck) !== -1)
          return path5.join(directory, fileToCheck);
      }
      var parentDirectory = path5.dirname(directory);
      if (directory !== parentDirectory)
        return walkForTsConfig(parentDirectory, readdirSync);
    }
    exports.walkForTsConfig = walkForTsConfig;
    function loadTsconfig(configFilePath, existsSync4, readFileSync2) {
      if (existsSync4 === void 0 && (existsSync4 = fs.existsSync), readFileSync2 === void 0 && (readFileSync2 = function(filename) {
        return fs.readFileSync(filename, "utf8");
      }), !!existsSync4(configFilePath)) {
        var configString = readFileSync2(configFilePath), cleanedJson = StripBom(configString), config;
        try {
          config = JSON5.parse(cleanedJson);
        } catch (e) {
          throw new Error("".concat(configFilePath, " is malformed ").concat(e.message));
        }
        var extendedConfig = config.extends;
        if (extendedConfig) {
          var base2 = void 0;
          return Array.isArray(extendedConfig) ? base2 = extendedConfig.reduce(function(currBase, extendedConfigElement) {
            return mergeTsconfigs(currBase, loadTsconfigFromExtends(configFilePath, extendedConfigElement, existsSync4, readFileSync2));
          }, {}) : base2 = loadTsconfigFromExtends(configFilePath, extendedConfig, existsSync4, readFileSync2), mergeTsconfigs(base2, config);
        }
        return config;
      }
    }
    exports.loadTsconfig = loadTsconfig;
    function loadTsconfigFromExtends(configFilePath, extendedConfigValue, existsSync4, readFileSync2) {
      var _a;
      typeof extendedConfigValue == "string" && extendedConfigValue.indexOf(".json") === -1 && (extendedConfigValue += ".json");
      var currentDir = path5.dirname(configFilePath), extendedConfigPath = path5.join(currentDir, extendedConfigValue);
      extendedConfigValue.indexOf("/") !== -1 && extendedConfigValue.indexOf(".") !== -1 && !existsSync4(extendedConfigPath) && (extendedConfigPath = path5.join(currentDir, "node_modules", extendedConfigValue));
      var config = loadTsconfig(extendedConfigPath, existsSync4, readFileSync2) || {};
      if (!((_a = config.compilerOptions) === null || _a === void 0) && _a.baseUrl) {
        var extendsDir = path5.dirname(extendedConfigValue);
        config.compilerOptions.baseUrl = path5.join(extendsDir, config.compilerOptions.baseUrl);
      }
      return config;
    }
    function mergeTsconfigs(base2, config) {
      return base2 = base2 || {}, config = config || {}, __assign(__assign(__assign({}, base2), config), { compilerOptions: __assign(__assign({}, base2.compilerOptions), config.compilerOptions) });
    }
  }
});

// ../../../node_modules/tsconfig-paths/lib/config-loader.js
var require_config_loader = __commonJS({
  "../../../node_modules/tsconfig-paths/lib/config-loader.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: !0 });
    exports.configLoader = exports.loadConfig = void 0;
    var TsConfigLoader2 = require_tsconfig_loader(), path5 = __require("path");
    function loadConfig2(cwd2) {
      return cwd2 === void 0 && (cwd2 = process.cwd()), configLoader({ cwd: cwd2 });
    }
    exports.loadConfig = loadConfig2;
    function configLoader(_a) {
      var cwd2 = _a.cwd, explicitParams = _a.explicitParams, _b = _a.tsConfigLoader, tsConfigLoader = _b === void 0 ? TsConfigLoader2.tsConfigLoader : _b;
      if (explicitParams) {
        var absoluteBaseUrl = path5.isAbsolute(explicitParams.baseUrl) ? explicitParams.baseUrl : path5.join(cwd2, explicitParams.baseUrl);
        return {
          resultType: "success",
          configFileAbsolutePath: "",
          baseUrl: explicitParams.baseUrl,
          absoluteBaseUrl,
          paths: explicitParams.paths,
          mainFields: explicitParams.mainFields,
          addMatchAll: explicitParams.addMatchAll
        };
      }
      var loadResult = tsConfigLoader({
        cwd: cwd2,
        getEnv: function(key) {
          return process.env[key];
        }
      });
      return loadResult.tsConfigPath ? {
        resultType: "success",
        configFileAbsolutePath: loadResult.tsConfigPath,
        baseUrl: loadResult.baseUrl,
        absoluteBaseUrl: path5.resolve(path5.dirname(loadResult.tsConfigPath), loadResult.baseUrl || ""),
        paths: loadResult.paths || {},
        addMatchAll: loadResult.baseUrl !== void 0
      } : {
        resultType: "failed",
        message: "Couldn't find tsconfig.json"
      };
    }
    exports.configLoader = configLoader;
  }
});

// ../../../node_modules/minimist/index.js
var require_minimist = __commonJS({
  "../../../node_modules/minimist/index.js"(exports, module) {
    "use strict";
    function hasKey(obj, keys) {
      var o = obj;
      keys.slice(0, -1).forEach(function(key2) {
        o = o[key2] || {};
      });
      var key = keys[keys.length - 1];
      return key in o;
    }
    function isNumber(x) {
      return typeof x == "number" || /^0x[0-9a-f]+$/i.test(x) ? !0 : /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(x);
    }
    function isConstructorOrProto(obj, key) {
      return key === "constructor" && typeof obj[key] == "function" || key === "__proto__";
    }
    module.exports = function(args, opts) {
      opts || (opts = {});
      var flags = {
        bools: {},
        strings: {},
        unknownFn: null
      };
      typeof opts.unknown == "function" && (flags.unknownFn = opts.unknown), typeof opts.boolean == "boolean" && opts.boolean ? flags.allBools = !0 : [].concat(opts.boolean).filter(Boolean).forEach(function(key2) {
        flags.bools[key2] = !0;
      });
      var aliases = {};
      function aliasIsBoolean(key2) {
        return aliases[key2].some(function(x) {
          return flags.bools[x];
        });
      }
      Object.keys(opts.alias || {}).forEach(function(key2) {
        aliases[key2] = [].concat(opts.alias[key2]), aliases[key2].forEach(function(x) {
          aliases[x] = [key2].concat(aliases[key2].filter(function(y) {
            return x !== y;
          }));
        });
      }), [].concat(opts.string).filter(Boolean).forEach(function(key2) {
        flags.strings[key2] = !0, aliases[key2] && [].concat(aliases[key2]).forEach(function(k) {
          flags.strings[k] = !0;
        });
      });
      var defaults = opts.default || {}, argv = { _: [] };
      function argDefined(key2, arg2) {
        return flags.allBools && /^--[^=]+$/.test(arg2) || flags.strings[key2] || flags.bools[key2] || aliases[key2];
      }
      function setKey(obj, keys, value2) {
        for (var o = obj, i3 = 0; i3 < keys.length - 1; i3++) {
          var key2 = keys[i3];
          if (isConstructorOrProto(o, key2))
            return;
          o[key2] === void 0 && (o[key2] = {}), (o[key2] === Object.prototype || o[key2] === Number.prototype || o[key2] === String.prototype) && (o[key2] = {}), o[key2] === Array.prototype && (o[key2] = []), o = o[key2];
        }
        var lastKey = keys[keys.length - 1];
        isConstructorOrProto(o, lastKey) || ((o === Object.prototype || o === Number.prototype || o === String.prototype) && (o = {}), o === Array.prototype && (o = []), o[lastKey] === void 0 || flags.bools[lastKey] || typeof o[lastKey] == "boolean" ? o[lastKey] = value2 : Array.isArray(o[lastKey]) ? o[lastKey].push(value2) : o[lastKey] = [o[lastKey], value2]);
      }
      function setArg(key2, val, arg2) {
        if (!(arg2 && flags.unknownFn && !argDefined(key2, arg2) && flags.unknownFn(arg2) === !1)) {
          var value2 = !flags.strings[key2] && isNumber(val) ? Number(val) : val;
          setKey(argv, key2.split("."), value2), (aliases[key2] || []).forEach(function(x) {
            setKey(argv, x.split("."), value2);
          });
        }
      }
      Object.keys(flags.bools).forEach(function(key2) {
        setArg(key2, defaults[key2] === void 0 ? !1 : defaults[key2]);
      });
      var notFlags = [];
      args.indexOf("--") !== -1 && (notFlags = args.slice(args.indexOf("--") + 1), args = args.slice(0, args.indexOf("--")));
      for (var i2 = 0; i2 < args.length; i2++) {
        var arg = args[i2], key, next;
        if (/^--.+=/.test(arg)) {
          var m = arg.match(/^--([^=]+)=([\s\S]*)$/);
          key = m[1];
          var value = m[2];
          flags.bools[key] && (value = value !== "false"), setArg(key, value, arg);
        } else if (/^--no-.+/.test(arg))
          key = arg.match(/^--no-(.+)/)[1], setArg(key, !1, arg);
        else if (/^--.+/.test(arg))
          key = arg.match(/^--(.+)/)[1], next = args[i2 + 1], next !== void 0 && !/^(-|--)[^-]/.test(next) && !flags.bools[key] && !flags.allBools && (!aliases[key] || !aliasIsBoolean(key)) ? (setArg(key, next, arg), i2 += 1) : /^(true|false)$/.test(next) ? (setArg(key, next === "true", arg), i2 += 1) : setArg(key, flags.strings[key] ? "" : !0, arg);
        else if (/^-[^-]+/.test(arg)) {
          for (var letters = arg.slice(1, -1).split(""), broken = !1, j = 0; j < letters.length; j++) {
            if (next = arg.slice(j + 2), next === "-") {
              setArg(letters[j], next, arg);
              continue;
            }
            if (/[A-Za-z]/.test(letters[j]) && next[0] === "=") {
              setArg(letters[j], next.slice(1), arg), broken = !0;
              break;
            }
            if (/[A-Za-z]/.test(letters[j]) && /-?\d+(\.\d*)?(e-?\d+)?$/.test(next)) {
              setArg(letters[j], next, arg), broken = !0;
              break;
            }
            if (letters[j + 1] && letters[j + 1].match(/\W/)) {
              setArg(letters[j], arg.slice(j + 2), arg), broken = !0;
              break;
            } else
              setArg(letters[j], flags.strings[letters[j]] ? "" : !0, arg);
          }
          key = arg.slice(-1)[0], !broken && key !== "-" && (args[i2 + 1] && !/^(-|--)[^-]/.test(args[i2 + 1]) && !flags.bools[key] && (!aliases[key] || !aliasIsBoolean(key)) ? (setArg(key, args[i2 + 1], arg), i2 += 1) : args[i2 + 1] && /^(true|false)$/.test(args[i2 + 1]) ? (setArg(key, args[i2 + 1] === "true", arg), i2 += 1) : setArg(key, flags.strings[key] ? "" : !0, arg));
        } else if ((!flags.unknownFn || flags.unknownFn(arg) !== !1) && argv._.push(flags.strings._ || !isNumber(arg) ? arg : Number(arg)), opts.stopEarly) {
          argv._.push.apply(argv._, args.slice(i2 + 1));
          break;
        }
      }
      return Object.keys(defaults).forEach(function(k) {
        hasKey(argv, k.split(".")) || (setKey(argv, k.split("."), defaults[k]), (aliases[k] || []).forEach(function(x) {
          setKey(argv, x.split("."), defaults[k]);
        }));
      }), opts["--"] ? argv["--"] = notFlags.slice() : notFlags.forEach(function(k) {
        argv._.push(k);
      }), argv;
    };
  }
});

// ../../../node_modules/tsconfig-paths/lib/register.js
var require_register = __commonJS({
  "../../../node_modules/tsconfig-paths/lib/register.js"(exports) {
    "use strict";
    var __spreadArray = exports && exports.__spreadArray || function(to, from, pack) {
      if (pack || arguments.length === 2) for (var i2 = 0, l = from.length, ar; i2 < l; i2++)
        (ar || !(i2 in from)) && (ar || (ar = Array.prototype.slice.call(from, 0, i2)), ar[i2] = from[i2]);
      return to.concat(ar || Array.prototype.slice.call(from));
    };
    Object.defineProperty(exports, "__esModule", { value: !0 });
    exports.register = void 0;
    var match_path_sync_1 = require_match_path_sync(), config_loader_1 = require_config_loader(), noOp = function() {
    };
    function getCoreModules(builtinModules) {
      builtinModules = builtinModules || [
        "assert",
        "buffer",
        "child_process",
        "cluster",
        "crypto",
        "dgram",
        "dns",
        "domain",
        "events",
        "fs",
        "http",
        "https",
        "net",
        "os",
        "path",
        "punycode",
        "querystring",
        "readline",
        "stream",
        "string_decoder",
        "tls",
        "tty",
        "url",
        "util",
        "v8",
        "vm",
        "zlib"
      ];
      for (var coreModules = {}, _i = 0, builtinModules_1 = builtinModules; _i < builtinModules_1.length; _i++) {
        var module_1 = builtinModules_1[_i];
        coreModules[module_1] = !0;
      }
      return coreModules;
    }
    function register2(params) {
      var cwd2, explicitParams;
      if (params)
        cwd2 = params.cwd, (params.baseUrl || params.paths) && (explicitParams = params);
      else {
        var minimist = require_minimist(), argv = minimist(process.argv.slice(2), {
          // eslint-disable-next-line id-denylist
          string: ["project"],
          alias: {
            project: ["P"]
          }
        });
        cwd2 = argv.project;
      }
      var configLoaderResult = (0, config_loader_1.configLoader)({
        cwd: cwd2 ?? process.cwd(),
        explicitParams
      });
      if (configLoaderResult.resultType === "failed")
        return console.warn("".concat(configLoaderResult.message, ". tsconfig-paths will be skipped")), noOp;
      var matchPath2 = (0, match_path_sync_1.createMatchPath)(configLoaderResult.absoluteBaseUrl, configLoaderResult.paths, configLoaderResult.mainFields, configLoaderResult.addMatchAll), Module = __require("module"), originalResolveFilename = Module._resolveFilename, coreModules = getCoreModules(Module.builtinModules);
      return Module._resolveFilename = function(request, _parent) {
        var isCoreModule = coreModules.hasOwnProperty(request);
        if (!isCoreModule) {
          var found = matchPath2(request);
          if (found) {
            var modifiedArguments = __spreadArray([found], [].slice.call(arguments, 1), !0);
            return originalResolveFilename.apply(this, modifiedArguments);
          }
        }
        return originalResolveFilename.apply(this, arguments);
      }, function() {
        Module._resolveFilename = originalResolveFilename;
      };
    }
    exports.register = register2;
  }
});

// ../../../node_modules/tsconfig-paths/lib/index.js
var require_lib2 = __commonJS({
  "../../../node_modules/tsconfig-paths/lib/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: !0 });
    exports.loadConfig = exports.register = exports.matchFromAbsolutePathsAsync = exports.createMatchPathAsync = exports.matchFromAbsolutePaths = exports.createMatchPath = void 0;
    var match_path_sync_1 = require_match_path_sync();
    Object.defineProperty(exports, "createMatchPath", { enumerable: !0, get: function() {
      return match_path_sync_1.createMatchPath;
    } });
    Object.defineProperty(exports, "matchFromAbsolutePaths", { enumerable: !0, get: function() {
      return match_path_sync_1.matchFromAbsolutePaths;
    } });
    var match_path_async_1 = require_match_path_async();
    Object.defineProperty(exports, "createMatchPathAsync", { enumerable: !0, get: function() {
      return match_path_async_1.createMatchPathAsync;
    } });
    Object.defineProperty(exports, "matchFromAbsolutePathsAsync", { enumerable: !0, get: function() {
      return match_path_async_1.matchFromAbsolutePathsAsync;
    } });
    var register_1 = require_register();
    Object.defineProperty(exports, "register", { enumerable: !0, get: function() {
      return register_1.register;
    } });
    var config_loader_1 = require_config_loader();
    Object.defineProperty(exports, "loadConfig", { enumerable: !0, get: function() {
      return config_loader_1.loadConfig;
    } });
  }
});

// ../../../node_modules/resolve/lib/homedir.js
var require_homedir = __commonJS({
  "../../../node_modules/resolve/lib/homedir.js"(exports, module) {
    "use strict";
    var os = __require("os");
    module.exports = os.homedir || function() {
      var home = process.env.HOME, user = process.env.LOGNAME || process.env.USER || process.env.LNAME || process.env.USERNAME;
      return process.platform === "win32" ? process.env.USERPROFILE || process.env.HOMEDRIVE + process.env.HOMEPATH || home || null : process.platform === "darwin" ? home || (user ? "/Users/" + user : null) : process.platform === "linux" ? home || (process.getuid() === 0 ? "/root" : user ? "/home/" + user : null) : home || null;
    };
  }
});

// ../../../node_modules/resolve/lib/caller.js
var require_caller = __commonJS({
  "../../../node_modules/resolve/lib/caller.js"(exports, module) {
    module.exports = function() {
      var origPrepareStackTrace = Error.prepareStackTrace;
      Error.prepareStackTrace = function(_, stack2) {
        return stack2;
      };
      var stack = new Error().stack;
      return Error.prepareStackTrace = origPrepareStackTrace, stack[2].getFileName();
    };
  }
});

// ../../../node_modules/path-parse/index.js
var require_path_parse = __commonJS({
  "../../../node_modules/path-parse/index.js"(exports, module) {
    "use strict";
    var isWindows2 = process.platform === "win32", splitWindowsRe = /^(((?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?[\\\/]?)(?:[^\\\/]*[\\\/])*)((\.{1,2}|[^\\\/]+?|)(\.[^.\/\\]*|))[\\\/]*$/, win32 = {};
    function win32SplitPath(filename) {
      return splitWindowsRe.exec(filename).slice(1);
    }
    win32.parse = function(pathString) {
      if (typeof pathString != "string")
        throw new TypeError(
          "Parameter 'pathString' must be a string, not " + typeof pathString
        );
      var allParts = win32SplitPath(pathString);
      if (!allParts || allParts.length !== 5)
        throw new TypeError("Invalid path '" + pathString + "'");
      return {
        root: allParts[1],
        dir: allParts[0] === allParts[1] ? allParts[0] : allParts[0].slice(0, -1),
        base: allParts[2],
        ext: allParts[4],
        name: allParts[3]
      };
    };
    var splitPathRe = /^((\/?)(?:[^\/]*\/)*)((\.{1,2}|[^\/]+?|)(\.[^.\/]*|))[\/]*$/, posix = {};
    function posixSplitPath(filename) {
      return splitPathRe.exec(filename).slice(1);
    }
    posix.parse = function(pathString) {
      if (typeof pathString != "string")
        throw new TypeError(
          "Parameter 'pathString' must be a string, not " + typeof pathString
        );
      var allParts = posixSplitPath(pathString);
      if (!allParts || allParts.length !== 5)
        throw new TypeError("Invalid path '" + pathString + "'");
      return {
        root: allParts[1],
        dir: allParts[0].slice(0, -1),
        base: allParts[2],
        ext: allParts[4],
        name: allParts[3]
      };
    };
    isWindows2 ? module.exports = win32.parse : module.exports = posix.parse;
    module.exports.posix = posix.parse;
    module.exports.win32 = win32.parse;
  }
});

// ../../../node_modules/resolve/lib/node-modules-paths.js
var require_node_modules_paths = __commonJS({
  "../../../node_modules/resolve/lib/node-modules-paths.js"(exports, module) {
    var path5 = __require("path"), parse8 = path5.parse || require_path_parse(), driveLetterRegex = /^([A-Za-z]:)/, uncPathRegex = /^\\\\/, getNodeModulesDirs = function(absoluteStart, modules) {
      var prefix = "/";
      driveLetterRegex.test(absoluteStart) ? prefix = "" : uncPathRegex.test(absoluteStart) && (prefix = "\\\\");
      for (var paths = [absoluteStart], parsed = parse8(absoluteStart); parsed.dir !== paths[paths.length - 1]; )
        paths.push(parsed.dir), parsed = parse8(parsed.dir);
      return paths.reduce(function(dirs, aPath) {
        return dirs.concat(modules.map(function(moduleDir) {
          return path5.resolve(prefix, aPath, moduleDir);
        }));
      }, []);
    };
    module.exports = function(start, opts, request) {
      var modules = opts && opts.moduleDirectory ? [].concat(opts.moduleDirectory) : ["node_modules"];
      if (opts && typeof opts.paths == "function")
        return opts.paths(
          request,
          start,
          function() {
            return getNodeModulesDirs(start, modules);
          },
          opts
        );
      var dirs = getNodeModulesDirs(start, modules);
      return opts && opts.paths ? dirs.concat(opts.paths) : dirs;
    };
  }
});

// ../../../node_modules/resolve/lib/normalize-options.js
var require_normalize_options = __commonJS({
  "../../../node_modules/resolve/lib/normalize-options.js"(exports, module) {
    var path5 = __require("path");
    module.exports = function(_, opts) {
      if (opts = opts || {}, opts.forceNodeResolution || !process.versions.pnp)
        return opts;
      let { findPnpApi } = __require("module"), runPnpResolution = (request, basedir) => {
        let parts = request.match(/^((?:@[^/]+\/)?[^/]+)(\/.*)?/);
        if (!parts)
          throw new Error(`Assertion failed: Expected the "resolve" package to call the "paths" callback with package names only (got "${request}")`);
        basedir.charAt(basedir.length - 1) !== "/" && (basedir = path5.join(basedir, "/"));
        let api = findPnpApi(basedir);
        if (api === null)
          return;
        let manifestPath;
        try {
          manifestPath = api.resolveToUnqualified(`${parts[1]}/package.json`, basedir, { considerBuiltins: !1 });
        } catch {
          return null;
        }
        if (manifestPath === null)
          throw new Error(`Assertion failed: The resolution thinks that "${parts[1]}" is a Node builtin`);
        let packagePath = path5.dirname(manifestPath), unqualifiedPath = typeof parts[2] < "u" ? path5.join(packagePath, parts[2]) : packagePath;
        return { packagePath, unqualifiedPath };
      }, runPnpResolutionOnArray = (request, paths2) => {
        for (let i2 = 0; i2 < paths2.length; i2++) {
          let resolution = runPnpResolution(request, paths2[i2]);
          if (resolution || i2 === paths2.length - 1)
            return resolution;
        }
        return null;
      }, originalPaths = Array.isArray(opts.paths) ? opts.paths : [], packageIterator = (request, basedir, getCandidates, opts2) => {
        let pathsToTest = [basedir].concat(originalPaths), resolution = runPnpResolutionOnArray(request, pathsToTest);
        return resolution == null ? getCandidates() : [resolution.unqualifiedPath];
      }, paths = (request, basedir, getNodeModulePaths, opts2) => {
        let pathsToTest = [basedir].concat(originalPaths), resolution = runPnpResolutionOnArray(request, pathsToTest);
        if (resolution == null)
          return getNodeModulePaths().concat(originalPaths);
        let nodeModules = path5.dirname(resolution.packagePath);
        return request.match(/^@[^/]+\//) && (nodeModules = path5.dirname(nodeModules)), [nodeModules];
      }, isInsideIterator = !1;
      return opts.__skipPackageIterator || (opts.packageIterator = function(request, basedir, getCandidates, opts2) {
        isInsideIterator = !0;
        try {
          return packageIterator(request, basedir, getCandidates, opts2);
        } finally {
          isInsideIterator = !1;
        }
      }), opts.paths = function(request, basedir, getNodeModulePaths, opts2) {
        return isInsideIterator ? getNodeModulePaths().concat(originalPaths) : paths(request, basedir, getNodeModulePaths, opts2);
      }, opts;
    };
  }
});

// ../../../node_modules/function-bind/implementation.js
var require_implementation = __commonJS({
  "../../../node_modules/function-bind/implementation.js"(exports, module) {
    "use strict";
    var ERROR_MESSAGE = "Function.prototype.bind called on incompatible ", toStr = Object.prototype.toString, max = Math.max, funcType = "[object Function]", concatty = function(a, b) {
      for (var arr = [], i2 = 0; i2 < a.length; i2 += 1)
        arr[i2] = a[i2];
      for (var j = 0; j < b.length; j += 1)
        arr[j + a.length] = b[j];
      return arr;
    }, slicy = function(arrLike, offset2) {
      for (var arr = [], i2 = offset2 || 0, j = 0; i2 < arrLike.length; i2 += 1, j += 1)
        arr[j] = arrLike[i2];
      return arr;
    }, joiny = function(arr, joiner) {
      for (var str = "", i2 = 0; i2 < arr.length; i2 += 1)
        str += arr[i2], i2 + 1 < arr.length && (str += joiner);
      return str;
    };
    module.exports = function(that) {
      var target = this;
      if (typeof target != "function" || toStr.apply(target) !== funcType)
        throw new TypeError(ERROR_MESSAGE + target);
      for (var args = slicy(arguments, 1), bound, binder = function() {
        if (this instanceof bound) {
          var result = target.apply(
            this,
            concatty(args, arguments)
          );
          return Object(result) === result ? result : this;
        }
        return target.apply(
          that,
          concatty(args, arguments)
        );
      }, boundLength = max(0, target.length - args.length), boundArgs = [], i2 = 0; i2 < boundLength; i2++)
        boundArgs[i2] = "$" + i2;
      if (bound = Function("binder", "return function (" + joiny(boundArgs, ",") + "){ return binder.apply(this,arguments); }")(binder), target.prototype) {
        var Empty = function() {
        };
        Empty.prototype = target.prototype, bound.prototype = new Empty(), Empty.prototype = null;
      }
      return bound;
    };
  }
});

// ../../../node_modules/function-bind/index.js
var require_function_bind = __commonJS({
  "../../../node_modules/function-bind/index.js"(exports, module) {
    "use strict";
    var implementation = require_implementation();
    module.exports = Function.prototype.bind || implementation;
  }
});

// ../../../node_modules/hasown/index.js
var require_hasown = __commonJS({
  "../../../node_modules/hasown/index.js"(exports, module) {
    "use strict";
    var call = Function.prototype.call, $hasOwn = Object.prototype.hasOwnProperty, bind = require_function_bind();
    module.exports = bind.call(call, $hasOwn);
  }
});

// ../../../node_modules/is-core-module/core.json
var require_core = __commonJS({
  "../../../node_modules/is-core-module/core.json"(exports, module) {
    module.exports = {
      assert: !0,
      "node:assert": [">= 14.18 && < 15", ">= 16"],
      "assert/strict": ">= 15",
      "node:assert/strict": ">= 16",
      async_hooks: ">= 8",
      "node:async_hooks": [">= 14.18 && < 15", ">= 16"],
      buffer_ieee754: ">= 0.5 && < 0.9.7",
      buffer: !0,
      "node:buffer": [">= 14.18 && < 15", ">= 16"],
      child_process: !0,
      "node:child_process": [">= 14.18 && < 15", ">= 16"],
      cluster: ">= 0.5",
      "node:cluster": [">= 14.18 && < 15", ">= 16"],
      console: !0,
      "node:console": [">= 14.18 && < 15", ">= 16"],
      constants: !0,
      "node:constants": [">= 14.18 && < 15", ">= 16"],
      crypto: !0,
      "node:crypto": [">= 14.18 && < 15", ">= 16"],
      _debug_agent: ">= 1 && < 8",
      _debugger: "< 8",
      dgram: !0,
      "node:dgram": [">= 14.18 && < 15", ">= 16"],
      diagnostics_channel: [">= 14.17 && < 15", ">= 15.1"],
      "node:diagnostics_channel": [">= 14.18 && < 15", ">= 16"],
      dns: !0,
      "node:dns": [">= 14.18 && < 15", ">= 16"],
      "dns/promises": ">= 15",
      "node:dns/promises": ">= 16",
      domain: ">= 0.7.12",
      "node:domain": [">= 14.18 && < 15", ">= 16"],
      events: !0,
      "node:events": [">= 14.18 && < 15", ">= 16"],
      freelist: "< 6",
      fs: !0,
      "node:fs": [">= 14.18 && < 15", ">= 16"],
      "fs/promises": [">= 10 && < 10.1", ">= 14"],
      "node:fs/promises": [">= 14.18 && < 15", ">= 16"],
      _http_agent: ">= 0.11.1",
      "node:_http_agent": [">= 14.18 && < 15", ">= 16"],
      _http_client: ">= 0.11.1",
      "node:_http_client": [">= 14.18 && < 15", ">= 16"],
      _http_common: ">= 0.11.1",
      "node:_http_common": [">= 14.18 && < 15", ">= 16"],
      _http_incoming: ">= 0.11.1",
      "node:_http_incoming": [">= 14.18 && < 15", ">= 16"],
      _http_outgoing: ">= 0.11.1",
      "node:_http_outgoing": [">= 14.18 && < 15", ">= 16"],
      _http_server: ">= 0.11.1",
      "node:_http_server": [">= 14.18 && < 15", ">= 16"],
      http: !0,
      "node:http": [">= 14.18 && < 15", ">= 16"],
      http2: ">= 8.8",
      "node:http2": [">= 14.18 && < 15", ">= 16"],
      https: !0,
      "node:https": [">= 14.18 && < 15", ">= 16"],
      inspector: ">= 8",
      "node:inspector": [">= 14.18 && < 15", ">= 16"],
      "inspector/promises": [">= 19"],
      "node:inspector/promises": [">= 19"],
      _linklist: "< 8",
      module: !0,
      "node:module": [">= 14.18 && < 15", ">= 16"],
      net: !0,
      "node:net": [">= 14.18 && < 15", ">= 16"],
      "node-inspect/lib/_inspect": ">= 7.6 && < 12",
      "node-inspect/lib/internal/inspect_client": ">= 7.6 && < 12",
      "node-inspect/lib/internal/inspect_repl": ">= 7.6 && < 12",
      os: !0,
      "node:os": [">= 14.18 && < 15", ">= 16"],
      path: !0,
      "node:path": [">= 14.18 && < 15", ">= 16"],
      "path/posix": ">= 15.3",
      "node:path/posix": ">= 16",
      "path/win32": ">= 15.3",
      "node:path/win32": ">= 16",
      perf_hooks: ">= 8.5",
      "node:perf_hooks": [">= 14.18 && < 15", ">= 16"],
      process: ">= 1",
      "node:process": [">= 14.18 && < 15", ">= 16"],
      punycode: ">= 0.5",
      "node:punycode": [">= 14.18 && < 15", ">= 16"],
      querystring: !0,
      "node:querystring": [">= 14.18 && < 15", ">= 16"],
      readline: !0,
      "node:readline": [">= 14.18 && < 15", ">= 16"],
      "readline/promises": ">= 17",
      "node:readline/promises": ">= 17",
      repl: !0,
      "node:repl": [">= 14.18 && < 15", ">= 16"],
      "node:sea": [">= 20.12 && < 21", ">= 21.7"],
      smalloc: ">= 0.11.5 && < 3",
      "node:sqlite": [">= 22.13 && < 23", ">= 23.4"],
      _stream_duplex: ">= 0.9.4",
      "node:_stream_duplex": [">= 14.18 && < 15", ">= 16"],
      _stream_transform: ">= 0.9.4",
      "node:_stream_transform": [">= 14.18 && < 15", ">= 16"],
      _stream_wrap: ">= 1.4.1",
      "node:_stream_wrap": [">= 14.18 && < 15", ">= 16"],
      _stream_passthrough: ">= 0.9.4",
      "node:_stream_passthrough": [">= 14.18 && < 15", ">= 16"],
      _stream_readable: ">= 0.9.4",
      "node:_stream_readable": [">= 14.18 && < 15", ">= 16"],
      _stream_writable: ">= 0.9.4",
      "node:_stream_writable": [">= 14.18 && < 15", ">= 16"],
      stream: !0,
      "node:stream": [">= 14.18 && < 15", ">= 16"],
      "stream/consumers": ">= 16.7",
      "node:stream/consumers": ">= 16.7",
      "stream/promises": ">= 15",
      "node:stream/promises": ">= 16",
      "stream/web": ">= 16.5",
      "node:stream/web": ">= 16.5",
      string_decoder: !0,
      "node:string_decoder": [">= 14.18 && < 15", ">= 16"],
      sys: [">= 0.4 && < 0.7", ">= 0.8"],
      "node:sys": [">= 14.18 && < 15", ">= 16"],
      "test/reporters": ">= 19.9 && < 20.2",
      "node:test/reporters": [">= 18.17 && < 19", ">= 19.9", ">= 20"],
      "test/mock_loader": ">= 22.3 && < 22.7",
      "node:test/mock_loader": ">= 22.3 && < 22.7",
      "node:test": [">= 16.17 && < 17", ">= 18"],
      timers: !0,
      "node:timers": [">= 14.18 && < 15", ">= 16"],
      "timers/promises": ">= 15",
      "node:timers/promises": ">= 16",
      _tls_common: ">= 0.11.13",
      "node:_tls_common": [">= 14.18 && < 15", ">= 16"],
      _tls_legacy: ">= 0.11.3 && < 10",
      _tls_wrap: ">= 0.11.3",
      "node:_tls_wrap": [">= 14.18 && < 15", ">= 16"],
      tls: !0,
      "node:tls": [">= 14.18 && < 15", ">= 16"],
      trace_events: ">= 10",
      "node:trace_events": [">= 14.18 && < 15", ">= 16"],
      tty: !0,
      "node:tty": [">= 14.18 && < 15", ">= 16"],
      url: !0,
      "node:url": [">= 14.18 && < 15", ">= 16"],
      util: !0,
      "node:util": [">= 14.18 && < 15", ">= 16"],
      "util/types": ">= 15.3",
      "node:util/types": ">= 16",
      "v8/tools/arguments": ">= 10 && < 12",
      "v8/tools/codemap": [">= 4.4 && < 5", ">= 5.2 && < 12"],
      "v8/tools/consarray": [">= 4.4 && < 5", ">= 5.2 && < 12"],
      "v8/tools/csvparser": [">= 4.4 && < 5", ">= 5.2 && < 12"],
      "v8/tools/logreader": [">= 4.4 && < 5", ">= 5.2 && < 12"],
      "v8/tools/profile_view": [">= 4.4 && < 5", ">= 5.2 && < 12"],
      "v8/tools/splaytree": [">= 4.4 && < 5", ">= 5.2 && < 12"],
      v8: ">= 1",
      "node:v8": [">= 14.18 && < 15", ">= 16"],
      vm: !0,
      "node:vm": [">= 14.18 && < 15", ">= 16"],
      wasi: [">= 13.4 && < 13.5", ">= 18.17 && < 19", ">= 20"],
      "node:wasi": [">= 18.17 && < 19", ">= 20"],
      worker_threads: ">= 11.7",
      "node:worker_threads": [">= 14.18 && < 15", ">= 16"],
      zlib: ">= 0.5",
      "node:zlib": [">= 14.18 && < 15", ">= 16"]
    };
  }
});

// ../../../node_modules/is-core-module/index.js
var require_is_core_module = __commonJS({
  "../../../node_modules/is-core-module/index.js"(exports, module) {
    "use strict";
    var hasOwn2 = require_hasown();
    function specifierIncluded(current2, specifier) {
      for (var nodeParts = current2.split("."), parts = specifier.split(" "), op = parts.length > 1 ? parts[0] : "=", versionParts = (parts.length > 1 ? parts[1] : parts[0]).split("."), i2 = 0; i2 < 3; ++i2) {
        var cur = parseInt(nodeParts[i2] || 0, 10), ver = parseInt(versionParts[i2] || 0, 10);
        if (cur !== ver)
          return op === "<" ? cur < ver : op === ">=" ? cur >= ver : !1;
      }
      return op === ">=";
    }
    function matchesRange(current2, range) {
      var specifiers = range.split(/ ?&& ?/);
      if (specifiers.length === 0)
        return !1;
      for (var i2 = 0; i2 < specifiers.length; ++i2)
        if (!specifierIncluded(current2, specifiers[i2]))
          return !1;
      return !0;
    }
    function versionIncluded(nodeVersion, specifierValue) {
      if (typeof specifierValue == "boolean")
        return specifierValue;
      var current2 = typeof nodeVersion > "u" ? process.versions && process.versions.node : nodeVersion;
      if (typeof current2 != "string")
        throw new TypeError(typeof nodeVersion > "u" ? "Unable to determine current node version" : "If provided, a valid node version is required");
      if (specifierValue && typeof specifierValue == "object") {
        for (var i2 = 0; i2 < specifierValue.length; ++i2)
          if (matchesRange(current2, specifierValue[i2]))
            return !0;
        return !1;
      }
      return matchesRange(current2, specifierValue);
    }
    var data2 = require_core();
    module.exports = function(x, nodeVersion) {
      return hasOwn2(data2, x) && versionIncluded(nodeVersion, data2[x]);
    };
  }
});

// ../../../node_modules/resolve/lib/async.js
var require_async = __commonJS({
  "../../../node_modules/resolve/lib/async.js"(exports, module) {
    var fs = __require("fs"), getHomedir = require_homedir(), path5 = __require("path"), caller = require_caller(), nodeModulesPaths = require_node_modules_paths(), normalizeOptions = require_normalize_options(), isCore = require_is_core_module(), realpathFS = process.platform !== "win32" && fs.realpath && typeof fs.realpath.native == "function" ? fs.realpath.native : fs.realpath, relativePathRegex = /^(?:\.\.?(?:\/|$)|\/|([A-Za-z]:)?[/\\])/, windowsDriveRegex = /^\w:[/\\]*$/, nodeModulesRegex = /[/\\]node_modules[/\\]*$/, homedir = getHomedir(), defaultPaths = function() {
      return [
        path5.join(homedir, ".node_modules"),
        path5.join(homedir, ".node_libraries")
      ];
    }, defaultIsFile = function(file, cb) {
      fs.stat(file, function(err, stat) {
        return err ? err.code === "ENOENT" || err.code === "ENOTDIR" ? cb(null, !1) : cb(err) : cb(null, stat.isFile() || stat.isFIFO());
      });
    }, defaultIsDir = function(dir, cb) {
      fs.stat(dir, function(err, stat) {
        return err ? err.code === "ENOENT" || err.code === "ENOTDIR" ? cb(null, !1) : cb(err) : cb(null, stat.isDirectory());
      });
    }, defaultRealpath = function(x, cb) {
      realpathFS(x, function(realpathErr, realPath) {
        realpathErr && realpathErr.code !== "ENOENT" ? cb(realpathErr) : cb(null, realpathErr ? x : realPath);
      });
    }, maybeRealpath = function(realpath, x, opts, cb) {
      opts && opts.preserveSymlinks === !1 ? realpath(x, cb) : cb(null, x);
    }, defaultReadPackage = function(readFile, pkgfile, cb) {
      readFile(pkgfile, function(readFileErr, body) {
        if (readFileErr) cb(readFileErr);
        else
          try {
            var pkg = JSON.parse(body);
            cb(null, pkg);
          } catch {
            cb(null);
          }
      });
    }, getPackageCandidates = function(x, start, opts) {
      for (var dirs = nodeModulesPaths(start, opts, x), i2 = 0; i2 < dirs.length; i2++)
        dirs[i2] = path5.join(dirs[i2], x);
      return dirs;
    };
    module.exports = function(x, options, callback) {
      var cb = callback, opts = options;
      if (typeof options == "function" && (cb = opts, opts = {}), typeof x != "string") {
        var err = new TypeError("Path must be a string.");
        return process.nextTick(function() {
          cb(err);
        });
      }
      opts = normalizeOptions(x, opts);
      var isFile2 = opts.isFile || defaultIsFile, isDirectory = opts.isDirectory || defaultIsDir, readFile = opts.readFile || fs.readFile, realpath = opts.realpath || defaultRealpath, readPackage = opts.readPackage || defaultReadPackage;
      if (opts.readFile && opts.readPackage) {
        var conflictErr = new TypeError("`readFile` and `readPackage` are mutually exclusive.");
        return process.nextTick(function() {
          cb(conflictErr);
        });
      }
      var packageIterator = opts.packageIterator, extensions = opts.extensions || [".js"], includeCoreModules = opts.includeCoreModules !== !1, basedir = opts.basedir || path5.dirname(caller()), parent = opts.filename || basedir;
      opts.paths = opts.paths || defaultPaths();
      var absoluteStart = path5.resolve(basedir);
      maybeRealpath(
        realpath,
        absoluteStart,
        opts,
        function(err2, realStart) {
          err2 ? cb(err2) : init(realStart);
        }
      );
      var res;
      function init(basedir2) {
        if (relativePathRegex.test(x))
          res = path5.resolve(basedir2, x), (x === "." || x === ".." || x.slice(-1) === "/") && (res += "/"), x.slice(-1) === "/" && res === basedir2 ? loadAsDirectory(res, opts.package, onfile) : loadAsFile(res, opts.package, onfile);
        else {
          if (includeCoreModules && isCore(x))
            return cb(null, x);
          loadNodeModules(x, basedir2, function(err2, n, pkg) {
            if (err2) cb(err2);
            else {
              if (n)
                return maybeRealpath(realpath, n, opts, function(err3, realN) {
                  err3 ? cb(err3) : cb(null, realN, pkg);
                });
              var moduleError = new Error("Cannot find module '" + x + "' from '" + parent + "'");
              moduleError.code = "MODULE_NOT_FOUND", cb(moduleError);
            }
          });
        }
      }
      function onfile(err2, m, pkg) {
        err2 ? cb(err2) : m ? cb(null, m, pkg) : loadAsDirectory(res, function(err3, d, pkg2) {
          if (err3) cb(err3);
          else if (d)
            maybeRealpath(realpath, d, opts, function(err4, realD) {
              err4 ? cb(err4) : cb(null, realD, pkg2);
            });
          else {
            var moduleError = new Error("Cannot find module '" + x + "' from '" + parent + "'");
            moduleError.code = "MODULE_NOT_FOUND", cb(moduleError);
          }
        });
      }
      function loadAsFile(x2, thePackage, callback2) {
        var loadAsFilePackage = thePackage, cb2 = callback2;
        typeof loadAsFilePackage == "function" && (cb2 = loadAsFilePackage, loadAsFilePackage = void 0);
        var exts = [""].concat(extensions);
        load(exts, x2, loadAsFilePackage);
        function load(exts2, x3, loadPackage) {
          if (exts2.length === 0) return cb2(null, void 0, loadPackage);
          var file = x3 + exts2[0], pkg = loadPackage;
          pkg ? onpkg(null, pkg) : loadpkg(path5.dirname(file), onpkg);
          function onpkg(err2, pkg_, dir) {
            if (pkg = pkg_, err2) return cb2(err2);
            if (dir && pkg && opts.pathFilter) {
              var rfile = path5.relative(dir, file), rel = rfile.slice(0, rfile.length - exts2[0].length), r = opts.pathFilter(pkg, x3, rel);
              if (r) return load(
                [""].concat(extensions.slice()),
                path5.resolve(dir, r),
                pkg
              );
            }
            isFile2(file, onex);
          }
          function onex(err2, ex) {
            if (err2) return cb2(err2);
            if (ex) return cb2(null, file, pkg);
            load(exts2.slice(1), x3, pkg);
          }
        }
      }
      function loadpkg(dir, cb2) {
        if (dir === "" || dir === "/" || process.platform === "win32" && windowsDriveRegex.test(dir) || nodeModulesRegex.test(dir)) return cb2(null);
        maybeRealpath(realpath, dir, opts, function(unwrapErr, pkgdir) {
          if (unwrapErr) return loadpkg(path5.dirname(dir), cb2);
          var pkgfile = path5.join(pkgdir, "package.json");
          isFile2(pkgfile, function(err2, ex) {
            if (!ex) return loadpkg(path5.dirname(dir), cb2);
            readPackage(readFile, pkgfile, function(err3, pkgParam) {
              err3 && cb2(err3);
              var pkg = pkgParam;
              pkg && opts.packageFilter && (pkg = opts.packageFilter(pkg, pkgfile)), cb2(null, pkg, dir);
            });
          });
        });
      }
      function loadAsDirectory(x2, loadAsDirectoryPackage, callback2) {
        var cb2 = callback2, fpkg = loadAsDirectoryPackage;
        typeof fpkg == "function" && (cb2 = fpkg, fpkg = opts.package), maybeRealpath(realpath, x2, opts, function(unwrapErr, pkgdir) {
          if (unwrapErr) return cb2(unwrapErr);
          var pkgfile = path5.join(pkgdir, "package.json");
          isFile2(pkgfile, function(err2, ex) {
            if (err2) return cb2(err2);
            if (!ex) return loadAsFile(path5.join(x2, "index"), fpkg, cb2);
            readPackage(readFile, pkgfile, function(err3, pkgParam) {
              if (err3) return cb2(err3);
              var pkg = pkgParam;
              if (pkg && opts.packageFilter && (pkg = opts.packageFilter(pkg, pkgfile)), pkg && pkg.main) {
                if (typeof pkg.main != "string") {
                  var mainError = new TypeError("package \u201C" + pkg.name + "\u201D `main` must be a string");
                  return mainError.code = "INVALID_PACKAGE_MAIN", cb2(mainError);
                }
                (pkg.main === "." || pkg.main === "./") && (pkg.main = "index"), loadAsFile(path5.resolve(x2, pkg.main), pkg, function(err4, m, pkg2) {
                  if (err4) return cb2(err4);
                  if (m) return cb2(null, m, pkg2);
                  if (!pkg2) return loadAsFile(path5.join(x2, "index"), pkg2, cb2);
                  var dir = path5.resolve(x2, pkg2.main);
                  loadAsDirectory(dir, pkg2, function(err5, n, pkg3) {
                    if (err5) return cb2(err5);
                    if (n) return cb2(null, n, pkg3);
                    loadAsFile(path5.join(x2, "index"), pkg3, cb2);
                  });
                });
                return;
              }
              loadAsFile(path5.join(x2, "/index"), pkg, cb2);
            });
          });
        });
      }
      function processDirs(cb2, dirs) {
        if (dirs.length === 0) return cb2(null, void 0);
        var dir = dirs[0];
        isDirectory(path5.dirname(dir), isdir);
        function isdir(err2, isdir2) {
          if (err2) return cb2(err2);
          if (!isdir2) return processDirs(cb2, dirs.slice(1));
          loadAsFile(dir, opts.package, onfile2);
        }
        function onfile2(err2, m, pkg) {
          if (err2) return cb2(err2);
          if (m) return cb2(null, m, pkg);
          loadAsDirectory(dir, opts.package, ondir);
        }
        function ondir(err2, n, pkg) {
          if (err2) return cb2(err2);
          if (n) return cb2(null, n, pkg);
          processDirs(cb2, dirs.slice(1));
        }
      }
      function loadNodeModules(x2, start, cb2) {
        var thunk = function() {
          return getPackageCandidates(x2, start, opts);
        };
        processDirs(
          cb2,
          packageIterator ? packageIterator(x2, start, thunk, opts) : thunk()
        );
      }
    };
  }
});

// ../../../node_modules/resolve/lib/core.json
var require_core2 = __commonJS({
  "../../../node_modules/resolve/lib/core.json"(exports, module) {
    module.exports = {
      assert: !0,
      "node:assert": [">= 14.18 && < 15", ">= 16"],
      "assert/strict": ">= 15",
      "node:assert/strict": ">= 16",
      async_hooks: ">= 8",
      "node:async_hooks": [">= 14.18 && < 15", ">= 16"],
      buffer_ieee754: ">= 0.5 && < 0.9.7",
      buffer: !0,
      "node:buffer": [">= 14.18 && < 15", ">= 16"],
      child_process: !0,
      "node:child_process": [">= 14.18 && < 15", ">= 16"],
      cluster: ">= 0.5",
      "node:cluster": [">= 14.18 && < 15", ">= 16"],
      console: !0,
      "node:console": [">= 14.18 && < 15", ">= 16"],
      constants: !0,
      "node:constants": [">= 14.18 && < 15", ">= 16"],
      crypto: !0,
      "node:crypto": [">= 14.18 && < 15", ">= 16"],
      _debug_agent: ">= 1 && < 8",
      _debugger: "< 8",
      dgram: !0,
      "node:dgram": [">= 14.18 && < 15", ">= 16"],
      diagnostics_channel: [">= 14.17 && < 15", ">= 15.1"],
      "node:diagnostics_channel": [">= 14.18 && < 15", ">= 16"],
      dns: !0,
      "node:dns": [">= 14.18 && < 15", ">= 16"],
      "dns/promises": ">= 15",
      "node:dns/promises": ">= 16",
      domain: ">= 0.7.12",
      "node:domain": [">= 14.18 && < 15", ">= 16"],
      events: !0,
      "node:events": [">= 14.18 && < 15", ">= 16"],
      freelist: "< 6",
      fs: !0,
      "node:fs": [">= 14.18 && < 15", ">= 16"],
      "fs/promises": [">= 10 && < 10.1", ">= 14"],
      "node:fs/promises": [">= 14.18 && < 15", ">= 16"],
      _http_agent: ">= 0.11.1",
      "node:_http_agent": [">= 14.18 && < 15", ">= 16"],
      _http_client: ">= 0.11.1",
      "node:_http_client": [">= 14.18 && < 15", ">= 16"],
      _http_common: ">= 0.11.1",
      "node:_http_common": [">= 14.18 && < 15", ">= 16"],
      _http_incoming: ">= 0.11.1",
      "node:_http_incoming": [">= 14.18 && < 15", ">= 16"],
      _http_outgoing: ">= 0.11.1",
      "node:_http_outgoing": [">= 14.18 && < 15", ">= 16"],
      _http_server: ">= 0.11.1",
      "node:_http_server": [">= 14.18 && < 15", ">= 16"],
      http: !0,
      "node:http": [">= 14.18 && < 15", ">= 16"],
      http2: ">= 8.8",
      "node:http2": [">= 14.18 && < 15", ">= 16"],
      https: !0,
      "node:https": [">= 14.18 && < 15", ">= 16"],
      inspector: ">= 8",
      "node:inspector": [">= 14.18 && < 15", ">= 16"],
      "inspector/promises": [">= 19"],
      "node:inspector/promises": [">= 19"],
      _linklist: "< 8",
      module: !0,
      "node:module": [">= 14.18 && < 15", ">= 16"],
      net: !0,
      "node:net": [">= 14.18 && < 15", ">= 16"],
      "node-inspect/lib/_inspect": ">= 7.6 && < 12",
      "node-inspect/lib/internal/inspect_client": ">= 7.6 && < 12",
      "node-inspect/lib/internal/inspect_repl": ">= 7.6 && < 12",
      os: !0,
      "node:os": [">= 14.18 && < 15", ">= 16"],
      path: !0,
      "node:path": [">= 14.18 && < 15", ">= 16"],
      "path/posix": ">= 15.3",
      "node:path/posix": ">= 16",
      "path/win32": ">= 15.3",
      "node:path/win32": ">= 16",
      perf_hooks: ">= 8.5",
      "node:perf_hooks": [">= 14.18 && < 15", ">= 16"],
      process: ">= 1",
      "node:process": [">= 14.18 && < 15", ">= 16"],
      punycode: ">= 0.5",
      "node:punycode": [">= 14.18 && < 15", ">= 16"],
      querystring: !0,
      "node:querystring": [">= 14.18 && < 15", ">= 16"],
      readline: !0,
      "node:readline": [">= 14.18 && < 15", ">= 16"],
      "readline/promises": ">= 17",
      "node:readline/promises": ">= 17",
      repl: !0,
      "node:repl": [">= 14.18 && < 15", ">= 16"],
      "node:sea": [">= 20.12 && < 21", ">= 21.7"],
      smalloc: ">= 0.11.5 && < 3",
      "node:sqlite": [">= 22.13 && < 23", ">= 23.4"],
      _stream_duplex: ">= 0.9.4",
      "node:_stream_duplex": [">= 14.18 && < 15", ">= 16"],
      _stream_transform: ">= 0.9.4",
      "node:_stream_transform": [">= 14.18 && < 15", ">= 16"],
      _stream_wrap: ">= 1.4.1",
      "node:_stream_wrap": [">= 14.18 && < 15", ">= 16"],
      _stream_passthrough: ">= 0.9.4",
      "node:_stream_passthrough": [">= 14.18 && < 15", ">= 16"],
      _stream_readable: ">= 0.9.4",
      "node:_stream_readable": [">= 14.18 && < 15", ">= 16"],
      _stream_writable: ">= 0.9.4",
      "node:_stream_writable": [">= 14.18 && < 15", ">= 16"],
      stream: !0,
      "node:stream": [">= 14.18 && < 15", ">= 16"],
      "stream/consumers": ">= 16.7",
      "node:stream/consumers": ">= 16.7",
      "stream/promises": ">= 15",
      "node:stream/promises": ">= 16",
      "stream/web": ">= 16.5",
      "node:stream/web": ">= 16.5",
      string_decoder: !0,
      "node:string_decoder": [">= 14.18 && < 15", ">= 16"],
      sys: [">= 0.4 && < 0.7", ">= 0.8"],
      "node:sys": [">= 14.18 && < 15", ">= 16"],
      "test/reporters": ">= 19.9 && < 20.2",
      "node:test/reporters": [">= 18.17 && < 19", ">= 19.9", ">= 20"],
      "test/mock_loader": ">= 22.3 && < 22.7",
      "node:test/mock_loader": ">= 22.3 && < 22.7",
      "node:test": [">= 16.17 && < 17", ">= 18"],
      timers: !0,
      "node:timers": [">= 14.18 && < 15", ">= 16"],
      "timers/promises": ">= 15",
      "node:timers/promises": ">= 16",
      _tls_common: ">= 0.11.13",
      "node:_tls_common": [">= 14.18 && < 15", ">= 16"],
      _tls_legacy: ">= 0.11.3 && < 10",
      _tls_wrap: ">= 0.11.3",
      "node:_tls_wrap": [">= 14.18 && < 15", ">= 16"],
      tls: !0,
      "node:tls": [">= 14.18 && < 15", ">= 16"],
      trace_events: ">= 10",
      "node:trace_events": [">= 14.18 && < 15", ">= 16"],
      tty: !0,
      "node:tty": [">= 14.18 && < 15", ">= 16"],
      url: !0,
      "node:url": [">= 14.18 && < 15", ">= 16"],
      util: !0,
      "node:util": [">= 14.18 && < 15", ">= 16"],
      "util/types": ">= 15.3",
      "node:util/types": ">= 16",
      "v8/tools/arguments": ">= 10 && < 12",
      "v8/tools/codemap": [">= 4.4 && < 5", ">= 5.2 && < 12"],
      "v8/tools/consarray": [">= 4.4 && < 5", ">= 5.2 && < 12"],
      "v8/tools/csvparser": [">= 4.4 && < 5", ">= 5.2 && < 12"],
      "v8/tools/logreader": [">= 4.4 && < 5", ">= 5.2 && < 12"],
      "v8/tools/profile_view": [">= 4.4 && < 5", ">= 5.2 && < 12"],
      "v8/tools/splaytree": [">= 4.4 && < 5", ">= 5.2 && < 12"],
      v8: ">= 1",
      "node:v8": [">= 14.18 && < 15", ">= 16"],
      vm: !0,
      "node:vm": [">= 14.18 && < 15", ">= 16"],
      wasi: [">= 13.4 && < 13.5", ">= 18.17 && < 19", ">= 20"],
      "node:wasi": [">= 18.17 && < 19", ">= 20"],
      worker_threads: ">= 11.7",
      "node:worker_threads": [">= 14.18 && < 15", ">= 16"],
      zlib: ">= 0.5",
      "node:zlib": [">= 14.18 && < 15", ">= 16"]
    };
  }
});

// ../../../node_modules/resolve/lib/core.js
var require_core3 = __commonJS({
  "../../../node_modules/resolve/lib/core.js"(exports, module) {
    "use strict";
    var isCoreModule = require_is_core_module(), data2 = require_core2(), core = {};
    for (mod in data2)
      Object.prototype.hasOwnProperty.call(data2, mod) && (core[mod] = isCoreModule(mod));
    var mod;
    module.exports = core;
  }
});

// ../../../node_modules/resolve/lib/is-core.js
var require_is_core = __commonJS({
  "../../../node_modules/resolve/lib/is-core.js"(exports, module) {
    var isCoreModule = require_is_core_module();
    module.exports = function(x) {
      return isCoreModule(x);
    };
  }
});

// ../../../node_modules/resolve/lib/sync.js
var require_sync = __commonJS({
  "../../../node_modules/resolve/lib/sync.js"(exports, module) {
    var isCore = require_is_core_module(), fs = __require("fs"), path5 = __require("path"), getHomedir = require_homedir(), caller = require_caller(), nodeModulesPaths = require_node_modules_paths(), normalizeOptions = require_normalize_options(), realpathFS = process.platform !== "win32" && fs.realpathSync && typeof fs.realpathSync.native == "function" ? fs.realpathSync.native : fs.realpathSync, relativePathRegex = /^(?:\.\.?(?:\/|$)|\/|([A-Za-z]:)?[/\\])/, windowsDriveRegex = /^\w:[/\\]*$/, nodeModulesRegex = /[/\\]node_modules[/\\]*$/, homedir = getHomedir(), defaultPaths = function() {
      return [
        path5.join(homedir, ".node_modules"),
        path5.join(homedir, ".node_libraries")
      ];
    }, defaultIsFile = function(file) {
      try {
        var stat = fs.statSync(file, { throwIfNoEntry: !1 });
      } catch (e) {
        if (e && (e.code === "ENOENT" || e.code === "ENOTDIR")) return !1;
        throw e;
      }
      return !!stat && (stat.isFile() || stat.isFIFO());
    }, defaultIsDir = function(dir) {
      try {
        var stat = fs.statSync(dir, { throwIfNoEntry: !1 });
      } catch (e) {
        if (e && (e.code === "ENOENT" || e.code === "ENOTDIR")) return !1;
        throw e;
      }
      return !!stat && stat.isDirectory();
    }, defaultRealpathSync = function(x) {
      try {
        return realpathFS(x);
      } catch (realpathErr) {
        if (realpathErr.code !== "ENOENT")
          throw realpathErr;
      }
      return x;
    }, maybeRealpathSync = function(realpathSync, x, opts) {
      return opts && opts.preserveSymlinks === !1 ? realpathSync(x) : x;
    }, defaultReadPackageSync = function(readFileSync2, pkgfile) {
      var body = readFileSync2(pkgfile);
      try {
        var pkg = JSON.parse(body);
        return pkg;
      } catch {
      }
    }, getPackageCandidates = function(x, start, opts) {
      for (var dirs = nodeModulesPaths(start, opts, x), i2 = 0; i2 < dirs.length; i2++)
        dirs[i2] = path5.join(dirs[i2], x);
      return dirs;
    };
    module.exports = function(x, options) {
      if (typeof x != "string")
        throw new TypeError("Path must be a string.");
      var opts = normalizeOptions(x, options), isFile2 = opts.isFile || defaultIsFile, readFileSync2 = opts.readFileSync || fs.readFileSync, isDirectory = opts.isDirectory || defaultIsDir, realpathSync = opts.realpathSync || defaultRealpathSync, readPackageSync = opts.readPackageSync || defaultReadPackageSync;
      if (opts.readFileSync && opts.readPackageSync)
        throw new TypeError("`readFileSync` and `readPackageSync` are mutually exclusive.");
      var packageIterator = opts.packageIterator, extensions = opts.extensions || [".js"], includeCoreModules = opts.includeCoreModules !== !1, basedir = opts.basedir || path5.dirname(caller()), parent = opts.filename || basedir;
      opts.paths = opts.paths || defaultPaths();
      var absoluteStart = maybeRealpathSync(realpathSync, path5.resolve(basedir), opts);
      if (relativePathRegex.test(x)) {
        var res = path5.resolve(absoluteStart, x);
        (x === "." || x === ".." || x.slice(-1) === "/") && (res += "/");
        var m = loadAsFileSync(res) || loadAsDirectorySync(res);
        if (m) return maybeRealpathSync(realpathSync, m, opts);
      } else {
        if (includeCoreModules && isCore(x))
          return x;
        var n = loadNodeModulesSync(x, absoluteStart);
        if (n) return maybeRealpathSync(realpathSync, n, opts);
      }
      var err = new Error("Cannot find module '" + x + "' from '" + parent + "'");
      throw err.code = "MODULE_NOT_FOUND", err;
      function loadAsFileSync(x2) {
        var pkg = loadpkg(path5.dirname(x2));
        if (pkg && pkg.dir && pkg.pkg && opts.pathFilter) {
          var rfile = path5.relative(pkg.dir, x2), r = opts.pathFilter(pkg.pkg, x2, rfile);
          r && (x2 = path5.resolve(pkg.dir, r));
        }
        if (isFile2(x2))
          return x2;
        for (var i2 = 0; i2 < extensions.length; i2++) {
          var file = x2 + extensions[i2];
          if (isFile2(file))
            return file;
        }
      }
      function loadpkg(dir) {
        if (!(dir === "" || dir === "/") && !(process.platform === "win32" && windowsDriveRegex.test(dir)) && !nodeModulesRegex.test(dir)) {
          var pkgfile = path5.join(maybeRealpathSync(realpathSync, dir, opts), "package.json");
          if (!isFile2(pkgfile))
            return loadpkg(path5.dirname(dir));
          var pkg = readPackageSync(readFileSync2, pkgfile);
          return pkg && opts.packageFilter && (pkg = opts.packageFilter(
            pkg,
            /*pkgfile,*/
            dir
          )), { pkg, dir };
        }
      }
      function loadAsDirectorySync(x2) {
        var pkgfile = path5.join(maybeRealpathSync(realpathSync, x2, opts), "/package.json");
        if (isFile2(pkgfile)) {
          try {
            var pkg = readPackageSync(readFileSync2, pkgfile);
          } catch {
          }
          if (pkg && opts.packageFilter && (pkg = opts.packageFilter(
            pkg,
            /*pkgfile,*/
            x2
          )), pkg && pkg.main) {
            if (typeof pkg.main != "string") {
              var mainError = new TypeError("package \u201C" + pkg.name + "\u201D `main` must be a string");
              throw mainError.code = "INVALID_PACKAGE_MAIN", mainError;
            }
            (pkg.main === "." || pkg.main === "./") && (pkg.main = "index");
            try {
              var m2 = loadAsFileSync(path5.resolve(x2, pkg.main));
              if (m2) return m2;
              var n2 = loadAsDirectorySync(path5.resolve(x2, pkg.main));
              if (n2) return n2;
            } catch {
            }
          }
        }
        return loadAsFileSync(path5.join(x2, "/index"));
      }
      function loadNodeModulesSync(x2, start) {
        for (var thunk = function() {
          return getPackageCandidates(x2, start, opts);
        }, dirs = packageIterator ? packageIterator(x2, start, thunk, opts) : thunk(), i2 = 0; i2 < dirs.length; i2++) {
          var dir = dirs[i2];
          if (isDirectory(path5.dirname(dir))) {
            var m2 = loadAsFileSync(dir);
            if (m2) return m2;
            var n2 = loadAsDirectorySync(dir);
            if (n2) return n2;
          }
        }
      }
    };
  }
});

// ../../../node_modules/resolve/index.js
var require_resolve = __commonJS({
  "../../../node_modules/resolve/index.js"(exports, module) {
    var async = require_async();
    async.core = require_core3();
    async.isCore = require_is_core();
    async.sync = require_sync();
    module.exports = async;
  }
});

// ../../../node_modules/@volar/language-core/node_modules/@volar/source-map/lib/binarySearch.js
var require_binarySearch = __commonJS({
  "../../../node_modules/@volar/language-core/node_modules/@volar/source-map/lib/binarySearch.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: !0 });
    exports.binarySearch = binarySearch;
    function binarySearch(values, searchValue) {
      let low = 0, high = values.length - 1, match;
      for (; low <= high; ) {
        let mid = Math.floor((low + high) / 2), midValue = values[mid];
        if (midValue < searchValue)
          low = mid + 1;
        else if (midValue > searchValue)
          high = mid - 1;
        else {
          low = mid, high = mid, match = mid;
          break;
        }
      }
      let finalLow = Math.max(Math.min(low, high, values.length - 1), 0), finalHigh = Math.min(Math.max(low, high, 0), values.length - 1);
      return { low: finalLow, high: finalHigh, match };
    }
  }
});

// ../../../node_modules/@volar/language-core/node_modules/@volar/source-map/lib/translateOffset.js
var require_translateOffset = __commonJS({
  "../../../node_modules/@volar/language-core/node_modules/@volar/source-map/lib/translateOffset.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: !0 });
    exports.translateOffset = translateOffset;
    var warned = !1;
    function translateOffset(start, fromOffsets, toOffsets, fromLengths, toLengths = fromLengths, preferEnd = !1) {
      if (!fromOffsets.every((value, index) => index === 0 || fromOffsets[index - 1] <= value)) {
        for (let i2 = 0; i2 < fromOffsets.length; i2++) {
          let fromOffset = fromOffsets[i2], fromLength = fromLengths[i2];
          if (start >= fromOffset && start <= fromOffset + fromLength) {
            let toLength = toLengths[i2], toOffset = toOffsets[i2], rangeOffset, relativePos = start - fromOffset;
            return preferEnd && toLength > fromLength && relativePos === fromLength ? rangeOffset = toLength : rangeOffset = Math.min(relativePos, toLength), toOffset + rangeOffset;
          }
        }
        warned || (warned = !0, console.warn("fromOffsets should be sorted in ascending order"));
      }
      let low = 0, high = fromOffsets.length - 1;
      for (; low <= high; ) {
        let mid = Math.floor((low + high) / 2), fromOffset = fromOffsets[mid], fromLength = fromLengths[mid];
        if (start >= fromOffset && start <= fromOffset + fromLength) {
          let toLength = toLengths[mid], toOffset = toOffsets[mid], rangeOffset, relativePos = start - fromOffset;
          return preferEnd && toLength > fromLength && relativePos === fromLength ? rangeOffset = toLength : rangeOffset = Math.min(relativePos, toLength), toOffset + rangeOffset;
        } else start < fromOffset ? high = mid - 1 : low = mid + 1;
      }
    }
  }
});

// ../../../node_modules/@volar/language-core/node_modules/@volar/source-map/lib/sourceMap.js
var require_sourceMap = __commonJS({
  "../../../node_modules/@volar/language-core/node_modules/@volar/source-map/lib/sourceMap.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: !0 });
    exports.SourceMap = void 0;
    var binarySearch_1 = require_binarySearch(), translateOffset_1 = require_translateOffset(), SourceMap = class {
      constructor(mappings) {
        this.mappings = mappings;
      }
      toSourceRange(generatedStart, generatedEnd, fallbackToAnyMatch, filter) {
        return this.findMatchingStartEnd(generatedStart, generatedEnd, fallbackToAnyMatch, "generatedOffsets", filter);
      }
      toGeneratedRange(sourceStart, sourceEnd, fallbackToAnyMatch, filter) {
        return this.findMatchingStartEnd(sourceStart, sourceEnd, fallbackToAnyMatch, "sourceOffsets", filter);
      }
      toSourceLocation(generatedOffset, filter) {
        return this.findMatchingOffsets(generatedOffset, "generatedOffsets", filter);
      }
      toGeneratedLocation(sourceOffset, filter) {
        return this.findMatchingOffsets(sourceOffset, "sourceOffsets", filter);
      }
      *findMatchingOffsets(offset2, fromRange, filter, preferEnd = !1) {
        let memo = this.getMemoBasedOnRange(fromRange);
        if (memo.offsets.length === 0)
          return;
        let { low: start, high: end } = (0, binarySearch_1.binarySearch)(memo.offsets, offset2), skip = /* @__PURE__ */ new Set(), toRange = fromRange === "sourceOffsets" ? "generatedOffsets" : "sourceOffsets";
        for (let i2 = start; i2 <= end; i2++)
          for (let mapping of memo.mappings[i2]) {
            if (skip.has(mapping) || (skip.add(mapping), filter && !filter(mapping.data)))
              continue;
            let mapped = (0, translateOffset_1.translateOffset)(offset2, mapping[fromRange], mapping[toRange], getLengths(mapping, fromRange), getLengths(mapping, toRange), preferEnd);
            mapped !== void 0 && (yield [mapped, mapping]);
          }
      }
      *findMatchingStartEnd(start, end, fallbackToAnyMatch, fromRange, filter) {
        let toRange = fromRange === "sourceOffsets" ? "generatedOffsets" : "sourceOffsets", preferEnd = toRange === "sourceOffsets", mappedStarts = [], hadMatch = !1;
        for (let [mappedStart, mapping] of this.findMatchingOffsets(start, fromRange)) {
          if (filter && !filter(mapping.data))
            continue;
          mappedStarts.push([mappedStart, mapping]);
          let mappedEnd = (0, translateOffset_1.translateOffset)(end, mapping[fromRange], mapping[toRange], getLengths(mapping, fromRange), getLengths(mapping, toRange), preferEnd);
          mappedEnd !== void 0 && (hadMatch = !0, yield [mappedStart, mappedEnd, mapping, mapping]);
        }
        if (!hadMatch && fallbackToAnyMatch) {
          for (let [mappedStart, mappingStart] of mappedStarts)
            for (let [mappedEnd, mappingEnd] of this.findMatchingOffsets(end, fromRange, void 0, preferEnd))
              if (!(filter && !filter(mappingEnd.data) || mappedEnd < mappedStart)) {
                yield [mappedStart, mappedEnd, mappingStart, mappingEnd];
                break;
              }
        }
      }
      getMemoBasedOnRange(fromRange) {
        return fromRange === "sourceOffsets" ? this.sourceCodeOffsetsMemo ??= this.createMemo("sourceOffsets") : this.generatedCodeOffsetsMemo ??= this.createMemo("generatedOffsets");
      }
      createMemo(key) {
        let offsetsSet = /* @__PURE__ */ new Set();
        for (let mapping of this.mappings)
          for (let i2 = 0; i2 < mapping[key].length; i2++)
            offsetsSet.add(mapping[key][i2]), offsetsSet.add(mapping[key][i2] + getLengths(mapping, key)[i2]);
        let offsets = [...offsetsSet].sort((a, b) => a - b), mappings = offsets.map(() => /* @__PURE__ */ new Set());
        for (let mapping of this.mappings)
          for (let i2 = 0; i2 < mapping[key].length; i2++) {
            let startIndex = (0, binarySearch_1.binarySearch)(offsets, mapping[key][i2]).match, endIndex = (0, binarySearch_1.binarySearch)(offsets, mapping[key][i2] + getLengths(mapping, key)[i2]).match;
            for (let i3 = startIndex; i3 <= endIndex; i3++)
              mappings[i3].add(mapping);
          }
        return { offsets, mappings };
      }
    };
    exports.SourceMap = SourceMap;
    function getLengths(mapping, key) {
      return key === "sourceOffsets" ? mapping.lengths : mapping.generatedLengths ?? mapping.lengths;
    }
  }
});

// ../../../node_modules/@volar/language-core/node_modules/@volar/source-map/index.js
var require_source_map2 = __commonJS({
  "../../../node_modules/@volar/language-core/node_modules/@volar/source-map/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      k2 === void 0 && (k2 = k);
      var desc = Object.getOwnPropertyDescriptor(m, k);
      (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) && (desc = { enumerable: !0, get: function() {
        return m[k];
      } }), Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      k2 === void 0 && (k2 = k), o[k2] = m[k];
    })), __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m) p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p) && __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: !0 });
    __exportStar(require_sourceMap(), exports);
    __exportStar(require_translateOffset(), exports);
  }
});

// ../../../node_modules/@volar/language-core/lib/editor.js
var require_editor = __commonJS({
  "../../../node_modules/@volar/language-core/lib/editor.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: !0 });
    exports.isHoverEnabled = isHoverEnabled;
    exports.isInlayHintsEnabled = isInlayHintsEnabled;
    exports.isCodeLensEnabled = isCodeLensEnabled;
    exports.isMonikerEnabled = isMonikerEnabled;
    exports.isInlineValueEnabled = isInlineValueEnabled;
    exports.isSemanticTokensEnabled = isSemanticTokensEnabled;
    exports.isCallHierarchyEnabled = isCallHierarchyEnabled;
    exports.isTypeHierarchyEnabled = isTypeHierarchyEnabled;
    exports.isRenameEnabled = isRenameEnabled;
    exports.isDefinitionEnabled = isDefinitionEnabled;
    exports.isTypeDefinitionEnabled = isTypeDefinitionEnabled;
    exports.isReferencesEnabled = isReferencesEnabled;
    exports.isImplementationEnabled = isImplementationEnabled;
    exports.isHighlightEnabled = isHighlightEnabled;
    exports.isSymbolsEnabled = isSymbolsEnabled;
    exports.isFoldingRangesEnabled = isFoldingRangesEnabled;
    exports.isSelectionRangesEnabled = isSelectionRangesEnabled;
    exports.isLinkedEditingEnabled = isLinkedEditingEnabled;
    exports.isColorEnabled = isColorEnabled;
    exports.isDocumentLinkEnabled = isDocumentLinkEnabled;
    exports.isDiagnosticsEnabled = isDiagnosticsEnabled;
    exports.isCodeActionsEnabled = isCodeActionsEnabled;
    exports.isFormattingEnabled = isFormattingEnabled;
    exports.isCompletionEnabled = isCompletionEnabled;
    exports.isAutoInsertEnabled = isAutoInsertEnabled;
    exports.isSignatureHelpEnabled = isSignatureHelpEnabled;
    exports.shouldReportDiagnostics = shouldReportDiagnostics;
    exports.resolveRenameNewName = resolveRenameNewName;
    exports.resolveRenameEditText = resolveRenameEditText;
    exports.findOverlapCodeRange = findOverlapCodeRange;
    function isHoverEnabled(info) {
      return !!info.semantic;
    }
    function isInlayHintsEnabled(info) {
      return !!info.semantic;
    }
    function isCodeLensEnabled(info) {
      return !!info.semantic;
    }
    function isMonikerEnabled(info) {
      return !!info.semantic;
    }
    function isInlineValueEnabled(info) {
      return !!info.semantic;
    }
    function isSemanticTokensEnabled(info) {
      return typeof info.semantic == "object" ? info.semantic.shouldHighlight?.() ?? !0 : !!info.semantic;
    }
    function isCallHierarchyEnabled(info) {
      return !!info.navigation;
    }
    function isTypeHierarchyEnabled(info) {
      return !!info.navigation;
    }
    function isRenameEnabled(info) {
      return typeof info.navigation == "object" ? info.navigation.shouldRename?.() ?? !0 : !!info.navigation;
    }
    function isDefinitionEnabled(info) {
      return !!info.navigation;
    }
    function isTypeDefinitionEnabled(info) {
      return !!info.navigation;
    }
    function isReferencesEnabled(info) {
      return !!info.navigation;
    }
    function isImplementationEnabled(info) {
      return !!info.navigation;
    }
    function isHighlightEnabled(info) {
      return typeof info.navigation == "object" ? info.navigation.shouldHighlight?.() ?? !0 : !!info.navigation;
    }
    function isSymbolsEnabled(info) {
      return !!info.structure;
    }
    function isFoldingRangesEnabled(info) {
      return !!info.structure;
    }
    function isSelectionRangesEnabled(info) {
      return !!info.structure;
    }
    function isLinkedEditingEnabled(info) {
      return !!info.structure;
    }
    function isColorEnabled(info) {
      return !!info.structure;
    }
    function isDocumentLinkEnabled(info) {
      return !!info.structure;
    }
    function isDiagnosticsEnabled(info) {
      return !!info.verification;
    }
    function isCodeActionsEnabled(info) {
      return !!info.verification;
    }
    function isFormattingEnabled(info) {
      return !!info.format;
    }
    function isCompletionEnabled(info) {
      return !!info.completion;
    }
    function isAutoInsertEnabled(info) {
      return !!info.completion;
    }
    function isSignatureHelpEnabled(info) {
      return !!info.completion;
    }
    function shouldReportDiagnostics(info, source, code) {
      return typeof info.verification == "object" ? info.verification.shouldReport?.(source, code) ?? !0 : !!info.verification;
    }
    function resolveRenameNewName(newName, info) {
      return typeof info.navigation == "object" ? info.navigation.resolveRenameNewName?.(newName) ?? newName : newName;
    }
    function resolveRenameEditText(text, info) {
      return typeof info.navigation == "object" ? info.navigation.resolveRenameEditText?.(text) ?? text : text;
    }
    function findOverlapCodeRange(start, end, map, filter) {
      let mappedStart, mappedEnd;
      for (let [mapped, mapping] of map.toGeneratedLocation(start))
        if (filter(mapping.data)) {
          mappedStart = mapped;
          break;
        }
      for (let [mapped, mapping] of map.toGeneratedLocation(end))
        if (filter(mapping.data)) {
          mappedEnd = mapped;
          break;
        }
      if (mappedStart === void 0 || mappedEnd === void 0) {
        for (let mapping of map.mappings)
          if (filter(mapping.data)) {
            let mappingStart = mapping.sourceOffsets[0], mappingEnd = mapping.sourceOffsets[mapping.sourceOffsets.length - 1] + mapping.lengths[mapping.lengths.length - 1], overlap = getOverlapRange(start, end, mappingStart, mappingEnd);
            if (overlap) {
              let curMappedStart = overlap.start - mappingStart + mapping.generatedOffsets[0], lastGeneratedLength = (mapping.generatedLengths ?? mapping.lengths)[mapping.generatedOffsets.length - 1], curMappedEndOffset = Math.min(overlap.end - mapping.sourceOffsets[mapping.sourceOffsets.length - 1], lastGeneratedLength), curMappedEnd = mapping.generatedOffsets[mapping.generatedOffsets.length - 1] + curMappedEndOffset;
              mappedStart = mappedStart === void 0 ? curMappedStart : Math.min(mappedStart, curMappedStart), mappedEnd = mappedEnd === void 0 ? curMappedEnd : Math.max(mappedEnd, curMappedEnd);
            }
          }
      }
      if (mappedStart !== void 0 && mappedEnd !== void 0)
        return {
          start: mappedStart,
          end: mappedEnd
        };
    }
    function getOverlapRange(range1Start, range1End, range2Start, range2End) {
      let start = Math.max(range1Start, range2Start), end = Math.min(range1End, range2End);
      if (!(start > end))
        return {
          start,
          end
        };
    }
  }
});

// ../../../node_modules/@volar/language-core/lib/linkedCodeMap.js
var require_linkedCodeMap = __commonJS({
  "../../../node_modules/@volar/language-core/lib/linkedCodeMap.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: !0 });
    exports.LinkedCodeMap = void 0;
    var source_map_1 = require_source_map2(), LinkedCodeMap = class extends source_map_1.SourceMap {
      *getLinkedOffsets(start) {
        for (let mapped of this.toGeneratedLocation(start))
          yield mapped[0];
        for (let mapped of this.toSourceLocation(start))
          yield mapped[0];
      }
    };
    exports.LinkedCodeMap = LinkedCodeMap;
  }
});

// ../../../node_modules/@volar/language-core/lib/types.js
var require_types = __commonJS({
  "../../../node_modules/@volar/language-core/lib/types.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: !0 });
  }
});

// ../../../node_modules/@volar/language-core/lib/utils.js
var require_utils2 = __commonJS({
  "../../../node_modules/@volar/language-core/lib/utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: !0 });
    exports.FileMap = void 0;
    var FileMap2 = class extends Map {
      constructor(caseSensitive) {
        super(), this.caseSensitive = caseSensitive, this.originalFileNames = /* @__PURE__ */ new Map();
      }
      keys() {
        return this.originalFileNames.values();
      }
      get(key) {
        return super.get(this.normalizeId(key));
      }
      has(key) {
        return super.has(this.normalizeId(key));
      }
      set(key, value) {
        return this.originalFileNames.set(this.normalizeId(key), key), super.set(this.normalizeId(key), value);
      }
      delete(key) {
        return this.originalFileNames.delete(this.normalizeId(key)), super.delete(this.normalizeId(key));
      }
      clear() {
        return this.originalFileNames.clear(), super.clear();
      }
      normalizeId(id) {
        return this.caseSensitive ? id : id.toLowerCase();
      }
    };
    exports.FileMap = FileMap2;
  }
});

// ../../../node_modules/@volar/language-core/index.js
var require_language_core = __commonJS({
  "../../../node_modules/@volar/language-core/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      k2 === void 0 && (k2 = k);
      var desc = Object.getOwnPropertyDescriptor(m, k);
      (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) && (desc = { enumerable: !0, get: function() {
        return m[k];
      } }), Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      k2 === void 0 && (k2 = k), o[k2] = m[k];
    })), __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m) p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p) && __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: !0 });
    exports.defaultMapperFactory = exports.SourceMap = void 0;
    exports.createLanguage = createLanguage2;
    exports.forEachEmbeddedCode = forEachEmbeddedCode;
    var source_map_1 = require_source_map2();
    Object.defineProperty(exports, "SourceMap", { enumerable: !0, get: function() {
      return source_map_1.SourceMap;
    } });
    __exportStar(require_editor(), exports);
    __exportStar(require_linkedCodeMap(), exports);
    __exportStar(require_types(), exports);
    __exportStar(require_utils2(), exports);
    var source_map_2 = require_source_map2(), linkedCodeMap_1 = require_linkedCodeMap(), defaultMapperFactory = (mappings) => new source_map_2.SourceMap(mappings);
    exports.defaultMapperFactory = defaultMapperFactory;
    function createLanguage2(plugins, scriptRegistry, sync, onAssociationDirty) {
      let virtualCodeToSourceScriptMap = /* @__PURE__ */ new WeakMap(), virtualCodeToSourceMap = /* @__PURE__ */ new WeakMap(), virtualCodeToLinkedCodeMap = /* @__PURE__ */ new WeakMap(), language = {
        mapperFactory: exports.defaultMapperFactory,
        plugins,
        scripts: {
          fromVirtualCode(virtualCode) {
            return virtualCodeToSourceScriptMap.get(virtualCode);
          },
          get(id, includeFsFiles = !0, shouldRegister = !1) {
            sync(id, includeFsFiles, shouldRegister);
            let result = scriptRegistry.get(id);
            return result?.isAssociationDirty && this.set(id, result.snapshot, result.languageId), scriptRegistry.get(id);
          },
          set(id, snapshot, languageId, _plugins = plugins) {
            if (!languageId) {
              for (let plugin of plugins)
                if (languageId = plugin.getLanguageId?.(id), languageId)
                  break;
            }
            if (!languageId) {
              console.warn(`languageId not found for ${String(id)}`);
              return;
            }
            let associatedOnly = !1;
            for (let plugin of plugins)
              if (plugin.isAssociatedFileOnly?.(id, languageId)) {
                associatedOnly = !0;
                break;
              }
            if (scriptRegistry.has(id)) {
              let sourceScript = scriptRegistry.get(id);
              if (sourceScript.languageId !== languageId || sourceScript.associatedOnly !== associatedOnly)
                return this.delete(id), triggerTargetsDirty(sourceScript), this.set(id, snapshot, languageId);
              if (associatedOnly)
                sourceScript.snapshot !== snapshot && (sourceScript.snapshot = snapshot, triggerTargetsDirty(sourceScript));
              else if (sourceScript.isAssociationDirty || sourceScript.snapshot !== snapshot) {
                sourceScript.snapshot !== snapshot && (sourceScript.snapshot = snapshot, triggerTargetsDirty(sourceScript));
                let codegenCtx = prepareCreateVirtualCode(sourceScript);
                if (sourceScript.generated) {
                  let { updateVirtualCode, createVirtualCode } = sourceScript.generated.languagePlugin, newVirtualCode = updateVirtualCode ? updateVirtualCode(id, sourceScript.generated.root, snapshot, codegenCtx) : createVirtualCode?.(id, languageId, snapshot, codegenCtx);
                  if (newVirtualCode) {
                    sourceScript.generated.root = newVirtualCode, sourceScript.generated.embeddedCodes.clear();
                    for (let code of forEachEmbeddedCode(sourceScript.generated.root))
                      virtualCodeToSourceScriptMap.set(code, sourceScript), sourceScript.generated.embeddedCodes.set(code.id, code);
                    return sourceScript;
                  } else {
                    this.delete(id);
                    return;
                  }
                }
              } else
                return sourceScript;
            } else {
              let sourceScript = {
                id,
                languageId,
                snapshot,
                associatedIds: /* @__PURE__ */ new Set(),
                targetIds: /* @__PURE__ */ new Set(),
                associatedOnly
              };
              if (scriptRegistry.set(id, sourceScript), associatedOnly)
                return sourceScript;
              for (let languagePlugin of _plugins) {
                let virtualCode = languagePlugin.createVirtualCode?.(id, languageId, snapshot, prepareCreateVirtualCode(sourceScript));
                if (virtualCode) {
                  sourceScript.generated = {
                    root: virtualCode,
                    languagePlugin,
                    embeddedCodes: /* @__PURE__ */ new Map()
                  };
                  for (let code of forEachEmbeddedCode(virtualCode))
                    virtualCodeToSourceScriptMap.set(code, sourceScript), sourceScript.generated.embeddedCodes.set(code.id, code);
                  break;
                }
              }
              return sourceScript;
            }
          },
          delete(id) {
            let sourceScript = scriptRegistry.get(id);
            sourceScript && (sourceScript.generated?.languagePlugin.disposeVirtualCode?.(id, sourceScript.generated.root), scriptRegistry.delete(id), triggerTargetsDirty(sourceScript));
          }
        },
        maps: {
          get(virtualCode, sourceScript) {
            let mapCache = virtualCodeToSourceMap.get(virtualCode.snapshot);
            if (mapCache || virtualCodeToSourceMap.set(virtualCode.snapshot, mapCache = /* @__PURE__ */ new WeakMap()), !mapCache.has(sourceScript.snapshot)) {
              let mappings = virtualCode.associatedScriptMappings?.get(sourceScript.id) ?? virtualCode.mappings;
              mapCache.set(sourceScript.snapshot, language.mapperFactory(mappings));
            }
            return mapCache.get(sourceScript.snapshot);
          },
          *forEach(virtualCode) {
            let sourceScript = virtualCodeToSourceScriptMap.get(virtualCode);
            if (yield [
              sourceScript,
              this.get(virtualCode, sourceScript)
            ], virtualCode.associatedScriptMappings)
              for (let [relatedScriptId] of virtualCode.associatedScriptMappings) {
                let relatedSourceScript = scriptRegistry.get(relatedScriptId);
                relatedSourceScript && (yield [
                  relatedSourceScript,
                  this.get(virtualCode, relatedSourceScript)
                ]);
              }
          }
        },
        linkedCodeMaps: {
          get(virtualCode) {
            let sourceScript = virtualCodeToSourceScriptMap.get(virtualCode), mapCache = virtualCodeToLinkedCodeMap.get(virtualCode.snapshot);
            return mapCache?.[0] !== sourceScript.snapshot && virtualCodeToLinkedCodeMap.set(virtualCode.snapshot, mapCache = [
              sourceScript.snapshot,
              virtualCode.linkedCodeMappings ? new linkedCodeMap_1.LinkedCodeMap(virtualCode.linkedCodeMappings) : void 0
            ]), mapCache[1];
          }
        }
      };
      return language;
      function triggerTargetsDirty(sourceScript) {
        sourceScript.targetIds.forEach((id) => {
          let sourceScript2 = scriptRegistry.get(id);
          sourceScript2 && (sourceScript2.isAssociationDirty = !0, onAssociationDirty?.(sourceScript2.id));
        });
      }
      function prepareCreateVirtualCode(sourceScript) {
        for (let id of sourceScript.associatedIds)
          scriptRegistry.get(id)?.targetIds.delete(sourceScript.id);
        return sourceScript.associatedIds.clear(), sourceScript.isAssociationDirty = !1, {
          getAssociatedScript(id) {
            sync(id, !0, !0);
            let relatedSourceScript = scriptRegistry.get(id);
            return relatedSourceScript && (relatedSourceScript.targetIds.add(sourceScript.id), sourceScript.associatedIds.add(relatedSourceScript.id)), relatedSourceScript;
          }
        };
      }
    }
    function* forEachEmbeddedCode(virtualCode) {
      if (yield virtualCode, virtualCode.embeddedCodes)
        for (let embeddedCode of virtualCode.embeddedCodes)
          yield* forEachEmbeddedCode(embeddedCode);
    }
  }
});

// ../../../node_modules/@volar/typescript/lib/common.js
var require_common = __commonJS({
  "../../../node_modules/@volar/typescript/lib/common.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: !0 });
    exports.resolveFileLanguageId = resolveFileLanguageId2;
    function resolveFileLanguageId2(path5) {
      switch (path5.split(".").pop()) {
        case "js":
          return "javascript";
        case "cjs":
          return "javascript";
        case "mjs":
          return "javascript";
        case "ts":
          return "typescript";
        case "cts":
          return "typescript";
        case "mts":
          return "typescript";
        case "jsx":
          return "javascriptreact";
        case "tsx":
          return "typescriptreact";
        case "json":
          return "json";
      }
    }
  }
});

// ../../../node_modules/@volar/typescript/lib/resolveModuleName.js
var require_resolveModuleName = __commonJS({
  "../../../node_modules/@volar/typescript/lib/resolveModuleName.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: !0 });
    exports.createResolveModuleName = createResolveModuleName;
    function createResolveModuleName(ts, getFileSize, host, languagePlugins, getSourceScript) {
      let toSourceFileInfo = /* @__PURE__ */ new Map(), moduleResolutionHost = {
        readFile: host.readFile.bind(host),
        directoryExists: host.directoryExists?.bind(host),
        realpath: host.realpath?.bind(host),
        getCurrentDirectory: host.getCurrentDirectory?.bind(host),
        getDirectories: host.getDirectories?.bind(host),
        useCaseSensitiveFileNames: typeof host.useCaseSensitiveFileNames == "function" ? host.useCaseSensitiveFileNames.bind(host) : host.useCaseSensitiveFileNames,
        fileExists(fileName) {
          let result = host.fileExists(fileName);
          for (let { typescript } of languagePlugins)
            if (typescript) {
              if (!result)
                for (let { extension } of typescript.extraFileExtensions) {
                  if (!fileName.endsWith(`.d.${extension}.ts`))
                    continue;
                  let sourceFileName = fileName.slice(0, -`.d.${extension}.ts`.length) + `.${extension}`;
                  if (fileExists(sourceFileName)) {
                    let sourceScript = getSourceScript(sourceFileName);
                    if (sourceScript?.generated) {
                      let serviceScript = sourceScript.generated.languagePlugin.typescript?.getServiceScript(sourceScript.generated.root);
                      if (serviceScript) {
                        let dtsPath = sourceFileName + ".d.ts";
                        return (serviceScript.extension === ".js" || serviceScript.extension === ".jsx") && fileExists(dtsPath) ? toSourceFileInfo.set(fileName, {
                          sourceFileName: dtsPath,
                          extension: ".ts"
                        }) : toSourceFileInfo.set(fileName, {
                          sourceFileName,
                          extension: serviceScript.extension
                        }), !0;
                      }
                    }
                  }
                }
              if (typescript.resolveHiddenExtensions && fileName.endsWith(".d.ts"))
                for (let { extension } of typescript.extraFileExtensions) {
                  let sourceFileName = fileName.slice(0, -5) + `.${extension}`;
                  if (fileExists(sourceFileName)) {
                    let sourceScript = getSourceScript(sourceFileName);
                    if (sourceScript?.generated) {
                      let serviceScript = sourceScript.generated.languagePlugin.typescript?.getServiceScript(sourceScript.generated.root);
                      if (serviceScript)
                        return toSourceFileInfo.set(fileName, {
                          sourceFileName,
                          extension: serviceScript.extension
                        }), !0;
                    }
                  }
                }
            }
          return result;
        }
      };
      return (moduleName, containingFile, compilerOptions, cache, redirectedReference, resolutionMode) => {
        let result = ts.resolveModuleName(moduleName, containingFile, compilerOptions, moduleResolutionHost, cache, redirectedReference, resolutionMode);
        if (result.resolvedModule) {
          let sourceFileInfo = toSourceFileInfo.get(result.resolvedModule.resolvedFileName);
          sourceFileInfo && (result.resolvedModule.resolvedFileName = sourceFileInfo.sourceFileName, result.resolvedModule.extension = sourceFileInfo.extension);
        }
        return toSourceFileInfo.clear(), result;
      };
      function fileExists(fileName) {
        return host.fileExists(fileName) ? (getFileSize?.(fileName) ?? host.readFile(fileName)?.length ?? 0) < 4 * 1024 * 1024 : !1;
      }
    }
  }
});

// ../../../node_modules/@volar/typescript/lib/node/utils.js
var require_utils3 = __commonJS({
  "../../../node_modules/@volar/typescript/lib/node/utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: !0 });
    exports.getServiceScript = getServiceScript;
    exports.fixupImpliedNodeFormatForFile = fixupImpliedNodeFormatForFile;
    function getServiceScript(language, fileName) {
      let sourceScript = language.scripts.get(fileName);
      if (sourceScript?.targetIds.size)
        for (let targetId of sourceScript.targetIds) {
          let targetScript = language.scripts.get(targetId);
          if (targetScript?.generated) {
            let serviceScript = targetScript.generated.languagePlugin.typescript?.getServiceScript(targetScript.generated.root);
            if (serviceScript)
              return [serviceScript, targetScript, sourceScript];
          }
        }
      if (sourceScript?.associatedOnly)
        return [void 0, sourceScript, sourceScript];
      if (sourceScript?.generated) {
        let serviceScript = sourceScript.generated.languagePlugin.typescript?.getServiceScript(sourceScript.generated.root);
        if (serviceScript)
          return [serviceScript, sourceScript, sourceScript];
      }
      return [void 0, void 0, void 0];
    }
    function fixupImpliedNodeFormatForFile(ts, pluginExtensions, sourceFile, packageJsonInfoCache, host, options) {
      if (sourceFile.impliedNodeFormat !== void 0 || !pluginExtensions.some((ext) => sourceFile.fileName.endsWith(ext)) || [".d.ts", ".ts", ".tsx", ".js", ".jsx"].some((ext) => sourceFile.fileName.endsWith(ext)))
        return;
      let asTs = sourceFile.fileName + ".ts", impliedNodeFormat = ts.getImpliedNodeFormatForFileWorker?.(asTs, packageJsonInfoCache, host, options)?.impliedNodeFormat;
      if (impliedNodeFormat !== void 0)
        return sourceFile.impliedNodeFormat = impliedNodeFormat, () => sourceFile.impliedNodeFormat = void 0;
    }
  }
});

// ../../../node_modules/@volar/typescript/lib/node/decorateLanguageServiceHost.js
var require_decorateLanguageServiceHost = __commonJS({
  "../../../node_modules/@volar/typescript/lib/node/decorateLanguageServiceHost.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: !0 });
    exports.decorateLanguageServiceHost = decorateLanguageServiceHost;
    exports.searchExternalFiles = searchExternalFiles;
    var resolveModuleName_1 = require_resolveModuleName(), utils_1 = require_utils3();
    function decorateLanguageServiceHost(ts, language, languageServiceHost) {
      let pluginExtensions = language.plugins.map((plugin) => plugin.typescript?.extraFileExtensions.map((ext) => "." + ext.extension) ?? []).flat(), scripts = /* @__PURE__ */ new Map(), crashFileNames = /* @__PURE__ */ new Set(), readDirectory = languageServiceHost.readDirectory?.bind(languageServiceHost), resolveModuleNameLiterals = languageServiceHost.resolveModuleNameLiterals?.bind(languageServiceHost), resolveModuleNames = languageServiceHost.resolveModuleNames?.bind(languageServiceHost), getScriptSnapshot = languageServiceHost.getScriptSnapshot.bind(languageServiceHost), getScriptKind = languageServiceHost.getScriptKind?.bind(languageServiceHost);
      if (readDirectory && (languageServiceHost.readDirectory = (path5, extensions, exclude, include, depth) => {
        if (extensions)
          for (let ext of pluginExtensions)
            extensions.includes(ext) || (extensions = [...extensions, ext]);
        return readDirectory(path5, extensions, exclude, include, depth);
      }), pluginExtensions.length) {
        let resolveModuleName = (0, resolveModuleName_1.createResolveModuleName)(ts, ts.sys.getFileSize, languageServiceHost, language.plugins, (fileName) => language.scripts.get(fileName)), moduleResolutionCache = languageServiceHost.getModuleResolutionCache?.();
        resolveModuleNameLiterals && (languageServiceHost.resolveModuleNameLiterals = (moduleLiterals, containingFile, redirectedReference, options, containingSourceFile, ...rest) => {
          let disposeFixup = (0, utils_1.fixupImpliedNodeFormatForFile)(ts, pluginExtensions, containingSourceFile, moduleResolutionCache?.getPackageJsonInfoCache(), languageServiceHost, options);
          try {
            return moduleLiterals.every((name) => !pluginExtensions.some((ext) => name.text.endsWith(ext))) ? resolveModuleNameLiterals(moduleLiterals, containingFile, redirectedReference, options, containingSourceFile, ...rest) : moduleLiterals.map((moduleLiteral) => {
              let mode = ts.getModeForUsageLocation(containingSourceFile, moduleLiteral, options);
              return resolveModuleName(moduleLiteral.text, containingFile, options, moduleResolutionCache, redirectedReference, mode);
            });
          } finally {
            disposeFixup?.();
          }
        }), resolveModuleNames && (languageServiceHost.resolveModuleNames = (moduleNames, containingFile, reusedNames, redirectedReference, options, containingSourceFile) => moduleNames.every((name) => !pluginExtensions.some((ext) => name.endsWith(ext))) ? resolveModuleNames(moduleNames, containingFile, reusedNames, redirectedReference, options, containingSourceFile) : moduleNames.map((moduleName) => resolveModuleName(moduleName, containingFile, options, moduleResolutionCache, redirectedReference).resolvedModule));
      }
      languageServiceHost.getScriptSnapshot = (fileName) => {
        let virtualScript = updateVirtualScript(fileName, !0);
        return virtualScript ? virtualScript.snapshot : getScriptSnapshot(fileName);
      }, getScriptKind && (languageServiceHost.getScriptKind = (fileName) => {
        let virtualScript = updateVirtualScript(fileName, !1);
        return virtualScript ? virtualScript.scriptKind : getScriptKind(fileName);
      });
      function updateVirtualScript(fileName, shouldRegister) {
        if (crashFileNames.has(fileName))
          return;
        let version2;
        try {
          version2 = languageServiceHost.getScriptVersion(fileName);
        } catch {
          crashFileNames.add(fileName);
        }
        if (version2 === void 0)
          return;
        let script = scripts.get(fileName);
        if (!script || script[0] !== version2) {
          script = [version2];
          let sourceScript = language.scripts.get(fileName, void 0, shouldRegister);
          if (sourceScript?.generated) {
            let serviceScript = sourceScript.generated.languagePlugin.typescript?.getServiceScript(sourceScript.generated.root);
            if (serviceScript)
              if (serviceScript.preventLeadingOffset)
                script[1] = {
                  extension: serviceScript.extension,
                  scriptKind: serviceScript.scriptKind,
                  snapshot: serviceScript.code.snapshot
                };
              else {
                let virtualContents = sourceScript.snapshot.getText(0, sourceScript.snapshot.getLength()).split(`
`).map((line) => " ".repeat(line.length)).join(`
`) + serviceScript.code.snapshot.getText(0, serviceScript.code.snapshot.getLength());
                script[1] = {
                  extension: serviceScript.extension,
                  scriptKind: serviceScript.scriptKind,
                  snapshot: ts.ScriptSnapshot.fromString(virtualContents)
                };
              }
            sourceScript.generated.languagePlugin.typescript?.getExtraServiceScripts && console.warn("getExtraServiceScripts() is not available in TS plugin.");
          }
          scripts.set(fileName, script);
        }
        return script[1];
      }
    }
    function searchExternalFiles(ts, project, exts) {
      if (project.projectKind !== ts.server.ProjectKind.Configured)
        return [];
      let configFile = project.getProjectName(), config = ts.readJsonConfigFile(configFile, project.readFile.bind(project)), parseHost = {
        useCaseSensitiveFileNames: project.useCaseSensitiveFileNames(),
        fileExists: project.fileExists.bind(project),
        readFile: project.readFile.bind(project),
        readDirectory: (...args) => (args[1] = exts, project.readDirectory(...args))
      };
      return ts.parseJsonSourceFileConfigFileContent(config, parseHost, project.getCurrentDirectory()).fileNames;
    }
  }
});

// ../../../node_modules/@volar/typescript/lib/node/transform.js
var require_transform = __commonJS({
  "../../../node_modules/@volar/typescript/lib/node/transform.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: !0 });
    exports.transformCallHierarchyItem = transformCallHierarchyItem;
    exports.transformDiagnostic = transformDiagnostic;
    exports.fillSourceFileText = fillSourceFileText;
    exports.transformFileTextChanges = transformFileTextChanges;
    exports.transformDocumentSpan = transformDocumentSpan;
    exports.transformSpan = transformSpan;
    exports.transformTextChange = transformTextChange;
    exports.transformTextSpan = transformTextSpan;
    exports.toSourceOffset = toSourceOffset;
    exports.toSourceRanges = toSourceRanges;
    exports.toSourceOffsets = toSourceOffsets;
    exports.toGeneratedRange = toGeneratedRange;
    exports.toGeneratedRanges = toGeneratedRanges;
    exports.toGeneratedOffset = toGeneratedOffset;
    exports.toGeneratedOffsets = toGeneratedOffsets;
    exports.getMappingOffset = getMappingOffset;
    var language_core_1 = require_language_core(), utils_1 = require_utils3(), transformedDiagnostics = /* @__PURE__ */ new WeakMap(), transformedSourceFile = /* @__PURE__ */ new WeakSet();
    function transformCallHierarchyItem(language, item, fallbackToAnyMatch, filter) {
      let span = transformSpan(language, item.file, item.span, fallbackToAnyMatch, filter), selectionSpan = transformSpan(language, item.file, item.selectionSpan, fallbackToAnyMatch, filter);
      return {
        ...item,
        file: span?.fileName ?? item.file,
        span: span?.textSpan ?? { start: 0, length: 0 },
        selectionSpan: selectionSpan?.textSpan ?? { start: 0, length: 0 }
      };
    }
    function transformDiagnostic(language, diagnostic, program, isTsc) {
      if (!transformedDiagnostics.has(diagnostic)) {
        transformedDiagnostics.set(diagnostic, void 0);
        let { relatedInformation } = diagnostic;
        if (relatedInformation && (diagnostic.relatedInformation = relatedInformation.map((d) => transformDiagnostic(language, d, program, isTsc)).filter((d) => !!d)), diagnostic.file !== void 0 && diagnostic.start !== void 0 && diagnostic.length !== void 0) {
          let [serviceScript] = (0, utils_1.getServiceScript)(language, diagnostic.file.fileName);
          if (serviceScript) {
            let [sourceSpanFileName, sourceSpan] = transformTextSpan(void 0, language, serviceScript, {
              start: diagnostic.start,
              length: diagnostic.length
            }, !0, (data2) => (0, language_core_1.shouldReportDiagnostics)(data2, String(diagnostic.source), String(diagnostic.code))) ?? [], actualDiagnosticFile = sourceSpanFileName ? diagnostic.file.fileName === sourceSpanFileName ? diagnostic.file : program?.getSourceFile(sourceSpanFileName) : void 0;
            sourceSpan && actualDiagnosticFile && (isTsc && fillSourceFileText(language, diagnostic.file), transformedDiagnostics.set(diagnostic, {
              ...diagnostic,
              file: actualDiagnosticFile,
              start: sourceSpan.start,
              length: sourceSpan.length
            }));
          } else
            transformedDiagnostics.set(diagnostic, diagnostic);
        } else
          transformedDiagnostics.set(diagnostic, diagnostic);
      }
      return transformedDiagnostics.get(diagnostic);
    }
    function fillSourceFileText(language, sourceFile) {
      if (transformedSourceFile.has(sourceFile))
        return;
      transformedSourceFile.add(sourceFile);
      let [serviceScript] = (0, utils_1.getServiceScript)(language, sourceFile.fileName);
      if (serviceScript && !serviceScript.preventLeadingOffset) {
        let sourceScript = language.scripts.fromVirtualCode(serviceScript.code);
        sourceFile.text = sourceScript.snapshot.getText(0, sourceScript.snapshot.getLength()) + sourceFile.text.substring(sourceScript.snapshot.getLength());
      }
    }
    function transformFileTextChanges(language, changes, fallbackToAnyMatch, filter) {
      let changesPerFile = {}, newFiles = /* @__PURE__ */ new Set();
      for (let fileChanges of changes) {
        let [_, source] = (0, utils_1.getServiceScript)(language, fileChanges.fileName);
        if (source)
          fileChanges.textChanges.forEach((c) => {
            let { fileName, textSpan } = transformSpan(language, fileChanges.fileName, c.span, fallbackToAnyMatch, filter) ?? {};
            fileName && textSpan && (changesPerFile[fileName] ?? (changesPerFile[fileName] = [])).push({ ...c, span: textSpan });
          });
        else {
          let list2 = changesPerFile[fileChanges.fileName] ?? (changesPerFile[fileChanges.fileName] = []);
          fileChanges.textChanges.forEach((c) => {
            list2.push(c);
          }), fileChanges.isNewFile && newFiles.add(fileChanges.fileName);
        }
      }
      let result = [];
      for (let fileName in changesPerFile)
        result.push({
          fileName,
          isNewFile: newFiles.has(fileName),
          textChanges: changesPerFile[fileName]
        });
      return result;
    }
    function transformDocumentSpan(language, documentSpan, fallbackToAnyMatch, filter, shouldFallback) {
      let textSpan = transformSpan(language, documentSpan.fileName, documentSpan.textSpan, fallbackToAnyMatch, filter);
      if (!textSpan && shouldFallback && (textSpan = {
        fileName: documentSpan.fileName,
        textSpan: { start: 0, length: 0 }
      }), !textSpan)
        return;
      let contextSpan = transformSpan(language, documentSpan.fileName, documentSpan.contextSpan, fallbackToAnyMatch, filter), originalTextSpan = transformSpan(language, documentSpan.originalFileName, documentSpan.originalTextSpan, fallbackToAnyMatch, filter), originalContextSpan = transformSpan(language, documentSpan.originalFileName, documentSpan.originalContextSpan, fallbackToAnyMatch, filter);
      return {
        ...documentSpan,
        fileName: textSpan.fileName,
        textSpan: textSpan.textSpan,
        contextSpan: contextSpan?.textSpan,
        originalFileName: originalTextSpan?.fileName,
        originalTextSpan: originalTextSpan?.textSpan,
        originalContextSpan: originalContextSpan?.textSpan
      };
    }
    function transformSpan(language, fileName, textSpan, fallbackToAnyMatch, filter) {
      if (!fileName || !textSpan)
        return;
      let [serviceScript] = (0, utils_1.getServiceScript)(language, fileName);
      if (serviceScript) {
        let [sourceSpanFileName, sourceSpan] = transformTextSpan(void 0, language, serviceScript, textSpan, fallbackToAnyMatch, filter) ?? [];
        if (sourceSpan && sourceSpanFileName)
          return {
            fileName: sourceSpanFileName,
            textSpan: sourceSpan
          };
      } else
        return {
          fileName,
          textSpan
        };
    }
    function transformTextChange(sourceScript, language, serviceScript, textChange, fallbackToAnyMatch, filter) {
      let [sourceSpanFileName, sourceSpan] = transformTextSpan(sourceScript, language, serviceScript, textChange.span, fallbackToAnyMatch, filter) ?? [];
      if (sourceSpan && sourceSpanFileName)
        return [sourceSpanFileName, {
          newText: textChange.newText,
          span: sourceSpan
        }];
    }
    function transformTextSpan(sourceScript, language, serviceScript, textSpan, fallbackToAnyMatch, filter) {
      let start = textSpan.start, end = textSpan.start + textSpan.length;
      for (let [fileName, sourceStart, sourceEnd] of toSourceRanges(sourceScript, language, serviceScript, start, end, fallbackToAnyMatch, filter))
        return [fileName, {
          start: sourceStart,
          length: sourceEnd - sourceStart
        }];
    }
    function toSourceOffset(sourceScript, language, serviceScript, position, filter) {
      for (let source of toSourceOffsets(sourceScript, language, serviceScript, position, filter))
        return source;
    }
    function* toSourceRanges(sourceScript, language, serviceScript, start, end, fallbackToAnyMatch, filter) {
      if (sourceScript) {
        let map = language.maps.get(serviceScript.code, sourceScript);
        for (let [sourceStart, sourceEnd] of map.toSourceRange(start - getMappingOffset(language, serviceScript), end - getMappingOffset(language, serviceScript), fallbackToAnyMatch, filter))
          yield [sourceScript.id, sourceStart, sourceEnd];
      } else
        for (let [sourceScript2, map] of language.maps.forEach(serviceScript.code))
          for (let [sourceStart, sourceEnd] of map.toSourceRange(start - getMappingOffset(language, serviceScript), end - getMappingOffset(language, serviceScript), fallbackToAnyMatch, filter))
            yield [sourceScript2.id, sourceStart, sourceEnd];
    }
    function* toSourceOffsets(sourceScript, language, serviceScript, position, filter) {
      if (sourceScript) {
        let map = language.maps.get(serviceScript.code, sourceScript);
        for (let [sourceOffset, mapping] of map.toSourceLocation(position - getMappingOffset(language, serviceScript)))
          filter(mapping.data) && (yield [sourceScript.id, sourceOffset]);
      } else
        for (let [sourceScript2, map] of language.maps.forEach(serviceScript.code))
          for (let [sourceOffset, mapping] of map.toSourceLocation(position - getMappingOffset(language, serviceScript)))
            filter(mapping.data) && (yield [sourceScript2.id, sourceOffset]);
    }
    function toGeneratedRange(language, serviceScript, sourceScript, start, end, filter) {
      for (let result of toGeneratedRanges(language, serviceScript, sourceScript, start, end, filter))
        return result;
    }
    function* toGeneratedRanges(language, serviceScript, sourceScript, start, end, filter) {
      let map = language.maps.get(serviceScript.code, sourceScript);
      for (let [generateStart, generateEnd] of map.toGeneratedRange(start, end, !0, filter))
        yield [
          generateStart + getMappingOffset(language, serviceScript),
          generateEnd + getMappingOffset(language, serviceScript)
        ];
    }
    function toGeneratedOffset(language, serviceScript, sourceScript, position, filter) {
      for (let [generateOffset] of toGeneratedOffsets(language, serviceScript, sourceScript, position, filter))
        return generateOffset;
    }
    function* toGeneratedOffsets(language, serviceScript, sourceScript, position, filter) {
      let map = language.maps.get(serviceScript.code, sourceScript);
      for (let [generateOffset, mapping] of map.toGeneratedLocation(position))
        filter(mapping.data) && (yield [generateOffset + getMappingOffset(language, serviceScript), mapping]);
    }
    function getMappingOffset(language, serviceScript) {
      return serviceScript.preventLeadingOffset ? 0 : language.scripts.fromVirtualCode(serviceScript.code).snapshot.getLength();
    }
  }
});

// ../../../node_modules/@volar/typescript/lib/node/decorateProgram.js
var require_decorateProgram = __commonJS({
  "../../../node_modules/@volar/typescript/lib/node/decorateProgram.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: !0 });
    exports.decorateProgram = decorateProgram;
    var transform_1 = require_transform(), utils_1 = require_utils3();
    function decorateProgram(language, program) {
      let emit = program.emit, getSyntacticDiagnostics = program.getSyntacticDiagnostics, getSemanticDiagnostics = program.getSemanticDiagnostics, getGlobalDiagnostics = program.getGlobalDiagnostics, getSourceFileByPath = program.getSourceFileByPath, getBindAndCheckDiagnostics = program.getBindAndCheckDiagnostics;
      program.emit = (...args) => {
        let result = emit(...args);
        return {
          ...result,
          diagnostics: result.diagnostics.map((d) => (0, transform_1.transformDiagnostic)(language, d, program, !0)).filter((d) => !!d)
        };
      }, program.getSyntacticDiagnostics = (sourceFile, cancellationToken) => {
        if (sourceFile) {
          let [serviceScript, targetScript, sourceScript] = (0, utils_1.getServiceScript)(language, sourceFile.fileName), actualSourceFile = targetScript ? program.getSourceFile(targetScript.id) : sourceFile;
          return getSyntacticDiagnostics(actualSourceFile, cancellationToken).map((d) => (0, transform_1.transformDiagnostic)(language, d, program, !0)).filter((d) => !!d).filter((d) => !serviceScript || !d.file || language.scripts.get(d.file.fileName) === sourceScript);
        } else
          return getSyntacticDiagnostics(void 0, cancellationToken).map((d) => (0, transform_1.transformDiagnostic)(language, d, program, !0)).filter((d) => !!d);
      }, program.getSemanticDiagnostics = (sourceFile, cancellationToken) => {
        if (sourceFile) {
          let [serviceScript, targetScript, sourceScript] = (0, utils_1.getServiceScript)(language, sourceFile.fileName), actualSourceFile = targetScript ? program.getSourceFile(targetScript.id) : sourceFile;
          return getSemanticDiagnostics(actualSourceFile, cancellationToken).map((d) => (0, transform_1.transformDiagnostic)(language, d, program, !0)).filter((d) => !!d).filter((d) => !serviceScript || !d.file || language.scripts.get(d.file.fileName) === sourceScript);
        } else
          return getSemanticDiagnostics(void 0, cancellationToken).map((d) => (0, transform_1.transformDiagnostic)(language, d, program, !0)).filter((d) => !!d);
      }, program.getGlobalDiagnostics = (cancellationToken) => getGlobalDiagnostics(cancellationToken).map((d) => (0, transform_1.transformDiagnostic)(language, d, program, !0)).filter((d) => !!d), program.getBindAndCheckDiagnostics = (sourceFile, cancellationToken) => {
        if (sourceFile) {
          let [serviceScript, targetScript, sourceScript] = (0, utils_1.getServiceScript)(language, sourceFile.fileName), actualSourceFile = targetScript ? program.getSourceFile(targetScript.id) : sourceFile;
          return getBindAndCheckDiagnostics(actualSourceFile, cancellationToken).map((d) => (0, transform_1.transformDiagnostic)(language, d, program, !0)).filter((d) => !!d).filter((d) => !serviceScript || language.scripts.get(d.file.fileName) === sourceScript);
        } else
          return getBindAndCheckDiagnostics(void 0, cancellationToken).map((d) => (0, transform_1.transformDiagnostic)(language, d, program, !0)).filter((d) => !!d);
      }, program.getSourceFileByPath = (path5) => {
        let sourceFile = getSourceFileByPath(path5);
        return sourceFile && (0, transform_1.fillSourceFileText)(language, sourceFile), sourceFile;
      };
    }
  }
});

// ../../../node_modules/@volar/typescript/lib/node/proxyCreateProgram.js
var require_proxyCreateProgram = __commonJS({
  "../../../node_modules/@volar/typescript/lib/node/proxyCreateProgram.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: !0 });
    exports.proxyCreateProgram = proxyCreateProgram;
    var language_core_1 = require_language_core(), common_1 = require_common(), resolveModuleName_1 = require_resolveModuleName(), decorateProgram_1 = require_decorateProgram(), utils_1 = require_utils3(), arrayEqual = (a, b) => {
      if (a.length !== b.length)
        return !1;
      for (let i2 = 0; i2 < a.length; i2++)
        if (a[i2] !== b[i2])
          return !1;
      return !0;
    }, objectEqual = (a, b) => {
      let keysA = Object.keys(a), keysB = Object.keys(b);
      if (keysA.length !== keysB.length)
        return !1;
      for (let key of keysA)
        if (a[key] !== b[key])
          return !1;
      return !0;
    };
    function proxyCreateProgram(ts, original, create) {
      let sourceFileSnapshots = new language_core_1.FileMap(ts.sys.useCaseSensitiveFileNames), parsedSourceFiles = /* @__PURE__ */ new WeakMap(), lastOptions, languagePlugins, language, moduleResolutionCache;
      return new Proxy(original, {
        apply: (target, thisArg, args) => {
          let options = args[0];
          if (assert2(!!options.host, "!!options.host"), !lastOptions || !languagePlugins || !language || !arrayEqual(options.rootNames, lastOptions.rootNames) || !objectEqual(options.options, lastOptions.options)) {
            moduleResolutionCache = ts.createModuleResolutionCache(options.host.getCurrentDirectory(), options.host.getCanonicalFileName, options.options), lastOptions = options;
            let created = create(ts, options);
            Array.isArray(created) ? languagePlugins = created : languagePlugins = created.languagePlugins, language = (0, language_core_1.createLanguage)([
              ...languagePlugins,
              { getLanguageId: common_1.resolveFileLanguageId }
            ], new language_core_1.FileMap(ts.sys.useCaseSensitiveFileNames), (fileName, includeFsFiles) => {
              if (includeFsFiles && !sourceFileSnapshots.has(fileName)) {
                let sourceFileText = originalHost.readFile(fileName);
                sourceFileText !== void 0 ? sourceFileSnapshots.set(fileName, [void 0, {
                  getChangeRange() {
                  },
                  getLength() {
                    return sourceFileText.length;
                  },
                  getText(start, end) {
                    return sourceFileText.substring(start, end);
                  }
                }]) : sourceFileSnapshots.set(fileName, [void 0, void 0]);
              }
              let snapshot = sourceFileSnapshots.get(fileName)?.[1];
              snapshot ? language.scripts.set(fileName, snapshot) : language.scripts.delete(fileName);
            }), "setup" in created && created.setup?.(language);
          }
          let originalHost = options.host, pluginExtensions = languagePlugins.map((plugin) => plugin.typescript?.extraFileExtensions.map(({ extension }) => `.${extension}`) ?? []).flat();
          if (options.host = { ...originalHost }, options.host.getSourceFile = (fileName, languageVersionOrOptions, onError, shouldCreateNewSourceFile) => {
            let originalSourceFile = originalHost.getSourceFile(fileName, languageVersionOrOptions, onError, shouldCreateNewSourceFile);
            if ((!sourceFileSnapshots.has(fileName) || sourceFileSnapshots.get(fileName)?.[0] !== originalSourceFile) && (originalSourceFile ? sourceFileSnapshots.set(fileName, [originalSourceFile, {
              getChangeRange() {
              },
              getLength() {
                return originalSourceFile.text.length;
              },
              getText(start, end) {
                return originalSourceFile.text.substring(start, end);
              }
            }]) : sourceFileSnapshots.set(fileName, [void 0, void 0])), !!originalSourceFile) {
              if (!parsedSourceFiles.has(originalSourceFile)) {
                let sourceScript = language.scripts.get(fileName);
                if (assert2(!!sourceScript, "!!sourceScript"), parsedSourceFiles.set(originalSourceFile, void 0), sourceScript.generated?.languagePlugin.typescript) {
                  let { getServiceScript, getExtraServiceScripts } = sourceScript.generated.languagePlugin.typescript, serviceScript = getServiceScript(sourceScript.generated.root);
                  if (serviceScript) {
                    let virtualContents;
                    serviceScript.preventLeadingOffset ? virtualContents = serviceScript.code.snapshot.getText(0, serviceScript.code.snapshot.getLength()) : virtualContents = originalSourceFile.text.split(`
`).map((line) => " ".repeat(line.length)).join(`
`) + serviceScript.code.snapshot.getText(0, serviceScript.code.snapshot.getLength());
                    let parsedSourceFile = ts.createSourceFile(fileName, virtualContents, languageVersionOrOptions, void 0, serviceScript.scriptKind);
                    parsedSourceFile.version = originalSourceFile.version, originalSourceFile.scriptKind = serviceScript.scriptKind, parsedSourceFiles.set(originalSourceFile, parsedSourceFile);
                  }
                  getExtraServiceScripts && console.warn("getExtraServiceScripts() is not available in this use case.");
                }
              }
              return parsedSourceFiles.get(originalSourceFile) ?? originalSourceFile;
            }
          }, pluginExtensions.length) {
            options.options.allowArbitraryExtensions = !0;
            let resolveModuleName = (0, resolveModuleName_1.createResolveModuleName)(ts, ts.sys.getFileSize, originalHost, language.plugins, (fileName) => language.scripts.get(fileName)), resolveModuleNameLiterals = originalHost.resolveModuleNameLiterals, resolveModuleNames = originalHost.resolveModuleNames;
            options.host.resolveModuleNameLiterals = (moduleLiterals, containingFile, redirectedReference, compilerOptions, containingSourceFile, ...rest) => {
              let disposeFixup = (0, utils_1.fixupImpliedNodeFormatForFile)(ts, pluginExtensions, containingSourceFile, moduleResolutionCache.getPackageJsonInfoCache(), originalHost, compilerOptions);
              try {
                return resolveModuleNameLiterals && moduleLiterals.every((name) => !pluginExtensions.some((ext) => name.text.endsWith(ext))) ? resolveModuleNameLiterals(moduleLiterals, containingFile, redirectedReference, compilerOptions, containingSourceFile, ...rest) : moduleLiterals.map((moduleLiteral) => {
                  let mode = ts.getModeForUsageLocation(containingSourceFile, moduleLiteral, compilerOptions);
                  return resolveModuleName(moduleLiteral.text, containingFile, compilerOptions, moduleResolutionCache, redirectedReference, mode);
                });
              } finally {
                disposeFixup?.();
              }
            }, options.host.resolveModuleNames = (moduleNames, containingFile, reusedNames, redirectedReference, compilerOptions, containingSourceFile) => resolveModuleNames && moduleNames.every((name) => !pluginExtensions.some((ext) => name.endsWith(ext))) ? resolveModuleNames(moduleNames, containingFile, reusedNames, redirectedReference, compilerOptions, containingSourceFile) : moduleNames.map((moduleName) => resolveModuleName(moduleName, containingFile, compilerOptions, moduleResolutionCache, redirectedReference, containingSourceFile?.impliedNodeFormat).resolvedModule);
          }
          let program = Reflect.apply(target, thisArg, args);
          return (0, decorateProgram_1.decorateProgram)(language, program), program;
        }
      });
    }
    function assert2(condition, message) {
      if (!condition)
        throw console.error(message), new Error(message);
    }
  }
});

// ../../../node_modules/@volar/typescript/lib/node/dedupe.js
var require_dedupe = __commonJS({
  "../../../node_modules/@volar/typescript/lib/node/dedupe.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: !0 });
    exports.dedupeDocumentSpans = dedupeDocumentSpans;
    function dedupeDocumentSpans(items) {
      return dedupe(items, (item) => [
        item.fileName,
        item.textSpan.start,
        item.textSpan.length
      ].join(":"));
    }
    function dedupe(items, getKey) {
      let map = /* @__PURE__ */ new Map();
      for (let item of items.reverse())
        map.set(getKey(item), item);
      return [...map.values()];
    }
  }
});

// ../../../node_modules/@volar/typescript/lib/node/proxyLanguageService.js
var require_proxyLanguageService = __commonJS({
  "../../../node_modules/@volar/typescript/lib/node/proxyLanguageService.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: !0 });
    exports.createProxyLanguageService = createProxyLanguageService;
    var language_core_1 = require_language_core(), dedupe_1 = require_dedupe(), transform_1 = require_transform(), utils_1 = require_utils3(), windowsPathReg = /\\/g;
    function createProxyLanguageService(languageService) {
      let proxyCache = /* @__PURE__ */ new Map(), getProxyMethod;
      return {
        initialize(language) {
          getProxyMethod = (target, p) => {
            switch (p) {
              case "getNavigationTree":
                return getNavigationTree(language, target[p]);
              case "getOutliningSpans":
                return getOutliningSpans(language, target[p]);
              case "getFormattingEditsForDocument":
                return getFormattingEditsForDocument(language, target[p]);
              case "getFormattingEditsForRange":
                return getFormattingEditsForRange(language, target[p]);
              case "getFormattingEditsAfterKeystroke":
                return getFormattingEditsAfterKeystroke(language, target[p]);
              case "getEditsForFileRename":
                return getEditsForFileRename(language, target[p]);
              case "getLinkedEditingRangeAtPosition":
                return getLinkedEditingRangeAtPosition(language, target[p]);
              case "prepareCallHierarchy":
                return prepareCallHierarchy(language, target[p]);
              case "provideCallHierarchyIncomingCalls":
                return provideCallHierarchyIncomingCalls(language, target[p]);
              case "provideCallHierarchyOutgoingCalls":
                return provideCallHierarchyOutgoingCalls(language, target[p]);
              case "organizeImports":
                return organizeImports(language, target[p]);
              case "getQuickInfoAtPosition":
                return getQuickInfoAtPosition(language, target[p]);
              case "getSignatureHelpItems":
                return getSignatureHelpItems(language, target[p]);
              case "getDocumentHighlights":
                return getDocumentHighlights(language, target[p]);
              case "getApplicableRefactors":
                return getApplicableRefactors(language, target[p]);
              case "getEditsForRefactor":
                return getEditsForRefactor(language, target[p]);
              case "getCombinedCodeFix":
                return getCombinedCodeFix(language, target[p]);
              case "getRenameInfo":
                return getRenameInfo(language, target[p]);
              case "getCodeFixesAtPosition":
                return getCodeFixesAtPosition(language, target[p]);
              case "getEncodedSemanticClassifications":
                return getEncodedSemanticClassifications(language, target[p]);
              case "getSyntacticDiagnostics":
                return getSyntacticDiagnostics(language, languageService, target[p]);
              case "getSemanticDiagnostics":
                return getSemanticDiagnostics(language, languageService, target[p]);
              case "getSuggestionDiagnostics":
                return getSuggestionDiagnostics(language, languageService, target[p]);
              case "getDefinitionAndBoundSpan":
                return getDefinitionAndBoundSpan(language, target[p]);
              case "findReferences":
                return findReferences(language, target[p]);
              case "getDefinitionAtPosition":
                return getDefinitionAtPosition(language, target[p]);
              case "getTypeDefinitionAtPosition":
                return getTypeDefinitionAtPosition(language, target[p]);
              case "getImplementationAtPosition":
                return getImplementationAtPosition(language, target[p]);
              case "findRenameLocations":
                return findRenameLocations(language, target[p]);
              case "getReferencesAtPosition":
                return getReferencesAtPosition(language, target[p]);
              case "getCompletionsAtPosition":
                return getCompletionsAtPosition(language, target[p]);
              case "getCompletionEntryDetails":
                return getCompletionEntryDetails(language, target[p]);
              case "provideInlayHints":
                return provideInlayHints(language, target[p]);
              case "getFileReferences":
                return getFileReferences(language, target[p]);
              case "getNavigateToItems":
                return getNavigateToItems(language, target[p]);
            }
          };
        },
        proxy: new Proxy(languageService, {
          get(target, p, receiver) {
            if (getProxyMethod) {
              proxyCache.has(p) || proxyCache.set(p, getProxyMethod(target, p));
              let proxyMethod = proxyCache.get(p);
              if (proxyMethod)
                return proxyMethod;
            }
            return Reflect.get(target, p, receiver);
          },
          set(target, p, value, receiver) {
            return Reflect.set(target, p, value, receiver);
          }
        })
      };
    }
    function getNavigationTree(language, getNavigationTree2) {
      return (filePath) => {
        let fileName = filePath.replace(windowsPathReg, "/"), [serviceScript, targetScript] = (0, utils_1.getServiceScript)(language, fileName);
        if (serviceScript || targetScript?.associatedOnly) {
          let tree = getNavigationTree2(targetScript.id);
          return tree.childItems = void 0, tree;
        } else
          return getNavigationTree2(fileName);
      };
    }
    function getOutliningSpans(language, getOutliningSpans2) {
      return (filePath) => {
        let fileName = filePath.replace(windowsPathReg, "/"), [serviceScript, targetScript] = (0, utils_1.getServiceScript)(language, fileName);
        return serviceScript || targetScript?.associatedOnly ? [] : getOutliningSpans2(fileName);
      };
    }
    function getFormattingEditsForDocument(language, getFormattingEditsForDocument2) {
      return (filePath, options) => {
        let fileName = filePath.replace(windowsPathReg, "/"), [serviceScript, targetScript, sourceScript] = (0, utils_1.getServiceScript)(language, fileName);
        return targetScript?.associatedOnly ? [] : serviceScript ? language.maps.get(serviceScript.code, targetScript).mappings.some((mapping) => (0, language_core_1.isFormattingEnabled)(mapping.data)) ? getFormattingEditsForDocument2(targetScript.id, options).map((edit) => (0, transform_1.transformTextChange)(sourceScript, language, serviceScript, edit, !1, language_core_1.isFormattingEnabled)?.[1]).filter((edit) => !!edit) : [] : getFormattingEditsForDocument2(fileName, options);
      };
    }
    function getFormattingEditsForRange(language, getFormattingEditsForRange2) {
      return (filePath, start, end, options) => {
        let fileName = filePath.replace(windowsPathReg, "/"), [serviceScript, targetScript, sourceScript] = (0, utils_1.getServiceScript)(language, fileName);
        if (targetScript?.associatedOnly)
          return [];
        if (serviceScript) {
          let generatedRange = (0, transform_1.toGeneratedRange)(language, serviceScript, sourceScript, start, end, language_core_1.isFormattingEnabled);
          return generatedRange !== void 0 ? getFormattingEditsForRange2(targetScript.id, generatedRange[0], generatedRange[1], options).map((edit) => (0, transform_1.transformTextChange)(sourceScript, language, serviceScript, edit, !1, language_core_1.isFormattingEnabled)?.[1]).filter((edit) => !!edit) : [];
        } else
          return getFormattingEditsForRange2(fileName, start, end, options);
      };
    }
    function getFormattingEditsAfterKeystroke(language, getFormattingEditsAfterKeystroke2) {
      return (filePath, position, key, options) => {
        let fileName = filePath.replace(windowsPathReg, "/"), [serviceScript, targetScript, sourceScript] = (0, utils_1.getServiceScript)(language, fileName);
        if (targetScript?.associatedOnly)
          return [];
        if (serviceScript) {
          let generatePosition = (0, transform_1.toGeneratedOffset)(language, serviceScript, sourceScript, position, language_core_1.isFormattingEnabled);
          return generatePosition !== void 0 ? getFormattingEditsAfterKeystroke2(targetScript.id, generatePosition, key, options).map((edit) => (0, transform_1.transformTextChange)(sourceScript, language, serviceScript, edit, !1, language_core_1.isFormattingEnabled)?.[1]).filter((edit) => !!edit) : [];
        } else
          return getFormattingEditsAfterKeystroke2(fileName, position, key, options);
      };
    }
    function getEditsForFileRename(language, getEditsForFileRename2) {
      return (oldFilePath, newFilePath, formatOptions, preferences) => {
        let edits = getEditsForFileRename2(oldFilePath, newFilePath, formatOptions, preferences);
        return (0, transform_1.transformFileTextChanges)(language, edits, !1, language_core_1.isRenameEnabled);
      };
    }
    function getLinkedEditingRangeAtPosition(language, getLinkedEditingRangeAtPosition2) {
      return (filePath, position) => {
        let fileName = filePath.replace(windowsPathReg, "/"), [serviceScript, targetScript, sourceScript] = (0, utils_1.getServiceScript)(language, fileName);
        if (!targetScript?.associatedOnly)
          if (serviceScript) {
            let generatePosition = (0, transform_1.toGeneratedOffset)(language, serviceScript, sourceScript, position, language_core_1.isLinkedEditingEnabled);
            if (generatePosition !== void 0) {
              let info = getLinkedEditingRangeAtPosition2(targetScript.id, generatePosition);
              if (info)
                return {
                  ranges: info.ranges.map((span) => (0, transform_1.transformTextSpan)(sourceScript, language, serviceScript, span, !1, language_core_1.isLinkedEditingEnabled)?.[1]).filter((span) => !!span),
                  wordPattern: info.wordPattern
                };
            }
          } else
            return getLinkedEditingRangeAtPosition2(fileName, position);
      };
    }
    function prepareCallHierarchy(language, prepareCallHierarchy2) {
      return (filePath, position) => {
        let fileName = filePath.replace(windowsPathReg, "/"), [serviceScript, targetScript, sourceScript] = (0, utils_1.getServiceScript)(language, fileName);
        if (!targetScript?.associatedOnly)
          if (serviceScript) {
            let generatePosition = (0, transform_1.toGeneratedOffset)(language, serviceScript, sourceScript, position, language_core_1.isCallHierarchyEnabled);
            if (generatePosition !== void 0) {
              let item = prepareCallHierarchy2(targetScript.id, generatePosition);
              if (Array.isArray(item))
                return item.map((item2) => (0, transform_1.transformCallHierarchyItem)(language, item2, !0, language_core_1.isCallHierarchyEnabled));
              if (item)
                return (0, transform_1.transformCallHierarchyItem)(language, item, !0, language_core_1.isCallHierarchyEnabled);
            }
          } else
            return prepareCallHierarchy2(fileName, position);
      };
    }
    function provideCallHierarchyIncomingCalls(language, provideCallHierarchyIncomingCalls2) {
      return (filePath, position) => {
        let calls = [], fileName = filePath.replace(windowsPathReg, "/"), [serviceScript, targetScript, sourceScript] = (0, utils_1.getServiceScript)(language, fileName);
        if (targetScript?.associatedOnly)
          return [];
        if (serviceScript) {
          let generatePosition = (0, transform_1.toGeneratedOffset)(language, serviceScript, sourceScript, position, language_core_1.isCallHierarchyEnabled);
          generatePosition !== void 0 && (calls = provideCallHierarchyIncomingCalls2(targetScript.id, generatePosition));
        } else
          calls = provideCallHierarchyIncomingCalls2(fileName, position);
        return calls.map((call) => {
          let from = (0, transform_1.transformCallHierarchyItem)(language, call.from, !0, language_core_1.isCallHierarchyEnabled), fromSpans = call.fromSpans.map((span) => (0, transform_1.transformSpan)(language, call.from.file, span, !0, language_core_1.isCallHierarchyEnabled)?.textSpan).filter((span) => !!span);
          return {
            from,
            fromSpans
          };
        });
      };
    }
    function provideCallHierarchyOutgoingCalls(language, provideCallHierarchyOutgoingCalls2) {
      return (filePath, position) => {
        let calls = [], fileName = filePath.replace(windowsPathReg, "/"), [serviceScript, targetScript, sourceScript] = (0, utils_1.getServiceScript)(language, fileName);
        if (targetScript?.associatedOnly)
          return [];
        if (serviceScript) {
          let generatePosition = (0, transform_1.toGeneratedOffset)(language, serviceScript, sourceScript, position, language_core_1.isCallHierarchyEnabled);
          generatePosition !== void 0 && (calls = provideCallHierarchyOutgoingCalls2(targetScript.id, generatePosition));
        } else
          calls = provideCallHierarchyOutgoingCalls2(fileName, position);
        return calls.map((call) => {
          let to = (0, transform_1.transformCallHierarchyItem)(language, call.to, !0, language_core_1.isCallHierarchyEnabled), fromSpans = call.fromSpans.map((span) => serviceScript ? (0, transform_1.transformTextSpan)(sourceScript, language, serviceScript, span, !0, language_core_1.isCallHierarchyEnabled)?.[1] : span).filter((span) => !!span);
          return {
            to,
            fromSpans
          };
        });
      };
    }
    function organizeImports(language, organizeImports2) {
      return (args, formatOptions, preferences) => {
        let unresolved = organizeImports2(args, formatOptions, preferences);
        return (0, transform_1.transformFileTextChanges)(language, unresolved, !1, language_core_1.isCodeActionsEnabled);
      };
    }
    function getQuickInfoAtPosition(language, getQuickInfoAtPosition2) {
      return (filePath, position, ...args) => {
        let fileName = filePath.replace(windowsPathReg, "/"), [serviceScript, targetScript, sourceScript] = (0, utils_1.getServiceScript)(language, fileName);
        if (!targetScript?.associatedOnly)
          if (serviceScript) {
            let infos = [];
            for (let [generatePosition] of (0, transform_1.toGeneratedOffsets)(language, serviceScript, sourceScript, position, language_core_1.isHoverEnabled)) {
              let info = getQuickInfoAtPosition2(targetScript.id, generatePosition, ...args);
              if (info) {
                let textSpan = (0, transform_1.transformTextSpan)(sourceScript, language, serviceScript, info.textSpan, !0, language_core_1.isHoverEnabled)?.[1];
                textSpan && infos.push({
                  ...info,
                  textSpan
                });
              }
            }
            if (infos.length === 1)
              return infos[0];
            if (infos.length >= 2) {
              let combine = { ...infos[0] };
              combine.displayParts = combine.displayParts?.slice(), combine.documentation = combine.documentation?.slice(), combine.tags = combine.tags?.slice();
              let displayPartsStrs = /* @__PURE__ */ new Set([displayPartsToString(infos[0].displayParts)]), documentationStrs = /* @__PURE__ */ new Set([displayPartsToString(infos[0].documentation)]), tagsStrs = /* @__PURE__ */ new Set();
              for (let tag of infos[0].tags ?? [])
                tagsStrs.add(tag.name + "__volar__" + displayPartsToString(tag.text));
              for (let i2 = 1; i2 < infos.length; i2++) {
                let { displayParts, documentation, tags } = infos[i2];
                displayParts?.length && !displayPartsStrs.has(displayPartsToString(displayParts)) && (displayPartsStrs.add(displayPartsToString(displayParts)), combine.displayParts ??= [], combine.displayParts.push({ ...displayParts[0], text: `

` + displayParts[0].text }), combine.displayParts.push(...displayParts.slice(1))), documentation?.length && !documentationStrs.has(displayPartsToString(documentation)) && (documentationStrs.add(displayPartsToString(documentation)), combine.documentation ??= [], combine.documentation.push({ ...documentation[0], text: `

` + documentation[0].text }), combine.documentation.push(...documentation.slice(1)));
                for (let tag of tags ?? [])
                  tagsStrs.has(tag.name + "__volar__" + displayPartsToString(tag.text)) || (tagsStrs.add(tag.name + "__volar__" + displayPartsToString(tag.text)), combine.tags ??= [], combine.tags.push(tag));
              }
              return combine;
            }
          } else
            return getQuickInfoAtPosition2(fileName, position, ...args);
      };
    }
    function getSignatureHelpItems(language, getSignatureHelpItems2) {
      return (filePath, position, options) => {
        let fileName = filePath.replace(windowsPathReg, "/"), [serviceScript, targetScript, sourceScript] = (0, utils_1.getServiceScript)(language, fileName);
        if (!targetScript?.associatedOnly)
          if (serviceScript) {
            let generatePosition = (0, transform_1.toGeneratedOffset)(language, serviceScript, sourceScript, position, language_core_1.isSignatureHelpEnabled);
            if (generatePosition !== void 0) {
              let result = getSignatureHelpItems2(targetScript.id, generatePosition, options);
              if (result) {
                let applicableSpan = (0, transform_1.transformTextSpan)(sourceScript, language, serviceScript, result.applicableSpan, !0, language_core_1.isSignatureHelpEnabled)?.[1];
                if (applicableSpan)
                  return {
                    ...result,
                    applicableSpan
                  };
              }
            }
          } else
            return getSignatureHelpItems2(fileName, position, options);
      };
    }
    function getDocumentHighlights(language, getDocumentHighlights2) {
      return (filePath, position, filesToSearch) => {
        let fileName = filePath.replace(windowsPathReg, "/");
        return linkedCodeFeatureWorker(language, fileName, position, language_core_1.isHighlightEnabled, (fileName2, position2) => getDocumentHighlights2(fileName2, position2, filesToSearch), function* (result) {
          for (let ref2 of result)
            for (let reference of ref2.highlightSpans)
              yield [reference.fileName ?? ref2.fileName, reference.textSpan.start];
        }).flat().map((highlights) => ({
          ...highlights,
          highlightSpans: highlights.highlightSpans.map((span) => {
            let { textSpan } = (0, transform_1.transformSpan)(language, span.fileName ?? highlights.fileName, span.textSpan, !1, language_core_1.isHighlightEnabled) ?? {};
            if (textSpan)
              return {
                ...span,
                contextSpan: (0, transform_1.transformSpan)(language, span.fileName ?? highlights.fileName, span.contextSpan, !1, language_core_1.isHighlightEnabled)?.textSpan,
                textSpan
              };
          }).filter((span) => !!span)
        }));
      };
    }
    function getApplicableRefactors(language, getApplicableRefactors2) {
      return (filePath, positionOrRange, preferences, triggerReason, kind, includeInteractiveActions) => {
        let fileName = filePath.replace(windowsPathReg, "/"), [serviceScript, targetScript, sourceScript] = (0, utils_1.getServiceScript)(language, fileName);
        if (targetScript?.associatedOnly)
          return [];
        if (serviceScript) {
          if (typeof positionOrRange == "number") {
            let generatePosition = (0, transform_1.toGeneratedOffset)(language, serviceScript, sourceScript, positionOrRange, language_core_1.isCodeActionsEnabled);
            if (generatePosition !== void 0)
              return getApplicableRefactors2(targetScript.id, generatePosition, preferences, triggerReason, kind, includeInteractiveActions);
          } else
            for (let [generatedStart, generatedEnd] of (0, transform_1.toGeneratedRanges)(language, serviceScript, sourceScript, positionOrRange.pos, positionOrRange.end, language_core_1.isCodeActionsEnabled))
              return getApplicableRefactors2(targetScript.id, { pos: generatedStart, end: generatedEnd }, preferences, triggerReason, kind, includeInteractiveActions);
          return [];
        } else
          return getApplicableRefactors2(fileName, positionOrRange, preferences, triggerReason, kind, includeInteractiveActions);
      };
    }
    function getEditsForRefactor(language, getEditsForRefactor2) {
      return (filePath, formatOptions, positionOrRange, refactorName, actionName, preferences, interactiveRefactorArguments) => {
        let edits, fileName = filePath.replace(windowsPathReg, "/"), [serviceScript, targetScript, sourceScript] = (0, utils_1.getServiceScript)(language, fileName);
        if (!targetScript?.associatedOnly) {
          if (serviceScript)
            if (typeof positionOrRange == "number") {
              let generatePosition = (0, transform_1.toGeneratedOffset)(language, serviceScript, sourceScript, positionOrRange, language_core_1.isCodeActionsEnabled);
              generatePosition !== void 0 && (edits = getEditsForRefactor2(targetScript.id, formatOptions, generatePosition, refactorName, actionName, preferences, interactiveRefactorArguments));
            } else
              for (let [generatedStart, generatedEnd] of (0, transform_1.toGeneratedRanges)(language, serviceScript, sourceScript, positionOrRange.pos, positionOrRange.end, language_core_1.isCodeActionsEnabled))
                edits = getEditsForRefactor2(targetScript.id, formatOptions, { pos: generatedStart, end: generatedEnd }, refactorName, actionName, preferences, interactiveRefactorArguments);
          else
            edits = getEditsForRefactor2(fileName, formatOptions, positionOrRange, refactorName, actionName, preferences, interactiveRefactorArguments);
          if (edits)
            return edits.edits = (0, transform_1.transformFileTextChanges)(language, edits.edits, !1, language_core_1.isCodeActionsEnabled), edits;
        }
      };
    }
    function getCombinedCodeFix(language, getCombinedCodeFix2) {
      return (...args) => {
        let codeActions = getCombinedCodeFix2(...args);
        return codeActions.changes = (0, transform_1.transformFileTextChanges)(language, codeActions.changes, !1, language_core_1.isCodeActionsEnabled), codeActions;
      };
    }
    function getRenameInfo(language, getRenameInfo2) {
      return (filePath, position, options) => {
        let fileName = filePath.replace(windowsPathReg, "/"), [serviceScript, targetScript, sourceScript] = (0, utils_1.getServiceScript)(language, fileName);
        if (targetScript?.associatedOnly)
          return {
            canRename: !1,
            localizedErrorMessage: "Cannot rename"
          };
        if (serviceScript) {
          let failed;
          for (let [generateOffset] of (0, transform_1.toGeneratedOffsets)(language, serviceScript, sourceScript, position, language_core_1.isRenameEnabled)) {
            let info = getRenameInfo2(targetScript.id, generateOffset, options);
            if (info.canRename) {
              let span = (0, transform_1.transformTextSpan)(sourceScript, language, serviceScript, info.triggerSpan, !1, language_core_1.isRenameEnabled)?.[1];
              if (span)
                return info.triggerSpan = span, info;
            } else
              failed = info;
          }
          return failed || {
            canRename: !1,
            localizedErrorMessage: "Failed to get rename locations"
          };
        } else
          return getRenameInfo2(fileName, position, options);
      };
    }
    function getCodeFixesAtPosition(language, getCodeFixesAtPosition2) {
      return (filePath, start, end, errorCodes, formatOptions, preferences) => {
        let fixes = [], fileName = filePath.replace(windowsPathReg, "/"), [serviceScript, targetScript, sourceScript] = (0, utils_1.getServiceScript)(language, fileName);
        if (targetScript?.associatedOnly)
          return [];
        if (serviceScript) {
          let generateRange = (0, transform_1.toGeneratedRange)(language, serviceScript, sourceScript, start, end, language_core_1.isCodeActionsEnabled);
          generateRange !== void 0 && (fixes = getCodeFixesAtPosition2(targetScript.id, generateRange[0], generateRange[1], errorCodes, formatOptions, preferences));
        } else
          fixes = getCodeFixesAtPosition2(fileName, start, end, errorCodes, formatOptions, preferences);
        return fixes = fixes.map((fix) => (fix.changes = (0, transform_1.transformFileTextChanges)(language, fix.changes, !1, language_core_1.isCodeActionsEnabled), fix)), fixes;
      };
    }
    function getEncodedSemanticClassifications(language, getEncodedSemanticClassifications2) {
      return (filePath, span, format3) => {
        let fileName = filePath.replace(windowsPathReg, "/"), [serviceScript, targetScript, sourceScript] = (0, utils_1.getServiceScript)(language, fileName);
        if (targetScript?.associatedOnly)
          return {
            spans: [],
            endOfLineState: 0
          };
        if (serviceScript) {
          let map = language.maps.get(serviceScript.code, targetScript), mapped = (0, language_core_1.findOverlapCodeRange)(span.start, span.start + span.length, map, language_core_1.isSemanticTokensEnabled);
          if (!mapped)
            return {
              spans: [],
              endOfLineState: 0
            };
          let mappingOffset = (0, transform_1.getMappingOffset)(language, serviceScript), start = mapped.start + mappingOffset, end = mapped.end + mappingOffset, result = getEncodedSemanticClassifications2(targetScript.id, { start, length: end - start }, format3), spans = [];
          for (let i2 = 0; i2 < result.spans.length; i2 += 3)
            for (let [_, sourceStart, sourceEnd] of (0, transform_1.toSourceRanges)(sourceScript, language, serviceScript, result.spans[i2], result.spans[i2] + result.spans[i2 + 1], !1, language_core_1.isSemanticTokensEnabled)) {
              spans.push(sourceStart, sourceEnd - sourceStart, result.spans[i2 + 2]);
              break;
            }
          return result.spans = spans, result;
        } else
          return getEncodedSemanticClassifications2(fileName, span, format3);
      };
    }
    function getSyntacticDiagnostics(language, languageService, getSyntacticDiagnostics2) {
      return (filePath) => {
        let fileName = filePath.replace(windowsPathReg, "/"), [serviceScript, targetScript, sourceScript] = (0, utils_1.getServiceScript)(language, fileName);
        return targetScript?.associatedOnly ? [] : getSyntacticDiagnostics2(targetScript?.id ?? fileName).map((d) => (0, transform_1.transformDiagnostic)(language, d, languageService.getProgram(), !1)).filter((d) => !!d).filter((d) => !serviceScript || language.scripts.get(d.file.fileName) === sourceScript);
      };
    }
    function getSemanticDiagnostics(language, languageService, getSemanticDiagnostics2) {
      return (filePath) => {
        let fileName = filePath.replace(windowsPathReg, "/"), [serviceScript, targetScript, sourceScript] = (0, utils_1.getServiceScript)(language, fileName);
        return targetScript?.associatedOnly ? [] : getSemanticDiagnostics2(targetScript?.id ?? fileName).map((d) => (0, transform_1.transformDiagnostic)(language, d, languageService.getProgram(), !1)).filter((d) => !!d).filter((d) => !serviceScript || !d.file || language.scripts.get(d.file.fileName) === sourceScript);
      };
    }
    function getSuggestionDiagnostics(language, languageService, getSuggestionDiagnostics2) {
      return (filePath) => {
        let fileName = filePath.replace(windowsPathReg, "/"), [serviceScript, targetScript, sourceScript] = (0, utils_1.getServiceScript)(language, fileName);
        return targetScript?.associatedOnly ? [] : getSuggestionDiagnostics2(targetScript?.id ?? fileName).map((d) => (0, transform_1.transformDiagnostic)(language, d, languageService.getProgram(), !1)).filter((d) => !!d).filter((d) => !serviceScript || !d.file || language.scripts.get(d.file.fileName) === sourceScript);
      };
    }
    function getDefinitionAndBoundSpan(language, getDefinitionAndBoundSpan2) {
      return (filePath, position) => {
        let fileName = filePath.replace(windowsPathReg, "/"), unresolved = linkedCodeFeatureWorker(language, fileName, position, language_core_1.isDefinitionEnabled, (fileName2, position2) => getDefinitionAndBoundSpan2(fileName2, position2), function* (result) {
          for (let ref2 of result.definitions ?? [])
            yield [ref2.fileName, ref2.textSpan.start];
        }), textSpan = unresolved.map((s) => (0, transform_1.transformSpan)(language, fileName, s.textSpan, !0, language_core_1.isDefinitionEnabled)?.textSpan).filter((s) => !!s)[0];
        if (!textSpan)
          return;
        let definitions = unresolved.map((s) => s.definitions?.map((s2) => (0, transform_1.transformDocumentSpan)(language, s2, !0, language_core_1.isDefinitionEnabled, s2.fileName !== fileName)).filter((s2) => !!s2) ?? []).flat();
        return {
          textSpan,
          definitions: (0, dedupe_1.dedupeDocumentSpans)(definitions)
        };
      };
    }
    function findReferences(language, findReferences2) {
      return (filePath, position) => {
        let fileName = filePath.replace(windowsPathReg, "/");
        return linkedCodeFeatureWorker(language, fileName, position, language_core_1.isReferencesEnabled, (fileName2, position2) => findReferences2(fileName2, position2), function* (result) {
          for (let ref2 of result)
            for (let reference of ref2.references)
              yield [reference.fileName, reference.textSpan.start];
        }).flat().map((symbol) => ({
          definition: (0, transform_1.transformDocumentSpan)(language, symbol.definition, !0, language_core_1.isDefinitionEnabled, !0),
          references: symbol.references.map((r) => (0, transform_1.transformDocumentSpan)(language, r, !0, language_core_1.isReferencesEnabled)).filter((r) => !!r)
        }));
      };
    }
    function getDefinitionAtPosition(language, getDefinitionAtPosition2) {
      return (filePath, position) => {
        let fileName = filePath.replace(windowsPathReg, "/"), resolved = linkedCodeFeatureWorker(language, fileName, position, language_core_1.isDefinitionEnabled, (fileName2, position2) => getDefinitionAtPosition2(fileName2, position2), function* (result) {
          for (let ref2 of result)
            yield [ref2.fileName, ref2.textSpan.start];
        }).flat().map((s) => (0, transform_1.transformDocumentSpan)(language, s, !0, language_core_1.isDefinitionEnabled, s.fileName !== fileName)).filter((s) => !!s);
        return (0, dedupe_1.dedupeDocumentSpans)(resolved);
      };
    }
    function getTypeDefinitionAtPosition(language, getTypeDefinitionAtPosition2) {
      return (filePath, position) => {
        let fileName = filePath.replace(windowsPathReg, "/"), resolved = linkedCodeFeatureWorker(language, fileName, position, language_core_1.isTypeDefinitionEnabled, (fileName2, position2) => getTypeDefinitionAtPosition2(fileName2, position2), function* (result) {
          for (let ref2 of result)
            yield [ref2.fileName, ref2.textSpan.start];
        }).flat().map((s) => (0, transform_1.transformDocumentSpan)(language, s, !0, language_core_1.isTypeDefinitionEnabled)).filter((s) => !!s);
        return (0, dedupe_1.dedupeDocumentSpans)(resolved);
      };
    }
    function getImplementationAtPosition(language, getImplementationAtPosition2) {
      return (filePath, position) => {
        let fileName = filePath.replace(windowsPathReg, "/"), resolved = linkedCodeFeatureWorker(language, fileName, position, language_core_1.isImplementationEnabled, (fileName2, position2) => getImplementationAtPosition2(fileName2, position2), function* (result) {
          for (let ref2 of result)
            yield [ref2.fileName, ref2.textSpan.start];
        }).flat().map((s) => (0, transform_1.transformDocumentSpan)(language, s, !0, language_core_1.isImplementationEnabled)).filter((s) => !!s);
        return (0, dedupe_1.dedupeDocumentSpans)(resolved);
      };
    }
    function findRenameLocations(language, findRenameLocations2) {
      return (filePath, position, findInStrings, findInComments, preferences) => {
        let fileName = filePath.replace(windowsPathReg, "/"), resolved = linkedCodeFeatureWorker(language, fileName, position, language_core_1.isRenameEnabled, (fileName2, position2) => findRenameLocations2(fileName2, position2, findInStrings, findInComments, preferences), function* (result) {
          for (let ref2 of result)
            yield [ref2.fileName, ref2.textSpan.start];
        }).flat().map((s) => (0, transform_1.transformDocumentSpan)(language, s, !1, language_core_1.isRenameEnabled)).filter((s) => !!s);
        return (0, dedupe_1.dedupeDocumentSpans)(resolved);
      };
    }
    function getReferencesAtPosition(language, getReferencesAtPosition2) {
      return (filePath, position) => {
        let fileName = filePath.replace(windowsPathReg, "/"), resolved = linkedCodeFeatureWorker(language, fileName, position, language_core_1.isReferencesEnabled, (fileName2, position2) => getReferencesAtPosition2(fileName2, position2), function* (result) {
          for (let ref2 of result)
            yield [ref2.fileName, ref2.textSpan.start];
        }).flat().map((s) => (0, transform_1.transformDocumentSpan)(language, s, !0, language_core_1.isReferencesEnabled)).filter((s) => !!s);
        return (0, dedupe_1.dedupeDocumentSpans)(resolved);
      };
    }
    function getCompletionsAtPosition(language, getCompletionsAtPosition2) {
      return (filePath, position, options, formattingSettings) => {
        let fileName = filePath.replace(windowsPathReg, "/"), [serviceScript, targetScript, sourceScript] = (0, utils_1.getServiceScript)(language, fileName);
        if (!targetScript?.associatedOnly)
          if (serviceScript) {
            let mainResult, additionalResults = [];
            for (let [generatedOffset, mapping] of (0, transform_1.toGeneratedOffsets)(language, serviceScript, sourceScript, position, language_core_1.isCompletionEnabled)) {
              let isAdditional = typeof mapping.data.completion == "object" && mapping.data.completion.isAdditional;
              if (!isAdditional && mainResult?.entries.length)
                continue;
              let result = getCompletionsAtPosition2(targetScript.id, generatedOffset, options, formattingSettings);
              if (result) {
                typeof mapping.data.completion == "object" && mapping.data.completion.onlyImport && (result.entries = result.entries.filter((entry) => !!entry.sourceDisplay));
                for (let entry of result.entries)
                  entry.replacementSpan = entry.replacementSpan && (0, transform_1.transformTextSpan)(sourceScript, language, serviceScript, entry.replacementSpan, !1, language_core_1.isCompletionEnabled)?.[1];
                result.optionalReplacementSpan = result.optionalReplacementSpan && (0, transform_1.transformTextSpan)(sourceScript, language, serviceScript, result.optionalReplacementSpan, !1, language_core_1.isCompletionEnabled)?.[1], isAdditional ? additionalResults.push(result) : mainResult = result;
              }
            }
            let results = additionalResults;
            if (mainResult && results.unshift(mainResult), results.length)
              return {
                ...results[0],
                entries: results.map((additionalResult) => additionalResult.entries).flat()
              };
          } else
            return getCompletionsAtPosition2(fileName, position, options, formattingSettings);
      };
    }
    function getCompletionEntryDetails(language, getCompletionEntryDetails2) {
      return (filePath, position, entryName, formatOptions, source, preferences, data2) => {
        let details, fileName = filePath.replace(windowsPathReg, "/"), [serviceScript, targetScript, sourceScript] = (0, utils_1.getServiceScript)(language, fileName);
        if (!targetScript?.associatedOnly) {
          if (serviceScript) {
            let generatePosition = (0, transform_1.toGeneratedOffset)(language, serviceScript, sourceScript, position, language_core_1.isCompletionEnabled);
            generatePosition !== void 0 && (details = getCompletionEntryDetails2(targetScript.id, generatePosition, entryName, formatOptions, source, preferences, data2));
          } else
            return getCompletionEntryDetails2(fileName, position, entryName, formatOptions, source, preferences, data2);
          if (details?.codeActions)
            for (let codeAction of details.codeActions)
              codeAction.changes = (0, transform_1.transformFileTextChanges)(language, codeAction.changes, !1, language_core_1.isCompletionEnabled);
          return details;
        }
      };
    }
    function provideInlayHints(language, provideInlayHints2) {
      return (filePath, span, preferences) => {
        let fileName = filePath.replace(windowsPathReg, "/"), [serviceScript, targetScript, sourceScript] = (0, utils_1.getServiceScript)(language, fileName);
        if (targetScript?.associatedOnly)
          return [];
        if (serviceScript) {
          let map = language.maps.get(serviceScript.code, sourceScript), mapped = (0, language_core_1.findOverlapCodeRange)(span.start, span.start + span.length, map, language_core_1.isSemanticTokensEnabled);
          if (!mapped)
            return [];
          let mappingOffset = (0, transform_1.getMappingOffset)(language, serviceScript), start = mapped.start + mappingOffset, end = mapped.end + mappingOffset, result = provideInlayHints2(targetScript.id, { start, length: end - start }, preferences), hints = [];
          for (let hint of result) {
            let sourcePosition = (0, transform_1.toSourceOffset)(sourceScript, language, serviceScript, hint.position, language_core_1.isInlayHintsEnabled);
            sourcePosition !== void 0 && hints.push({
              ...hint,
              position: sourcePosition[1]
            });
          }
          return hints;
        } else
          return provideInlayHints2(fileName, span, preferences);
      };
    }
    function getFileReferences(language, getFileReferences2) {
      return (filePath) => {
        let fileName = filePath.replace(windowsPathReg, "/"), resolved = getFileReferences2(fileName).map((s) => (0, transform_1.transformDocumentSpan)(language, s, !0, language_core_1.isReferencesEnabled)).filter((s) => !!s);
        return (0, dedupe_1.dedupeDocumentSpans)(resolved);
      };
    }
    function getNavigateToItems(language, getNavigateToItems2) {
      return (...args) => {
        let resolved = getNavigateToItems2(...args).map((s) => (0, transform_1.transformDocumentSpan)(language, s, !0, language_core_1.isReferencesEnabled)).filter((s) => !!s);
        return (0, dedupe_1.dedupeDocumentSpans)(resolved);
      };
    }
    function linkedCodeFeatureWorker(language, fileName, position, filter, worker, getLinkedCodes) {
      let results = [], processedFilePositions = /* @__PURE__ */ new Set(), [serviceScript, targetScript, sourceScript] = (0, utils_1.getServiceScript)(language, fileName);
      if (serviceScript)
        for (let [generatedOffset] of (0, transform_1.toGeneratedOffsets)(language, serviceScript, sourceScript, position, filter))
          process2(targetScript.id, generatedOffset);
      else
        process2(fileName, position);
      return results;
      function process2(fileName2, position2) {
        if (processedFilePositions.has(fileName2 + ":" + position2))
          return;
        processedFilePositions.add(fileName2 + ":" + position2);
        let result = worker(fileName2, position2);
        if (result) {
          results.push(result);
          for (let ref2 of getLinkedCodes(result)) {
            processedFilePositions.add(ref2[0] + ":" + ref2[1]);
            let [serviceScript2] = (0, utils_1.getServiceScript)(language, ref2[0]);
            if (!serviceScript2)
              continue;
            let linkedCodeMap = language.linkedCodeMaps.get(serviceScript2.code);
            if (!linkedCodeMap)
              continue;
            let mappingOffset = (0, transform_1.getMappingOffset)(language, serviceScript2);
            for (let linkedCodeOffset of linkedCodeMap.getLinkedOffsets(ref2[1] - mappingOffset))
              process2(ref2[0], linkedCodeOffset + mappingOffset);
          }
        }
      }
    }
    function displayPartsToString(displayParts) {
      return displayParts ? displayParts.map((displayPart) => displayPart.text).join("") : "";
    }
  }
});

// ../../../node_modules/path-browserify/index.js
var require_path_browserify = __commonJS({
  "../../../node_modules/path-browserify/index.js"(exports, module) {
    "use strict";
    function assertPath(path5) {
      if (typeof path5 != "string")
        throw new TypeError("Path must be a string. Received " + JSON.stringify(path5));
    }
    function normalizeStringPosix(path5, allowAboveRoot) {
      for (var res = "", lastSegmentLength = 0, lastSlash = -1, dots = 0, code, i2 = 0; i2 <= path5.length; ++i2) {
        if (i2 < path5.length)
          code = path5.charCodeAt(i2);
        else {
          if (code === 47)
            break;
          code = 47;
        }
        if (code === 47) {
          if (!(lastSlash === i2 - 1 || dots === 1))
            if (lastSlash !== i2 - 1 && dots === 2) {
              if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 || res.charCodeAt(res.length - 2) !== 46) {
                if (res.length > 2) {
                  var lastSlashIndex = res.lastIndexOf("/");
                  if (lastSlashIndex !== res.length - 1) {
                    lastSlashIndex === -1 ? (res = "", lastSegmentLength = 0) : (res = res.slice(0, lastSlashIndex), lastSegmentLength = res.length - 1 - res.lastIndexOf("/")), lastSlash = i2, dots = 0;
                    continue;
                  }
                } else if (res.length === 2 || res.length === 1) {
                  res = "", lastSegmentLength = 0, lastSlash = i2, dots = 0;
                  continue;
                }
              }
              allowAboveRoot && (res.length > 0 ? res += "/.." : res = "..", lastSegmentLength = 2);
            } else
              res.length > 0 ? res += "/" + path5.slice(lastSlash + 1, i2) : res = path5.slice(lastSlash + 1, i2), lastSegmentLength = i2 - lastSlash - 1;
          lastSlash = i2, dots = 0;
        } else code === 46 && dots !== -1 ? ++dots : dots = -1;
      }
      return res;
    }
    function _format(sep3, pathObject) {
      var dir = pathObject.dir || pathObject.root, base2 = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
      return dir ? dir === pathObject.root ? dir + base2 : dir + sep3 + base2 : base2;
    }
    var posix = {
      // path.resolve([from ...], to)
      resolve: function() {
        for (var resolvedPath = "", resolvedAbsolute = !1, cwd2, i2 = arguments.length - 1; i2 >= -1 && !resolvedAbsolute; i2--) {
          var path5;
          i2 >= 0 ? path5 = arguments[i2] : (cwd2 === void 0 && (cwd2 = process.cwd()), path5 = cwd2), assertPath(path5), path5.length !== 0 && (resolvedPath = path5 + "/" + resolvedPath, resolvedAbsolute = path5.charCodeAt(0) === 47);
        }
        return resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute), resolvedAbsolute ? resolvedPath.length > 0 ? "/" + resolvedPath : "/" : resolvedPath.length > 0 ? resolvedPath : ".";
      },
      normalize: function(path5) {
        if (assertPath(path5), path5.length === 0) return ".";
        var isAbsolute4 = path5.charCodeAt(0) === 47, trailingSeparator = path5.charCodeAt(path5.length - 1) === 47;
        return path5 = normalizeStringPosix(path5, !isAbsolute4), path5.length === 0 && !isAbsolute4 && (path5 = "."), path5.length > 0 && trailingSeparator && (path5 += "/"), isAbsolute4 ? "/" + path5 : path5;
      },
      isAbsolute: function(path5) {
        return assertPath(path5), path5.length > 0 && path5.charCodeAt(0) === 47;
      },
      join: function() {
        if (arguments.length === 0)
          return ".";
        for (var joined, i2 = 0; i2 < arguments.length; ++i2) {
          var arg = arguments[i2];
          assertPath(arg), arg.length > 0 && (joined === void 0 ? joined = arg : joined += "/" + arg);
        }
        return joined === void 0 ? "." : posix.normalize(joined);
      },
      relative: function(from, to) {
        if (assertPath(from), assertPath(to), from === to || (from = posix.resolve(from), to = posix.resolve(to), from === to)) return "";
        for (var fromStart = 1; fromStart < from.length && from.charCodeAt(fromStart) === 47; ++fromStart)
          ;
        for (var fromEnd = from.length, fromLen = fromEnd - fromStart, toStart = 1; toStart < to.length && to.charCodeAt(toStart) === 47; ++toStart)
          ;
        for (var toEnd = to.length, toLen = toEnd - toStart, length = fromLen < toLen ? fromLen : toLen, lastCommonSep = -1, i2 = 0; i2 <= length; ++i2) {
          if (i2 === length) {
            if (toLen > length) {
              if (to.charCodeAt(toStart + i2) === 47)
                return to.slice(toStart + i2 + 1);
              if (i2 === 0)
                return to.slice(toStart + i2);
            } else fromLen > length && (from.charCodeAt(fromStart + i2) === 47 ? lastCommonSep = i2 : i2 === 0 && (lastCommonSep = 0));
            break;
          }
          var fromCode = from.charCodeAt(fromStart + i2), toCode = to.charCodeAt(toStart + i2);
          if (fromCode !== toCode)
            break;
          fromCode === 47 && (lastCommonSep = i2);
        }
        var out = "";
        for (i2 = fromStart + lastCommonSep + 1; i2 <= fromEnd; ++i2)
          (i2 === fromEnd || from.charCodeAt(i2) === 47) && (out.length === 0 ? out += ".." : out += "/..");
        return out.length > 0 ? out + to.slice(toStart + lastCommonSep) : (toStart += lastCommonSep, to.charCodeAt(toStart) === 47 && ++toStart, to.slice(toStart));
      },
      _makeLong: function(path5) {
        return path5;
      },
      dirname: function(path5) {
        if (assertPath(path5), path5.length === 0) return ".";
        for (var code = path5.charCodeAt(0), hasRoot = code === 47, end = -1, matchedSlash = !0, i2 = path5.length - 1; i2 >= 1; --i2)
          if (code = path5.charCodeAt(i2), code === 47) {
            if (!matchedSlash) {
              end = i2;
              break;
            }
          } else
            matchedSlash = !1;
        return end === -1 ? hasRoot ? "/" : "." : hasRoot && end === 1 ? "//" : path5.slice(0, end);
      },
      basename: function(path5, ext) {
        if (ext !== void 0 && typeof ext != "string") throw new TypeError('"ext" argument must be a string');
        assertPath(path5);
        var start = 0, end = -1, matchedSlash = !0, i2;
        if (ext !== void 0 && ext.length > 0 && ext.length <= path5.length) {
          if (ext.length === path5.length && ext === path5) return "";
          var extIdx = ext.length - 1, firstNonSlashEnd = -1;
          for (i2 = path5.length - 1; i2 >= 0; --i2) {
            var code = path5.charCodeAt(i2);
            if (code === 47) {
              if (!matchedSlash) {
                start = i2 + 1;
                break;
              }
            } else
              firstNonSlashEnd === -1 && (matchedSlash = !1, firstNonSlashEnd = i2 + 1), extIdx >= 0 && (code === ext.charCodeAt(extIdx) ? --extIdx === -1 && (end = i2) : (extIdx = -1, end = firstNonSlashEnd));
          }
          return start === end ? end = firstNonSlashEnd : end === -1 && (end = path5.length), path5.slice(start, end);
        } else {
          for (i2 = path5.length - 1; i2 >= 0; --i2)
            if (path5.charCodeAt(i2) === 47) {
              if (!matchedSlash) {
                start = i2 + 1;
                break;
              }
            } else end === -1 && (matchedSlash = !1, end = i2 + 1);
          return end === -1 ? "" : path5.slice(start, end);
        }
      },
      extname: function(path5) {
        assertPath(path5);
        for (var startDot = -1, startPart = 0, end = -1, matchedSlash = !0, preDotState = 0, i2 = path5.length - 1; i2 >= 0; --i2) {
          var code = path5.charCodeAt(i2);
          if (code === 47) {
            if (!matchedSlash) {
              startPart = i2 + 1;
              break;
            }
            continue;
          }
          end === -1 && (matchedSlash = !1, end = i2 + 1), code === 46 ? startDot === -1 ? startDot = i2 : preDotState !== 1 && (preDotState = 1) : startDot !== -1 && (preDotState = -1);
        }
        return startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
        preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1 ? "" : path5.slice(startDot, end);
      },
      format: function(pathObject) {
        if (pathObject === null || typeof pathObject != "object")
          throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
        return _format("/", pathObject);
      },
      parse: function(path5) {
        assertPath(path5);
        var ret = { root: "", dir: "", base: "", ext: "", name: "" };
        if (path5.length === 0) return ret;
        var code = path5.charCodeAt(0), isAbsolute4 = code === 47, start;
        isAbsolute4 ? (ret.root = "/", start = 1) : start = 0;
        for (var startDot = -1, startPart = 0, end = -1, matchedSlash = !0, i2 = path5.length - 1, preDotState = 0; i2 >= start; --i2) {
          if (code = path5.charCodeAt(i2), code === 47) {
            if (!matchedSlash) {
              startPart = i2 + 1;
              break;
            }
            continue;
          }
          end === -1 && (matchedSlash = !1, end = i2 + 1), code === 46 ? startDot === -1 ? startDot = i2 : preDotState !== 1 && (preDotState = 1) : startDot !== -1 && (preDotState = -1);
        }
        return startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
        preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1 ? end !== -1 && (startPart === 0 && isAbsolute4 ? ret.base = ret.name = path5.slice(1, end) : ret.base = ret.name = path5.slice(startPart, end)) : (startPart === 0 && isAbsolute4 ? (ret.name = path5.slice(1, startDot), ret.base = path5.slice(1, end)) : (ret.name = path5.slice(startPart, startDot), ret.base = path5.slice(startPart, end)), ret.ext = path5.slice(startDot, end)), startPart > 0 ? ret.dir = path5.slice(0, startPart - 1) : isAbsolute4 && (ret.dir = "/"), ret;
      },
      sep: "/",
      delimiter: ":",
      win32: null,
      posix: null
    };
    posix.posix = posix;
    module.exports = posix;
  }
});

// ../../../node_modules/@volar/typescript/lib/protocol/createProject.js
var require_createProject = __commonJS({
  "../../../node_modules/@volar/typescript/lib/protocol/createProject.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: !0 });
    exports.createLanguageServiceHost = createLanguageServiceHost2;
    var language_core_1 = require_language_core(), path5 = require_path_browserify(), utils_1 = require_utils3(), resolveModuleName_1 = require_resolveModuleName();
    function createLanguageServiceHost2(ts, sys, language, asScriptId, projectHost) {
      let pluginExtensions = language.plugins.map((plugin) => plugin.typescript?.extraFileExtensions.map((ext) => "." + ext.extension) ?? []).flat(), scriptVersions = new language_core_1.FileMap(sys.useCaseSensitiveFileNames), lastProjectVersion, tsProjectVersion = 0, tsFileRegistry = new language_core_1.FileMap(sys.useCaseSensitiveFileNames), tsFileDirRegistry = new language_core_1.FileMap(sys.useCaseSensitiveFileNames), extraScriptRegistry = new language_core_1.FileMap(sys.useCaseSensitiveFileNames), lastTsVirtualFileSnapshots = /* @__PURE__ */ new Set(), lastOtherVirtualFileSnapshots = /* @__PURE__ */ new Set(), languageServiceHost = {
        ...sys,
        getCurrentDirectory() {
          return projectHost.getCurrentDirectory();
        },
        useCaseSensitiveFileNames() {
          return sys.useCaseSensitiveFileNames;
        },
        getNewLine() {
          return sys.newLine;
        },
        getTypeRootsVersion: () => "version" in sys ? sys.version : -1,
        getDirectories(dirName) {
          return sys.getDirectories(dirName);
        },
        readDirectory(dirName, extensions, excludes, includes, depth) {
          let exts = new Set(extensions);
          for (let ext of pluginExtensions)
            exts.add(ext);
          return extensions = [...exts], sys.readDirectory(dirName, extensions, excludes, includes, depth);
        },
        getCompilationSettings() {
          let options = projectHost.getCompilationSettings();
          return pluginExtensions.length && (options.allowNonTsExtensions ??= !0, options.allowNonTsExtensions || console.warn("`allowNonTsExtensions` must be `true`.")), options;
        },
        getLocalizedDiagnosticMessages: projectHost.getLocalizedDiagnosticMessages,
        getProjectReferences: projectHost.getProjectReferences,
        getDefaultLibFileName: (options) => {
          try {
            return ts.getDefaultLibFilePath(options);
          } catch {
            return `/node_modules/typescript/lib/${ts.getDefaultLibFileName(options)}`;
          }
        },
        readFile(fileName) {
          let snapshot = getScriptSnapshot(fileName);
          if (snapshot)
            return snapshot.getText(0, snapshot.getLength());
        },
        directoryExists(directoryName) {
          return sync(), tsFileDirRegistry.has(directoryName) ? !0 : sys.directoryExists(directoryName);
        },
        fileExists(fileName) {
          return getScriptVersion(fileName) !== "";
        },
        getProjectVersion() {
          return sync(), tsProjectVersion + ("version" in sys ? `:${sys.version}` : "");
        },
        getScriptFileNames() {
          return sync(), [...tsFileRegistry.keys()];
        },
        getScriptKind(fileName) {
          if (sync(), extraScriptRegistry.has(fileName))
            return extraScriptRegistry.get(fileName).scriptKind;
          let sourceScript = language.scripts.get(asScriptId(fileName));
          if (sourceScript?.generated) {
            let serviceScript = sourceScript.generated.languagePlugin.typescript?.getServiceScript(sourceScript.generated.root);
            if (serviceScript)
              return serviceScript.scriptKind;
          }
          switch (path5.extname(fileName)) {
            case ".js":
            case ".cjs":
            case ".mjs":
              return ts.ScriptKind.JS;
            case ".jsx":
              return ts.ScriptKind.JSX;
            case ".ts":
            case ".cts":
            case ".mts":
              return ts.ScriptKind.TS;
            case ".tsx":
              return ts.ScriptKind.TSX;
            case ".json":
              return ts.ScriptKind.JSON;
            default:
              return ts.ScriptKind.Unknown;
          }
        },
        getScriptVersion,
        getScriptSnapshot
      };
      for (let plugin of language.plugins)
        plugin.typescript?.resolveLanguageServiceHost && (languageServiceHost = plugin.typescript.resolveLanguageServiceHost(languageServiceHost));
      if (pluginExtensions.length) {
        let moduleResolutionCache = ts.createModuleResolutionCache(languageServiceHost.getCurrentDirectory(), languageServiceHost.useCaseSensitiveFileNames?.() ? (s) => s : (s) => s.toLowerCase(), languageServiceHost.getCompilationSettings()), resolveModuleName = (0, resolveModuleName_1.createResolveModuleName)(ts, sys.getFileSize, languageServiceHost, language.plugins, (fileName) => language.scripts.get(asScriptId(fileName))), lastSysVersion = "version" in sys ? sys.version : void 0;
        languageServiceHost.resolveModuleNameLiterals = (moduleLiterals, containingFile, redirectedReference, options, containingSourceFile) => {
          let disposeFixup = (0, utils_1.fixupImpliedNodeFormatForFile)(ts, pluginExtensions, containingSourceFile, moduleResolutionCache.getPackageJsonInfoCache(), languageServiceHost, options);
          try {
            return "version" in sys && lastSysVersion !== sys.version && (lastSysVersion = sys.version, moduleResolutionCache.clear()), moduleLiterals.map((moduleLiteral) => {
              let mode = ts.getModeForUsageLocation(containingSourceFile, moduleLiteral, options);
              return resolveModuleName(moduleLiteral.text, containingFile, options, moduleResolutionCache, redirectedReference, mode);
            });
          } finally {
            disposeFixup?.();
          }
        }, languageServiceHost.resolveModuleNames = (moduleNames, containingFile, _reusedNames, redirectedReference, options) => ("version" in sys && lastSysVersion !== sys.version && (lastSysVersion = sys.version, moduleResolutionCache.clear()), moduleNames.map((moduleName) => resolveModuleName(moduleName, containingFile, options, moduleResolutionCache, redirectedReference).resolvedModule)), languageServiceHost.getModuleResolutionCache = () => moduleResolutionCache;
      }
      return {
        languageServiceHost,
        getExtraServiceScript
      };
      function getExtraServiceScript(fileName) {
        return sync(), extraScriptRegistry.get(fileName);
      }
      function sync() {
        let newProjectVersion = projectHost.getProjectVersion?.();
        if (!(newProjectVersion === void 0 || newProjectVersion !== lastProjectVersion))
          return;
        lastProjectVersion = newProjectVersion, extraScriptRegistry.clear();
        let newTsVirtualFileSnapshots = /* @__PURE__ */ new Set(), newOtherVirtualFileSnapshots = /* @__PURE__ */ new Set(), tsFileNamesSet = /* @__PURE__ */ new Set();
        for (let fileName of projectHost.getScriptFileNames()) {
          let sourceScript = language.scripts.get(asScriptId(fileName));
          if (sourceScript?.generated) {
            let serviceScript = sourceScript.generated.languagePlugin.typescript?.getServiceScript(sourceScript.generated.root);
            serviceScript && (newTsVirtualFileSnapshots.add(serviceScript.code.snapshot), tsFileNamesSet.add(fileName));
            for (let extraServiceScript of sourceScript.generated.languagePlugin.typescript?.getExtraServiceScripts?.(fileName, sourceScript.generated.root) ?? [])
              newTsVirtualFileSnapshots.add(extraServiceScript.code.snapshot), tsFileNamesSet.add(extraServiceScript.fileName), extraScriptRegistry.set(extraServiceScript.fileName, extraServiceScript);
            for (let code of (0, language_core_1.forEachEmbeddedCode)(sourceScript.generated.root))
              newOtherVirtualFileSnapshots.add(code.snapshot);
          } else
            tsFileNamesSet.add(fileName);
        }
        setEquals(lastTsVirtualFileSnapshots, newTsVirtualFileSnapshots) ? setEquals(lastOtherVirtualFileSnapshots, newOtherVirtualFileSnapshots) && tsProjectVersion++ : tsProjectVersion++, lastTsVirtualFileSnapshots = newTsVirtualFileSnapshots, lastOtherVirtualFileSnapshots = newOtherVirtualFileSnapshots, tsFileRegistry.clear(), tsFileDirRegistry.clear();
        for (let fileName of tsFileNamesSet) {
          tsFileRegistry.set(fileName, !0);
          let parts = fileName.split("/");
          for (let i2 = 1; i2 < parts.length; i2++) {
            let dirName = parts.slice(0, i2).join("/");
            tsFileDirRegistry.set(dirName, !0);
          }
        }
      }
      function getScriptSnapshot(fileName) {
        if (sync(), extraScriptRegistry.has(fileName))
          return extraScriptRegistry.get(fileName).code.snapshot;
        let sourceScript = language.scripts.get(asScriptId(fileName));
        if (sourceScript?.generated) {
          let serviceScript = sourceScript.generated.languagePlugin.typescript?.getServiceScript(sourceScript.generated.root);
          if (serviceScript)
            return serviceScript.code.snapshot;
        } else if (sourceScript)
          return sourceScript.snapshot;
      }
      function getScriptVersion(fileName) {
        sync(), scriptVersions.has(fileName) || scriptVersions.set(fileName, { lastVersion: 0, map: /* @__PURE__ */ new WeakMap() });
        let version2 = scriptVersions.get(fileName);
        if (extraScriptRegistry.has(fileName)) {
          let snapshot = extraScriptRegistry.get(fileName).code.snapshot;
          return version2.map.has(snapshot) || version2.map.set(snapshot, version2.lastVersion++), version2.map.get(snapshot).toString();
        }
        let sourceScript = language.scripts.get(asScriptId(fileName));
        if (sourceScript?.generated) {
          let serviceScript = sourceScript.generated.languagePlugin.typescript?.getServiceScript(sourceScript.generated.root);
          if (serviceScript)
            return version2.map.has(serviceScript.code.snapshot) || version2.map.set(serviceScript.code.snapshot, version2.lastVersion++), version2.map.get(serviceScript.code.snapshot).toString();
        }
        let openedFile = language.scripts.get(asScriptId(fileName), !1);
        return openedFile && !openedFile.generated ? (version2.map.has(openedFile.snapshot) || version2.map.set(openedFile.snapshot, version2.lastVersion++), version2.map.get(openedFile.snapshot).toString()) : sys.fileExists(fileName) ? sys.getModifiedTime?.(fileName)?.valueOf().toString() ?? "0" : "";
      }
    }
    function setEquals(a, b) {
      if (a.size !== b.size)
        return !1;
      for (let item of a)
        if (!b.has(item))
          return !1;
      return !0;
    }
  }
});

// ../../../node_modules/vscode-uri/lib/umd/index.js
var require_umd = __commonJS({
  "../../../node_modules/vscode-uri/lib/umd/index.js"(exports, module) {
    (function(t6, e) {
      if (typeof exports == "object" && typeof module == "object") module.exports = e();
      else if (typeof define == "function" && define.amd) define([], e);
      else {
        var r = e();
        for (var n in r) (typeof exports == "object" ? exports : t6)[n] = r[n];
      }
    })(exports, (() => (() => {
      "use strict";
      var t6 = { 975: (t7) => {
        function e2(t8) {
          if (typeof t8 != "string") throw new TypeError("Path must be a string. Received " + JSON.stringify(t8));
        }
        function r2(t8, e3) {
          for (var r3, n3 = "", i2 = 0, o = -1, s = 0, a = 0; a <= t8.length; ++a) {
            if (a < t8.length) r3 = t8.charCodeAt(a);
            else {
              if (r3 === 47) break;
              r3 = 47;
            }
            if (r3 === 47) {
              if (!(o === a - 1 || s === 1)) if (o !== a - 1 && s === 2) {
                if (n3.length < 2 || i2 !== 2 || n3.charCodeAt(n3.length - 1) !== 46 || n3.charCodeAt(n3.length - 2) !== 46) {
                  if (n3.length > 2) {
                    var h = n3.lastIndexOf("/");
                    if (h !== n3.length - 1) {
                      h === -1 ? (n3 = "", i2 = 0) : i2 = (n3 = n3.slice(0, h)).length - 1 - n3.lastIndexOf("/"), o = a, s = 0;
                      continue;
                    }
                  } else if (n3.length === 2 || n3.length === 1) {
                    n3 = "", i2 = 0, o = a, s = 0;
                    continue;
                  }
                }
                e3 && (n3.length > 0 ? n3 += "/.." : n3 = "..", i2 = 2);
              } else n3.length > 0 ? n3 += "/" + t8.slice(o + 1, a) : n3 = t8.slice(o + 1, a), i2 = a - o - 1;
              o = a, s = 0;
            } else r3 === 46 && s !== -1 ? ++s : s = -1;
          }
          return n3;
        }
        var n2 = { resolve: function() {
          for (var t8, n3 = "", i2 = !1, o = arguments.length - 1; o >= -1 && !i2; o--) {
            var s;
            o >= 0 ? s = arguments[o] : (t8 === void 0 && (t8 = process.cwd()), s = t8), e2(s), s.length !== 0 && (n3 = s + "/" + n3, i2 = s.charCodeAt(0) === 47);
          }
          return n3 = r2(n3, !i2), i2 ? n3.length > 0 ? "/" + n3 : "/" : n3.length > 0 ? n3 : ".";
        }, normalize: function(t8) {
          if (e2(t8), t8.length === 0) return ".";
          var n3 = t8.charCodeAt(0) === 47, i2 = t8.charCodeAt(t8.length - 1) === 47;
          return (t8 = r2(t8, !n3)).length !== 0 || n3 || (t8 = "."), t8.length > 0 && i2 && (t8 += "/"), n3 ? "/" + t8 : t8;
        }, isAbsolute: function(t8) {
          return e2(t8), t8.length > 0 && t8.charCodeAt(0) === 47;
        }, join: function() {
          if (arguments.length === 0) return ".";
          for (var t8, r3 = 0; r3 < arguments.length; ++r3) {
            var i2 = arguments[r3];
            e2(i2), i2.length > 0 && (t8 === void 0 ? t8 = i2 : t8 += "/" + i2);
          }
          return t8 === void 0 ? "." : n2.normalize(t8);
        }, relative: function(t8, r3) {
          if (e2(t8), e2(r3), t8 === r3 || (t8 = n2.resolve(t8)) === (r3 = n2.resolve(r3))) return "";
          for (var i2 = 1; i2 < t8.length && t8.charCodeAt(i2) === 47; ++i2) ;
          for (var o = t8.length, s = o - i2, a = 1; a < r3.length && r3.charCodeAt(a) === 47; ++a) ;
          for (var h = r3.length - a, c = s < h ? s : h, f = -1, u = 0; u <= c; ++u) {
            if (u === c) {
              if (h > c) {
                if (r3.charCodeAt(a + u) === 47) return r3.slice(a + u + 1);
                if (u === 0) return r3.slice(a + u);
              } else s > c && (t8.charCodeAt(i2 + u) === 47 ? f = u : u === 0 && (f = 0));
              break;
            }
            var l = t8.charCodeAt(i2 + u);
            if (l !== r3.charCodeAt(a + u)) break;
            l === 47 && (f = u);
          }
          var d = "";
          for (u = i2 + f + 1; u <= o; ++u) u !== o && t8.charCodeAt(u) !== 47 || (d.length === 0 ? d += ".." : d += "/..");
          return d.length > 0 ? d + r3.slice(a + f) : (a += f, r3.charCodeAt(a) === 47 && ++a, r3.slice(a));
        }, _makeLong: function(t8) {
          return t8;
        }, dirname: function(t8) {
          if (e2(t8), t8.length === 0) return ".";
          for (var r3 = t8.charCodeAt(0), n3 = r3 === 47, i2 = -1, o = !0, s = t8.length - 1; s >= 1; --s) if ((r3 = t8.charCodeAt(s)) === 47) {
            if (!o) {
              i2 = s;
              break;
            }
          } else o = !1;
          return i2 === -1 ? n3 ? "/" : "." : n3 && i2 === 1 ? "//" : t8.slice(0, i2);
        }, basename: function(t8, r3) {
          if (r3 !== void 0 && typeof r3 != "string") throw new TypeError('"ext" argument must be a string');
          e2(t8);
          var n3, i2 = 0, o = -1, s = !0;
          if (r3 !== void 0 && r3.length > 0 && r3.length <= t8.length) {
            if (r3.length === t8.length && r3 === t8) return "";
            var a = r3.length - 1, h = -1;
            for (n3 = t8.length - 1; n3 >= 0; --n3) {
              var c = t8.charCodeAt(n3);
              if (c === 47) {
                if (!s) {
                  i2 = n3 + 1;
                  break;
                }
              } else h === -1 && (s = !1, h = n3 + 1), a >= 0 && (c === r3.charCodeAt(a) ? --a == -1 && (o = n3) : (a = -1, o = h));
            }
            return i2 === o ? o = h : o === -1 && (o = t8.length), t8.slice(i2, o);
          }
          for (n3 = t8.length - 1; n3 >= 0; --n3) if (t8.charCodeAt(n3) === 47) {
            if (!s) {
              i2 = n3 + 1;
              break;
            }
          } else o === -1 && (s = !1, o = n3 + 1);
          return o === -1 ? "" : t8.slice(i2, o);
        }, extname: function(t8) {
          e2(t8);
          for (var r3 = -1, n3 = 0, i2 = -1, o = !0, s = 0, a = t8.length - 1; a >= 0; --a) {
            var h = t8.charCodeAt(a);
            if (h !== 47) i2 === -1 && (o = !1, i2 = a + 1), h === 46 ? r3 === -1 ? r3 = a : s !== 1 && (s = 1) : r3 !== -1 && (s = -1);
            else if (!o) {
              n3 = a + 1;
              break;
            }
          }
          return r3 === -1 || i2 === -1 || s === 0 || s === 1 && r3 === i2 - 1 && r3 === n3 + 1 ? "" : t8.slice(r3, i2);
        }, format: function(t8) {
          if (t8 === null || typeof t8 != "object") throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof t8);
          return (function(t9, e3) {
            var r3 = e3.dir || e3.root, n3 = e3.base || (e3.name || "") + (e3.ext || "");
            return r3 ? r3 === e3.root ? r3 + n3 : r3 + "/" + n3 : n3;
          })(0, t8);
        }, parse: function(t8) {
          e2(t8);
          var r3 = { root: "", dir: "", base: "", ext: "", name: "" };
          if (t8.length === 0) return r3;
          var n3, i2 = t8.charCodeAt(0), o = i2 === 47;
          o ? (r3.root = "/", n3 = 1) : n3 = 0;
          for (var s = -1, a = 0, h = -1, c = !0, f = t8.length - 1, u = 0; f >= n3; --f) if ((i2 = t8.charCodeAt(f)) !== 47) h === -1 && (c = !1, h = f + 1), i2 === 46 ? s === -1 ? s = f : u !== 1 && (u = 1) : s !== -1 && (u = -1);
          else if (!c) {
            a = f + 1;
            break;
          }
          return s === -1 || h === -1 || u === 0 || u === 1 && s === h - 1 && s === a + 1 ? h !== -1 && (r3.base = r3.name = a === 0 && o ? t8.slice(1, h) : t8.slice(a, h)) : (a === 0 && o ? (r3.name = t8.slice(1, s), r3.base = t8.slice(1, h)) : (r3.name = t8.slice(a, s), r3.base = t8.slice(a, h)), r3.ext = t8.slice(s, h)), a > 0 ? r3.dir = t8.slice(0, a - 1) : o && (r3.dir = "/"), r3;
        }, sep: "/", delimiter: ":", win32: null, posix: null };
        n2.posix = n2, t7.exports = n2;
      }, 70: (t7, e2) => {
        if (Object.defineProperty(e2, "__esModule", { value: !0 }), e2.isWindows = void 0, typeof process == "object") e2.isWindows = process.platform === "win32";
        else if (typeof navigator == "object") {
          let t8 = navigator.userAgent;
          e2.isWindows = t8.indexOf("Windows") >= 0;
        }
      }, 231: (t7, e2, r2) => {
        Object.defineProperty(e2, "__esModule", { value: !0 }), e2.uriToFsPath = e2.URI = void 0;
        let n2 = r2(70), i2 = /^\w[\w\d+.-]*$/, o = /^\//, s = /^\/\//;
        function a(t8, e3) {
          if (!t8.scheme && e3) throw new Error(`[UriError]: Scheme is missing: {scheme: "", authority: "${t8.authority}", path: "${t8.path}", query: "${t8.query}", fragment: "${t8.fragment}"}`);
          if (t8.scheme && !i2.test(t8.scheme)) throw new Error("[UriError]: Scheme contains illegal characters.");
          if (t8.path) {
            if (t8.authority) {
              if (!o.test(t8.path)) throw new Error('[UriError]: If a URI contains an authority component, then the path component must either be empty or begin with a slash ("/") character');
            } else if (s.test(t8.path)) throw new Error('[UriError]: If a URI does not contain an authority component, then the path cannot begin with two slash characters ("//")');
          }
        }
        let h = "", c = "/", f = /^(([^:/?#]+?):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;
        class u {
          static isUri(t8) {
            return t8 instanceof u || !!t8 && typeof t8.authority == "string" && typeof t8.fragment == "string" && typeof t8.path == "string" && typeof t8.query == "string" && typeof t8.scheme == "string" && typeof t8.fsPath == "string" && typeof t8.with == "function" && typeof t8.toString == "function";
          }
          scheme;
          authority;
          path;
          query;
          fragment;
          constructor(t8, e3, r3, n3, i3, o2 = !1) {
            typeof t8 == "object" ? (this.scheme = t8.scheme || h, this.authority = t8.authority || h, this.path = t8.path || h, this.query = t8.query || h, this.fragment = t8.fragment || h) : (this.scheme = /* @__PURE__ */ (function(t9, e4) {
              return t9 || e4 ? t9 : "file";
            })(t8, o2), this.authority = e3 || h, this.path = (function(t9, e4) {
              switch (t9) {
                case "https":
                case "http":
                case "file":
                  e4 ? e4[0] !== c && (e4 = c + e4) : e4 = c;
              }
              return e4;
            })(this.scheme, r3 || h), this.query = n3 || h, this.fragment = i3 || h, a(this, o2));
          }
          get fsPath() {
            return v(this, !1);
          }
          with(t8) {
            if (!t8) return this;
            let { scheme: e3, authority: r3, path: n3, query: i3, fragment: o2 } = t8;
            return e3 === void 0 ? e3 = this.scheme : e3 === null && (e3 = h), r3 === void 0 ? r3 = this.authority : r3 === null && (r3 = h), n3 === void 0 ? n3 = this.path : n3 === null && (n3 = h), i3 === void 0 ? i3 = this.query : i3 === null && (i3 = h), o2 === void 0 ? o2 = this.fragment : o2 === null && (o2 = h), e3 === this.scheme && r3 === this.authority && n3 === this.path && i3 === this.query && o2 === this.fragment ? this : new d(e3, r3, n3, i3, o2);
          }
          static parse(t8, e3 = !1) {
            let r3 = f.exec(t8);
            return r3 ? new d(r3[2] || h, w(r3[4] || h), w(r3[5] || h), w(r3[7] || h), w(r3[9] || h), e3) : new d(h, h, h, h, h);
          }
          static file(t8) {
            let e3 = h;
            if (n2.isWindows && (t8 = t8.replace(/\\/g, c)), t8[0] === c && t8[1] === c) {
              let r3 = t8.indexOf(c, 2);
              r3 === -1 ? (e3 = t8.substring(2), t8 = c) : (e3 = t8.substring(2, r3), t8 = t8.substring(r3) || c);
            }
            return new d("file", e3, t8, h, h);
          }
          static from(t8) {
            let e3 = new d(t8.scheme, t8.authority, t8.path, t8.query, t8.fragment);
            return a(e3, !0), e3;
          }
          toString(t8 = !1) {
            return y(this, t8);
          }
          toJSON() {
            return this;
          }
          static revive(t8) {
            if (t8) {
              if (t8 instanceof u) return t8;
              {
                let e3 = new d(t8);
                return e3._formatted = t8.external, e3._fsPath = t8._sep === l ? t8.fsPath : null, e3;
              }
            }
            return t8;
          }
        }
        e2.URI = u;
        let l = n2.isWindows ? 1 : void 0;
        class d extends u {
          _formatted = null;
          _fsPath = null;
          get fsPath() {
            return this._fsPath || (this._fsPath = v(this, !1)), this._fsPath;
          }
          toString(t8 = !1) {
            return t8 ? y(this, !0) : (this._formatted || (this._formatted = y(this, !1)), this._formatted);
          }
          toJSON() {
            let t8 = { $mid: 1 };
            return this._fsPath && (t8.fsPath = this._fsPath, t8._sep = l), this._formatted && (t8.external = this._formatted), this.path && (t8.path = this.path), this.scheme && (t8.scheme = this.scheme), this.authority && (t8.authority = this.authority), this.query && (t8.query = this.query), this.fragment && (t8.fragment = this.fragment), t8;
          }
        }
        let p = { 58: "%3A", 47: "%2F", 63: "%3F", 35: "%23", 91: "%5B", 93: "%5D", 64: "%40", 33: "%21", 36: "%24", 38: "%26", 39: "%27", 40: "%28", 41: "%29", 42: "%2A", 43: "%2B", 44: "%2C", 59: "%3B", 61: "%3D", 32: "%20" };
        function g(t8, e3, r3) {
          let n3, i3 = -1;
          for (let o2 = 0; o2 < t8.length; o2++) {
            let s2 = t8.charCodeAt(o2);
            if (s2 >= 97 && s2 <= 122 || s2 >= 65 && s2 <= 90 || s2 >= 48 && s2 <= 57 || s2 === 45 || s2 === 46 || s2 === 95 || s2 === 126 || e3 && s2 === 47 || r3 && s2 === 91 || r3 && s2 === 93 || r3 && s2 === 58) i3 !== -1 && (n3 += encodeURIComponent(t8.substring(i3, o2)), i3 = -1), n3 !== void 0 && (n3 += t8.charAt(o2));
            else {
              n3 === void 0 && (n3 = t8.substr(0, o2));
              let e4 = p[s2];
              e4 !== void 0 ? (i3 !== -1 && (n3 += encodeURIComponent(t8.substring(i3, o2)), i3 = -1), n3 += e4) : i3 === -1 && (i3 = o2);
            }
          }
          return i3 !== -1 && (n3 += encodeURIComponent(t8.substring(i3))), n3 !== void 0 ? n3 : t8;
        }
        function m(t8) {
          let e3;
          for (let r3 = 0; r3 < t8.length; r3++) {
            let n3 = t8.charCodeAt(r3);
            n3 === 35 || n3 === 63 ? (e3 === void 0 && (e3 = t8.substr(0, r3)), e3 += p[n3]) : e3 !== void 0 && (e3 += t8[r3]);
          }
          return e3 !== void 0 ? e3 : t8;
        }
        function v(t8, e3) {
          let r3;
          return r3 = t8.authority && t8.path.length > 1 && t8.scheme === "file" ? `//${t8.authority}${t8.path}` : t8.path.charCodeAt(0) === 47 && (t8.path.charCodeAt(1) >= 65 && t8.path.charCodeAt(1) <= 90 || t8.path.charCodeAt(1) >= 97 && t8.path.charCodeAt(1) <= 122) && t8.path.charCodeAt(2) === 58 ? e3 ? t8.path.substr(1) : t8.path[1].toLowerCase() + t8.path.substr(2) : t8.path, n2.isWindows && (r3 = r3.replace(/\//g, "\\")), r3;
        }
        function y(t8, e3) {
          let r3 = e3 ? m : g, n3 = "", { scheme: i3, authority: o2, path: s2, query: a2, fragment: h2 } = t8;
          if (i3 && (n3 += i3, n3 += ":"), (o2 || i3 === "file") && (n3 += c, n3 += c), o2) {
            let t9 = o2.indexOf("@");
            if (t9 !== -1) {
              let e4 = o2.substr(0, t9);
              o2 = o2.substr(t9 + 1), t9 = e4.lastIndexOf(":"), t9 === -1 ? n3 += r3(e4, !1, !1) : (n3 += r3(e4.substr(0, t9), !1, !1), n3 += ":", n3 += r3(e4.substr(t9 + 1), !1, !0)), n3 += "@";
            }
            o2 = o2.toLowerCase(), t9 = o2.lastIndexOf(":"), t9 === -1 ? n3 += r3(o2, !1, !0) : (n3 += r3(o2.substr(0, t9), !1, !0), n3 += o2.substr(t9));
          }
          if (s2) {
            if (s2.length >= 3 && s2.charCodeAt(0) === 47 && s2.charCodeAt(2) === 58) {
              let t9 = s2.charCodeAt(1);
              t9 >= 65 && t9 <= 90 && (s2 = `/${String.fromCharCode(t9 + 32)}:${s2.substr(3)}`);
            } else if (s2.length >= 2 && s2.charCodeAt(1) === 58) {
              let t9 = s2.charCodeAt(0);
              t9 >= 65 && t9 <= 90 && (s2 = `${String.fromCharCode(t9 + 32)}:${s2.substr(2)}`);
            }
            n3 += r3(s2, !0, !1);
          }
          return a2 && (n3 += "?", n3 += r3(a2, !1, !1)), h2 && (n3 += "#", n3 += e3 ? h2 : g(h2, !1, !1)), n3;
        }
        function b(t8) {
          try {
            return decodeURIComponent(t8);
          } catch {
            return t8.length > 3 ? t8.substr(0, 3) + b(t8.substr(3)) : t8;
          }
        }
        e2.uriToFsPath = v;
        let C = /(%[0-9A-Za-z][0-9A-Za-z])+/g;
        function w(t8) {
          return t8.match(C) ? t8.replace(C, ((t9) => b(t9))) : t8;
        }
      }, 552: function(t7, e2, r2) {
        var n2 = this && this.__createBinding || (Object.create ? function(t8, e3, r3, n3) {
          n3 === void 0 && (n3 = r3);
          var i3 = Object.getOwnPropertyDescriptor(e3, r3);
          i3 && !("get" in i3 ? !e3.__esModule : i3.writable || i3.configurable) || (i3 = { enumerable: !0, get: function() {
            return e3[r3];
          } }), Object.defineProperty(t8, n3, i3);
        } : function(t8, e3, r3, n3) {
          n3 === void 0 && (n3 = r3), t8[n3] = e3[r3];
        }), i2 = this && this.__setModuleDefault || (Object.create ? function(t8, e3) {
          Object.defineProperty(t8, "default", { enumerable: !0, value: e3 });
        } : function(t8, e3) {
          t8.default = e3;
        }), o = this && this.__importStar || function(t8) {
          if (t8 && t8.__esModule) return t8;
          var e3 = {};
          if (t8 != null) for (var r3 in t8) r3 !== "default" && Object.prototype.hasOwnProperty.call(t8, r3) && n2(e3, t8, r3);
          return i2(e3, t8), e3;
        };
        Object.defineProperty(e2, "__esModule", { value: !0 }), e2.Utils = void 0;
        let s = o(r2(975)), a = s.posix || s, h = "/";
        var c;
        (function(t8) {
          t8.joinPath = function(t9, ...e3) {
            return t9.with({ path: a.join(t9.path, ...e3) });
          }, t8.resolvePath = function(t9, ...e3) {
            let r3 = t9.path, n3 = !1;
            r3[0] !== h && (r3 = h + r3, n3 = !0);
            let i3 = a.resolve(r3, ...e3);
            return n3 && i3[0] === h && !t9.authority && (i3 = i3.substring(1)), t9.with({ path: i3 });
          }, t8.dirname = function(t9) {
            if (t9.path.length === 0 || t9.path === h) return t9;
            let e3 = a.dirname(t9.path);
            return e3.length === 1 && e3.charCodeAt(0) === 46 && (e3 = ""), t9.with({ path: e3 });
          }, t8.basename = function(t9) {
            return a.basename(t9.path);
          }, t8.extname = function(t9) {
            return a.extname(t9.path);
          };
        })(c || (e2.Utils = c = {}));
      } }, e = {};
      function r(n2) {
        var i2 = e[n2];
        if (i2 !== void 0) return i2.exports;
        var o = e[n2] = { exports: {} };
        return t6[n2].call(o.exports, o, o.exports, r), o.exports;
      }
      var n = {};
      return (() => {
        var t7 = n;
        Object.defineProperty(t7, "__esModule", { value: !0 }), t7.Utils = t7.URI = void 0;
        let e2 = r(231);
        Object.defineProperty(t7, "URI", { enumerable: !0, get: function() {
          return e2.URI;
        } });
        let i2 = r(552);
        Object.defineProperty(t7, "Utils", { enumerable: !0, get: function() {
          return i2.Utils;
        } });
      })(), n;
    })()));
  }
});

// ../../../node_modules/@volar/typescript/lib/typescript/core.js
var require_core4 = __commonJS({
  "../../../node_modules/@volar/typescript/lib/typescript/core.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: !0 });
    exports.every = every;
    exports.findIndex = findIndex;
    exports.indexOfAnyCharCode = indexOfAnyCharCode;
    exports.map = map;
    exports.flatten = flatten;
    exports.flatMap = flatMap;
    exports.some = some;
    exports.sort = sort;
    exports.lastOrUndefined = lastOrUndefined;
    exports.last = last;
    exports.equateStringsCaseInsensitive = equateStringsCaseInsensitive;
    exports.equateStringsCaseSensitive = equateStringsCaseSensitive;
    exports.compareStringsCaseSensitive = compareStringsCaseSensitive;
    exports.getStringComparer = getStringComparer;
    exports.endsWith = endsWith;
    exports.stringContains = stringContains;
    exports.createGetCanonicalFileName = createGetCanonicalFileName;
    exports.startsWith = startsWith;
    var emptyArray = [];
    function every(array, callback) {
      if (array) {
        for (let i2 = 0; i2 < array.length; i2++)
          if (!callback(array[i2], i2))
            return !1;
      }
      return !0;
    }
    function findIndex(array, predicate, startIndex) {
      if (array === void 0)
        return -1;
      for (let i2 = startIndex ?? 0; i2 < array.length; i2++)
        if (predicate(array[i2], i2))
          return i2;
      return -1;
    }
    function contains(array, value, equalityComparer = equateValues) {
      if (array) {
        for (let v of array)
          if (equalityComparer(v, value))
            return !0;
      }
      return !1;
    }
    function indexOfAnyCharCode(text, charCodes, start) {
      for (let i2 = start || 0; i2 < text.length; i2++)
        if (contains(charCodes, text.charCodeAt(i2)))
          return i2;
      return -1;
    }
    function map(array, f) {
      let result;
      if (array) {
        result = [];
        for (let i2 = 0; i2 < array.length; i2++)
          result.push(f(array[i2], i2));
      }
      return result;
    }
    function flatten(array) {
      let result = [];
      for (let v of array)
        v && (isArray2(v) ? addRange(result, v) : result.push(v));
      return result;
    }
    function flatMap(array, mapfn) {
      let result;
      if (array)
        for (let i2 = 0; i2 < array.length; i2++) {
          let v = mapfn(array[i2], i2);
          v && (isArray2(v) ? result = addRange(result, v) : result = append(result, v));
        }
      return result || emptyArray;
    }
    function some(array, predicate) {
      if (array)
        if (predicate) {
          for (let v of array)
            if (predicate(v))
              return !0;
        } else
          return array.length > 0;
      return !1;
    }
    function append(to, value) {
      return value === void 0 ? to : to === void 0 ? [value] : (to.push(value), to);
    }
    function toOffset(array, offset2) {
      return offset2 < 0 ? array.length + offset2 : offset2;
    }
    function addRange(to, from, start, end) {
      if (from === void 0 || from.length === 0)
        return to;
      if (to === void 0)
        return from.slice(start, end);
      start = start === void 0 ? 0 : toOffset(from, start), end = end === void 0 ? from.length : toOffset(from, end);
      for (let i2 = start; i2 < end && i2 < from.length; i2++)
        from[i2] !== void 0 && to.push(from[i2]);
      return to;
    }
    function sort(array, comparer) {
      return array.length === 0 ? array : array.slice().sort(comparer);
    }
    function lastOrUndefined(array) {
      return array === void 0 || array.length === 0 ? void 0 : array[array.length - 1];
    }
    function last(array) {
      return array[array.length - 1];
    }
    function isArray2(value) {
      return Array.isArray ? Array.isArray(value) : value instanceof Array;
    }
    function identity(x) {
      return x;
    }
    function toLowerCase(x) {
      return x.toLowerCase();
    }
    var fileNameLowerCaseRegExp = /[^\u0130\u0131\u00DFa-z0-9\\/:\-_\. ]+/g;
    function toFileNameLowerCase(x) {
      return fileNameLowerCaseRegExp.test(x) ? x.replace(fileNameLowerCaseRegExp, toLowerCase) : x;
    }
    function equateValues(a, b) {
      return a === b;
    }
    function equateStringsCaseInsensitive(a, b) {
      return a === b || a !== void 0 && b !== void 0 && a.toUpperCase() === b.toUpperCase();
    }
    function equateStringsCaseSensitive(a, b) {
      return equateValues(a, b);
    }
    function compareComparableValues(a, b) {
      return a === b ? 0 : a === void 0 ? -1 : b === void 0 ? 1 : a < b ? -1 : 1;
    }
    function compareStringsCaseInsensitive(a, b) {
      return a === b ? 0 : a === void 0 ? -1 : b === void 0 ? 1 : (a = a.toUpperCase(), b = b.toUpperCase(), a < b ? -1 : a > b ? 1 : 0);
    }
    function compareStringsCaseSensitive(a, b) {
      return compareComparableValues(a, b);
    }
    function getStringComparer(ignoreCase) {
      return ignoreCase ? compareStringsCaseInsensitive : compareStringsCaseSensitive;
    }
    function endsWith(str, suffix) {
      let expectedPos = str.length - suffix.length;
      return expectedPos >= 0 && str.indexOf(suffix, expectedPos) === expectedPos;
    }
    function stringContains(str, substring) {
      return str.indexOf(substring) !== -1;
    }
    function createGetCanonicalFileName(useCaseSensitiveFileNames) {
      return useCaseSensitiveFileNames ? identity : toFileNameLowerCase;
    }
    function startsWith(str, prefix) {
      return str.lastIndexOf(prefix, 0) === 0;
    }
  }
});

// ../../../node_modules/@volar/typescript/lib/typescript/path.js
var require_path = __commonJS({
  "../../../node_modules/@volar/typescript/lib/typescript/path.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: !0 });
    exports.directorySeparator = void 0;
    exports.isRootedDiskPath = isRootedDiskPath;
    exports.hasExtension = hasExtension;
    exports.fileExtensionIsOneOf = fileExtensionIsOneOf;
    exports.getDirectoryPath = getDirectoryPath;
    exports.combinePaths = combinePaths;
    exports.getNormalizedPathComponents = getNormalizedPathComponents;
    exports.normalizePath = normalizePath;
    exports.removeTrailingDirectorySeparator = removeTrailingDirectorySeparator;
    exports.containsPath = containsPath;
    var core_1 = require_core4();
    exports.directorySeparator = "/";
    var altDirectorySeparator = "\\", urlSchemeSeparator = "://", backslashRegExp = /\\/g;
    function isAnyDirectorySeparator(charCode) {
      return charCode === 47 || charCode === 92;
    }
    function isRootedDiskPath(path5) {
      return getEncodedRootLength(path5) > 0;
    }
    function hasExtension(fileName) {
      return (0, core_1.stringContains)(getBaseFileName(fileName), ".");
    }
    function fileExtensionIs(path5, extension) {
      return path5.length > extension.length && (0, core_1.endsWith)(path5, extension);
    }
    function fileExtensionIsOneOf(path5, extensions) {
      for (let extension of extensions)
        if (fileExtensionIs(path5, extension))
          return !0;
      return !1;
    }
    function hasTrailingDirectorySeparator(path5) {
      return path5.length > 0 && isAnyDirectorySeparator(path5.charCodeAt(path5.length - 1));
    }
    function isVolumeCharacter(charCode) {
      return charCode >= 97 && charCode <= 122 || charCode >= 65 && charCode <= 90;
    }
    function getFileUrlVolumeSeparatorEnd(url, start) {
      let ch0 = url.charCodeAt(start);
      if (ch0 === 58)
        return start + 1;
      if (ch0 === 37 && url.charCodeAt(start + 1) === 51) {
        let ch2 = url.charCodeAt(start + 2);
        if (ch2 === 97 || ch2 === 65)
          return start + 3;
      }
      return -1;
    }
    function getEncodedRootLength(path5) {
      if (!path5)
        return 0;
      let ch0 = path5.charCodeAt(0);
      if (ch0 === 47 || ch0 === 92) {
        if (path5.charCodeAt(1) !== ch0)
          return 1;
        let p1 = path5.indexOf(ch0 === 47 ? exports.directorySeparator : altDirectorySeparator, 2);
        return p1 < 0 ? path5.length : p1 + 1;
      }
      if (isVolumeCharacter(ch0) && path5.charCodeAt(1) === 58) {
        let ch2 = path5.charCodeAt(2);
        if (ch2 === 47 || ch2 === 92)
          return 3;
        if (path5.length === 2)
          return 2;
      }
      let schemeEnd = path5.indexOf(urlSchemeSeparator);
      if (schemeEnd !== -1) {
        let authorityStart = schemeEnd + urlSchemeSeparator.length, authorityEnd = path5.indexOf(exports.directorySeparator, authorityStart);
        if (authorityEnd !== -1) {
          let scheme = path5.slice(0, schemeEnd), authority = path5.slice(authorityStart, authorityEnd);
          if (scheme === "file" && (authority === "" || authority === "localhost") && isVolumeCharacter(path5.charCodeAt(authorityEnd + 1))) {
            let volumeSeparatorEnd = getFileUrlVolumeSeparatorEnd(path5, authorityEnd + 2);
            if (volumeSeparatorEnd !== -1) {
              if (path5.charCodeAt(volumeSeparatorEnd) === 47)
                return ~(volumeSeparatorEnd + 1);
              if (volumeSeparatorEnd === path5.length)
                return ~volumeSeparatorEnd;
            }
          }
          return ~(authorityEnd + 1);
        }
        return ~path5.length;
      }
      return 0;
    }
    function getRootLength(path5) {
      let rootLength = getEncodedRootLength(path5);
      return rootLength < 0 ? ~rootLength : rootLength;
    }
    function getDirectoryPath(path5) {
      path5 = normalizeSlashes(path5);
      let rootLength = getRootLength(path5);
      return rootLength === path5.length ? path5 : (path5 = removeTrailingDirectorySeparator(path5), path5.slice(0, Math.max(rootLength, path5.lastIndexOf(exports.directorySeparator))));
    }
    function getBaseFileName(path5, extensions, ignoreCase) {
      if (path5 = normalizeSlashes(path5), getRootLength(path5) === path5.length)
        return "";
      path5 = removeTrailingDirectorySeparator(path5);
      let name = path5.slice(Math.max(getRootLength(path5), path5.lastIndexOf(exports.directorySeparator) + 1)), extension = extensions !== void 0 && ignoreCase !== void 0 ? getAnyExtensionFromPath(name, extensions, ignoreCase) : void 0;
      return extension ? name.slice(0, name.length - extension.length) : name;
    }
    function tryGetExtensionFromPath(path5, extension, stringEqualityComparer) {
      if ((0, core_1.startsWith)(extension, ".") || (extension = "." + extension), path5.length >= extension.length && path5.charCodeAt(path5.length - extension.length) === 46) {
        let pathExtension = path5.slice(path5.length - extension.length);
        if (stringEqualityComparer(pathExtension, extension))
          return pathExtension;
      }
    }
    function getAnyExtensionFromPathWorker(path5, extensions, stringEqualityComparer) {
      if (typeof extensions == "string")
        return tryGetExtensionFromPath(path5, extensions, stringEqualityComparer) || "";
      for (let extension of extensions) {
        let result = tryGetExtensionFromPath(path5, extension, stringEqualityComparer);
        if (result)
          return result;
      }
      return "";
    }
    function getAnyExtensionFromPath(path5, extensions, ignoreCase) {
      if (extensions)
        return getAnyExtensionFromPathWorker(removeTrailingDirectorySeparator(path5), extensions, ignoreCase ? core_1.equateStringsCaseInsensitive : core_1.equateStringsCaseSensitive);
      let baseFileName = getBaseFileName(path5), extensionIndex = baseFileName.lastIndexOf(".");
      return extensionIndex >= 0 ? baseFileName.substring(extensionIndex) : "";
    }
    function pathComponents(path5, rootLength) {
      let root = path5.substring(0, rootLength), rest = path5.substring(rootLength).split(exports.directorySeparator);
      return rest.length && !(0, core_1.lastOrUndefined)(rest) && rest.pop(), [root, ...rest];
    }
    function getPathComponents(path5, currentDirectory = "") {
      return path5 = combinePaths(currentDirectory, path5), pathComponents(path5, getRootLength(path5));
    }
    function getPathFromPathComponents(pathComponents2) {
      return pathComponents2.length === 0 ? "" : (pathComponents2[0] && ensureTrailingDirectorySeparator(pathComponents2[0])) + pathComponents2.slice(1).join(exports.directorySeparator);
    }
    function normalizeSlashes(path5) {
      return path5.indexOf("\\") !== -1 ? path5.replace(backslashRegExp, exports.directorySeparator) : path5;
    }
    function reducePathComponents(components) {
      if (!(0, core_1.some)(components))
        return [];
      let reduced = [components[0]];
      for (let i2 = 1; i2 < components.length; i2++) {
        let component = components[i2];
        if (component && component !== ".") {
          if (component === "..") {
            if (reduced.length > 1) {
              if (reduced[reduced.length - 1] !== "..") {
                reduced.pop();
                continue;
              }
            } else if (reduced[0])
              continue;
          }
          reduced.push(component);
        }
      }
      return reduced;
    }
    function combinePaths(path5, ...paths) {
      path5 && (path5 = normalizeSlashes(path5));
      for (let relativePath of paths)
        relativePath && (relativePath = normalizeSlashes(relativePath), !path5 || getRootLength(relativePath) !== 0 ? path5 = relativePath : path5 = ensureTrailingDirectorySeparator(path5) + relativePath);
      return path5;
    }
    function getNormalizedPathComponents(path5, currentDirectory) {
      return reducePathComponents(getPathComponents(path5, currentDirectory));
    }
    function normalizePath(path5) {
      if (path5 = normalizeSlashes(path5), !relativePathSegmentRegExp.test(path5))
        return path5;
      let simplified = path5.replace(/\/\.\//g, "/").replace(/^\.\//, "");
      if (simplified !== path5 && (path5 = simplified, !relativePathSegmentRegExp.test(path5)))
        return path5;
      let normalized = getPathFromPathComponents(reducePathComponents(getPathComponents(path5)));
      return normalized && hasTrailingDirectorySeparator(path5) ? ensureTrailingDirectorySeparator(normalized) : normalized;
    }
    function removeTrailingDirectorySeparator(path5) {
      return hasTrailingDirectorySeparator(path5) ? path5.substr(0, path5.length - 1) : path5;
    }
    function ensureTrailingDirectorySeparator(path5) {
      return hasTrailingDirectorySeparator(path5) ? path5 : path5 + exports.directorySeparator;
    }
    var relativePathSegmentRegExp = /(?:\/\/)|(?:^|\/)\.\.?(?:$|\/)/;
    function containsPath(parent, child, currentDirectory, ignoreCase) {
      if (typeof currentDirectory == "string" ? (parent = combinePaths(currentDirectory, parent), child = combinePaths(currentDirectory, child)) : typeof currentDirectory == "boolean" && (ignoreCase = currentDirectory), parent === void 0 || child === void 0)
        return !1;
      if (parent === child)
        return !0;
      let parentComponents = reducePathComponents(getPathComponents(parent)), childComponents = reducePathComponents(getPathComponents(child));
      if (childComponents.length < parentComponents.length)
        return !1;
      let componentEqualityComparer = ignoreCase ? core_1.equateStringsCaseInsensitive : core_1.equateStringsCaseSensitive;
      for (let i2 = 0; i2 < parentComponents.length; i2++)
        if (!(i2 === 0 ? core_1.equateStringsCaseInsensitive : componentEqualityComparer)(parentComponents[i2], childComponents[i2]))
          return !1;
      return !0;
    }
  }
});

// ../../../node_modules/@volar/typescript/lib/typescript/utilities.js
var require_utilities = __commonJS({
  "../../../node_modules/@volar/typescript/lib/typescript/utilities.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: !0 });
    exports.matchFiles = matchFiles;
    var core_1 = require_core4(), path_1 = require_path(), reservedCharacterPattern = /[^\w\s\/]/g, wildcardCharCodes = [
      42,
      63
      /* CharacterCodes.question */
    ], commonPackageFolders = ["node_modules", "bower_components", "jspm_packages"], implicitExcludePathRegexPattern = `(?!(${commonPackageFolders.join("|")})(/|$))`, filesMatcher = {
      /**
       * Matches any single directory segment unless it is the last segment and a .min.js file
       * Breakdown:
       *  [^./]                   # matches everything up to the first . character (excluding directory separators)
       *  (\\.(?!min\\.js$))?     # matches . characters but not if they are part of the .min.js file extension
       */
      singleAsteriskRegexFragment: "([^./]|(\\.(?!min\\.js$))?)*",
      /**
       * Regex for the ** wildcard. Matches any number of subdirectories. When used for including
       * files or directories, does not match subdirectories that start with a . character
       */
      doubleAsteriskRegexFragment: `(/${implicitExcludePathRegexPattern}[^/.][^/]*)*?`,
      replaceWildcardCharacter: (match) => replaceWildcardCharacter(match, filesMatcher.singleAsteriskRegexFragment)
    }, directoriesMatcher = {
      singleAsteriskRegexFragment: "[^/]*",
      /**
       * Regex for the ** wildcard. Matches any number of subdirectories. When used for including
       * files or directories, does not match subdirectories that start with a . character
       */
      doubleAsteriskRegexFragment: `(/${implicitExcludePathRegexPattern}[^/.][^/]*)*?`,
      replaceWildcardCharacter: (match) => replaceWildcardCharacter(match, directoriesMatcher.singleAsteriskRegexFragment)
    }, excludeMatcher = {
      singleAsteriskRegexFragment: "[^/]*",
      doubleAsteriskRegexFragment: "(/.+?)?",
      replaceWildcardCharacter: (match) => replaceWildcardCharacter(match, excludeMatcher.singleAsteriskRegexFragment)
    }, wildcardMatchers = {
      files: filesMatcher,
      directories: directoriesMatcher,
      exclude: excludeMatcher
    };
    function getRegularExpressionForWildcard(specs, basePath, usage) {
      let patterns = getRegularExpressionsForWildcards(specs, basePath, usage);
      return !patterns || !patterns.length ? void 0 : `^(${patterns.map((pattern2) => `(${pattern2})`).join("|")})${usage === "exclude" ? "($|/)" : "$"}`;
    }
    function getRegularExpressionsForWildcards(specs, basePath, usage) {
      if (!(specs === void 0 || specs.length === 0))
        return (0, core_1.flatMap)(specs, (spec) => spec && getSubPatternFromSpec(spec, basePath, usage, wildcardMatchers[usage]));
    }
    function isImplicitGlob(lastPathComponent) {
      return !/[.*?]/.test(lastPathComponent);
    }
    function getSubPatternFromSpec(spec, basePath, usage, { singleAsteriskRegexFragment, doubleAsteriskRegexFragment, replaceWildcardCharacter: replaceWildcardCharacter2 }) {
      let subpattern = "", hasWrittenComponent = !1, components = (0, path_1.getNormalizedPathComponents)(spec, basePath), lastComponent = (0, core_1.last)(components);
      if (usage !== "exclude" && lastComponent === "**")
        return;
      components[0] = (0, path_1.removeTrailingDirectorySeparator)(components[0]), isImplicitGlob(lastComponent) && components.push("**", "*");
      let optionalCount = 0;
      for (let component of components) {
        if (component === "**")
          subpattern += doubleAsteriskRegexFragment;
        else if (usage === "directories" && (subpattern += "(", optionalCount++), hasWrittenComponent && (subpattern += path_1.directorySeparator), usage !== "exclude") {
          let componentPattern = "";
          component.charCodeAt(0) === 42 ? (componentPattern += "([^./]" + singleAsteriskRegexFragment + ")?", component = component.substr(1)) : component.charCodeAt(0) === 63 && (componentPattern += "[^./]", component = component.substr(1)), componentPattern += component.replace(reservedCharacterPattern, replaceWildcardCharacter2), componentPattern !== component && (subpattern += implicitExcludePathRegexPattern), subpattern += componentPattern;
        } else
          subpattern += component.replace(reservedCharacterPattern, replaceWildcardCharacter2);
        hasWrittenComponent = !0;
      }
      for (; optionalCount > 0; )
        subpattern += ")?", optionalCount--;
      return subpattern;
    }
    function replaceWildcardCharacter(match, singleAsteriskRegexFragment) {
      return match === "*" ? singleAsteriskRegexFragment : match === "?" ? "[^/]" : "\\" + match;
    }
    function getFileMatcherPatterns(path5, excludes, includes, useCaseSensitiveFileNames, currentDirectory) {
      path5 = (0, path_1.normalizePath)(path5), currentDirectory = (0, path_1.normalizePath)(currentDirectory);
      let absolutePath = (0, path_1.combinePaths)(currentDirectory, path5);
      return {
        includeFilePatterns: (0, core_1.map)(getRegularExpressionsForWildcards(includes, absolutePath, "files"), (pattern) => `^${pattern}$`),
        includeFilePattern: getRegularExpressionForWildcard(includes, absolutePath, "files"),
        includeDirectoryPattern: getRegularExpressionForWildcard(includes, absolutePath, "directories"),
        excludePattern: getRegularExpressionForWildcard(excludes, absolutePath, "exclude"),
        basePaths: getBasePaths(path5, includes, useCaseSensitiveFileNames)
      };
    }
    function getRegexFromPattern(pattern, useCaseSensitiveFileNames) {
      return new RegExp(pattern, useCaseSensitiveFileNames ? "" : "i");
    }
    function matchFiles(path5, extensions, excludes, includes, useCaseSensitiveFileNames, currentDirectory, depth, getFileSystemEntries, realpath) {
      path5 = (0, path_1.normalizePath)(path5), currentDirectory = (0, path_1.normalizePath)(currentDirectory);
      let patterns = getFileMatcherPatterns(path5, excludes, includes, useCaseSensitiveFileNames, currentDirectory), includeFileRegexes = patterns.includeFilePatterns && patterns.includeFilePatterns.map((pattern) => getRegexFromPattern(pattern, useCaseSensitiveFileNames)), includeDirectoryRegex = patterns.includeDirectoryPattern && getRegexFromPattern(patterns.includeDirectoryPattern, useCaseSensitiveFileNames), excludeRegex = patterns.excludePattern && getRegexFromPattern(patterns.excludePattern, useCaseSensitiveFileNames), results = includeFileRegexes ? includeFileRegexes.map(() => []) : [[]], visited = /* @__PURE__ */ new Map(), toCanonical = (0, core_1.createGetCanonicalFileName)(useCaseSensitiveFileNames);
      for (let basePath of patterns.basePaths)
        visitDirectory(basePath, (0, path_1.combinePaths)(currentDirectory, basePath), depth);
      return (0, core_1.flatten)(results);
      function visitDirectory(path6, absolutePath, depth2) {
        let canonicalPath = toCanonical(realpath(absolutePath));
        if (visited.has(canonicalPath))
          return;
        visited.set(canonicalPath, !0);
        let { files, directories } = getFileSystemEntries(path6);
        for (let current2 of (0, core_1.sort)(files, core_1.compareStringsCaseSensitive)) {
          let name = (0, path_1.combinePaths)(path6, current2), absoluteName = (0, path_1.combinePaths)(absolutePath, current2);
          if (!(extensions && !(0, path_1.fileExtensionIsOneOf)(name, extensions)) && !(excludeRegex && excludeRegex.test(absoluteName)))
            if (!includeFileRegexes)
              results[0].push(name);
            else {
              let includeIndex = (0, core_1.findIndex)(includeFileRegexes, (re) => re.test(absoluteName));
              includeIndex !== -1 && results[includeIndex].push(name);
            }
        }
        if (!(depth2 !== void 0 && (depth2--, depth2 === 0)))
          for (let current2 of (0, core_1.sort)(directories, core_1.compareStringsCaseSensitive)) {
            let name = (0, path_1.combinePaths)(path6, current2), absoluteName = (0, path_1.combinePaths)(absolutePath, current2);
            (!includeDirectoryRegex || includeDirectoryRegex.test(absoluteName)) && (!excludeRegex || !excludeRegex.test(absoluteName)) && visitDirectory(name, absoluteName, depth2);
          }
      }
    }
    function getBasePaths(path5, includes, useCaseSensitiveFileNames) {
      let basePaths = [path5];
      if (includes) {
        let includeBasePaths = [];
        for (let include of includes) {
          let absolute2 = (0, path_1.isRootedDiskPath)(include) ? include : (0, path_1.normalizePath)((0, path_1.combinePaths)(path5, include));
          includeBasePaths.push(getIncludeBasePath(absolute2));
        }
        includeBasePaths.sort((0, core_1.getStringComparer)(!useCaseSensitiveFileNames));
        for (let includeBasePath of includeBasePaths)
          (0, core_1.every)(basePaths, (basePath) => !(0, path_1.containsPath)(basePath, includeBasePath, path5, !useCaseSensitiveFileNames)) && basePaths.push(includeBasePath);
      }
      return basePaths;
    }
    function getIncludeBasePath(absolute2) {
      let wildcardOffset = (0, core_1.indexOfAnyCharCode)(absolute2, wildcardCharCodes);
      return wildcardOffset < 0 ? (0, path_1.hasExtension)(absolute2) ? (0, path_1.removeTrailingDirectorySeparator)((0, path_1.getDirectoryPath)(absolute2)) : absolute2 : absolute2.substring(0, absolute2.lastIndexOf(path_1.directorySeparator, wildcardOffset));
    }
  }
});

// ../../../node_modules/@volar/typescript/lib/protocol/createSys.js
var require_createSys = __commonJS({
  "../../../node_modules/@volar/typescript/lib/protocol/createSys.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: !0 });
    exports.createSys = createSys;
    var path5 = require_path_browserify(), vscode_uri_1 = require_umd(), utilities_1 = require_utilities(), currentCwd = "";
    function createSys(sys, env, getCurrentDirectory, uriConverter) {
      let version2 = 0, caseSensitive = sys?.useCaseSensitiveFileNames ?? !1, root = {
        name: "",
        dirs: /* @__PURE__ */ new Map(),
        files: /* @__PURE__ */ new Map(),
        requestedRead: !1
      }, promises = /* @__PURE__ */ new Set(), fileWatcher = env.onDidChangeWatchedFiles?.(({ changes }) => {
        version2++;
        for (let change of changes) {
          let changeUri = vscode_uri_1.URI.parse(change.uri), fileName = uriConverter.asFileName(changeUri), dirName = path5.dirname(fileName), baseName = path5.basename(fileName), fileExists2 = change.type === 1 || change.type === 2;
          getDir(dirName, fileExists2).files.set(normalizeFileId(baseName), fileExists2 ? {
            name: baseName,
            stat: {
              type: 1,
              ctime: Date.now(),
              mtime: Date.now(),
              size: -1
            },
            requestedStat: !1,
            requestedText: !1
          } : {
            name: baseName,
            stat: void 0,
            text: void 0,
            requestedStat: !0,
            requestedText: !0
          });
        }
      });
      return {
        dispose() {
          fileWatcher?.dispose();
        },
        args: sys?.args ?? [],
        newLine: sys?.newLine ?? `
`,
        useCaseSensitiveFileNames: caseSensitive,
        realpath: sys?.realpath,
        write: sys?.write ?? (() => {
        }),
        writeFile: sys?.writeFile ?? (() => {
        }),
        createDirectory: sys?.createDirectory ?? (() => {
        }),
        exit: sys?.exit ?? (() => {
        }),
        getExecutingFilePath: sys?.getExecutingFilePath ?? (() => getCurrentDirectory + "/__fake__.js"),
        getCurrentDirectory,
        getModifiedTime,
        readFile,
        readDirectory,
        getDirectories,
        resolvePath,
        fileExists,
        directoryExists,
        get version() {
          return version2;
        },
        async sync() {
          for (; promises.size; )
            await Promise.all(promises);
          return version2;
        }
      };
      function resolvePath(fsPath) {
        if (sys) {
          let currentDirectory = getCurrentDirectory();
          if (currentCwd !== currentDirectory && (currentCwd = currentDirectory, sys.directoryExists(currentDirectory)))
            try {
              process.chdir(currentDirectory);
            } catch {
            }
          return sys.resolvePath(fsPath).replace(/\\/g, "/");
        }
        return path5.resolve(fsPath).replace(/\\/g, "/");
      }
      function readFile(fileName, encoding) {
        fileName = resolvePath(fileName);
        let dirPath = path5.dirname(fileName), dir = getDir(dirPath), name = path5.basename(fileName);
        return readFileWorker(fileName, encoding, dir), dir.files.get(normalizeFileId(name))?.text;
      }
      function directoryExists(dirName) {
        dirName = resolvePath(dirName);
        let dir = getDir(dirName);
        if (dir.exists === void 0) {
          dir.exists = !1;
          let result = env.fs?.stat(uriConverter.asUri(dirName));
          if (typeof result == "object" && "then" in result) {
            let promise = result;
            promises.add(promise), result.then((result2) => {
              promises.delete(promise), dir.exists = result2?.type === 2, dir.exists && version2++;
            });
          } else
            dir.exists = result?.type === 2;
        }
        return dir.exists;
      }
      function getModifiedTime(fileName) {
        fileName = resolvePath(fileName);
        let file = getFile(fileName);
        return file.requestedStat || (file.requestedStat = !0, handleStat(fileName, file)), file.stat ? new Date(file.stat.mtime) : /* @__PURE__ */ new Date(-1);
      }
      function fileExists(fileName) {
        fileName = resolvePath(fileName);
        let file = getFile(fileName), exists = () => file.text !== void 0 || file.stat?.type === 1;
        return exists() ? !0 : (file.requestedStat || (file.requestedStat = !0, handleStat(fileName, file)), exists());
      }
      function handleStat(fileName, file) {
        let result = env.fs?.stat(uriConverter.asUri(fileName));
        if (typeof result == "object" && "then" in result) {
          let promise = result;
          promises.add(promise), result.then((result2) => {
            promises.delete(promise), (file.stat?.type !== result2?.type || file.stat?.mtime !== result2?.mtime) && version2++, file.stat = result2;
          });
        } else
          file.stat = result;
      }
      function getFile(fileName) {
        fileName = resolvePath(fileName);
        let dirPath = path5.dirname(fileName), baseName = path5.basename(fileName), dir = getDir(dirPath), file = dir.files.get(normalizeFileId(baseName));
        return file || dir.files.set(normalizeFileId(baseName), file = {
          name: baseName,
          requestedStat: !1,
          requestedText: !1
        }), file;
      }
      function getDirectories(dirName) {
        return dirName = resolvePath(dirName), readDirectoryWorker(dirName), [...getDir(dirName).dirs.values()].filter((dir2) => dir2.exists).map((dir2) => dir2.name);
      }
      function readDirectory(dirName, extensions, excludes, includes, depth) {
        dirName = resolvePath(dirName);
        let currentDirectory = getCurrentDirectory(), matches = (0, utilities_1.matchFiles)(dirName, extensions, excludes, includes, caseSensitive, currentDirectory, depth, (dirPath) => {
          dirPath = resolvePath(dirPath), readDirectoryWorker(dirPath);
          let dir = getDir(dirPath);
          return {
            files: [...dir.files.values()].filter((file) => file.stat?.type === 1).map((file) => file.name),
            directories: [...dir.dirs.values()].filter((dir2) => dir2.exists).map((dir2) => dir2.name)
          };
        }, sys?.realpath ? ((path6) => sys.realpath(path6)) : ((path6) => path6));
        return [...new Set(matches)];
      }
      function readFileWorker(fileName, encoding, dir) {
        let name = path5.basename(fileName), file = dir.files.get(normalizeFileId(name));
        if (file || dir.files.set(normalizeFileId(name), file = {
          name,
          requestedStat: !1,
          requestedText: !1
        }), file.requestedText)
          return;
        file.requestedText = !0;
        let uri = uriConverter.asUri(fileName), result = env.fs?.readFile(uri, encoding);
        if (typeof result == "object" && "then" in result) {
          let promise = result;
          promises.add(promise), result.then((result2) => {
            promises.delete(promise), result2 !== void 0 && (file.text = result2, file.stat && file.stat.mtime++, version2++);
          });
        } else result !== void 0 && (file.text = result);
      }
      function readDirectoryWorker(dirName) {
        let dir = getDir(dirName);
        if (dir.requestedRead)
          return;
        dir.requestedRead = !0;
        let result = env.fs?.readDirectory(uriConverter.asUri(dirName || "."));
        if (typeof result == "object" && "then" in result) {
          let promise = result;
          promises.add(promise), result.then((result2) => {
            promises.delete(promise), onReadDirectoryResult(dirName, dir, result2) && version2++;
          });
        } else
          onReadDirectoryResult(dirName, dir, result ?? []);
      }
      function onReadDirectoryResult(dirName, dir, result) {
        result = result.filter(([name]) => name !== "." && name !== "..");
        let updated = !1;
        for (let [name, _fileType] of result) {
          let fileType = _fileType;
          if (fileType === 64) {
            let stat = env.fs?.stat(uriConverter.asUri(dirName + "/" + name));
            if (typeof stat == "object" && "then" in stat) {
              let promise = stat;
              promises.add(promise), stat.then((stat2) => {
                if (promises.delete(promise), stat2?.type === 1) {
                  let file = dir.files.get(normalizeFileId(name));
                  file || dir.files.set(normalizeFileId(name), file = {
                    name,
                    requestedStat: !1,
                    requestedText: !1
                  }), (stat2.type !== file.stat?.type || stat2.mtime !== file.stat?.mtime) && version2++, file.stat = stat2, file.requestedStat = !0;
                } else if (stat2?.type === 2) {
                  let childDir = getDirFromDir(dir, name);
                  childDir.exists || (childDir.exists = !0, version2++);
                }
              });
            } else stat && (fileType = stat.type);
          }
          if (fileType === 1) {
            let file = dir.files.get(normalizeFileId(name));
            file || dir.files.set(normalizeFileId(name), file = {
              name,
              requestedStat: !1,
              requestedText: !1
            }), file.stat || (file.stat = {
              type: 1,
              mtime: 0,
              ctime: 0,
              size: 0
            }, updated = !0);
          } else if (fileType === 2) {
            let childDir = getDirFromDir(dir, name);
            childDir.exists || (childDir.exists = !0, updated = !0);
          }
        }
        return updated;
      }
      function getDir(dirName, markExists = !1) {
        let dirNames = [], currentDirPath = dirName, currentDirName = path5.basename(currentDirPath), lastDirPath;
        for (; lastDirPath !== currentDirPath; )
          lastDirPath = currentDirPath, dirNames.push(currentDirName), currentDirPath = path5.dirname(currentDirPath), currentDirName = path5.basename(currentDirPath);
        let currentDir = root;
        for (let i2 = dirNames.length - 1; i2 >= 0; i2--) {
          let nextDirName = dirNames[i2];
          currentDir = getDirFromDir(currentDir, nextDirName), markExists && !currentDir.exists && (currentDir.exists = !0, version2++);
        }
        return currentDir;
      }
      function getDirFromDir(dir, name) {
        let target = dir.dirs.get(normalizeFileId(name));
        return target || dir.dirs.set(normalizeFileId(name), target = {
          name,
          dirs: /* @__PURE__ */ new Map(),
          files: /* @__PURE__ */ new Map()
        }), target;
      }
      function normalizeFileId(fileName) {
        return caseSensitive ? fileName : fileName.toLowerCase();
      }
    }
  }
});

// ../../../node_modules/@volar/typescript/index.js
var require_typescript = __commonJS({
  "../../../node_modules/@volar/typescript/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      k2 === void 0 && (k2 = k);
      var desc = Object.getOwnPropertyDescriptor(m, k);
      (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) && (desc = { enumerable: !0, get: function() {
        return m[k];
      } }), Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      k2 === void 0 && (k2 = k), o[k2] = m[k];
    })), __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m) p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p) && __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: !0 });
    __exportStar(require_common(), exports);
    __exportStar(require_decorateLanguageServiceHost(), exports);
    __exportStar(require_decorateProgram(), exports);
    __exportStar(require_proxyCreateProgram(), exports);
    __exportStar(require_proxyLanguageService(), exports);
    __exportStar(require_createProject(), exports);
    __exportStar(require_createSys(), exports);
  }
});

// src/preset.ts
import path4, { join as join6 } from "node:path";
import { fileURLToPath as fileURLToPath2 } from "node:url";
import { getProjectRoot as getProjectRoot2 } from "storybook/internal/common";

// ../../core/src/shared/utils/module.ts
import { createRequire, register } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

// ../../../node_modules/exsolve/dist/index.mjs
import assert from "node:assert";
import v8 from "node:v8";
import { format, inspect } from "node:util";
var own$1 = {}.hasOwnProperty, classRegExp = /^([A-Z][a-z\d]*)+$/, kTypes = /* @__PURE__ */ new Set([
  "string",
  "function",
  "number",
  "object",
  "Function",
  "Object",
  "boolean",
  "bigint",
  "symbol"
]), messages = /* @__PURE__ */ new Map(), nodeInternalPrefix = "__node_internal_", userStackTraceLimit;
function formatList(array, type = "and") {
  return array.length < 3 ? array.join(` ${type} `) : `${array.slice(0, -1).join(", ")}, ${type} ${array.at(-1)}`;
}
function createError(sym, value, constructor) {
  return messages.set(sym, value), makeNodeErrorWithCode(constructor, sym);
}
function makeNodeErrorWithCode(Base, key) {
  return function(...parameters) {
    let limit = Error.stackTraceLimit;
    isErrorStackTraceLimitWritable() && (Error.stackTraceLimit = 0);
    let error = new Base();
    isErrorStackTraceLimitWritable() && (Error.stackTraceLimit = limit);
    let message = getMessage(key, parameters, error);
    return Object.defineProperties(error, {
      message: {
        value: message,
        enumerable: !1,
        writable: !0,
        configurable: !0
      },
      toString: {
        value() {
          return `${this.name} [${key}]: ${this.message}`;
        },
        enumerable: !1,
        writable: !0,
        configurable: !0
      }
    }), captureLargerStackTrace(error), error.code = key, error;
  };
}
function isErrorStackTraceLimitWritable() {
  try {
    if (v8.startupSnapshot.isBuildingSnapshot()) return !1;
  } catch {
  }
  let desc = Object.getOwnPropertyDescriptor(Error, "stackTraceLimit");
  return desc === void 0 ? Object.isExtensible(Error) : own$1.call(desc, "writable") && desc.writable !== void 0 ? desc.writable : desc.set !== void 0;
}
function hideStackFrames(wrappedFunction) {
  let hidden = nodeInternalPrefix + wrappedFunction.name;
  return Object.defineProperty(wrappedFunction, "name", { value: hidden }), wrappedFunction;
}
var captureLargerStackTrace = hideStackFrames(function(error) {
  let stackTraceLimitIsWritable = isErrorStackTraceLimitWritable();
  return stackTraceLimitIsWritable && (userStackTraceLimit = Error.stackTraceLimit, Error.stackTraceLimit = Number.POSITIVE_INFINITY), Error.captureStackTrace(error), stackTraceLimitIsWritable && (Error.stackTraceLimit = userStackTraceLimit), error;
});
function getMessage(key, parameters, self2) {
  let message = messages.get(key);
  if (assert.ok(message !== void 0, "expected `message` to be found"), typeof message == "function")
    return assert.ok(message.length <= parameters.length, `Code: ${key}; The provided arguments length (${parameters.length}) does not match the required ones (${message.length}).`), Reflect.apply(message, self2, parameters);
  let regex = /%[dfijoOs]/g, expectedLength = 0;
  for (; regex.exec(message) !== null; ) expectedLength++;
  return assert.ok(expectedLength === parameters.length, `Code: ${key}; The provided arguments length (${parameters.length}) does not match the required ones (${expectedLength}).`), parameters.length === 0 ? message : (parameters.unshift(message), Reflect.apply(format, null, parameters));
}
function determineSpecificType(value) {
  if (value == null) return String(value);
  if (typeof value == "function" && value.name) return `function ${value.name}`;
  if (typeof value == "object")
    return value.constructor && value.constructor.name ? `an instance of ${value.constructor.name}` : `${inspect(value, { depth: -1 })}`;
  let inspected = inspect(value, { colors: !1 });
  return inspected.length > 28 && (inspected = `${inspected.slice(0, 25)}...`), `type ${typeof value} (${inspected})`;
}
var ERR_INVALID_ARG_TYPE = createError("ERR_INVALID_ARG_TYPE", (name, expected, actual) => {
  assert.ok(typeof name == "string", "'name' must be a string"), Array.isArray(expected) || (expected = [expected]);
  let message = "The ";
  if (name.endsWith(" argument")) message += `${name} `;
  else {
    let type = name.includes(".") ? "property" : "argument";
    message += `"${name}" ${type} `;
  }
  message += "must be ";
  let types2 = [], instances = [], other = [];
  for (let value of expected)
    assert.ok(typeof value == "string", "All expected entries have to be of type string"), kTypes.has(value) ? types2.push(value.toLowerCase()) : classRegExp.exec(value) === null ? (assert.ok(value !== "object", 'The value "object" should be written as "Object"'), other.push(value)) : instances.push(value);
  if (instances.length > 0) {
    let pos = types2.indexOf("object");
    pos !== -1 && (types2.slice(pos, 1), instances.push("Object"));
  }
  return types2.length > 0 && (message += `${types2.length > 1 ? "one of type" : "of type"} ${formatList(types2, "or")}`, (instances.length > 0 || other.length > 0) && (message += " or ")), instances.length > 0 && (message += `an instance of ${formatList(instances, "or")}`, other.length > 0 && (message += " or ")), other.length > 0 && (other.length > 1 ? message += `one of ${formatList(other, "or")}` : (other[0]?.toLowerCase() !== other[0] && (message += "an "), message += `${other[0]}`)), message += `. Received ${determineSpecificType(actual)}`, message;
}, TypeError), ERR_INVALID_MODULE_SPECIFIER = createError(
  "ERR_INVALID_MODULE_SPECIFIER",
  /**
  * @param {string} request
  * @param {string} reason
  * @param {string} [base]
  */
  (request, reason, base2) => `Invalid module "${request}" ${reason}${base2 ? ` imported from ${base2}` : ""}`,
  TypeError
), ERR_INVALID_PACKAGE_CONFIG = createError("ERR_INVALID_PACKAGE_CONFIG", (path$1, base2, message) => `Invalid package config ${path$1}${base2 ? ` while importing ${base2}` : ""}${message ? `. ${message}` : ""}`, Error), ERR_INVALID_PACKAGE_TARGET = createError("ERR_INVALID_PACKAGE_TARGET", (packagePath, key, target, isImport = !1, base2) => {
  let relatedError = typeof target == "string" && !isImport && target.length > 0 && !target.startsWith("./");
  return key === "." ? (assert.ok(isImport === !1), `Invalid "exports" main target ${JSON.stringify(target)} defined in the package config ${packagePath}package.json${base2 ? ` imported from ${base2}` : ""}${relatedError ? '; targets must start with "./"' : ""}`) : `Invalid "${isImport ? "imports" : "exports"}" target ${JSON.stringify(target)} defined for '${key}' in the package config ${packagePath}package.json${base2 ? ` imported from ${base2}` : ""}${relatedError ? '; targets must start with "./"' : ""}`;
}, Error), ERR_MODULE_NOT_FOUND = createError("ERR_MODULE_NOT_FOUND", (path$1, base2, exactUrl = !1) => `Cannot find ${exactUrl ? "module" : "package"} '${path$1}' imported from ${base2}`, Error), ERR_NETWORK_IMPORT_DISALLOWED = createError("ERR_NETWORK_IMPORT_DISALLOWED", "import of '%s' by %s is not supported: %s", Error), ERR_PACKAGE_IMPORT_NOT_DEFINED = createError("ERR_PACKAGE_IMPORT_NOT_DEFINED", (specifier, packagePath, base2) => `Package import specifier "${specifier}" is not defined${packagePath ? ` in package ${packagePath || ""}package.json` : ""} imported from ${base2}`, TypeError), ERR_PACKAGE_PATH_NOT_EXPORTED = createError(
  "ERR_PACKAGE_PATH_NOT_EXPORTED",
  /**
  * @param {string} packagePath
  * @param {string} subpath
  * @param {string} [base]
  */
  (packagePath, subpath, base2) => subpath === "." ? `No "exports" main defined in ${packagePath}package.json${base2 ? ` imported from ${base2}` : ""}` : `Package subpath '${subpath}' is not defined by "exports" in ${packagePath}package.json${base2 ? ` imported from ${base2}` : ""}`,
  Error
), ERR_UNSUPPORTED_DIR_IMPORT = createError("ERR_UNSUPPORTED_DIR_IMPORT", "Directory import '%s' is not supported resolving ES modules imported from %s", Error), ERR_UNSUPPORTED_RESOLVE_REQUEST = createError("ERR_UNSUPPORTED_RESOLVE_REQUEST", 'Failed to resolve module specifier "%s" from "%s": Invalid relative URL or base scheme is not hierarchical.', TypeError), ERR_UNKNOWN_FILE_EXTENSION = createError("ERR_UNKNOWN_FILE_EXTENSION", (extension, path$1) => `Unknown file extension "${extension}" for ${path$1}`, TypeError), ERR_INVALID_ARG_VALUE = createError("ERR_INVALID_ARG_VALUE", (name, value, reason = "is invalid") => {
  let inspected = inspect(value);
  return inspected.length > 128 && (inspected = `${inspected.slice(0, 128)}...`), `The ${name.includes(".") ? "property" : "argument"} '${name}' ${reason}. Received ${inspected}`;
}, TypeError), hasOwnProperty$1 = {}.hasOwnProperty;
var hasOwnProperty = {}.hasOwnProperty;
var RegExpPrototypeSymbolReplace = RegExp.prototype[Symbol.replace], own = {}.hasOwnProperty;
var isWindows = process.platform === "win32", globalCache = globalThis.__EXSOLVE_CACHE__ ||= /* @__PURE__ */ new Map();

// ../../../node_modules/pathe/dist/shared/pathe.ff20891b.mjs
var _DRIVE_LETTER_START_RE = /^[A-Za-z]:\//;
function normalizeWindowsPath(input = "") {
  return input && input.replace(/\\/g, "/").replace(_DRIVE_LETTER_START_RE, (r) => r.toUpperCase());
}
var _UNC_REGEX = /^[/\\]{2}/, _IS_ABSOLUTE_RE = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/, _DRIVE_LETTER_RE = /^[A-Za-z]:$/, _ROOT_FOLDER_RE = /^\/([A-Za-z]:)?$/, sep = "/", delimiter = ":", normalize = function(path5) {
  if (path5.length === 0)
    return ".";
  path5 = normalizeWindowsPath(path5);
  let isUNCPath = path5.match(_UNC_REGEX), isPathAbsolute = isAbsolute(path5), trailingSeparator = path5[path5.length - 1] === "/";
  return path5 = normalizeString(path5, !isPathAbsolute), path5.length === 0 ? isPathAbsolute ? "/" : trailingSeparator ? "./" : "." : (trailingSeparator && (path5 += "/"), _DRIVE_LETTER_RE.test(path5) && (path5 += "/"), isUNCPath ? isPathAbsolute ? `//${path5}` : `//./${path5}` : isPathAbsolute && !isAbsolute(path5) ? `/${path5}` : path5);
}, join = function(...arguments_) {
  if (arguments_.length === 0)
    return ".";
  let joined;
  for (let argument of arguments_)
    argument && argument.length > 0 && (joined === void 0 ? joined = argument : joined += `/${argument}`);
  return joined === void 0 ? "." : normalize(joined.replace(/\/\/+/g, "/"));
};
function cwd() {
  return typeof process < "u" && typeof process.cwd == "function" ? process.cwd().replace(/\\/g, "/") : "/";
}
var resolve = function(...arguments_) {
  arguments_ = arguments_.map((argument) => normalizeWindowsPath(argument));
  let resolvedPath = "", resolvedAbsolute = !1;
  for (let index = arguments_.length - 1; index >= -1 && !resolvedAbsolute; index--) {
    let path5 = index >= 0 ? arguments_[index] : cwd();
    !path5 || path5.length === 0 || (resolvedPath = `${path5}/${resolvedPath}`, resolvedAbsolute = isAbsolute(path5));
  }
  return resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute), resolvedAbsolute && !isAbsolute(resolvedPath) ? `/${resolvedPath}` : resolvedPath.length > 0 ? resolvedPath : ".";
};
function normalizeString(path5, allowAboveRoot) {
  let res = "", lastSegmentLength = 0, lastSlash = -1, dots = 0, char = null;
  for (let index = 0; index <= path5.length; ++index) {
    if (index < path5.length)
      char = path5[index];
    else {
      if (char === "/")
        break;
      char = "/";
    }
    if (char === "/") {
      if (!(lastSlash === index - 1 || dots === 1)) if (dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res[res.length - 1] !== "." || res[res.length - 2] !== ".") {
          if (res.length > 2) {
            let lastSlashIndex = res.lastIndexOf("/");
            lastSlashIndex === -1 ? (res = "", lastSegmentLength = 0) : (res = res.slice(0, lastSlashIndex), lastSegmentLength = res.length - 1 - res.lastIndexOf("/")), lastSlash = index, dots = 0;
            continue;
          } else if (res.length > 0) {
            res = "", lastSegmentLength = 0, lastSlash = index, dots = 0;
            continue;
          }
        }
        allowAboveRoot && (res += res.length > 0 ? "/.." : "..", lastSegmentLength = 2);
      } else
        res.length > 0 ? res += `/${path5.slice(lastSlash + 1, index)}` : res = path5.slice(lastSlash + 1, index), lastSegmentLength = index - lastSlash - 1;
      lastSlash = index, dots = 0;
    } else char === "." && dots !== -1 ? ++dots : dots = -1;
  }
  return res;
}
var isAbsolute = function(p) {
  return _IS_ABSOLUTE_RE.test(p);
}, toNamespacedPath = function(p) {
  return normalizeWindowsPath(p);
}, _EXTNAME_RE = /.(\.[^./]+)$/, extname = function(p) {
  let match = _EXTNAME_RE.exec(normalizeWindowsPath(p));
  return match && match[1] || "";
}, relative = function(from, to) {
  let _from = resolve(from).replace(_ROOT_FOLDER_RE, "$1").split("/"), _to = resolve(to).replace(_ROOT_FOLDER_RE, "$1").split("/");
  if (_to[0][1] === ":" && _from[0][1] === ":" && _from[0] !== _to[0])
    return _to.join("/");
  let _fromCopy = [..._from];
  for (let segment of _fromCopy) {
    if (_to[0] !== segment)
      break;
    _from.shift(), _to.shift();
  }
  return [..._from.map(() => ".."), ..._to].join("/");
}, dirname = function(p) {
  let segments = normalizeWindowsPath(p).replace(/\/$/, "").split("/").slice(0, -1);
  return segments.length === 1 && _DRIVE_LETTER_RE.test(segments[0]) && (segments[0] += "/"), segments.join("/") || (isAbsolute(p) ? "/" : ".");
}, format2 = function(p) {
  let segments = [p.root, p.dir, p.base ?? p.name + p.ext].filter(Boolean);
  return normalizeWindowsPath(
    p.root ? resolve(...segments) : segments.join("/")
  );
}, basename = function(p, extension) {
  let lastSegment = normalizeWindowsPath(p).split("/").pop();
  return extension && lastSegment.endsWith(extension) ? lastSegment.slice(0, -extension.length) : lastSegment;
}, parse = function(p) {
  let root = normalizeWindowsPath(p).split("/").shift() || "/", base2 = basename(p), extension = extname(base2);
  return {
    root,
    dir: dirname(p),
    base: base2,
    ext: extension,
    name: base2.slice(0, base2.length - extension.length)
  };
}, path = {
  __proto__: null,
  basename,
  delimiter,
  dirname,
  extname,
  format: format2,
  isAbsolute,
  join,
  normalize,
  normalizeString,
  parse,
  relative,
  resolve,
  sep,
  toNamespacedPath
};

// ../../core/src/shared/utils/module.ts
var importMetaResolve = (...args) => typeof import.meta.resolve != "function" && process.env.VITEST === "true" ? (console.warn(
  "importMetaResolve from within Storybook is being used in a Vitest test, but it shouldn't be. Please report this at https://github.com/storybookjs/storybook/issues/new?template=bug_report.yml"
), pathToFileURL(args[0]).href) : import.meta.resolve(...args), resolvePackageDir = (pkg, parent) => {
  try {
    return dirname(fileURLToPath(importMetaResolve(join(pkg, "package.json"), parent)));
  } catch {
    try {
      return dirname(fileURLToPath(importMetaResolve(join(pkg, "package.json"))));
    } catch {
      let req = createRequire(parent ?? import.meta.url);
      return dirname(req.resolve(join(pkg, "package.json")));
    }
  }
};

// src/componentManifest/reactDocgen/extractReactDocgenInfo.ts
import { logger as logger3 } from "storybook/internal/node-logger";

// src/extractProps.ts
import {
  TypeSystem,
  extractComponentProps,
  hasDocgen
} from "storybook/internal/docs-tools";

// src/docs/lib/componentTypes.ts
var isMemo = (component) => component.$$typeof === /* @__PURE__ */ Symbol.for("react.memo");

// src/docs/lib/defaultValues/createDefaultValue.ts
import {
  createSummaryValue as createSummaryValue3,
  isTooLongForDefaultValueSummary as isTooLongForDefaultValueSummary3
} from "storybook/internal/docs-tools";

// src/docs/lib/captions.ts
var CUSTOM_CAPTION = "custom", OBJECT_CAPTION = "object", ARRAY_CAPTION = "array", CLASS_CAPTION = "class", FUNCTION_CAPTION = "func", ELEMENT_CAPTION = "element";

// src/docs/lib/generateCode.ts
var import_escodegen = __toESM(require_escodegen(), 1), import_ts_dedent = __toESM(require_dist(), 1), BASIC_OPTIONS = {
  format: {
    indent: {
      style: "  "
    },
    semicolons: !1
  }
}, COMPACT_OPTIONS = {
  ...BASIC_OPTIONS,
  format: {
    newline: ""
  }
}, PRETTY_OPTIONS = {
  ...BASIC_OPTIONS
};
function generateCode(ast, compact = !1) {
  return (0, import_escodegen.generate)(ast, compact ? COMPACT_OPTIONS : PRETTY_OPTIONS);
}
function generateObjectCode(ast, compact = !1) {
  return compact ? generateCompactObjectCode(ast) : generateCode(ast);
}
function generateCompactObjectCode(ast) {
  let result = generateCode(ast, !0);
  return result.endsWith(" }") || (result = `${result.slice(0, -1)} }`), result;
}
function generateArrayCode(ast, compact = !1) {
  return compact ? generateCompactArrayCode(ast) : generateMultilineArrayCode(ast);
}
function generateMultilineArrayCode(ast) {
  let result = generateCode(ast);
  return result.endsWith("  }]") && (result = (0, import_ts_dedent.dedent)(result)), result;
}
function generateCompactArrayCode(ast) {
  let result = generateCode(ast, !0);
  return result.startsWith("[    ") && (result = result.replace("[    ", "[")), result;
}

// src/docs/lib/inspection/acornParser.ts
init_acorn();
var import_acorn_jsx = __toESM(require_acorn_jsx(), 1), acornWalk = __toESM(require_walk(), 1);
var ACORN_WALK_VISITORS = {
  // @ts-expect-error (Converted from ts-ignore)
  ...acornWalk.base,
  JSXElement: () => {
  }
}, acornParser = Parser.extend((0, import_acorn_jsx.default)());
function extractIdentifierName(identifierNode) {
  return identifierNode != null ? identifierNode.name : null;
}
function filterAncestors(ancestors) {
  return ancestors.filter((x) => x.type === "ObjectExpression" || x.type === "ArrayExpression");
}
function calculateNodeDepth(node) {
  let depths = [];
  return acornWalk.ancestor(
    // @ts-expect-error (Converted from ts-ignore)
    node,
    {
      ObjectExpression(_, ancestors) {
        depths.push(filterAncestors(ancestors).length);
      },
      ArrayExpression(_, ancestors) {
        depths.push(filterAncestors(ancestors).length);
      }
    },
    ACORN_WALK_VISITORS
  ), Math.max(...depths);
}
function parseIdentifier(identifierNode) {
  return {
    inferredType: {
      type: "Identifier" /* IDENTIFIER */,
      identifier: extractIdentifierName(identifierNode)
    },
    ast: identifierNode
  };
}
function parseLiteral(literalNode) {
  return {
    inferredType: { type: "Literal" /* LITERAL */ },
    ast: literalNode
  };
}
function parseFunction(funcNode) {
  let innerJsxElementNode;
  acornWalk.simple(
    // @ts-expect-error (Converted from ts-ignore)
    funcNode.body,
    {
      JSXElement(node) {
        innerJsxElementNode = node;
      }
    },
    ACORN_WALK_VISITORS
  );
  let inferredType = {
    type: innerJsxElementNode != null ? "Element" /* ELEMENT */ : "Function" /* FUNCTION */,
    params: funcNode.params,
    hasParams: funcNode.params.length !== 0
  }, identifierName = extractIdentifierName(funcNode.id);
  return identifierName != null && (inferredType.identifier = identifierName), {
    inferredType,
    ast: funcNode
  };
}
function parseClass(classNode) {
  let innerJsxElementNode;
  return acornWalk.simple(
    // @ts-expect-error (Converted from ts-ignore)
    classNode.body,
    {
      JSXElement(node) {
        innerJsxElementNode = node;
      }
    },
    ACORN_WALK_VISITORS
  ), {
    inferredType: {
      type: innerJsxElementNode != null ? "Element" /* ELEMENT */ : "Class" /* CLASS */,
      identifier: extractIdentifierName(classNode.id)
    },
    ast: classNode
  };
}
function parseJsxElement(jsxElementNode) {
  let inferredType = {
    type: "Element" /* ELEMENT */
  }, identifierName = extractIdentifierName(jsxElementNode.openingElement.name);
  return identifierName != null && (inferredType.identifier = identifierName), {
    inferredType,
    ast: jsxElementNode
  };
}
function parseCall(callNode) {
  let identifierNode = callNode.callee.type === "MemberExpression" ? callNode.callee.property : callNode.callee;
  return extractIdentifierName(identifierNode) === "shape" ? parseObject(callNode.arguments[0]) : null;
}
function parseObject(objectNode) {
  return {
    inferredType: { type: "Object" /* OBJECT */, depth: calculateNodeDepth(objectNode) },
    ast: objectNode
  };
}
function parseArray(arrayNode) {
  return {
    inferredType: { type: "Array" /* ARRAY */, depth: calculateNodeDepth(arrayNode) },
    ast: arrayNode
  };
}
function parseExpression(expression) {
  switch (expression.type) {
    case "Identifier":
      return parseIdentifier(expression);
    case "Literal":
      return parseLiteral(expression);
    case "FunctionExpression":
    case "ArrowFunctionExpression":
      return parseFunction(expression);
    case "ClassExpression":
      return parseClass(expression);
    case "JSXElement":
      return parseJsxElement(expression);
    case "CallExpression":
      return parseCall(expression);
    case "ObjectExpression":
      return parseObject(expression);
    case "ArrayExpression":
      return parseArray(expression);
    default:
      return null;
  }
}
function parse5(value) {
  let ast = acornParser.parse(`(${value})`, { ecmaVersion: 2020 }), parsingResult = {
    inferredType: { type: "Unknown" /* UNKNOWN */ },
    ast
  };
  if (ast.body[0] != null) {
    let rootNode = ast.body[0];
    if (rootNode.type === "ExpressionStatement") {
      let expressionResult = parseExpression(rootNode.expression);
      expressionResult != null && (parsingResult = expressionResult);
    }
  }
  return parsingResult;
}

// src/docs/lib/inspection/inspectValue.ts
function inspectValue(value) {
  try {
    return { ...parse5(value) };
  } catch {
  }
  return { inferredType: { type: "Unknown" /* UNKNOWN */ } };
}

// src/docs/lib/isHtmlTag.ts
var import_html_tags = __toESM(require_html_tags2(), 1);
function isHtmlTag(tagName) {
  return import_html_tags.default.includes(tagName.toLowerCase());
}

// src/docs/lib/defaultValues/generateArray.ts
import {
  createSummaryValue,
  isTooLongForDefaultValueSummary
} from "storybook/internal/docs-tools";
function generateArray({ inferredType, ast }) {
  let { depth } = inferredType;
  if (depth <= 2) {
    let compactArray = generateArrayCode(ast, !0);
    if (!isTooLongForDefaultValueSummary(compactArray))
      return createSummaryValue(compactArray);
  }
  return createSummaryValue(ARRAY_CAPTION, generateArrayCode(ast));
}

// src/docs/lib/defaultValues/generateObject.ts
import {
  createSummaryValue as createSummaryValue2,
  isTooLongForDefaultValueSummary as isTooLongForDefaultValueSummary2
} from "storybook/internal/docs-tools";
function generateObject({ inferredType, ast }) {
  let { depth } = inferredType;
  if (depth === 1) {
    let compactObject = generateObjectCode(ast, !0);
    if (!isTooLongForDefaultValueSummary2(compactObject))
      return createSummaryValue2(compactObject);
  }
  return createSummaryValue2(OBJECT_CAPTION, generateObjectCode(ast));
}

// src/docs/lib/defaultValues/prettyIdentifier.ts
function getPrettyFuncIdentifier(identifier, hasArguments) {
  return hasArguments ? `${identifier}( ... )` : `${identifier}()`;
}
function getPrettyElementIdentifier(identifier) {
  return `<${identifier} />`;
}
function getPrettyIdentifier(inferredType) {
  let { type, identifier } = inferredType;
  switch (type) {
    case "Function" /* FUNCTION */:
      return getPrettyFuncIdentifier(identifier, inferredType.hasParams);
    case "Element" /* ELEMENT */:
      return getPrettyElementIdentifier(identifier);
    default:
      return identifier;
  }
}

// src/docs/lib/defaultValues/createDefaultValue.ts
function generateFunc({ inferredType, ast }) {
  let { identifier } = inferredType;
  if (identifier != null)
    return createSummaryValue3(
      getPrettyIdentifier(inferredType),
      generateCode(ast)
    );
  let prettyCaption = generateCode(ast, !0);
  return isTooLongForDefaultValueSummary3(prettyCaption) ? createSummaryValue3(FUNCTION_CAPTION, generateCode(ast)) : createSummaryValue3(prettyCaption);
}
function generateElement(defaultValue, inspectionResult) {
  let { inferredType } = inspectionResult, { identifier } = inferredType;
  if (identifier != null && !isHtmlTag(identifier)) {
    let prettyIdentifier = getPrettyIdentifier(
      inferredType
    );
    return createSummaryValue3(prettyIdentifier, defaultValue);
  }
  return isTooLongForDefaultValueSummary3(defaultValue) ? createSummaryValue3(ELEMENT_CAPTION, defaultValue) : createSummaryValue3(defaultValue);
}
function createDefaultValue(defaultValue) {
  try {
    let inspectionResult = inspectValue(defaultValue);
    switch (inspectionResult.inferredType.type) {
      case "Object" /* OBJECT */:
        return generateObject(inspectionResult);
      case "Function" /* FUNCTION */:
        return generateFunc(inspectionResult);
      case "Element" /* ELEMENT */:
        return generateElement(defaultValue, inspectionResult);
      case "Array" /* ARRAY */:
        return generateArray(inspectionResult);
      default:
        return null;
    }
  } catch (e) {
    console.error(e);
  }
  return null;
}

// src/docs/lib/defaultValues/createFromRawDefaultProp.ts
import {
  createSummaryValue as createSummaryValue4,
  isTooLongForDefaultValueSummary as isTooLongForDefaultValueSummary4
} from "storybook/internal/docs-tools";

// ../../../node_modules/es-toolkit/dist/predicate/isPlainObject.mjs
function isPlainObject(value) {
  if (!value || typeof value != "object")
    return !1;
  let proto = Object.getPrototypeOf(value);
  return proto === null || proto === Object.prototype || Object.getPrototypeOf(proto) === null ? Object.prototype.toString.call(value) === "[object Object]" : !1;
}

// ../../../node_modules/es-toolkit/dist/predicate/isFunction.mjs
function isFunction(value) {
  return typeof value == "function";
}

// ../../../node_modules/es-toolkit/dist/predicate/isString.mjs
function isString(value) {
  return typeof value == "string";
}

// ../../../node_modules/is-plain-object/dist/is-plain-object.mjs
function isObject(o) {
  return Object.prototype.toString.call(o) === "[object Object]";
}
function isPlainObject2(o) {
  var ctor, prot;
  return isObject(o) === !1 ? !1 : (ctor = o.constructor, ctor === void 0 ? !0 : (prot = ctor.prototype, !(isObject(prot) === !1 || prot.hasOwnProperty("isPrototypeOf") === !1)));
}

// ../../../node_modules/react-element-to-jsx-string/dist/esm/index.js
var import_pretty_print_object = __toESM(require_dist2()), import_react_is = __toESM(require_react_is());
import * as React from "react";
import React__default, { Fragment, isValidElement as isValidElement2 } from "react";
var spacer = (function(times, tabStop) {
  return times === 0 ? "" : new Array(times * tabStop).fill(" ").join("");
});
function _arrayLikeToArray(r, a) {
  (a == null || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _arrayWithoutHoles(r) {
  if (Array.isArray(r)) return _arrayLikeToArray(r);
}
function _defineProperty(e, r, t6) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t6,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t6, e;
}
function _iterableToArray(r) {
  if (typeof Symbol < "u" && r[Symbol.iterator] != null || r["@@iterator"] != null) return Array.from(r);
}
function _nonIterableSpread() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function ownKeys(e, r) {
  var t6 = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t6.push.apply(t6, o);
  }
  return t6;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t6 = arguments[r] != null ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t6), !0).forEach(function(r2) {
      _defineProperty(e, r2, t6[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t6)) : ownKeys(Object(t6)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t6, r2));
    });
  }
  return e;
}
function _toConsumableArray(r) {
  return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
}
function _toPrimitive(t6, r) {
  if (typeof t6 != "object" || !t6) return t6;
  var e = t6[Symbol.toPrimitive];
  if (e !== void 0) {
    var i2 = e.call(t6, r || "default");
    if (typeof i2 != "object") return i2;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (r === "string" ? String : Number)(t6);
}
function _toPropertyKey(t6) {
  var i2 = _toPrimitive(t6, "string");
  return typeof i2 == "symbol" ? i2 : i2 + "";
}
function _typeof(o) {
  "@babel/helpers - typeof";
  return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && typeof Symbol == "function" && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof(o);
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if (typeof r == "string") return _arrayLikeToArray(r, a);
    var t6 = {}.toString.call(r).slice(8, -1);
    return t6 === "Object" && r.constructor && (t6 = r.constructor.name), t6 === "Map" || t6 === "Set" ? Array.from(r) : t6 === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t6) ? _arrayLikeToArray(r, a) : void 0;
  }
}
function safeSortObject(value, seen) {
  if (value === null || _typeof(value) !== "object" || value instanceof Date || value instanceof RegExp)
    return value;
  if (React.isValidElement(value)) {
    var copyObj = _objectSpread2({}, value);
    return delete copyObj._owner, copyObj;
  }
  return seen.add(value), Array.isArray(value) ? value.map(function(v) {
    return safeSortObject(v, seen);
  }) : Object.keys(value).sort().reduce(function(result, key) {
    return key === "current" || seen.has(value[key]) ? result[key] = "[Circular]" : result[key] = safeSortObject(value[key], seen), result;
  }, {});
}
function sortObject(value) {
  return safeSortObject(value, /* @__PURE__ */ new WeakSet());
}
var createStringTreeNode = function(value) {
  return {
    type: "string",
    value
  };
}, createNumberTreeNode = function(value) {
  return {
    type: "number",
    value
  };
}, createReactElementTreeNode = function(displayName, props, defaultProps, childrens) {
  return {
    type: "ReactElement",
    displayName,
    props,
    defaultProps,
    childrens
  };
}, createReactFragmentTreeNode = function(key, childrens) {
  return {
    type: "ReactFragment",
    key,
    childrens
  };
}, supportFragment = !!Fragment, getFunctionTypeName = function(functionType) {
  return !functionType.name || functionType.name === "_default" ? "No Display Name" : functionType.name;
}, _getWrappedComponentDisplayName = function(Component) {
  switch (!0) {
    case !!Component.displayName:
      return Component.displayName;
    case Component.$$typeof === import_react_is.Memo:
      return _getWrappedComponentDisplayName(Component.type);
    case Component.$$typeof === import_react_is.ForwardRef:
      return _getWrappedComponentDisplayName(Component.render);
    default:
      return getFunctionTypeName(Component);
  }
}, getReactElementDisplayName = function(element) {
  switch (!0) {
    case typeof element.type == "string":
      return element.type;
    case typeof element.type == "function":
      return element.type.displayName ? element.type.displayName : getFunctionTypeName(element.type);
    case (0, import_react_is.isForwardRef)(element):
    case (0, import_react_is.isMemo)(element):
      return _getWrappedComponentDisplayName(element.type);
    case (0, import_react_is.isContextConsumer)(element):
      return "".concat(element.type._context.displayName || "Context", ".Consumer");
    case (0, import_react_is.isContextProvider)(element):
      return "".concat(element.type._context.displayName || "Context", ".Provider");
    case (0, import_react_is.isLazy)(element):
      return "Lazy";
    case (0, import_react_is.isProfiler)(element):
      return "Profiler";
    case (0, import_react_is.isStrictMode)(element):
      return "StrictMode";
    case (0, import_react_is.isSuspense)(element):
      return "Suspense";
    default:
      return "UnknownElementType";
  }
}, noChildren = function(propsValue, propName) {
  return propName !== "children";
}, onlyMeaningfulChildren = function(children) {
  return children !== !0 && children !== !1 && children !== null && children !== "";
}, filterProps = function(originalProps, cb) {
  var filteredProps = {};
  return Object.keys(originalProps).filter(function(key) {
    return cb(originalProps[key], key);
  }).forEach(function(key) {
    return filteredProps[key] = originalProps[key];
  }), filteredProps;
}, _parseReactElement = function(element, options) {
  var _options$displayName = options.displayName, displayNameFn = _options$displayName === void 0 ? getReactElementDisplayName : _options$displayName;
  if (typeof element == "string")
    return createStringTreeNode(element);
  if (typeof element == "number")
    return createNumberTreeNode(element);
  if (!React__default.isValidElement(element))
    throw new Error("react-element-to-jsx-string: Expected a React.Element, got `".concat(_typeof(element), "`"));
  var displayName = displayNameFn(element), props = filterProps(element.props, noChildren);
  element.ref !== null && (props.ref = element.ref);
  var key = element.key;
  typeof key == "string" && key.search(/^\./) && (props.key = key);
  var defaultProps = filterProps(element.type.defaultProps || {}, noChildren), childrens = React__default.Children.toArray(element.props.children).filter(onlyMeaningfulChildren).map(function(child) {
    return _parseReactElement(child, options);
  });
  return supportFragment && element.type === Fragment ? createReactFragmentTreeNode(key, childrens) : createReactElementTreeNode(displayName, props, defaultProps, childrens);
};
function noRefCheck() {
}
var inlineFunction = function(fn) {
  return fn.toString().split(`
`).map(function(line) {
    return line.trim();
  }).join("");
};
var defaultFunctionValue = inlineFunction, formatFunction = (function(fn, options) {
  var _options$functionValu = options.functionValue, functionValue = _options$functionValu === void 0 ? defaultFunctionValue : _options$functionValu, showFunctions = options.showFunctions;
  return functionValue(!showFunctions && functionValue === defaultFunctionValue ? noRefCheck : fn);
}), formatComplexDataStructure = (function(value, inline, lvl, options) {
  var normalizedValue = sortObject(value), stringifiedValue = (0, import_pretty_print_object.prettyPrint)(normalizedValue, {
    transform: function(currentObj, prop, originalResult) {
      var currentValue = currentObj[prop];
      return currentValue && isValidElement2(currentValue) ? formatTreeNode(_parseReactElement(currentValue, options), !0, lvl, options) : typeof currentValue == "function" ? formatFunction(currentValue, options) : originalResult;
    }
  });
  return inline ? stringifiedValue.replace(/\s+/g, " ").replace(/{ /g, "{").replace(/ }/g, "}").replace(/\[ /g, "[").replace(/ ]/g, "]") : stringifiedValue.replace(/\t/g, spacer(1, options.tabStop)).replace(/\n([^$])/g, `
`.concat(spacer(lvl + 1, options.tabStop), "$1"));
}), escape$1 = function(s) {
  return s.replace(/"/g, "&quot;");
}, formatPropValue = function(propValue, inline, lvl, options) {
  if (typeof propValue == "number")
    return "{".concat(String(propValue), "}");
  if (typeof propValue == "string")
    return '"'.concat(escape$1(propValue), '"');
  if (_typeof(propValue) === "symbol") {
    var symbolDescription = propValue.valueOf().toString().replace(/Symbol\((.*)\)/, "$1");
    return symbolDescription ? "{Symbol('".concat(symbolDescription, "')}") : "{Symbol()}";
  }
  return typeof propValue == "function" ? "{".concat(formatFunction(propValue, options), "}") : isValidElement2(propValue) ? "{".concat(formatTreeNode(_parseReactElement(propValue, options), !0, lvl, options), "}") : propValue instanceof Date ? isNaN(propValue.valueOf()) ? "{new Date(NaN)}" : '{new Date("'.concat(propValue.toISOString(), '")}') : isPlainObject2(propValue) || Array.isArray(propValue) ? "{".concat(formatComplexDataStructure(propValue, inline, lvl, options), "}") : "{".concat(String(propValue), "}");
}, formatProp = (function(name, hasValue, value, hasDefaultValue, defaultValue, inline, lvl, options) {
  if (!hasValue && !hasDefaultValue)
    throw new Error('The prop "'.concat(name, '" has no value and no default: could not be formatted'));
  var usedValue = hasValue ? value : defaultValue, useBooleanShorthandSyntax = options.useBooleanShorthandSyntax, tabStop = options.tabStop, formattedPropValue = formatPropValue(usedValue, inline, lvl, options), attributeFormattedInline = " ", attributeFormattedMultiline = `
`.concat(spacer(lvl + 1, tabStop)), isMultilineAttribute = formattedPropValue.includes(`
`);
  return useBooleanShorthandSyntax && formattedPropValue === "{false}" && !hasDefaultValue ? (attributeFormattedInline = "", attributeFormattedMultiline = "") : useBooleanShorthandSyntax && formattedPropValue === "{true}" ? (attributeFormattedInline += "".concat(name), attributeFormattedMultiline += "".concat(name)) : (attributeFormattedInline += "".concat(name, "=").concat(formattedPropValue), attributeFormattedMultiline += "".concat(name, "=").concat(formattedPropValue)), {
    attributeFormattedInline,
    attributeFormattedMultiline,
    isMultilineAttribute
  };
}), mergeSiblingPlainStringChildrenReducer = (function(previousNodes, currentNode) {
  var nodes = previousNodes.slice(0, previousNodes.length > 0 ? previousNodes.length - 1 : 0), previousNode = previousNodes[previousNodes.length - 1];
  return previousNode && (currentNode.type === "string" || currentNode.type === "number") && (previousNode.type === "string" || previousNode.type === "number") ? nodes.push(createStringTreeNode(String(previousNode.value) + String(currentNode.value))) : (previousNode && nodes.push(previousNode), nodes.push(currentNode)), nodes;
}), isKeyOrRefProps = function(propName) {
  return ["key", "ref"].includes(propName);
}, sortPropsByNames = (function(shouldSortUserProps) {
  return function(props) {
    var haveKeyProp = props.includes("key"), haveRefProp = props.includes("ref"), userPropsOnly = props.filter(function(oneProp) {
      return !isKeyOrRefProps(oneProp);
    }), sortedProps = _toConsumableArray(shouldSortUserProps ? userPropsOnly.sort() : userPropsOnly);
    return haveRefProp && sortedProps.unshift("ref"), haveKeyProp && sortedProps.unshift("key"), sortedProps;
  };
});
function createPropFilter(props, filter) {
  return Array.isArray(filter) ? function(key) {
    return filter.indexOf(key) === -1;
  } : function(key) {
    return filter(props[key], key);
  };
}
var compensateMultilineStringElementIndentation = function(element, formattedElement, inline, lvl, options) {
  var tabStop = options.tabStop;
  return element.type === "string" ? formattedElement.split(`
`).map(function(line, offset2) {
    return offset2 === 0 ? line : "".concat(spacer(lvl, tabStop)).concat(line);
  }).join(`
`) : formattedElement;
}, formatOneChildren = function(inline, lvl, options) {
  return function(element) {
    return compensateMultilineStringElementIndentation(element, formatTreeNode(element, inline, lvl, options), inline, lvl, options);
  };
}, onlyPropsWithOriginalValue = function(defaultProps, props) {
  return function(propName) {
    var haveDefaultValue = Object.keys(defaultProps).includes(propName);
    return !haveDefaultValue || haveDefaultValue && defaultProps[propName] !== props[propName];
  };
}, isInlineAttributeTooLong = function(attributes, inlineAttributeString, lvl, tabStop, maxInlineAttributesLineLength) {
  return maxInlineAttributesLineLength ? spacer(lvl, tabStop).length + inlineAttributeString.length > maxInlineAttributesLineLength : attributes.length > 1;
}, shouldRenderMultilineAttr = function(attributes, inlineAttributeString, containsMultilineAttr, inline, lvl, tabStop, maxInlineAttributesLineLength) {
  return (isInlineAttributeTooLong(attributes, inlineAttributeString, lvl, tabStop, maxInlineAttributesLineLength) || containsMultilineAttr) && !inline;
}, formatReactElementNode = (function(node, inline, lvl, options) {
  var type = node.type, _node$displayName = node.displayName, displayName = _node$displayName === void 0 ? "" : _node$displayName, childrens = node.childrens, _node$props = node.props, props = _node$props === void 0 ? {} : _node$props, _node$defaultProps = node.defaultProps, defaultProps = _node$defaultProps === void 0 ? {} : _node$defaultProps;
  if (type !== "ReactElement")
    throw new Error('The "formatReactElementNode" function could only format node of type "ReactElement". Given:  '.concat(type));
  var filterProps3 = options.filterProps, maxInlineAttributesLineLength = options.maxInlineAttributesLineLength, showDefaultProps = options.showDefaultProps, sortProps = options.sortProps, tabStop = options.tabStop, out = "<".concat(displayName), outInlineAttr = out, outMultilineAttr = out, containsMultilineAttr = !1, visibleAttributeNames = [], propFilter = createPropFilter(props, filterProps3);
  Object.keys(props).filter(propFilter).filter(onlyPropsWithOriginalValue(defaultProps, props)).forEach(function(propName) {
    return visibleAttributeNames.push(propName);
  }), Object.keys(defaultProps).filter(propFilter).filter(function() {
    return showDefaultProps;
  }).filter(function(defaultPropName) {
    return !visibleAttributeNames.includes(defaultPropName);
  }).forEach(function(defaultPropName) {
    return visibleAttributeNames.push(defaultPropName);
  });
  var attributes = sortPropsByNames(sortProps)(visibleAttributeNames);
  if (attributes.forEach(function(attributeName) {
    var _formatProp = formatProp(attributeName, Object.keys(props).includes(attributeName), props[attributeName], Object.keys(defaultProps).includes(attributeName), defaultProps[attributeName], inline, lvl, options), attributeFormattedInline = _formatProp.attributeFormattedInline, attributeFormattedMultiline = _formatProp.attributeFormattedMultiline, isMultilineAttribute = _formatProp.isMultilineAttribute;
    isMultilineAttribute && (containsMultilineAttr = !0), outInlineAttr += attributeFormattedInline, outMultilineAttr += attributeFormattedMultiline;
  }), outMultilineAttr += `
`.concat(spacer(lvl, tabStop)), shouldRenderMultilineAttr(attributes, outInlineAttr, containsMultilineAttr, inline, lvl, tabStop, maxInlineAttributesLineLength) ? out = outMultilineAttr : out = outInlineAttr, childrens && childrens.length > 0) {
    var newLvl = lvl + 1;
    out += ">", inline || (out += `
`, out += spacer(newLvl, tabStop)), out += childrens.reduce(mergeSiblingPlainStringChildrenReducer, []).map(formatOneChildren(inline, newLvl, options)).join(inline ? "" : `
`.concat(spacer(newLvl, tabStop))), inline || (out += `
`, out += spacer(newLvl - 1, tabStop)), out += "</".concat(displayName, ">");
  } else
    isInlineAttributeTooLong(attributes, outInlineAttr, lvl, tabStop, maxInlineAttributesLineLength) || (out += " "), out += "/>";
  return out;
}), REACT_FRAGMENT_TAG_NAME_SHORT_SYNTAX = "", REACT_FRAGMENT_TAG_NAME_EXPLICIT_SYNTAX = "React.Fragment", toReactElementTreeNode = function(displayName, key, childrens) {
  var props = {};
  return key && (props = {
    key
  }), {
    type: "ReactElement",
    displayName,
    props,
    defaultProps: {},
    childrens
  };
}, isKeyedFragment = function(_ref) {
  var key = _ref.key;
  return !!key;
}, hasNoChildren = function(_ref2) {
  var childrens = _ref2.childrens;
  return childrens.length === 0;
}, formatReactFragmentNode = (function(node, inline, lvl, options) {
  var type = node.type, key = node.key, childrens = node.childrens;
  if (type !== "ReactFragment")
    throw new Error('The "formatReactFragmentNode" function could only format node of type "ReactFragment". Given: '.concat(type));
  var useFragmentShortSyntax = options.useFragmentShortSyntax, displayName;
  return useFragmentShortSyntax ? hasNoChildren(node) || isKeyedFragment(node) ? displayName = REACT_FRAGMENT_TAG_NAME_EXPLICIT_SYNTAX : displayName = REACT_FRAGMENT_TAG_NAME_SHORT_SYNTAX : displayName = REACT_FRAGMENT_TAG_NAME_EXPLICIT_SYNTAX, formatReactElementNode(toReactElementTreeNode(displayName, key, childrens), inline, lvl, options);
}), jsxStopChars = ["<", ">", "{", "}"], shouldBeEscaped = function(s) {
  return jsxStopChars.some(function(jsxStopChar) {
    return s.includes(jsxStopChar);
  });
}, escape2 = function(s) {
  return shouldBeEscaped(s) ? "{`".concat(s, "`}") : s;
}, preserveTrailingSpace = function(s) {
  var result = s;
  return result.endsWith(" ") && (result = result.replace(/^(.*?)(\s+)$/, "$1{'$2'}")), result.startsWith(" ") && (result = result.replace(/^(\s+)(.*)$/, "{'$1'}$2")), result;
}, formatTreeNode = (function(node, inline, lvl, options) {
  if (node.type === "number")
    return String(node.value);
  if (node.type === "string")
    return node.value ? "".concat(preserveTrailingSpace(escape2(String(node.value)))) : "";
  if (node.type === "ReactElement")
    return formatReactElementNode(node, inline, lvl, options);
  if (node.type === "ReactFragment")
    return formatReactFragmentNode(node, inline, lvl, options);
  throw new TypeError('Unknow format type "'.concat(node.type, '"'));
}), formatTree = (function(node, options) {
  return formatTreeNode(node, !1, 0, options);
}), reactElementToJsxString = function(element) {
  var _ref = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, _ref$filterProps = _ref.filterProps, filterProps3 = _ref$filterProps === void 0 ? [] : _ref$filterProps, _ref$showDefaultProps = _ref.showDefaultProps, showDefaultProps = _ref$showDefaultProps === void 0 ? !0 : _ref$showDefaultProps, _ref$showFunctions = _ref.showFunctions, showFunctions = _ref$showFunctions === void 0 ? !1 : _ref$showFunctions, functionValue = _ref.functionValue, _ref$tabStop = _ref.tabStop, tabStop = _ref$tabStop === void 0 ? 2 : _ref$tabStop, _ref$useBooleanShorth = _ref.useBooleanShorthandSyntax, useBooleanShorthandSyntax = _ref$useBooleanShorth === void 0 ? !0 : _ref$useBooleanShorth, _ref$useFragmentShort = _ref.useFragmentShortSyntax, useFragmentShortSyntax = _ref$useFragmentShort === void 0 ? !0 : _ref$useFragmentShort, _ref$sortProps = _ref.sortProps, sortProps = _ref$sortProps === void 0 ? !0 : _ref$sortProps, maxInlineAttributesLineLength = _ref.maxInlineAttributesLineLength, displayName = _ref.displayName;
  if (!element)
    throw new Error("react-element-to-jsx-string: Expected a ReactElement");
  var options = {
    filterProps: filterProps3,
    showDefaultProps,
    showFunctions,
    functionValue,
    tabStop,
    useBooleanShorthandSyntax,
    useFragmentShortSyntax,
    sortProps,
    maxInlineAttributesLineLength,
    displayName
  };
  return formatTree(_parseReactElement(element, options), options);
};

// src/docs/lib/defaultValues/createFromRawDefaultProp.ts
var reactElementToJSXString = reactElementToJsxString;
function isReactElement(element) {
  return element.$$typeof != null;
}
function extractFunctionName(func, propName) {
  let { name } = func;
  return name !== "" && name !== "anonymous" && name !== propName ? name : null;
}
var stringResolver = (rawDefaultProp) => createSummaryValue4(JSON.stringify(rawDefaultProp));
function generateReactObject(rawDefaultProp) {
  let { type } = rawDefaultProp, { displayName } = type, jsx2 = reactElementToJSXString(rawDefaultProp, {});
  if (displayName != null) {
    let prettyIdentifier = getPrettyElementIdentifier(displayName);
    return createSummaryValue4(prettyIdentifier, jsx2);
  }
  if (isString(type) && isHtmlTag(type)) {
    let jsxSummary = reactElementToJSXString(rawDefaultProp, { tabStop: 0 }).replace(/\r?\n|\r/g, "");
    if (!isTooLongForDefaultValueSummary4(jsxSummary))
      return createSummaryValue4(jsxSummary);
  }
  return createSummaryValue4(ELEMENT_CAPTION, jsx2);
}
var objectResolver = (rawDefaultProp) => {
  if (isReactElement(rawDefaultProp) && rawDefaultProp.type != null)
    return generateReactObject(rawDefaultProp);
  if (isPlainObject(rawDefaultProp)) {
    let inspectionResult = inspectValue(JSON.stringify(rawDefaultProp));
    return generateObject(inspectionResult);
  }
  if (Array.isArray(rawDefaultProp)) {
    let inspectionResult = inspectValue(JSON.stringify(rawDefaultProp));
    return generateArray(inspectionResult);
  }
  return createSummaryValue4(OBJECT_CAPTION);
}, functionResolver = (rawDefaultProp, propDef) => {
  let isElement = !1, inspectionResult;
  if (isFunction(rawDefaultProp.render))
    isElement = !0;
  else if (rawDefaultProp.prototype != null && isFunction(rawDefaultProp.prototype.render))
    isElement = !0;
  else {
    let innerElement;
    try {
      inspectionResult = inspectValue(rawDefaultProp.toString());
      let { hasParams, params } = inspectionResult.inferredType;
      hasParams ? params.length === 1 && params[0].type === "ObjectPattern" && (innerElement = rawDefaultProp({})) : innerElement = rawDefaultProp(), innerElement != null && isReactElement(innerElement) && (isElement = !0);
    } catch {
    }
  }
  let funcName = extractFunctionName(rawDefaultProp, propDef.name);
  if (funcName != null) {
    if (isElement)
      return createSummaryValue4(getPrettyElementIdentifier(funcName));
    inspectionResult != null && (inspectionResult = inspectValue(rawDefaultProp.toString()));
    let { hasParams } = inspectionResult.inferredType;
    return createSummaryValue4(getPrettyFuncIdentifier(funcName, hasParams));
  }
  return createSummaryValue4(isElement ? ELEMENT_CAPTION : FUNCTION_CAPTION);
}, defaultResolver = (rawDefaultProp) => createSummaryValue4(rawDefaultProp.toString()), DEFAULT_TYPE_RESOLVERS = {
  string: stringResolver,
  object: objectResolver,
  function: functionResolver,
  default: defaultResolver
};
function createTypeResolvers(customResolvers = {}) {
  return {
    ...DEFAULT_TYPE_RESOLVERS,
    ...customResolvers
  };
}
function createDefaultValueFromRawDefaultProp(rawDefaultProp, propDef, typeResolvers = DEFAULT_TYPE_RESOLVERS) {
  try {
    switch (typeof rawDefaultProp) {
      case "string":
        return typeResolvers.string(rawDefaultProp, propDef);
      case "object":
        return typeResolvers.object(rawDefaultProp, propDef);
      case "function":
        return typeResolvers.function(rawDefaultProp, propDef);
      default:
        return typeResolvers.default(rawDefaultProp, propDef);
    }
  } catch (e) {
    console.error(e);
  }
  return null;
}

// src/docs/propTypes/createType.ts
import { createSummaryValue as createSummaryValue5, isTooLongForTypeSummary } from "storybook/internal/docs-tools";

// src/docs/propTypes/generateFuncSignature.ts
function generateFuncSignature(params, returns) {
  let hasParams = params != null, hasReturns = returns != null;
  if (!hasParams && !hasReturns)
    return "";
  let funcParts = [];
  if (hasParams) {
    let funcParams = params.map((x) => {
      let prettyName = x.getPrettyName(), typeName = x.getTypeName();
      return typeName != null ? `${prettyName}: ${typeName}` : prettyName;
    });
    funcParts.push(`(${funcParams.join(", ")})`);
  } else
    funcParts.push("()");
  return hasReturns && funcParts.push(`=> ${returns.getTypeName()}`), funcParts.join(" ");
}
function generateShortFuncSignature(params, returns) {
  let hasParams = params != null, hasReturns = returns != null;
  if (!hasParams && !hasReturns)
    return "";
  let funcParts = [];
  return hasParams ? funcParts.push("( ... )") : funcParts.push("()"), hasReturns && funcParts.push(`=> ${returns.getTypeName()}`), funcParts.join(" ");
}
function toMultilineSignature(signature) {
  return signature.replace(/,/g, `,\r
`);
}

// src/docs/propTypes/createType.ts
var MAX_FUNC_LENGTH = 150;
function createTypeDef({
  name,
  short,
  compact,
  full,
  inferredType
}) {
  return {
    name,
    short,
    compact,
    full: full ?? short,
    inferredType
  };
}
function cleanPropTypes(value) {
  return value.replace(/PropTypes./g, "").replace(/.isRequired/g, "");
}
function splitIntoLines(value) {
  return value.split(/\r?\n/);
}
function prettyObject(ast, compact = !1) {
  return cleanPropTypes(generateObjectCode(ast, compact));
}
function prettyArray(ast, compact = !1) {
  return cleanPropTypes(generateCode(ast, compact));
}
function getCaptionForInspectionType(type) {
  switch (type) {
    case "Object" /* OBJECT */:
      return OBJECT_CAPTION;
    case "Array" /* ARRAY */:
      return ARRAY_CAPTION;
    case "Class" /* CLASS */:
      return CLASS_CAPTION;
    case "Function" /* FUNCTION */:
      return FUNCTION_CAPTION;
    case "Element" /* ELEMENT */:
      return ELEMENT_CAPTION;
    default:
      return CUSTOM_CAPTION;
  }
}
function generateTypeFromString(value, originalTypeName) {
  let { inferredType, ast } = inspectValue(value), { type } = inferredType, short, compact, full;
  switch (type) {
    case "Identifier" /* IDENTIFIER */:
    case "Literal" /* LITERAL */:
      short = value, compact = value;
      break;
    case "Object" /* OBJECT */: {
      let { depth } = inferredType;
      short = OBJECT_CAPTION, compact = depth === 1 ? prettyObject(ast, !0) : null, full = prettyObject(ast);
      break;
    }
    case "Element" /* ELEMENT */: {
      let { identifier } = inferredType;
      short = identifier != null && !isHtmlTag(identifier) ? identifier : ELEMENT_CAPTION, compact = splitIntoLines(value).length === 1 ? value : null, full = value;
      break;
    }
    case "Array" /* ARRAY */: {
      let { depth } = inferredType;
      short = ARRAY_CAPTION, compact = depth <= 2 ? prettyArray(ast, !0) : null, full = prettyArray(ast);
      break;
    }
    default:
      short = getCaptionForInspectionType(type), compact = splitIntoLines(value).length === 1 ? value : null, full = value;
      break;
  }
  return createTypeDef({
    name: originalTypeName,
    short,
    compact,
    full,
    inferredType: type
  });
}
function generateCustom({ raw }) {
  return raw != null ? generateTypeFromString(raw, "custom" /* CUSTOM */) : createTypeDef({
    name: "custom" /* CUSTOM */,
    short: CUSTOM_CAPTION,
    compact: CUSTOM_CAPTION
  });
}
function generateFunc2(extractedProp) {
  let { jsDocTags } = extractedProp;
  return jsDocTags != null && (jsDocTags.params != null || jsDocTags.returns != null) ? createTypeDef({
    name: "func" /* FUNC */,
    // @ts-expect-error (Converted from ts-ignore)
    short: generateShortFuncSignature(jsDocTags.params, jsDocTags.returns),
    compact: null,
    // @ts-expect-error (Converted from ts-ignore)
    full: generateFuncSignature(jsDocTags.params, jsDocTags.returns)
  }) : createTypeDef({
    name: "func" /* FUNC */,
    short: FUNCTION_CAPTION,
    compact: FUNCTION_CAPTION
  });
}
function generateShape(type, extractedProp) {
  let fields2 = Object.keys(type.value).map((key) => `${key}: ${generateType(type.value[key], extractedProp).full}`).join(", "), { inferredType, ast } = inspectValue(`{ ${fields2} }`), { depth } = inferredType;
  return createTypeDef({
    name: "shape" /* SHAPE */,
    short: OBJECT_CAPTION,
    compact: depth === 1 && ast ? prettyObject(ast, !0) : null,
    full: ast ? prettyObject(ast) : null
  });
}
function objectOf(of) {
  return `objectOf(${of})`;
}
function generateObjectOf(type, extractedProp) {
  let { short, compact, full } = generateType(type.value, extractedProp);
  return createTypeDef({
    name: "objectOf" /* OBJECTOF */,
    short: objectOf(short),
    compact: compact != null ? objectOf(compact) : null,
    full: full && objectOf(full)
  });
}
function generateUnion(type, extractedProp) {
  if (Array.isArray(type.value)) {
    let values = type.value.reduce(
      (acc, v) => {
        let { short, compact, full } = generateType(v, extractedProp);
        return acc.short.push(short), acc.compact.push(compact), acc.full.push(full), acc;
      },
      { short: [], compact: [], full: [] }
    );
    return createTypeDef({
      name: "union" /* UNION */,
      short: values.short.join(" | "),
      compact: values.compact.every((x) => x != null) ? values.compact.join(" | ") : null,
      full: values.full.join(" | ")
    });
  }
  return createTypeDef({ name: "union" /* UNION */, short: type.value, compact: null });
}
function generateEnumValue({ value, computed }) {
  return computed ? generateTypeFromString(value, "enumvalue") : createTypeDef({ name: "enumvalue", short: value, compact: value });
}
function generateEnum(type) {
  if (Array.isArray(type.value)) {
    let values = type.value.reduce(
      (acc, v) => {
        let { short, compact, full } = generateEnumValue(v);
        return acc.short.push(short), acc.compact.push(compact), acc.full.push(full), acc;
      },
      { short: [], compact: [], full: [] }
    );
    return createTypeDef({
      name: "enum" /* ENUM */,
      short: values.short.join(" | "),
      compact: values.compact.every((x) => x != null) ? values.compact.join(" | ") : null,
      full: values.full.join(" | ")
    });
  }
  return createTypeDef({ name: "enum" /* ENUM */, short: type.value, compact: type.value });
}
function braceAfter(of) {
  return `${of}[]`;
}
function braceAround(of) {
  return `[${of}]`;
}
function createArrayOfObjectTypeDef(short, compact, full) {
  return createTypeDef({
    name: "arrayOf" /* ARRAYOF */,
    short: braceAfter(short),
    compact: compact != null ? braceAround(compact) : null,
    full: full && braceAround(full)
  });
}
function generateArray2(type, extractedProp) {
  let { name, short, compact, full, inferredType } = generateType(type.value, extractedProp);
  if (name === "custom" /* CUSTOM */) {
    if (inferredType === "Object" /* OBJECT */)
      return createArrayOfObjectTypeDef(short, compact, full);
  } else if (name === "shape" /* SHAPE */)
    return createArrayOfObjectTypeDef(short, compact, full);
  return createTypeDef({
    name: "arrayOf" /* ARRAYOF */,
    short: braceAfter(short),
    compact: braceAfter(short)
  });
}
function generateType(type, extractedProp) {
  try {
    switch (type.name) {
      case "custom" /* CUSTOM */:
        return generateCustom(type);
      case "func" /* FUNC */:
        return generateFunc2(extractedProp);
      case "shape" /* SHAPE */:
        return generateShape(type, extractedProp);
      case "instanceOf" /* INSTANCEOF */:
        return createTypeDef({
          name: "instanceOf" /* INSTANCEOF */,
          short: type.value,
          compact: type.value
        });
      case "objectOf" /* OBJECTOF */:
        return generateObjectOf(type, extractedProp);
      case "union" /* UNION */:
        return generateUnion(type, extractedProp);
      case "enum" /* ENUM */:
        return generateEnum(type);
      case "arrayOf" /* ARRAYOF */:
        return generateArray2(type, extractedProp);
      default:
        return createTypeDef({ name: type.name, short: type.name, compact: type.name });
    }
  } catch (e) {
    console.error(e);
  }
  return createTypeDef({ name: "unknown", short: "unknown", compact: "unknown" });
}
function createType(extractedProp) {
  let { type } = extractedProp.docgenInfo;
  if (type == null)
    return null;
  try {
    switch (type.name) {
      case "custom" /* CUSTOM */:
      case "shape" /* SHAPE */:
      case "instanceOf" /* INSTANCEOF */:
      case "objectOf" /* OBJECTOF */:
      case "union" /* UNION */:
      case "enum" /* ENUM */:
      case "arrayOf" /* ARRAYOF */: {
        let { short, compact, full } = generateType(type, extractedProp);
        return compact != null && !isTooLongForTypeSummary(compact) ? createSummaryValue5(compact) : full ? createSummaryValue5(short, full) : createSummaryValue5(short);
      }
      case "func" /* FUNC */: {
        let { short, full } = generateType(type, extractedProp), summary = short, detail;
        return full && full.length < MAX_FUNC_LENGTH ? summary = full : full && (detail = toMultilineSignature(full)), createSummaryValue5(summary, detail);
      }
      default:
        return null;
    }
  } catch (e) {
    console.error(e);
  }
  return null;
}

// src/docs/propTypes/rawDefaultPropResolvers.ts
import { createSummaryValue as createSummaryValue6 } from "storybook/internal/docs-tools";
var funcResolver = (rawDefaultProp, { name, type }) => {
  let isElement = type?.summary === "element" || type?.summary === "elementType", funcName = extractFunctionName(rawDefaultProp, name);
  if (funcName != null) {
    if (isElement)
      return createSummaryValue6(getPrettyElementIdentifier(funcName));
    let { hasParams } = inspectValue(rawDefaultProp.toString()).inferredType;
    return createSummaryValue6(getPrettyFuncIdentifier(funcName, hasParams));
  }
  return createSummaryValue6(isElement ? ELEMENT_CAPTION : FUNCTION_CAPTION);
}, rawDefaultPropTypeResolvers = createTypeResolvers({
  function: funcResolver
});

// src/docs/propTypes/sortProps.ts
function keepOriginalDefinitionOrder(extractedProps, component) {
  let { propTypes } = component;
  return propTypes != null ? Object.keys(propTypes).map((x) => extractedProps.find((y) => y.name === x)).filter(Boolean) : extractedProps;
}

// src/docs/propTypes/handleProp.ts
function enhancePropTypesProp(extractedProp, rawDefaultProp) {
  let { propDef } = extractedProp, newtype = createType(extractedProp);
  newtype != null && (propDef.type = newtype);
  let { defaultValue } = extractedProp.docgenInfo;
  if (defaultValue != null && defaultValue.value != null) {
    let newDefaultValue = createDefaultValue(defaultValue.value);
    newDefaultValue != null && (propDef.defaultValue = newDefaultValue);
  } else if (rawDefaultProp != null) {
    let newDefaultValue = createDefaultValueFromRawDefaultProp(
      rawDefaultProp,
      propDef,
      rawDefaultPropTypeResolvers
    );
    newDefaultValue != null && (propDef.defaultValue = newDefaultValue);
  }
  return propDef;
}
function enhancePropTypesProps(extractedProps, component) {
  let rawDefaultProps = component.defaultProps != null ? component.defaultProps : {}, enhancedProps = extractedProps.map(
    (x) => enhancePropTypesProp(x, rawDefaultProps[x.propDef.name])
  );
  return keepOriginalDefinitionOrder(enhancedProps, component);
}

// src/docs/typeScript/handleProp.ts
function enhanceTypeScriptProp(extractedProp, rawDefaultProp) {
  let { propDef } = extractedProp, { defaultValue } = extractedProp.docgenInfo;
  if (defaultValue != null && defaultValue.value != null) {
    let newDefaultValue = createDefaultValue(defaultValue.value);
    newDefaultValue != null && (propDef.defaultValue = newDefaultValue);
  } else if (rawDefaultProp != null) {
    let newDefaultValue = createDefaultValueFromRawDefaultProp(rawDefaultProp, propDef);
    newDefaultValue != null && (propDef.defaultValue = newDefaultValue);
  }
  return propDef;
}
function enhanceTypeScriptProps(extractedProps) {
  return extractedProps.map((prop) => enhanceTypeScriptProp(prop));
}

// src/extractProps.ts
function getPropDefs(component, section) {
  let processedComponent = component;
  !hasDocgen(component) && !component.propTypes && isMemo(component) && (processedComponent = component.type);
  let extractedProps = extractComponentProps(processedComponent, section);
  if (extractedProps.length === 0)
    return [];
  switch (extractedProps[0].typeSystem) {
    case TypeSystem.JAVASCRIPT:
      return enhancePropTypesProps(extractedProps, component);
    case TypeSystem.TYPESCRIPT:
      return enhanceTypeScriptProps(extractedProps);
    default:
      return extractedProps.map((x) => x.propDef);
  }
}
var extractProps = (component) => ({
  rows: getPropDefs(component, "props")
});

// src/extractArgTypes.ts
var extractArgTypes = (component) => {
  if (component) {
    let { rows } = extractProps(component);
    if (rows)
      return rows.reduce((acc, row) => {
        let {
          name,
          description,
          type,
          sbType,
          defaultValue: defaultSummary,
          jsDocTags,
          required
        } = row;
        return acc[name] = {
          name,
          description,
          type: { required, ...sbType },
          table: {
            type: type ?? void 0,
            jsDocTags,
            defaultValue: defaultSummary ?? void 0
          }
        }, acc;
      }, {});
  }
  return null;
};

// src/componentManifest/reactDocgen.ts
var import_ts_dedent2 = __toESM(require_dist(), 1), TsconfigPaths = __toESM(require_lib2(), 1);
import { existsSync as existsSync2 } from "node:fs";
import { dirname as dirname3, sep as sep2 } from "node:path";
import { babelParse, types as t } from "storybook/internal/babel";
import { supportedExtensions as supportedExtensions2 } from "storybook/internal/common";
import { logger as logger2 } from "storybook/internal/node-logger";
import {
  builtinHandlers as docgenHandlers,
  builtinResolvers as docgenResolver,
  makeFsImporter,
  parse as parse7
} from "react-docgen";

// ../../../node_modules/comment-parser/es6/primitives.js
var Markers;
(function(Markers2) {
  Markers2.start = "/**", Markers2.nostart = "/***", Markers2.delim = "*", Markers2.end = "*/";
})(Markers = Markers || (Markers = {}));

// ../../../node_modules/comment-parser/es6/util.js
function isSpace(source) {
  return /^\s+$/.test(source);
}
function splitCR(source) {
  let matches = source.match(/\r+$/);
  return matches == null ? ["", source] : [source.slice(-matches[0].length), source.slice(0, -matches[0].length)];
}
function splitSpace(source) {
  let matches = source.match(/^\s+/);
  return matches == null ? ["", source] : [source.slice(0, matches[0].length), source.slice(matches[0].length)];
}
function splitLines(source) {
  return source.split(/\n/);
}
function seedSpec(spec = {}) {
  return Object.assign({ tag: "", name: "", type: "", optional: !1, description: "", problems: [], source: [] }, spec);
}
function seedTokens(tokens = {}) {
  return Object.assign({ start: "", delimiter: "", postDelimiter: "", tag: "", postTag: "", name: "", postName: "", type: "", postType: "", description: "", end: "", lineEnd: "" }, tokens);
}

// ../../../node_modules/comment-parser/es6/parser/block-parser.js
var reTag = /^@\S+/;
function getParser({ fence = "```" } = {}) {
  let fencer = getFencer(fence), toggleFence = (source, isFenced) => fencer(source) ? !isFenced : isFenced;
  return function(source) {
    let sections = [[]], isFenced = !1;
    for (let line of source)
      reTag.test(line.tokens.description) && !isFenced ? sections.push([line]) : sections[sections.length - 1].push(line), isFenced = toggleFence(line.tokens.description, isFenced);
    return sections;
  };
}
function getFencer(fence) {
  return typeof fence == "string" ? (source) => source.split(fence).length % 2 === 0 : fence;
}

// ../../../node_modules/comment-parser/es6/parser/source-parser.js
function getParser2({ startLine = 0, markers = Markers } = {}) {
  let block = null, num = startLine;
  return function(source) {
    let rest = source, tokens = seedTokens();
    if ([tokens.lineEnd, rest] = splitCR(rest), [tokens.start, rest] = splitSpace(rest), block === null && rest.startsWith(markers.start) && !rest.startsWith(markers.nostart) && (block = [], tokens.delimiter = rest.slice(0, markers.start.length), rest = rest.slice(markers.start.length), [tokens.postDelimiter, rest] = splitSpace(rest)), block === null)
      return num++, null;
    let isClosed = rest.trimRight().endsWith(markers.end);
    if (tokens.delimiter === "" && rest.startsWith(markers.delim) && !rest.startsWith(markers.end) && (tokens.delimiter = markers.delim, rest = rest.slice(markers.delim.length), [tokens.postDelimiter, rest] = splitSpace(rest)), isClosed) {
      let trimmed = rest.trimRight();
      tokens.end = rest.slice(trimmed.length - markers.end.length), rest = trimmed.slice(0, -markers.end.length);
    }
    if (tokens.description = rest, block.push({ number: num, source, tokens }), num++, isClosed) {
      let result = block.slice();
      return block = null, result;
    }
    return null;
  };
}

// ../../../node_modules/comment-parser/es6/parser/spec-parser.js
function getParser3({ tokenizers }) {
  return function(source) {
    var _a;
    let spec = seedSpec({ source });
    for (let tokenize of tokenizers)
      if (spec = tokenize(spec), !((_a = spec.problems[spec.problems.length - 1]) === null || _a === void 0) && _a.critical)
        break;
    return spec;
  };
}

// ../../../node_modules/comment-parser/es6/parser/tokenizers/tag.js
function tagTokenizer() {
  return (spec) => {
    let { tokens } = spec.source[0], match = tokens.description.match(/\s*(@(\S+))(\s*)/);
    return match === null ? (spec.problems.push({
      code: "spec:tag:prefix",
      message: 'tag should start with "@" symbol',
      line: spec.source[0].number,
      critical: !0
    }), spec) : (tokens.tag = match[1], tokens.postTag = match[3], tokens.description = tokens.description.slice(match[0].length), spec.tag = match[2], spec);
  };
}

// ../../../node_modules/comment-parser/es6/parser/tokenizers/type.js
function typeTokenizer(spacing = "compact") {
  let join7 = getJoiner(spacing);
  return (spec) => {
    let curlies = 0, lines = [];
    for (let [i2, { tokens }] of spec.source.entries()) {
      let type = "";
      if (i2 === 0 && tokens.description[0] !== "{")
        return spec;
      for (let ch of tokens.description)
        if (ch === "{" && curlies++, ch === "}" && curlies--, type += ch, curlies === 0)
          break;
      if (lines.push([tokens, type]), curlies === 0)
        break;
    }
    if (curlies !== 0)
      return spec.problems.push({
        code: "spec:type:unpaired-curlies",
        message: "unpaired curlies",
        line: spec.source[0].number,
        critical: !0
      }), spec;
    let parts = [], offset2 = lines[0][0].postDelimiter.length;
    for (let [i2, [tokens, type]] of lines.entries())
      tokens.type = type, i2 > 0 && (tokens.type = tokens.postDelimiter.slice(offset2) + type, tokens.postDelimiter = tokens.postDelimiter.slice(0, offset2)), [tokens.postType, tokens.description] = splitSpace(tokens.description.slice(type.length)), parts.push(tokens.type);
    return parts[0] = parts[0].slice(1), parts[parts.length - 1] = parts[parts.length - 1].slice(0, -1), spec.type = join7(parts), spec;
  };
}
var trim = (x) => x.trim();
function getJoiner(spacing) {
  return spacing === "compact" ? (t6) => t6.map(trim).join("") : spacing === "preserve" ? (t6) => t6.join(`
`) : spacing;
}

// ../../../node_modules/comment-parser/es6/parser/tokenizers/name.js
var isQuoted = (s) => s && s.startsWith('"') && s.endsWith('"');
function nameTokenizer() {
  let typeEnd = (num, { tokens }, i2) => tokens.type === "" ? num : i2;
  return (spec) => {
    let { tokens } = spec.source[spec.source.reduce(typeEnd, 0)], source = tokens.description.trimLeft(), quotedGroups = source.split('"');
    if (quotedGroups.length > 1 && quotedGroups[0] === "" && quotedGroups.length % 2 === 1)
      return spec.name = quotedGroups[1], tokens.name = `"${quotedGroups[1]}"`, [tokens.postName, tokens.description] = splitSpace(source.slice(tokens.name.length)), spec;
    let brackets = 0, name = "", optional = !1, defaultValue;
    for (let ch of source) {
      if (brackets === 0 && isSpace(ch))
        break;
      ch === "[" && brackets++, ch === "]" && brackets--, name += ch;
    }
    if (brackets !== 0)
      return spec.problems.push({
        code: "spec:name:unpaired-brackets",
        message: "unpaired brackets",
        line: spec.source[0].number,
        critical: !0
      }), spec;
    let nameToken = name;
    if (name[0] === "[" && name[name.length - 1] === "]") {
      optional = !0, name = name.slice(1, -1);
      let parts = name.split("=");
      if (name = parts[0].trim(), parts[1] !== void 0 && (defaultValue = parts.slice(1).join("=").trim()), name === "")
        return spec.problems.push({
          code: "spec:name:empty-name",
          message: "empty name",
          line: spec.source[0].number,
          critical: !0
        }), spec;
      if (defaultValue === "")
        return spec.problems.push({
          code: "spec:name:empty-default",
          message: "empty default value",
          line: spec.source[0].number,
          critical: !0
        }), spec;
      if (!isQuoted(defaultValue) && /=(?!>)/.test(defaultValue))
        return spec.problems.push({
          code: "spec:name:invalid-default",
          message: "invalid default value syntax",
          line: spec.source[0].number,
          critical: !0
        }), spec;
    }
    return spec.optional = optional, spec.name = name, tokens.name = nameToken, defaultValue !== void 0 && (spec.default = defaultValue), [tokens.postName, tokens.description] = splitSpace(source.slice(tokens.name.length)), spec;
  };
}

// ../../../node_modules/comment-parser/es6/parser/tokenizers/description.js
function descriptionTokenizer(spacing = "compact", markers = Markers) {
  let join7 = getJoiner2(spacing);
  return (spec) => (spec.description = join7(spec.source, markers), spec);
}
function getJoiner2(spacing) {
  return spacing === "compact" ? compactJoiner : spacing === "preserve" ? preserveJoiner : spacing;
}
function compactJoiner(lines, markers = Markers) {
  return lines.map(({ tokens: { description } }) => description.trim()).filter((description) => description !== "").join(" ");
}
var lineNo = (num, { tokens }, i2) => tokens.type === "" ? num : i2, getDescription = ({ tokens }) => (tokens.delimiter === "" ? tokens.start : tokens.postDelimiter.slice(1)) + tokens.description;
function preserveJoiner(lines, markers = Markers) {
  if (lines.length === 0)
    return "";
  lines[0].tokens.description === "" && lines[0].tokens.delimiter === markers.start && (lines = lines.slice(1));
  let lastLine = lines[lines.length - 1];
  return lastLine !== void 0 && lastLine.tokens.description === "" && lastLine.tokens.end.endsWith(markers.end) && (lines = lines.slice(0, -1)), lines = lines.slice(lines.reduce(lineNo, 0)), lines.map(getDescription).join(`
`);
}

// ../../../node_modules/comment-parser/es6/parser/index.js
function getParser4({ startLine = 0, fence = "```", spacing = "compact", markers = Markers, tokenizers = [
  tagTokenizer(),
  typeTokenizer(spacing),
  nameTokenizer(),
  descriptionTokenizer(spacing)
] } = {}) {
  if (startLine < 0 || startLine % 1 > 0)
    throw new Error("Invalid startLine");
  let parseSource = getParser2({ startLine, markers }), parseBlock = getParser({ fence }), parseSpec = getParser3({ tokenizers }), joinDescription = getJoiner2(spacing);
  return function(source) {
    let blocks = [];
    for (let line of splitLines(source)) {
      let lines = parseSource(line);
      if (lines === null)
        continue;
      let sections = parseBlock(lines), specs = sections.slice(1).map(parseSpec);
      blocks.push({
        description: joinDescription(sections[0], markers),
        tags: specs,
        source: lines,
        problems: specs.reduce((acc, spec) => acc.concat(spec.problems), [])
      });
    }
    return blocks;
  };
}

// ../../../node_modules/comment-parser/es6/stringifier/index.js
function join2(tokens) {
  return tokens.start + tokens.delimiter + tokens.postDelimiter + tokens.tag + tokens.postTag + tokens.type + tokens.postType + tokens.name + tokens.postName + tokens.description + tokens.end + tokens.lineEnd;
}
function getStringifier() {
  return (block) => block.source.map(({ tokens }) => join2(tokens)).join(`
`);
}

// ../../../node_modules/comment-parser/es6/stringifier/inspect.js
var zeroWidth = {
  line: 0,
  start: 0,
  delimiter: 0,
  postDelimiter: 0,
  tag: 0,
  postTag: 0,
  name: 0,
  postName: 0,
  type: 0,
  postType: 0,
  description: 0,
  end: 0,
  lineEnd: 0
};
var fields = Object.keys(zeroWidth);

// ../../../node_modules/comment-parser/es6/index.js
function parse6(source, options = {}) {
  return getParser4(options)(source);
}
var stringify = getStringifier();

// src/componentManifest/utils.ts
import { readFileSync } from "node:fs";
import { getProjectRoot, resolveImport } from "storybook/internal/common";
import { logger } from "storybook/internal/node-logger";

// ../../../node_modules/empathic/find.mjs
import { join as join4 } from "node:path";
import { existsSync, statSync } from "node:fs";

// ../../../node_modules/empathic/walk.mjs
import { dirname as dirname2 } from "node:path";

// ../../../node_modules/empathic/resolve.mjs
import { isAbsolute as isAbsolute2, join as join3, resolve as resolve2 } from "node:path";
function absolute(input, root) {
  return isAbsolute2(input) ? input : resolve2(root || ".", input);
}

// ../../../node_modules/empathic/walk.mjs
function up(base2, options) {
  let { last, cwd: cwd2 } = options || {}, tmp = absolute(base2, cwd2), root = absolute(last || "/", cwd2), prev, arr = [];
  for (; prev !== root && (arr.push(tmp), tmp = dirname2(prev = tmp), tmp !== prev); )
    ;
  return arr;
}

// ../../../node_modules/empathic/find.mjs
function up2(name, options) {
  let dir, tmp, start = options && options.cwd || "";
  for (dir of up(start, options))
    if (tmp = join4(dir, name), existsSync(tmp)) return tmp;
}

// src/componentManifest/utils.ts
var groupBy = (items, keySelector) => items.reduce((acc = {}, item, index) => {
  let key = keySelector(item, index);
  return Array.isArray(acc[key]) || (acc[key] = []), acc[key].push(item), acc;
}, {});
function groupByToMap(items, getKey) {
  let result = /* @__PURE__ */ new Map();
  for (let item of items) {
    let key = getKey(item), group = result.get(key);
    group ? group.push(item) : result.set(key, [item]);
  }
  return result;
}
function invariant(condition, message) {
  if (!condition)
    throw new Error((typeof message == "function" ? message() : message) ?? "Invariant failed");
}
var memoStore = /* @__PURE__ */ new WeakMap(), asyncMemoStore = /* @__PURE__ */ new WeakMap(), cached = (fn, opts = {}) => {
  let keyOf2 = opts.key ?? ((...args) => {
    try {
      return JSON.stringify(args);
    } catch {
      return String(args[0]);
    }
  });
  return (...args) => {
    let k = keyOf2(...args), name = fn.name || opts.name || "anonymous", store = memoStore.get(fn);
    if (store || (store = /* @__PURE__ */ new Map(), memoStore.set(fn, store)), store.has(k))
      return logger.verbose(`[cache] hit ${name} key=${k}`), store.get(k);
    let start = Date.now(), result = fn(...args), duration = Date.now() - start;
    return store.set(k, result), logger.verbose(`[cache] miss ${name} took ${duration}ms key=${k}`), result;
  };
}, asyncCache = (fn, opts = {}) => {
  let keyOf2 = opts.key ?? ((...args) => {
    try {
      return JSON.stringify(args);
    } catch {
      return String(args[0]);
    }
  });
  return (...args) => {
    let k = keyOf2(...args), name = fn.name || opts.name || "anonymous", store = asyncMemoStore.get(fn);
    store || (store = /* @__PURE__ */ new Map(), asyncMemoStore.set(fn, store));
    let existing = store.get(k);
    if (existing)
      return logger.verbose(`[cache] hit ${name} key=${k}`), existing;
    let start = Date.now(), pending = fn(...args).then((result) => (logger.verbose(`[cache] miss ${name} took ${Date.now() - start}ms key=${k}`), result)).catch((error) => {
      throw store.get(k) === pending && store.delete(k), logger.verbose(`[cache] miss ${name} failed after ${Date.now() - start}ms key=${k}`), error;
    });
    return store.set(k, pending), pending;
  };
}, invalidateCache = () => {
  memoStore = /* @__PURE__ */ new WeakMap(), asyncMemoStore = /* @__PURE__ */ new WeakMap();
}, cachedReadFileSync = cached(readFileSync, { name: "cachedReadFile" }), cachedReadTextFileSync = cached(
  (filePath) => readFileSync(filePath, "utf-8"),
  { name: "cachedReadTextFile" }
), cachedFindUp = cached(up2, { name: "findUp" }), cachedResolveImport = cached(resolveImport, {
  name: "resolveImport"
}), TSCONFIG_CANDIDATES = ["tsconfig.json", "tsconfig.base.json", "tsconfig.app.json"], findTsconfigPath = cached(
  (cwd2) => {
    let projectRoot = getProjectRoot();
    for (let candidate of TSCONFIG_CANDIDATES) {
      let found = up2(candidate, { cwd: cwd2, last: projectRoot });
      if (found)
        return found;
    }
  },
  { name: "findTsconfigPath" }
);

// src/componentManifest/jsdocTags.ts
function extractJSDocInfo(jsdocComment) {
  let jsDoc = ["/**", ...jsdocComment.split(`
`).map((line) => ` * ${line}`), " */"].join(`
`), parsed = parse6(jsDoc);
  return {
    description: parsed[0].description,
    tags: Object.fromEntries(
      Object.entries(groupBy(parsed[0].tags, (it) => it.tag)).map(([key, tags]) => [
        key,
        tags?.map((tag) => (tag.type ? `{${tag.type}} ` : "") + `${tag.name} ${tag.description}`) ?? []
      ])
    )
  };
}

// src/componentManifest/reactDocgen/actualNameHandler.ts
import { utils } from "react-docgen";
var { getNameOrValue, isReactForwardRefCall } = utils, actualNameHandler = function(documentation, componentDefinition) {
  if (documentation.set("definedInFile", componentDefinition.hub.file.opts.filename), (componentDefinition.isClassDeclaration() || componentDefinition.isFunctionDeclaration()) && componentDefinition.has("id"))
    documentation.set(
      "actualName",
      getNameOrValue(componentDefinition.get("id"))
    );
  else if (componentDefinition.isArrowFunctionExpression() || componentDefinition.isFunctionExpression() || isReactForwardRefCall(componentDefinition)) {
    let currentPath = componentDefinition;
    for (; currentPath.parentPath; ) {
      if (currentPath.parentPath.isVariableDeclarator()) {
        documentation.set("actualName", getNameOrValue(currentPath.parentPath.get("id")));
        return;
      }
      if (currentPath.parentPath.isAssignmentExpression()) {
        let leftPath = currentPath.parentPath.get("left");
        if (leftPath.isIdentifier() || leftPath.isLiteral()) {
          documentation.set("actualName", getNameOrValue(leftPath));
          return;
        }
      }
      currentPath = currentPath.parentPath;
    }
    documentation.set("actualName", "");
  }
}, actualNameHandler_default = actualNameHandler;

// src/componentManifest/reactDocgen/docgenResolver.ts
var import_resolve2 = __toESM(require_resolve(), 1);
import { supportedExtensions } from "storybook/internal/common";
var ReactDocgenResolveError = class extends Error {
  constructor(filename) {
    super(`'${filename}' was ignored by react-docgen.`);
    // the magic string that react-docgen uses to check if a module is ignored
    this.code = "MODULE_NOT_FOUND";
  }
};

// src/componentManifest/reactDocgen/exportNameHandler.ts
import { utils as utils2 } from "react-docgen";
var { isReactForwardRefCall: isReactForwardRefCall2 } = utils2;
function nameFromId(path5) {
  if (path5) {
    if (path5.isIdentifier())
      return path5.node.name;
    if (path5.isStringLiteral())
      return path5.node.value;
  }
}
function isInlineDefaultExport(path5) {
  let p = path5;
  for (; p && p.parentPath; ) {
    if (p.parentPath.isExportDefaultDeclaration())
      return !0;
    p = p.parentPath;
  }
  return !1;
}
function findProgram(path5) {
  let found = path5.findParent((p) => p.isProgram());
  return found && found.isProgram() ? found : void 0;
}
function getLocalName(componentDefinition, fallback) {
  if (fallback)
    return fallback;
  if ((componentDefinition.isClassDeclaration() || componentDefinition.isFunctionDeclaration()) && componentDefinition.has("id")) {
    let idPath = componentDefinition.get("id");
    return nameFromId(idPath);
  }
  if (componentDefinition.isArrowFunctionExpression() || componentDefinition.isFunctionExpression() || isReactForwardRefCall2(componentDefinition)) {
    let p = componentDefinition;
    for (; p && p.parentPath; ) {
      if (p.parentPath.isVariableDeclarator()) {
        let id = p.parentPath.get("id");
        return nameFromId(id);
      }
      if (p.parentPath.isAssignmentExpression()) {
        let left = p.parentPath.get("left"), lhs = nameFromId(left);
        if (lhs)
          return lhs;
      }
      p = p.parentPath;
    }
  }
}
var exportNameHandler = (documentation, componentDefinition) => {
  if (isInlineDefaultExport(componentDefinition)) {
    documentation.set("exportName", "default");
    return;
  }
  let actual = documentation.get("actualName"), localName = getLocalName(componentDefinition, typeof actual == "string" ? actual : void 0), programPath = findProgram(componentDefinition);
  if (!programPath) {
    documentation.set("exportName", void 0);
    return;
  }
  let body = programPath.get("body");
  for (let stmt of body) {
    if (stmt.isExportNamedDeclaration() && stmt.has("declaration")) {
      let decl = stmt.get("declaration");
      if (decl.isFunctionDeclaration() || decl.isClassDeclaration()) {
        let name = nameFromId(decl.get("id"));
        if (name && name === localName) {
          documentation.set("exportName", name);
          return;
        }
      }
      if (decl.isVariableDeclaration()) {
        let decls = decl.get("declarations");
        for (let d of decls)
          if (d.isVariableDeclarator()) {
            let id = d.get("id");
            if (id.isIdentifier() && id.node.name === localName) {
              documentation.set("exportName", localName);
              return;
            }
          }
      }
    }
    if (stmt.isExportNamedDeclaration() && stmt.has("specifiers")) {
      let specs = stmt.get("specifiers");
      for (let s of specs)
        if (s.isExportSpecifier()) {
          let local = nameFromId(s.get("local")), exported = nameFromId(s.get("exported"));
          if (local && local === localName) {
            documentation.set(
              "exportName",
              exported === "default" ? "default" : exported ?? local
            );
            return;
          }
        }
    }
    if (stmt.isExportDefaultDeclaration()) {
      let decl = stmt.get("declaration");
      if (decl.isIdentifier() && decl.node.name === localName) {
        documentation.set("exportName", "default");
        return;
      }
    }
  }
  documentation.set("exportName", void 0);
}, exportNameHandler_default = exportNameHandler;

// src/componentManifest/reactDocgen.ts
var defaultHandlers = Object.values(docgenHandlers).map((handler) => handler), defaultResolver2 = new docgenResolver.FindExportedDefinitionsResolver(), handlers = [...defaultHandlers, actualNameHandler_default, exportNameHandler_default];
function getMatchingDocgen(docgens, component) {
  return docgens.length === 0 ? void 0 : docgens.length === 1 ? docgens[0] : docgens.find(
    (docgen) => [component.importName, component.localImportName].includes(docgen.exportName)
  ) ?? docgens.find(
    (docgen) => [component.importName, component.localImportName, component.componentName].includes(
      docgen.displayName
    ) || [component.importName, component.localImportName, component.componentName].includes(
      docgen.actualName
    )
  ) ?? docgens[0];
}
function matchPath(id, basedir) {
  basedir ??= process.cwd();
  let tsconfig = getTsConfig(basedir);
  return tsconfig.resultType === "success" ? TsconfigPaths.createMatchPath(tsconfig.absoluteBaseUrl, tsconfig.paths, [
    "browser",
    "module",
    "main"
  ])(id, void 0, void 0, supportedExtensions2) ?? id : id;
}
var getTsConfig = cached(
  (cwd2) => {
    let tsconfigPath = findTsconfigPath(cwd2);
    return TsconfigPaths.loadConfig(tsconfigPath);
  },
  { name: "getTsConfig" }
), parseWithReactDocgen = cached(
  (code, path5) => parse7(code, {
    resolver: defaultResolver2,
    handlers,
    importer: getReactDocgenImporter(),
    filename: path5
  }),
  { key: (code, path5) => path5, name: "parseWithReactDocgen" }
), getExportPaths = cached(
  (code, filePath) => {
    let ast;
    try {
      ast = babelParse(code);
    } catch {
      return [];
    }
    let basedir = dirname3(filePath);
    return ast.program.body.flatMap(
      (statement) => t.isExportAllDeclaration(statement) ? [statement.source.value] : t.isExportNamedDeclaration(statement) && statement.source && !statement.declaration ? [statement.source.value] : []
    ).map((id) => matchPath(id, basedir)).flatMap((id) => {
      try {
        return [cachedResolveImport(id, { basedir })];
      } catch (e) {
        return logger2.debug(e), [];
      }
    });
  },
  { name: "getExportPaths" }
), gatherDocgensForPath = cached(
  (path5, depth) => {
    if (path5.includes("node_modules"))
      return {
        docgens: [],
        errors: [
          {
            path: path5,
            code: "/* File in node_modules */",
            name: "Component file in node_modules",
            message: import_ts_dedent2.dedent`
              Component files in node_modules are not supported.
              The distributed files in node_modules usually don't contain the necessary comments or types needed to analyze component information.
              Configure TypeScript path aliases to map your package name to the source file instead.

              Example (tsconfig.json):
              {
                "compilerOptions": {
                  "baseUrl": ".",
                  "paths": {
                    "@design-system/button": ["src/components/Button.tsx"],
                    "@design-system/*": ["src/components/*"]
                  }
                }
              }

              Then import using:
              import { Button } from '@design-system/button'

              Storybook resolves tsconfig paths automatically.
            `
          }
        ]
      };
    let code;
    try {
      code = cachedReadFileSync(path5, "utf-8");
    } catch {
      return {
        docgens: [],
        errors: [
          {
            path: path5,
            code: "/* File not found or unreadable */",
            name: "Component file could not be read",
            message: `Could not read the component file located at "${path5}".
Prefer relative imports if possible.`
          }
        ]
      };
    }
    if (depth > 5)
      return {
        docgens: [],
        errors: [
          {
            path: path5,
            code,
            name: "Max re-export depth exceeded",
            message: import_ts_dedent2.dedent`
              Traversal stopped after 5 steps while following re-exports starting from this file.
              This usually indicates a deep or circular re-export chain. Try one of the following:
              - Import the component file directly (e.g., src/components/Button.tsx),
              - Reduce the number of re-export hops.
            `
          }
        ]
      };
    let exportPaths = getExportPaths(code, path5).map((p) => gatherDocgensForPath(p, depth + 1)), docgens = exportPaths.flatMap((r) => r.docgens), errors = exportPaths.flatMap((r) => r.errors);
    try {
      return {
        docgens: [...parseWithReactDocgen(code, path5), ...docgens],
        errors
      };
    } catch (e) {
      let message = e instanceof Error ? e.message : String(e);
      return {
        docgens,
        errors: [
          {
            path: path5,
            code,
            name: "No component definition found",
            message: import_ts_dedent2.dedent`
              ${message}
              You can debug your component file in this playground: https://react-docgen.dev/playground
            `
          },
          ...errors
        ]
      };
    }
  },
  { name: "gatherDocgensWithTrace", key: (filePath) => filePath }
), getReactDocgen = cached(
  (path5, component) => {
    let { docgens, errors } = gatherDocgensForPath(path5, 0), docgen = getMatchingDocgen(docgens, component);
    return docgen ? { type: "success", data: docgen } : { type: "error", error: {
      name: errors.at(-1)?.name ?? "No component definition found",
      message: errors.map(
        (e) => import_ts_dedent2.dedent`
            File: ${e.path}
            Error:
            ${e.message}
            Code:
            ${e.code}`
      ).join(`

`)
    } };
  },
  { name: "getReactDocgen", key: (path5, component) => path5 + JSON.stringify(component) }
);
function getReactDocgenImporter() {
  return makeFsImporter((filename, basedir) => {
    let mappedFilenameByPaths = matchPath(filename, basedir), result = cachedResolveImport(mappedFilenameByPaths, { basedir });
    if (result.includes(`${sep2}react-native${sep2}index.js`)) {
      let replaced = result.replace(
        `${sep2}react-native${sep2}index.js`,
        `${sep2}react-native-web${sep2}dist${sep2}index.js`
      );
      if (existsSync2(replaced) && supportedExtensions2.find((ext) => result.endsWith(ext)))
        return replaced;
    }
    if (supportedExtensions2.find((ext) => result.endsWith(ext)))
      return result;
    throw new ReactDocgenResolveError(filename);
  });
}
function getImportTag(docgen) {
  let jsdocComment = docgen?.description;
  return (jsdocComment ? extractJSDocInfo(jsdocComment).tags : void 0)?.import?.[0];
}

// src/componentManifest/reactDocgen/extractReactDocgenInfo.ts
function getComponentDocgen(filePath, componentName) {
  try {
    let code = cachedReadFileSync(filePath, "utf-8"), docgens = parseWithReactDocgen(code, filePath);
    if (docgens.length === 0)
      return null;
    if (componentName) {
      let matchingDocgen = docgens.find(
        (docgen) => docgen.actualName === componentName || docgen.displayName === componentName || docgen.exportName === componentName
      );
      return matchingDocgen ? {
        componentName: matchingDocgen.actualName || matchingDocgen.displayName || componentName,
        reactDocgen: { type: "success", data: matchingDocgen }
      } : null;
    }
    let firstDocgen = docgens[0];
    return {
      componentName: firstDocgen.actualName || firstDocgen.displayName || "Unknown",
      reactDocgen: { type: "success", data: firstDocgen }
    };
  } catch (error) {
    return logger3.debug(`Error parsing component file for docgen ${filePath}: ${error}`), null;
  }
}
var extractArgTypesFromDocgen = ({
  componentFilePath,
  componentExportName
}) => {
  let docgen = getComponentDocgen(componentFilePath, componentExportName);
  return !docgen || docgen.reactDocgen.type !== "success" ? null : extractArgTypes({ __docgenInfo: docgen.reactDocgen.data }) ?? {};
};

// src/componentManifest/reactDocgen/extractReactTypescriptDocgenInfo.ts
import { logger as logger4 } from "storybook/internal/node-logger";

// src/componentManifest/reactDocgen/utils.ts
import { dirname as dirname4 } from "path";
var REACT_NODE_TYPES = /* @__PURE__ */ new Set([
  "JSX.Element",
  "ComponentType",
  "ReactComponentType",
  "ReactElement",
  "ReactReactElement",
  "ElementType",
  "ReactElementType",
  "ReactNode",
  "ReactReactNode"
]), KNOWN_TYPE_NAMES = /* @__PURE__ */ new Set([
  "boolean",
  "string",
  "number",
  "Date",
  ...REACT_NODE_TYPES,
  "signature",
  "union",
  "Array",
  "tuple",
  "literal",
  "null",
  "void",
  "any",
  "unknown"
]);
var getTsConfig2 = async () => {
  try {
    let ts = await import("typescript"), tsconfigPath = ts.findConfigFile(process.cwd(), ts.sys.fileExists);
    if (console.log({ tsconfigPath }), tsconfigPath === void 0)
      return {};
    let basePath = dirname4(tsconfigPath), { config, error } = ts.readConfigFile(tsconfigPath, ts.sys.readFile);
    return error ? {} : ts.parseJsonConfigFileContent(config, ts.sys, basePath, {}, tsconfigPath).options;
  } catch {
    return {};
  }
};

// src/componentManifest/reactDocgen/extractReactTypescriptDocgenInfo.ts
var extractArgTypesFromDocgenTypescript = async ({
  componentFilePath,
  componentExportName,
  reactDocgenTypescriptOptions
}) => {
  try {
    let { withCompilerOptions } = (await import("react-docgen-typescript")).default, defaultOptions2 = {
      shouldExtractLiteralValuesFromEnum: !0,
      shouldRemoveUndefinedFromOptional: !0,
      propFilter: (prop) => prop.parent ? !/node_modules/.test(prop.parent.fileName) : !0,
      // We *need* this set so that RDT returns default values in the same format as react-docgen
      savePropValueAsString: !0
    }, tsConfig = await getTsConfig2(), mergedOptions = {
      ...defaultOptions2,
      ...reactDocgenTypescriptOptions,
      // Always ensure savePropValueAsString is true for consistency
      savePropValueAsString: !0
    }, docgens = withCompilerOptions(
      { ...tsConfig, noErrorTruncation: !0, strict: !0 },
      mergedOptions
    ).parse(componentFilePath);
    if (!docgens || docgens.length === 0)
      return null;
    let targetDocgen = docgens[0];
    if (componentExportName) {
      let match = docgens.find(
        (d) => d.displayName === componentExportName || d.filePath?.includes(componentExportName)
      );
      if (match)
        targetDocgen = match;
      else
        return null;
    }
    return extractArgTypes({ __docgenInfo: targetDocgen }) ?? {};
  } catch (error) {
    return logger4.debug(
      `Error parsing component file with react-docgen-typescript ${componentFilePath}: ${error}`
    ), null;
  }
};

// src/componentManifest/generator.ts
import { recast as recast2 } from "storybook/internal/babel";
import { Tag } from "storybook/internal/core-server";
import { storyNameFromExport } from "storybook/internal/csf";
import { extractDescription, loadCsf } from "storybook/internal/csf-tools";
import { logger as logger8 } from "storybook/internal/node-logger";

// src/componentManifest/componentMeta/ComponentMetaManager.ts
import { logger as logger5 } from "storybook/internal/node-logger";
import { existsSync as existsSync3, watch } from "fs";
import * as path3 from "path";

// src/componentManifest/componentMeta/ComponentMetaProject.ts
var import_language_core = __toESM(require_language_core(), 1), import_typescript = __toESM(require_typescript(), 1);
import * as path2 from "path";

// src/componentManifest/componentMeta/componentMetaExtractor.ts
var LARGE_SOURCE_THRESHOLD = 30, MAX_UNWRAP_DEPTH = 5, MAX_SERIALIZATION_DEPTH = 5;
function isLiteralType(type) {
  return type.isStringLiteral() || type.isNumberLiteral();
}
function isUnionType(type) {
  return type.isUnion();
}
function isWrappedExpression(typescript, expression) {
  return typescript.isParenthesizedExpression(expression) || typescript.isAsExpression(expression) || typescript.isNonNullExpression(expression) || (typescript.isSatisfiesExpression?.(expression) ?? !1);
}
function resolveAliasedSymbol(typescript, checker, symbol) {
  return symbol.flags & typescript.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
}
function getSymbolContextNode(symbol) {
  return symbol.valueDeclaration ?? symbol.getDeclarations()?.[0];
}
function resolveComponentSymbolFromNode(typescript, checker, node) {
  if (!node)
    return;
  let symbol = checker.getSymbolAtLocation(node);
  return symbol ? resolveComponentSymbol(typescript, checker, symbol, node) : void 0;
}
function resolveComponentSymbol(typescript, checker, symbol, contextNode, depth = 0) {
  let resolved = resolveAliasedSymbol(typescript, checker, symbol);
  if (depth > MAX_UNWRAP_DEPTH)
    return resolved;
  let declarationForPromotion = getSymbolContextNode(resolved);
  if (declarationForPromotion && (typescript.isArrowFunction(declarationForPromotion) || typescript.isFunctionExpression(declarationForPromotion)) && declarationForPromotion.parent && typescript.isVariableDeclaration(declarationForPromotion.parent) && typescript.isIdentifier(declarationForPromotion.parent.name)) {
    let variableSymbol = checker.getSymbolAtLocation(declarationForPromotion.parent.name);
    variableSymbol && (resolved = resolveAliasedSymbol(typescript, checker, variableSymbol));
  }
  let declaration = getSymbolContextNode(resolved);
  if (declaration) {
    if (typescript.isShorthandPropertyAssignment(declaration)) {
      let valueSymbol = checker.getShorthandAssignmentValueSymbol(declaration);
      if (valueSymbol)
        return resolveComponentSymbol(
          typescript,
          checker,
          valueSymbol,
          declaration.name,
          depth + 1
        );
    }
    if (typescript.isPropertyAssignment(declaration)) {
      let next = resolveComponentSymbolFromNode(typescript, checker, declaration.initializer);
      if (next)
        return next;
    }
    if (typescript.isBinaryExpression(declaration) && declaration.operatorToken.kind === typescript.SyntaxKind.EqualsToken) {
      let next = resolveComponentSymbolFromNode(typescript, checker, declaration.right);
      if (next)
        return next;
    }
  }
  let typeSymbol = (!!(resolved.flags & typescript.SymbolFlags.Property) || declaration !== void 0 && (typescript.isPropertyAssignment(declaration) || typescript.isShorthandPropertyAssignment(declaration) || typescript.isPropertySignature(declaration) || typescript.isPropertyDeclaration(declaration) || typescript.isBinaryExpression(declaration) && declaration.operatorToken.kind === typescript.SyntaxKind.EqualsToken)) && checker.getTypeOfSymbolAtLocation(resolved, contextNode).getSymbol?.();
  if (typeSymbol) {
    let resolvedTypeSymbol = resolveAliasedSymbol(typescript, checker, typeSymbol), typeDeclaration = getSymbolContextNode(resolvedTypeSymbol);
    if (resolvedTypeSymbol !== resolved && typeDeclaration)
      return resolveComponentSymbol(
        typescript,
        checker,
        resolvedTypeSymbol,
        typeDeclaration,
        depth + 1
      );
  }
  return resolved;
}
function resolvePropsFromStoryFile(typescript, checker, storySourceFile, componentRef) {
  let importSpecifier = componentRef.importId, importName = componentRef.importName, memberAccess = componentRef.member;
  if (!importSpecifier)
    return;
  let importSymbol;
  for (let stmt of storySourceFile.statements) {
    if (!typescript.isImportDeclaration(stmt))
      continue;
    let moduleSpec = stmt.moduleSpecifier;
    if (!typescript.isStringLiteral(moduleSpec) || moduleSpec.text !== importSpecifier)
      continue;
    let clause = stmt.importClause;
    if (clause) {
      if (importName === "default") {
        if (clause.name && (importSymbol = checker.getSymbolAtLocation(clause.name)), !importSymbol && clause.namedBindings && typescript.isNamedImports(clause.namedBindings)) {
          for (let spec of clause.namedBindings.elements)
            if ((spec.propertyName ?? spec.name).text === "default") {
              importSymbol = checker.getSymbolAtLocation(spec.name);
              break;
            }
        }
      } else if (clause.namedBindings && typescript.isNamedImports(clause.namedBindings)) {
        for (let spec of clause.namedBindings.elements)
          if ((spec.propertyName ?? spec.name).text === importName) {
            importSymbol = checker.getSymbolAtLocation(spec.name);
            break;
          }
      }
      if (!importSymbol && memberAccess && clause.namedBindings && typescript.isNamespaceImport(clause.namedBindings) && (importSymbol = checker.getSymbolAtLocation(clause.namedBindings.name)), importSymbol)
        break;
    }
  }
  if (!importSymbol)
    return;
  let result;
  function extractPropsFromJsx(node) {
    let sig = checker.getResolvedSignature(node);
    if (!sig)
      return;
    let params = sig.getParameters();
    return params.length === 0 ? checker.getTypeFromTypeNode(typescript.factory.createTypeLiteralNode([])) : checker.getTypeOfSymbolAtLocation(params[0], node);
  }
  function visit(node) {
    if (!result) {
      if (typescript.isJsxSelfClosingElement(node) || typescript.isJsxOpeningElement(node)) {
        let tagName = node.tagName;
        if (memberAccess) {
          if (typescript.isPropertyAccessExpression(tagName) && tagName.name.text === memberAccess) {
            let leftSym = checker.getSymbolAtLocation(tagName.expression);
            if (leftSym && importSymbol && leftSym === importSymbol) {
              let propsType = extractPropsFromJsx(node);
              if (propsType) {
                let memberSymbol = checker.getSymbolAtLocation(tagName.name) ?? checker.getTypeAtLocation(tagName.expression).getProperty(tagName.name.text) ?? resolveComponentSymbolFromNode(typescript, checker, tagName);
                result = {
                  componentRef,
                  propsType,
                  symbol: memberSymbol ? resolveComponentSymbol(typescript, checker, memberSymbol, tagName.name) : resolveAliasedSymbol(typescript, checker, importSymbol)
                };
                return;
              }
            }
          }
        } else if (typescript.isIdentifier(tagName)) {
          let sym = checker.getSymbolAtLocation(tagName);
          if (sym && importSymbol && sym === importSymbol) {
            let propsType = extractPropsFromJsx(node);
            if (propsType) {
              result = {
                componentRef,
                propsType,
                symbol: resolveAliasedSymbol(typescript, checker, sym)
              };
              return;
            }
          }
        }
      }
      typescript.forEachChild(node, visit);
    }
  }
  return visit(storySourceFile), result;
}
function resolvePropsFromComponentType(typescript, checker, componentType) {
  let callSigs = componentType.getCallSignatures();
  if (callSigs.length > 0) {
    let sig = callSigs[0];
    if (sig.parameters.length === 0)
      return checker.getVoidType();
    let propsType = checker.getTypeOfSymbol(sig.parameters[0]);
    if (!(propsType.flags & typescript.TypeFlags.Any))
      return propsType;
  }
  let ctorSigs = componentType.getConstructSignatures();
  for (let sig of ctorSigs) {
    let propsSym = sig.getReturnType().getProperty("props");
    if (propsSym) {
      let propsType = checker.getTypeOfSymbol(propsSym);
      if (!(propsType.flags & typescript.TypeFlags.Any))
        return propsType;
    }
  }
}
function getPropSourceFile(prop) {
  let declarations = prop.getDeclarations();
  if (declarations?.length) {
    for (let decl of declarations) {
      let fileName = decl.getSourceFile().fileName;
      if (!fileName.includes("node_modules") && !fileName.endsWith(".d.ts"))
        return fileName;
    }
    return declarations[0].getSourceFile().fileName;
  }
}
function getParentType(typescript, prop) {
  let declarations = prop.getDeclarations();
  if (!declarations?.length)
    return;
  let node = declarations[0].parent;
  for (; node; ) {
    if (typescript.isInterfaceDeclaration(node) || typescript.isTypeAliasDeclaration(node))
      return {
        name: node.name.getText(),
        fileName: node.getSourceFile().fileName
      };
    node = node.parent;
  }
}
function getAllDeclarationParents(typescript, prop) {
  let declarations = prop.getDeclarations();
  if (!declarations?.length)
    return;
  let parents = [];
  for (let declaration of declarations) {
    let { parent } = declaration;
    parent && (typescript.isInterfaceDeclaration(parent) || typescript.isTypeAliasDeclaration(parent) ? parents.push({
      name: parent.name.getText(),
      fileName: parent.getSourceFile().fileName
    }) : typescript.isTypeLiteralNode(parent) && parents.push({
      name: "TypeLiteral",
      fileName: parent.getSourceFile().fileName
    }));
  }
  return parents.length > 0 ? parents : void 0;
}
function serializeType(typescript, checker, type, isRequired, depth = 0) {
  if (depth > MAX_SERIALIZATION_DEPTH)
    return { name: checker.typeToString(type) };
  if (type.isUnion()) {
    let nonUndefinedTypes = type.types.filter(
      (t6) => !(t6.getFlags() & typescript.TypeFlags.Undefined)
    ), literalMembers = nonUndefinedTypes.filter(isLiteralType);
    if (literalMembers.length > 0 && literalMembers.length === nonUndefinedTypes.length)
      return {
        name: "enum",
        raw: literalMembers.map((m) => checker.typeToString(m)).join(" | "),
        value: literalMembers.map((m) => ({
          value: JSON.stringify(m.value)
        }))
      };
    if (!isRequired && nonUndefinedTypes.length === 1 && nonUndefinedTypes.length < type.types.length)
      return { name: checker.typeToString(nonUndefinedTypes[0]) };
  }
  let constraint = type.getConstraint?.();
  return constraint && constraint !== type ? serializeType(typescript, checker, constraint, isRequired, depth + 1) : { name: checker.typeToString(type) };
}
function unwrapToFunction(typescript, node, depth = 0, checker) {
  if (!(depth > MAX_UNWRAP_DEPTH)) {
    if (typescript.isArrowFunction(node) || typescript.isFunctionExpression(node) || typescript.isFunctionDeclaration(node))
      return node;
    if (typescript.isCallExpression(node))
      for (let arg of node.arguments) {
        let fn = unwrapToFunction(typescript, arg, depth + 1, checker);
        if (fn)
          return fn;
      }
    if (typescript.isParenthesizedExpression(node) || typescript.isAsExpression(node))
      return unwrapToFunction(typescript, node.expression, depth + 1, checker);
    if (typescript.isIdentifier(node) && checker) {
      let symbol = checker.getSymbolAtLocation(node);
      if (symbol) {
        let decl = (symbol.flags & typescript.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol).valueDeclaration;
        if (decl && typescript.isVariableDeclaration(decl) && decl.initializer)
          return unwrapToFunction(typescript, decl.initializer, depth + 1, checker);
        if (decl && typescript.isFunctionDeclaration(decl))
          return decl;
      }
    }
  }
}
function resolveLiteralValue(typescript, checker, node, depth = 0) {
  if (depth > MAX_UNWRAP_DEPTH || typescript.isStringLiteral(node) || typescript.isNumericLiteral(node) || typescript.isNoSubstitutionTemplateLiteral(node) || node.kind === typescript.SyntaxKind.TrueKeyword || node.kind === typescript.SyntaxKind.FalseKeyword || node.kind === typescript.SyntaxKind.NullKeyword)
    return node.getText();
  if (typescript.isIdentifier(node)) {
    if (node.text === "undefined")
      return "undefined";
    let symbol = checker.getSymbolAtLocation(node);
    if (!symbol)
      return node.getText();
    let decl = (symbol.flags & typescript.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol).valueDeclaration;
    return decl && typescript.isVariableDeclaration(decl) && decl.initializer || decl && typescript.isEnumMember(decl) && decl.initializer || decl && typescript.isBindingElement(decl) && decl.initializer ? resolveLiteralValue(typescript, checker, decl.initializer, depth + 1) : node.getText();
  }
  if (typescript.isPropertyAccessExpression(node)) {
    let symbol = checker.getSymbolAtLocation(node);
    if (symbol) {
      let decl = symbol.valueDeclaration;
      if (decl && typescript.isEnumMember(decl) && decl.initializer || decl && typescript.isPropertyAssignment(decl) && decl.initializer || decl && typescript.isVariableDeclaration(decl) && decl.initializer)
        return resolveLiteralValue(typescript, checker, decl.initializer, depth + 1);
    }
    return node.getText();
  }
  return node.getText();
}
function collectBindingDefaults(typescript, pattern, defaults, checker) {
  for (let element of pattern.elements)
    if (element.initializer) {
      let propName = element.propertyName ? element.propertyName.getText() : element.name.getText();
      defaults.set(
        propName,
        checker ? resolveLiteralValue(typescript, checker, element.initializer) : element.initializer.getText()
      );
    }
}
function unwrapExpression(typescript, expression) {
  let current2 = expression;
  for (; isWrappedExpression(typescript, current2); )
    current2 = current2.expression;
  return current2;
}
function isPropsIdentifier(typescript, node, paramName, checker) {
  if (!typescript.isIdentifier(node))
    return !1;
  if (!checker)
    return node.text === paramName.text;
  let symbol = checker.getSymbolAtLocation(node), paramSymbol = checker.getSymbolAtLocation(paramName);
  return symbol !== void 0 && symbol === paramSymbol;
}
function isPropsDerivedInitializer(typescript, initializer, paramName, checker) {
  let expr = unwrapExpression(typescript, initializer);
  return isPropsIdentifier(typescript, expr, paramName, checker) ? !0 : typescript.isAwaitExpression(expr) ? isPropsDerivedInitializer(typescript, expr.expression, paramName, checker) : typescript.isBinaryExpression(expr) && [
    typescript.SyntaxKind.BarBarToken,
    typescript.SyntaxKind.QuestionQuestionToken,
    typescript.SyntaxKind.AmpersandAmpersandToken
  ].includes(expr.operatorToken.kind) ? isPropsDerivedInitializer(typescript, expr.left, paramName, checker) || isPropsDerivedInitializer(typescript, expr.right, paramName, checker) : typescript.isConditionalExpression(expr) ? isPropsDerivedInitializer(typescript, expr.whenTrue, paramName, checker) || isPropsDerivedInitializer(typescript, expr.whenFalse, paramName, checker) : typescript.isCallExpression(expr) || typescript.isNewExpression(expr) ? expr.arguments?.some(
    (arg) => isPropsDerivedInitializer(typescript, arg, paramName, checker)
  ) ?? !1 : !1;
}
function extractDestructuringDefaults(typescript, resolved, checker) {
  let defaults = /* @__PURE__ */ new Map(), decl = resolved.valueDeclaration;
  if (!decl)
    return defaults;
  let fn;
  if (typescript.isFunctionDeclaration(decl)) {
    if (fn = decl, !fn.body) {
      let allDecls = resolved.getDeclarations?.() ?? [];
      for (let d of allDecls)
        if (typescript.isFunctionDeclaration(d) && d.body) {
          fn = d;
          break;
        }
    }
  } else typescript.isVariableDeclaration(decl) && decl.initializer ? fn = unwrapToFunction(typescript, decl.initializer, 0, checker) : typescript.isExportAssignment(decl) && decl.expression && (fn = unwrapToFunction(typescript, decl.expression, 0, checker));
  if (!fn)
    return defaults;
  let firstParam = fn.parameters[0];
  if (!firstParam)
    return defaults;
  if (typescript.isObjectBindingPattern(firstParam.name))
    return collectBindingDefaults(typescript, firstParam.name, defaults, checker), defaults;
  let propsParamName = typescript.isIdentifier(firstParam.name) ? firstParam.name : void 0;
  if (fn.body && propsParamName) {
    let body = typescript.isBlock(fn.body) ? fn.body : void 0;
    if (body) {
      for (let stmt of body.statements)
        if (typescript.isVariableStatement(stmt))
          for (let varDecl of stmt.declarationList.declarations)
            typescript.isObjectBindingPattern(varDecl.name) && varDecl.initializer && isPropsDerivedInitializer(typescript, varDecl.initializer, propsParamName, checker) && collectBindingDefaults(typescript, varDecl.name, defaults, checker);
    }
  }
  return defaults;
}
function collectObjectLiteralDefaults(typescript, checker, obj, defaults) {
  for (let prop of obj.properties)
    if (typescript.isPropertyAssignment(prop) && prop.name) {
      let name = prop.name.getText();
      defaults.set(name, resolveLiteralValue(typescript, checker, prop.initializer));
    } else if (typescript.isShorthandPropertyAssignment(prop)) {
      let name = prop.name.getText(), symbol = checker.getShorthandAssignmentValueSymbol(prop);
      symbol?.valueDeclaration && typescript.isVariableDeclaration(symbol.valueDeclaration) && symbol.valueDeclaration.initializer ? defaults.set(
        name,
        resolveLiteralValue(typescript, checker, symbol.valueDeclaration.initializer)
      ) : defaults.set(name, name);
    }
}
function extractStaticDefaultProps(typescript, checker, resolved) {
  let defaults = /* @__PURE__ */ new Map(), decl = resolved.valueDeclaration ?? resolved.getDeclarations()?.[0];
  if (!decl)
    return defaults;
  let componentSourceFile = decl.getSourceFile();
  for (let stmt of componentSourceFile.statements) {
    if (typescript.isClassDeclaration(stmt) && stmt.name) {
      if (checker.getSymbolAtLocation(stmt.name) !== resolved)
        continue;
      for (let member of stmt.members) {
        if (!typescript.isPropertyDeclaration(member) || !member.name || member.name.getText() !== "defaultProps" || !member.initializer)
          continue;
        let initializer = member.initializer;
        if (typescript.isIdentifier(initializer)) {
          let symDecl = checker.getSymbolAtLocation(initializer)?.valueDeclaration;
          symDecl && typescript.isVariableDeclaration(symDecl) && symDecl.initializer && (initializer = symDecl.initializer);
        }
        typescript.isObjectLiteralExpression(initializer) && collectObjectLiteralDefaults(typescript, checker, initializer, defaults);
      }
    }
    if (typescript.isExpressionStatement(stmt) && typescript.isBinaryExpression(stmt.expression) && stmt.expression.operatorToken.kind === typescript.SyntaxKind.EqualsToken) {
      let left = stmt.expression.left;
      if (!typescript.isPropertyAccessExpression(left) || left.name.text !== "defaultProps")
        continue;
      let targetSymbol = checker.getSymbolAtLocation(left.expression);
      if (!targetSymbol || (targetSymbol.flags & typescript.SymbolFlags.Alias ? checker.getAliasedSymbol(targetSymbol) : targetSymbol) !== resolved)
        continue;
      let right = stmt.expression.right;
      if (typescript.isIdentifier(right)) {
        let symDecl = checker.getSymbolAtLocation(right)?.valueDeclaration;
        symDecl && typescript.isVariableDeclaration(symDecl) && symDecl.initializer && (right = symDecl.initializer);
      }
      typescript.isObjectLiteralExpression(right) && collectObjectLiteralDefaults(typescript, checker, right, defaults);
    }
  }
  return defaults;
}
function getJSDocDefault(typescript, prop, checker) {
  let tags = prop.getJsDocTags(checker);
  for (let tag of tags)
    if (tag.name === "default" || tag.name === "defaultValue")
      return typescript.displayPartsToString(tag.text) || void 0;
}
function extractPropItem(typescript, checker, prop, contextNode, defaultsMap) {
  let isRequired = !!!(prop.flags & typescript.SymbolFlags.Optional), propType = checker.getTypeOfSymbolAtLocation(prop, contextNode), type = serializeType(typescript, checker, propType, isRequired), description = typescript.displayPartsToString(prop.getDocumentationComment(checker)), parent = getParentType(typescript, prop), declarations = getAllDeclarationParents(typescript, prop), propName = prop.getName(), destructuringDefault = defaultsMap?.get(propName), jsDocDefault = getJSDocDefault(typescript, prop, checker), defaultStr = destructuringDefault ?? jsDocDefault;
  return {
    name: propName,
    required: isRequired,
    type,
    description,
    defaultValue: defaultStr !== void 0 ? { value: defaultStr } : null,
    parent,
    declarations
  };
}
function getBulkSourceExclusions(properties) {
  let propSourceCache = /* @__PURE__ */ new Map(), getSource = (prop) => {
    let cached2 = propSourceCache.get(prop);
    return cached2 === void 0 && !propSourceCache.has(prop) && (cached2 = getPropSourceFile(prop), propSourceCache.set(prop, cached2)), cached2;
  }, sourceCount = /* @__PURE__ */ new Map();
  for (let prop of properties) {
    let source = getSource(prop);
    source && (source.includes("node_modules") || source.endsWith(".d.ts")) && sourceCount.set(source, (sourceCount.get(source) ?? 0) + 1);
  }
  let bulkSources = new Set(
    [...sourceCount.entries()].filter(([, count]) => count > LARGE_SOURCE_THRESHOLD).map(([source]) => source)
  ), excluded = /* @__PURE__ */ new Set();
  for (let prop of properties) {
    let source = getSource(prop);
    source && bulkSources.has(source) && excluded.add(prop.getName());
  }
  return excluded;
}
function computeDisplayName({
  exportSymbol,
  resolvedSymbol
}) {
  let resolvedName = resolvedSymbol.getName();
  if (!exportSymbol)
    return resolvedName && resolvedName !== "default" && resolvedName !== "__function" ? resolvedName : void 0;
  let exportName = exportSymbol.getName();
  return exportName === "default" ? resolvedName && resolvedName !== "default" && resolvedName !== "__function" ? resolvedName : void 0 : exportName;
}
function extractComponentJsDocTags(typescript, checker, symbol) {
  let tags = symbol.getJsDocTags(checker);
  if (tags.length === 0)
    return;
  let groupedTags = groupBy(tags, (tag) => tag.name);
  return Object.fromEntries(
    Object.entries(groupedTags).map(([name, grouped]) => [
      name,
      (grouped ?? []).map((tag) => typescript.displayPartsToString(tag.text ?? []).trim())
    ])
  );
}
function serializeComponentDoc(typescript, checker, {
  sourceFile,
  resolvedComponent,
  defaultsSourcePath
}) {
  let { componentRef, propsType, symbol } = resolvedComponent, exportName = componentRef.importName;
  if (!exportName)
    return;
  let displayNameOverride = componentRef.componentName, isMemberSelection = !!componentRef.member, filePath = componentRef.path ?? sourceFile.fileName, resolved = resolveAliasedSymbol(typescript, checker, symbol), contextNode = resolved.valueDeclaration ?? resolved.getDeclarations()?.[0];
  if (!contextNode)
    return;
  let moduleSymbol = checker.getSymbolAtLocation(sourceFile), exportSymbol = moduleSymbol ? checker.getExportsOfModule(moduleSymbol).find((candidate) => candidate.getName() === exportName) : void 0, allProperties, unionForceOptional;
  if (isUnionType(propsType)) {
    let seen = /* @__PURE__ */ new Map(), forceOptional = /* @__PURE__ */ new Set(), unionMembers = propsType.types, allMemberPropSets = [];
    for (let member of unionMembers) {
      let memberPropNames = /* @__PURE__ */ new Set();
      for (let prop of member.getApparentProperties()) {
        let name = prop.getName();
        memberPropNames.add(name);
        let propType = checker.getTypeOfSymbolAtLocation(prop, contextNode), isOptional = !!(prop.flags & typescript.SymbolFlags.Optional), isDegraded = !!(propType.getFlags() & typescript.TypeFlags.Never) || !!(propType.getFlags() & typescript.TypeFlags.Undefined);
        (isOptional || isDegraded) && forceOptional.add(name);
        let existing = seen.get(name);
        if (!existing)
          seen.set(name, prop);
        else if (!isDegraded) {
          let existingType = checker.getTypeOfSymbolAtLocation(existing, contextNode);
          (existingType.getFlags() & typescript.TypeFlags.Never || existingType.getFlags() & typescript.TypeFlags.Undefined) && seen.set(name, prop);
        }
      }
      allMemberPropSets.push(memberPropNames);
    }
    for (let name of seen.keys())
      allMemberPropSets.every((s) => s.has(name)) || forceOptional.add(name);
    allProperties = Array.from(seen.values()), unionForceOptional = forceOptional;
  } else
    allProperties = propsType.getApparentProperties();
  let excluded = getBulkSourceExclusions(allProperties), defaultsMap = extractDestructuringDefaults(typescript, resolved, checker);
  if (defaultsMap.size === 0 && defaultsSourcePath) {
    let fallbackDefaults = extractDefaultsFromSourceFile(typescript, defaultsSourcePath, {
      exportName,
      localName: resolved.getName(),
      preferLocalName: isMemberSelection
    });
    for (let [key, value] of fallbackDefaults)
      defaultsMap.set(key, value);
  }
  let staticDefaults = extractStaticDefaultProps(typescript, checker, resolved);
  for (let [key, value] of staticDefaults)
    defaultsMap.has(key) || defaultsMap.set(key, value);
  let props = {};
  for (let prop of allProperties) {
    if (excluded.has(prop.getName()))
      continue;
    let item = extractPropItem(typescript, checker, prop, contextNode, defaultsMap);
    unionForceOptional?.has(prop.getName()) && (item.required = !1), props[prop.getName()] = item;
  }
  let displayName = (isMemberSelection ? displayNameOverride : void 0) ?? computeDisplayName({
    exportSymbol,
    resolvedSymbol: resolved
  }) ?? displayNameOverride, description = typescript.displayPartsToString(resolved.getDocumentationComment(checker)), selectedJsDocTags = extractComponentJsDocTags(typescript, checker, resolved), exportResolved = exportSymbol && exportSymbol !== resolved ? resolveAliasedSymbol(typescript, checker, exportSymbol) : void 0, exportJsDocTags = exportResolved ? extractComponentJsDocTags(typescript, checker, exportResolved) : void 0, jsDocTags = selectedJsDocTags?.import || !exportJsDocTags?.import ? selectedJsDocTags : {
    ...selectedJsDocTags ?? {},
    import: exportJsDocTags.import
  };
  return {
    displayName,
    exportName,
    filePath,
    description,
    jsDocTags,
    props
  };
}
function extractDefaultsFromSourceFile(typescript, filePath, {
  exportName,
  localName,
  preferLocalName = !1
}) {
  let defaults = /* @__PURE__ */ new Map(), content = typescript.sys.readFile(filePath);
  if (!content)
    return defaults;
  let sf = typescript.createSourceFile(
    filePath,
    content,
    typescript.ScriptTarget.Latest,
    /* setParentNodes */
    !0
  ), varMap = /* @__PURE__ */ new Map();
  for (let stmt of sf.statements) {
    if (typescript.isVariableStatement(stmt))
      for (let decl of stmt.declarationList.declarations)
        typescript.isIdentifier(decl.name) && decl.initializer && varMap.set(decl.name.text, decl.initializer);
    typescript.isFunctionDeclaration(stmt) && stmt.name && varMap.set(stmt.name.text, stmt);
  }
  let fn = preferLocalName ? findLocalFunction(typescript, sf, localName, varMap) ?? findExportedFunction(typescript, sf, exportName, varMap) : findExportedFunction(typescript, sf, exportName, varMap) ?? findLocalFunction(typescript, sf, localName, varMap);
  if (!fn)
    return defaults;
  let firstParam = fn.parameters[0];
  if (!firstParam)
    return defaults;
  if (typescript.isObjectBindingPattern(firstParam.name))
    collectBindingDefaults(typescript, firstParam.name, defaults);
  else if (fn.body) {
    let propsParamName = typescript.isIdentifier(firstParam.name) ? firstParam.name : void 0, body = typescript.isBlock(fn.body) ? fn.body : void 0;
    if (body && propsParamName) {
      for (let stmt of body.statements)
        if (typescript.isVariableStatement(stmt))
          for (let varDecl of stmt.declarationList.declarations)
            typescript.isObjectBindingPattern(varDecl.name) && varDecl.initializer && isPropsDerivedInitializer(typescript, varDecl.initializer, propsParamName) && collectBindingDefaults(typescript, varDecl.name, defaults);
    }
  }
  return defaults;
}
function findLocalFunction(typescript, sf, localName, varMap) {
  if (!localName)
    return;
  let targetExpr = varMap.get(localName);
  if (targetExpr)
    return unwrapToFunctionAST(typescript, targetExpr, varMap, 0);
}
function findExportedFunction(typescript, sf, exportName, varMap) {
  let targetExpr;
  for (let stmt of sf.statements) {
    if (exportName === "default" && typescript.isExportAssignment(stmt) && !stmt.isExportEquals) {
      targetExpr = stmt.expression;
      break;
    }
    if (typescript.isVariableStatement(stmt) && hasExportModifier(typescript, stmt)) {
      for (let decl of stmt.declarationList.declarations)
        if (typescript.isIdentifier(decl.name) && decl.name.text === exportName && decl.initializer) {
          targetExpr = decl.initializer;
          break;
        }
      if (targetExpr)
        break;
    }
    if (typescript.isFunctionDeclaration(stmt) && hasExportModifier(typescript, stmt) && stmt.name?.text === exportName)
      return findFunctionImpl(typescript, sf, stmt.name.text) ?? stmt;
    if (typescript.isExportDeclaration(stmt) && stmt.exportClause && typescript.isNamedExports(stmt.exportClause)) {
      for (let spec of stmt.exportClause.elements) {
        let exported = spec.name.text, local = spec.propertyName ? spec.propertyName.text : spec.name.text;
        if (exported === exportName) {
          targetExpr = varMap.get(local);
          break;
        }
      }
      if (targetExpr)
        break;
    }
  }
  if (targetExpr || (targetExpr = varMap.get(exportName)), !!targetExpr)
    return unwrapToFunctionAST(typescript, targetExpr, varMap, 0);
}
function unwrapToFunctionAST(typescript, node, varMap, depth) {
  if (!(depth > MAX_UNWRAP_DEPTH)) {
    if (typescript.isFunctionExpression(node) || typescript.isArrowFunction(node) || typescript.isFunctionDeclaration(node))
      return node;
    if (typescript.isParenthesizedExpression(node) || typescript.isAsExpression(node) || typescript.isTypeAssertionExpression && typescript.isTypeAssertionExpression(node))
      return unwrapToFunctionAST(typescript, node.expression, varMap, depth + 1);
    if (typescript.isCallExpression(node)) {
      let callee = node.expression;
      if (typescript.isPropertyAccessExpression(callee) && typescript.isIdentifier(callee.expression) && callee.expression.text === "Object" && callee.name.text === "assign" && node.arguments.length >= 1 || node.arguments.length >= 1)
        return unwrapToFunctionAST(typescript, node.arguments[0], varMap, depth + 1);
    }
    if (typescript.isIdentifier(node)) {
      let init = varMap.get(node.text);
      if (init)
        return unwrapToFunctionAST(typescript, init, varMap, depth + 1);
    }
  }
}
function findFunctionImpl(typescript, sf, name) {
  for (let stmt of sf.statements)
    if (typescript.isFunctionDeclaration(stmt) && stmt.name?.text === name && stmt.body)
      return stmt;
}
function hasExportModifier(typescript, node) {
  return typescript.canHaveModifiers(node) && typescript.getModifiers(node)?.some((m) => m.kind === typescript.SyntaxKind.ExportKeyword) === !0;
}

// src/componentManifest/componentMeta/ComponentMetaProject.ts
var ComponentMetaProject = class {
  constructor(typescript, commandLine, configFileName, fsFileSnapshots = /* @__PURE__ */ new Map(), getCommandLineFn) {
    this.typescript = typescript;
    this.commandLine = commandLine;
    this.configFileName = configFileName;
    this.fsFileSnapshots = fsFileSnapshots;
    this.getCommandLineFn = getCommandLineFn;
    this.projectVersion = 0;
    this.shouldCheckRootFiles = !1;
    /** Entries to extract — set by the generator, replayed during warmup for targeted type resolution. */
    this.entries = [];
    let language = (0, import_language_core.createLanguage)(
      [{ getLanguageId: (fileName) => (0, import_typescript.resolveFileLanguageId)(fileName) }],
      new import_language_core.FileMap(typescript.sys.useCaseSensitiveFileNames),
      (fileName, includeFsFiles) => {
        if (!includeFsFiles)
          return;
        let cache = fsFileSnapshots.get(fileName), modifiedTime = typescript.sys.getModifiedTime?.(fileName)?.valueOf();
        if (!cache || cache[0] !== modifiedTime)
          if (typescript.sys.fileExists(fileName)) {
            let text = typescript.sys.readFile(fileName), snapshot2 = text !== void 0 ? typescript.ScriptSnapshot.fromString(text) : void 0;
            fsFileSnapshots.set(fileName, [modifiedTime, snapshot2]);
          } else
            fsFileSnapshots.set(fileName, [modifiedTime, void 0]);
        let snapshot = fsFileSnapshots.get(fileName)?.[1];
        snapshot ? language.scripts.set(fileName, snapshot) : language.scripts.delete(fileName);
      }
    ), projectHost = {
      getCurrentDirectory: () => configFileName ? path2.dirname(configFileName) : commandLine.options.rootDir ?? process.cwd(),
      getCompilationSettings: () => this.commandLine.options,
      getProjectReferences: () => this.commandLine.projectReferences,
      getProjectVersion: () => (this.checkRootFilesUpdate(), this.projectVersion.toString()),
      getScriptFileNames: () => (this.checkRootFilesUpdate(), this.commandLine.fileNames)
    }, { languageServiceHost } = (0, import_typescript.createLanguageServiceHost)(
      typescript,
      typescript.sys,
      language,
      (s) => s,
      // asScriptId — identity for React (no URI mapping needed)
      projectHost
    );
    this.ls = typescript.createLanguageService(languageServiceHost);
  }
  getCommandLine() {
    return this.commandLine;
  }
  dispose() {
    clearTimeout(this.warmupTimer), this.ls.dispose();
  }
  // ---------------------------------------------------------------------------
  // Project management
  // ---------------------------------------------------------------------------
  /**
   * Batch-add multiple files to the project in one go. Only bumps projectVersion once, avoiding
   * repeated program rebuilds.
   */
  ensureFiles(fileNames) {
    let added = !1;
    for (let fileName of fileNames)
      this.commandLine.fileNames.includes(fileName) || (this.commandLine.fileNames.push(fileName), added = !0);
    added && this.projectVersion++;
  }
  /**
   * Adapted from:
   * https://github.com/volarjs/volar.js/blob/882cd56d46a13d272f34e451f495d3d62251969a/packages/kit/lib/createChecker.ts#L436-L447
   */
  checkRootFilesUpdate() {
    if (!this.shouldCheckRootFiles || (this.shouldCheckRootFiles = !1, !this.getCommandLineFn))
      return;
    let newCommandLine = this.getCommandLineFn();
    arrayItemsEqual(newCommandLine.fileNames, this.commandLine.fileNames) || (this.commandLine.fileNames = newCommandLine.fileNames, this.projectVersion++);
  }
  hasSourceFile(fileName) {
    return !!this.ls.getProgram()?.getSourceFile(fileName);
  }
  /**
   * Get all non-node_modules source file paths from the TS program. Used by ComponentMetaManager to
   * watch directories for file changes.
   */
  getSourceFilePaths() {
    let program = this.ls.getProgram();
    return program ? program.getSourceFiles().map((sf) => sf.fileName.replace(/\\/g, "/")).filter((f) => !f.includes("node_modules")) : [];
  }
  /**
   * Adapted from:
   * https://github.com/volarjs/volar.js/blob/882cd56d46a13d272f34e451f495d3d62251969a/packages/kit/lib/createChecker.ts#L409-L432
   *
   * Created events only set shouldCheckRootFiles (version bump happens in checkRootFilesUpdate if
   * the file list actually changed). Deleted/created break early since they trigger a full config
   * reparse — processing remaining changes is unnecessary.
   */
  onFilesChanged(changes) {
    for (let { filePath } of changes)
      this.fsFileSnapshots.delete(filePath);
    let oldVersion = this.projectVersion, program = this.ls.getProgram();
    for (let { filePath, type } of changes)
      if (type === "changed")
        program?.getSourceFile(filePath) && this.projectVersion++;
      else if (type === "deleted") {
        program?.getSourceFile(filePath) && this.projectVersion++, this.shouldCheckRootFiles = !0;
        break;
      } else if (type === "created") {
        this.shouldCheckRootFiles = !0;
        break;
      }
    this.projectVersion !== oldVersion && this.entries.length > 0 && (clearTimeout(this.warmupTimer), this.warmupTimer = setTimeout(() => {
      try {
        this.extractPropsFromStories(this.entries);
      } catch {
      }
    }, 100), this.warmupTimer?.unref?.());
  }
  // ---------------------------------------------------------------------------
  // Primary extraction method — probe-free
  // ---------------------------------------------------------------------------
  extractPropsFromStories(entries) {
    this.entries = entries;
    let allFiles = entries.flatMap(
      (entry) => entry.component?.path ? [entry.storyPath, entry.component.path] : [entry.storyPath]
    );
    this.ensureFiles(allFiles), this.ensureFresh(allFiles);
    let program = this.ls.getProgram();
    if (!program)
      return;
    let checker = program.getTypeChecker(), serializationContextByComponentPath = /* @__PURE__ */ new Map();
    for (let entry of entries)
      try {
        let storySourceFile = program.getSourceFile(entry.storyPath), entryComponent = entry.component, componentPath = entryComponent?.path, exportName = entryComponent?.importName;
        if (!storySourceFile || !componentPath || !exportName || !entryComponent)
          continue;
        let importId = entryComponent.importId, isPackageImport = importId && !importId.startsWith("."), componentSourceFile;
        if (isPackageImport) {
          let resolved = this.typescript.resolveModuleName(
            importId,
            entry.storyPath,
            this.commandLine.options,
            this.typescript.sys
          );
          componentSourceFile = resolved.resolvedModule ? program.getSourceFile(resolved.resolvedModule.resolvedFileName) : program.getSourceFile(componentPath);
        } else
          componentSourceFile = program.getSourceFile(componentPath);
        if (!componentSourceFile)
          continue;
        let resolvedComponent;
        if (importId && (resolvedComponent = resolvePropsFromStoryFile(
          this.typescript,
          checker,
          storySourceFile,
          entryComponent
        )), resolvedComponent || (resolvedComponent = this.resolveFromMetaComponent(
          checker,
          storySourceFile,
          entryComponent
        )), !resolvedComponent)
          continue;
        let serializationContext = serializationContextByComponentPath.get(componentPath);
        if (serializationContext === void 0) {
          let resolvedFileName = componentSourceFile.fileName;
          serializationContext = {
            sourceFile: componentSourceFile,
            defaultsSourcePath: resolvedFileName.endsWith(".d.ts") || resolvedFileName.endsWith(".d.mts") || resolvedFileName.endsWith(".d.cts") ? componentPath : void 0
          }, serializationContextByComponentPath.set(componentPath, serializationContext);
        }
        let doc = serializeComponentDoc(this.typescript, checker, {
          sourceFile: serializationContext.sourceFile,
          resolvedComponent,
          defaultsSourcePath: serializationContext.defaultsSourcePath
        });
        doc && (entryComponent.reactComponentMeta = doc, entryComponent.componentJsDocTags = doc.jsDocTags, entryComponent.importOverride = entryComponent.componentJsDocTags?.import?.[0]?.trim());
      } catch {
        continue;
      }
  }
  /**
   * Check mtime for specific files and bump projectVersion if any changed.
   *
   * This bypasses the sync() gate in createLanguageServiceHost — sync() only runs when
   * projectVersion changes, so mtime-based cache alone can't detect stale files. We do a targeted
   * mtime check for the files we're about to extract from, ensuring freshness even when the
   * fs.watch event hasn't arrived yet (race with HMR) or was missed entirely.
   */
  ensureFresh(fileNames) {
    let stale = !1;
    for (let fileName of fileNames) {
      let cache = this.fsFileSnapshots.get(fileName);
      if (!cache)
        continue;
      let currentMtime = this.typescript.sys.getModifiedTime?.(fileName)?.valueOf();
      cache[0] !== currentMtime && (this.fsFileSnapshots.delete(fileName), stale = !0);
    }
    stale && this.projectVersion++;
  }
  // ---------------------------------------------------------------------------
  // Internal helpers
  // ---------------------------------------------------------------------------
  /**
   * Path 2 fallback: resolve the component type from the story file's `meta.component` property.
   * Only works when the user explicitly set `component:` in the meta — no node means no
   * extraction.
   */
  resolveFromMetaComponent(checker, storySourceFile, componentRef) {
    let { member: memberAccess } = componentRef, moduleSymbol = checker.getSymbolAtLocation(storySourceFile);
    if (!moduleSymbol)
      return;
    let defaultExport = checker.getExportsOfModule(moduleSymbol).find((e) => e.getName() === "default");
    if (!defaultExport)
      return;
    let componentProp = checker.getTypeOfSymbol(defaultExport).getProperty("component");
    if (!componentProp)
      return;
    let componentType = checker.getTypeOfSymbol(componentProp), selectedSymbol = componentProp.valueDeclaration && this.typescript.isPropertyAssignment(componentProp.valueDeclaration) ? checker.getSymbolAtLocation(componentProp.valueDeclaration.initializer) : componentType.getSymbol?.();
    if (memberAccess) {
      let prop = componentType.getProperty(memberAccess);
      if (prop)
        componentType = checker.getTypeOfSymbol(prop), selectedSymbol = prop;
      else
        return;
    }
    let propsType = resolvePropsFromComponentType(this.typescript, checker, componentType);
    if (!(!propsType || !selectedSymbol))
      return {
        componentRef,
        propsType,
        symbol: selectedSymbol
      };
  }
};
function arrayItemsEqual(a, b) {
  if (a.length !== b.length)
    return !1;
  let set = new Set(a);
  for (let file of b)
    if (!set.has(file))
      return !1;
  return !0;
}

// src/componentManifest/componentMeta/ComponentMetaManager.ts
var rootTsConfigNames = ["tsconfig.json", "jsconfig.json"], DEFAULT_INFERRED_OPTIONS = {
  strict: !0,
  esModuleInterop: !0,
  allowJs: !0,
  skipLibCheck: !0
}, ComponentMetaManager = class {
  constructor(typescript) {
    this.typescript = typescript;
    // Adapted from:
    // https://github.com/volarjs/volar.js/blob/882cd56d46a13d272f34e451f495d3d62251969a/packages/language-server/lib/project/typescriptProject.ts#L34-L37
    this.configProjects = /* @__PURE__ */ new Map();
    this.rootTsConfigs = /* @__PURE__ */ new Set();
    this.searchedDirs = /* @__PURE__ */ new Set();
    // Our own file watching layer
    this.watching = !1;
    this.watchersByDir = /* @__PURE__ */ new Map();
    this.pendingEvents = /* @__PURE__ */ new Map();
    // Adapted from:
    // https://github.com/volarjs/volar.js/blob/882cd56d46a13d272f34e451f495d3d62251969a/packages/kit/lib/createChecker.ts#L83
    this.fsFileSnapshots = /* @__PURE__ */ new Map();
  }
  // ---------------------------------------------------------------------------
  // Adapted from:
  // https://github.com/volarjs/volar.js/blob/882cd56d46a13d272f34e451f495d3d62251969a/packages/language-server/lib/project/typescriptProject.ts#L70-L79
  // ---------------------------------------------------------------------------
  getProjectForFile(fileName) {
    let tsconfig = this.findMatchTSConfig(fileName);
    return tsconfig ? this.getOrCreateConfiguredProject(tsconfig) ?? this.getOrCreateInferredProject(fileName) : this.getOrCreateInferredProject(fileName);
  }
  /**
   * Batch-extract component props across all entries, grouping by tsconfig project so each project
   * builds its TS program only once.
   */
  batchExtract(entries) {
    let extractableEntries = entries.filter(
      (storyRef) => storyRef.component?.path && storyRef.component.importName
    ), byProject = groupByToMap(
      extractableEntries,
      (storyRef) => this.getProjectForFile(storyRef.storyPath)
    );
    for (let [project, projectEntries] of byProject)
      try {
        project.extractPropsFromStories(projectEntries);
      } catch (err) {
        logger5.debug(`[reactComponentMeta] Batch extraction failed: ${err}`);
      }
  }
  // ---------------------------------------------------------------------------
  // Adapted from:
  // https://github.com/volarjs/volar.js/blob/882cd56d46a13d272f34e451f495d3d62251969a/packages/language-server/lib/project/typescriptProject.ts#L101-L234
  // ---------------------------------------------------------------------------
  findMatchTSConfig(filePath) {
    let fileName = filePath.replace(/\\/g, "/"), dir = path3.dirname(fileName);
    for (; !this.searchedDirs.has(dir); ) {
      this.searchedDirs.add(dir);
      for (let tsConfigName of rootTsConfigNames) {
        let tsconfigPath = path3.join(dir, tsConfigName).replace(/\\/g, "/");
        this.typescript.sys.fileExists(tsconfigPath) && this.rootTsConfigs.add(tsconfigPath);
      }
      let parent = path3.dirname(dir);
      if (parent === dir)
        break;
      dir = parent;
    }
    if (this.rootTsConfigs.size === 0)
      return null;
    let prepareClosestRootCommandLine = () => {
      let matches = [];
      for (let rootTsConfig of this.rootTsConfigs)
        isFileInDir(fileName, path3.dirname(rootTsConfig)) && matches.push(rootTsConfig);
      matches = matches.sort((a, b) => sortTSConfigs(fileName, a, b)), matches.length && getCommandLine(matches[0]);
    }, findIndirectReferenceTsconfig = () => findTSConfig((tsconfig) => !!this.configProjects.get(tsconfig)?.hasSourceFile(fileName)), findDirectIncludeTsconfig = () => findTSConfig((tsconfig) => {
      let commandLine = getCommandLine(tsconfig);
      return new Set(commandLine?.fileNames ?? []).has(fileName);
    }), findTSConfig = (match) => {
      let checked = /* @__PURE__ */ new Set();
      for (let rootTsConfig of [...this.rootTsConfigs].sort(
        (a, b) => sortTSConfigs(fileName, a, b)
      )) {
        let project = this.configProjects.get(rootTsConfig);
        if (project) {
          let chains = getReferencesChains(project.getCommandLine(), rootTsConfig, []);
          chains = chains.reverse();
          for (let chain of chains)
            for (let i2 = chain.length - 1; i2 >= 0; i2--) {
              let tsconfig = chain[i2];
              if (!checked.has(tsconfig) && (checked.add(tsconfig), match(tsconfig)))
                return tsconfig;
            }
        }
      }
      return null;
    }, getReferencesChains = (commandLine, tsConfig, before) => {
      if (commandLine.projectReferences?.length) {
        let newChains = [];
        for (let projectReference of commandLine.projectReferences) {
          let tsConfigPath = projectReference.path.replace(/\\/g, "/");
          if (this.typescript.sys.directoryExists(tsConfigPath)) {
            let newTsConfigPath = path3.join(tsConfigPath, "tsconfig.json"), newJsConfigPath = path3.join(tsConfigPath, "jsconfig.json");
            this.typescript.sys.fileExists(newTsConfigPath) ? tsConfigPath = newTsConfigPath : this.typescript.sys.fileExists(newJsConfigPath) && (tsConfigPath = newJsConfigPath);
          }
          let beforeIndex = before.indexOf(tsConfigPath);
          if (beforeIndex >= 0)
            newChains.push(before.slice(0, Math.max(beforeIndex, 1)));
          else {
            let referenceCommandLine = getCommandLine(tsConfigPath);
            if (referenceCommandLine)
              for (let chain of getReferencesChains(referenceCommandLine, tsConfigPath, [
                ...before,
                tsConfig
              ]))
                newChains.push(chain);
          }
        }
        return newChains;
      } else
        return [[...before, tsConfig]];
    }, getCommandLine = (tsConfig) => this.getOrCreateConfiguredProject(tsConfig)?.getCommandLine();
    return prepareClosestRootCommandLine(), findDirectIncludeTsconfig() ?? findIndirectReferenceTsconfig();
  }
  // ---------------------------------------------------------------------------
  // Adapted from:
  // https://github.com/volarjs/volar.js/blob/882cd56d46a13d272f34e451f495d3d62251969a/packages/language-server/lib/project/typescriptProject.ts#L236-L256
  // ---------------------------------------------------------------------------
  getOrCreateConfiguredProject(tsconfig) {
    tsconfig = tsconfig.replace(/\\/g, "/");
    let project = this.configProjects.get(tsconfig);
    if (!project)
      try {
        let getCommandLine = () => this.parseConfigWorker(tsconfig);
        project = new ComponentMetaProject(
          this.typescript,
          getCommandLine(),
          tsconfig,
          this.fsFileSnapshots,
          getCommandLine
        ), this.configProjects.set(tsconfig, project), this.watching && (this.watchDirectory(path3.dirname(tsconfig)), this.watchProgramSourceDirs(project));
      } catch (err) {
        return logger5.debug(`[reactComponentMeta] Failed to parse tsconfig ${tsconfig}: ${err}`), null;
      }
    return project;
  }
  // ---------------------------------------------------------------------------
  // Adapted from:
  // https://github.com/volarjs/volar.js/blob/882cd56d46a13d272f34e451f495d3d62251969a/packages/language-server/lib/project/typescriptProject.ts#L258-L284
  // ---------------------------------------------------------------------------
  getOrCreateInferredProject(fileName) {
    return this.inferredProject || (this.inferredProject = new ComponentMetaProject(
      this.typescript,
      {
        options: {
          ...DEFAULT_INFERRED_OPTIONS,
          target: this.typescript.ScriptTarget.Latest,
          module: this.typescript.ModuleKind.ESNext,
          moduleResolution: this.typescript.ModuleResolutionKind.Bundler,
          jsx: this.typescript.JsxEmit.ReactJSX
        },
        fileNames: [],
        errors: []
      },
      void 0,
      this.fsFileSnapshots
    )), this.inferredProject.ensureFiles([fileName]), this.inferredProject;
  }
  // ---------------------------------------------------------------------------
  // Adapted from:
  // https://github.com/volarjs/volar.js/blob/882cd56d46a13d272f34e451f495d3d62251969a/packages/language-server/lib/project/typescriptProjectLs.ts#L262-L353
  // ---------------------------------------------------------------------------
  parseConfigWorker(tsconfig) {
    let config = this.typescript.readJsonConfigFile(tsconfig, this.typescript.sys.readFile), content = this.typescript.parseJsonSourceFileConfigFileContent(
      config,
      this.typescript.sys,
      path3.dirname(tsconfig),
      {},
      tsconfig
    );
    return content.options.outDir = void 0, content.fileNames = content.fileNames.map((fileName) => fileName.replace(/\\/g, "/")), content;
  }
  // ---------------------------------------------------------------------------
  // File events
  // ---------------------------------------------------------------------------
  /**
   * Broadcast file changes to all projects. Each project selectively bumps projectVersion.
   *
   * Adapted from:
   * https://github.com/volarjs/volar.js/blob/882cd56d46a13d272f34e451f495d3d62251969a/packages/kit/lib/createChecker.ts#L409-L432
   */
  onFilesChanged(changes) {
    for (let project of this.configProjects.values())
      project.onFilesChanged(changes);
    this.inferredProject?.onFilesChanged(changes);
  }
  /**
   * Adapted from:
   * https://github.com/volarjs/volar.js/blob/882cd56d46a13d272f34e451f495d3d62251969a/packages/language-server/lib/project/typescriptProject.ts#L43-L68
   */
  onConfigChanged(configPath, type) {
    if (configPath = configPath.replace(/\\/g, "/"), type === "created")
      this.rootTsConfigs.add(configPath);
    else if ((type === "changed" || type === "deleted") && this.configProjects.has(configPath)) {
      type === "deleted" && this.rootTsConfigs.delete(configPath);
      let project = this.configProjects.get(configPath);
      this.configProjects.delete(configPath), project?.dispose();
    }
    this.searchedDirs.clear();
  }
  // ---------------------------------------------------------------------------
  // Our own file watching layer (no Volar equivalent — we're standalone)
  // ---------------------------------------------------------------------------
  startWatching() {
    if (!this.watching) {
      this.watching = !0;
      for (let tsconfig of this.configProjects.keys())
        this.watchDirectory(path3.dirname(tsconfig));
      this.watchProgramSourceDirs();
    }
  }
  /**
   * Watch directories that contain source files from all TS programs. This covers monorepo setups
   * where stories import components via path aliases (e.g. apps/storybook/ imports from
   * packages/ui/ via tsconfig paths).
   */
  watchProgramSourceDirs(singleProject) {
    let dirs = /* @__PURE__ */ new Set();
    if (singleProject)
      for (let filePath of singleProject.getSourceFilePaths())
        dirs.add(path3.dirname(filePath));
    else {
      for (let project of this.configProjects.values())
        for (let filePath of project.getSourceFilePaths())
          dirs.add(path3.dirname(filePath));
      if (this.inferredProject)
        for (let filePath of this.inferredProject.getSourceFilePaths())
          dirs.add(path3.dirname(filePath));
    }
    let roots = /* @__PURE__ */ new Set();
    for (let dir of dirs) {
      let candidate = dir;
      for (; candidate !== path3.dirname(candidate); ) {
        let normalized = candidate.replace(/\\/g, "/"), alreadyWatched = !1;
        for (let watched of this.watchersByDir.keys())
          if (normalized === watched || normalized.startsWith(watched + "/")) {
            alreadyWatched = !0;
            break;
          }
        if (alreadyWatched)
          break;
        if (this.typescript.sys.fileExists(path3.join(candidate, "package.json")) || this.typescript.sys.fileExists(path3.join(candidate, "tsconfig.json"))) {
          roots.add(candidate);
          break;
        }
        candidate = path3.dirname(candidate);
      }
    }
    for (let root of roots)
      this.watchDirectory(root);
  }
  watchDirectory(dir) {
    if (!this.watching)
      return;
    let normalized = dir.replace(/\\/g, "/");
    for (let watched of this.watchersByDir.keys())
      if (normalized === watched || normalized.startsWith(watched + "/"))
        return;
    for (let [watched, watcher] of this.watchersByDir)
      watched.startsWith(normalized + "/") && (watcher.close(), this.watchersByDir.delete(watched));
    try {
      let watcher = watch(dir, { recursive: !0 }, (eventType, filename) => {
        if (!filename)
          return;
        let filePath = path3.resolve(dir, filename).replace(/\\/g, "/");
        if (filePath.includes("/node_modules/") || filePath.includes("/.git/"))
          return;
        let existing = this.pendingEvents.get(filePath);
        existing && clearTimeout(existing), this.pendingEvents.set(
          filePath,
          setTimeout(() => {
            this.pendingEvents.delete(filePath), eventType === "rename" ? existsSync3(filePath) ? this.handleFileEvent(filePath, "created") : this.handleFileEvent(filePath, "deleted") : this.handleFileEvent(filePath, "changed");
          }, 50)
        );
      });
      watcher.unref(), this.watchersByDir.set(normalized, watcher);
    } catch (err) {
      logger5.debug(`[reactComponentMeta] Failed to watch directory ${normalized}: ${err}`);
    }
  }
  stopWatching() {
    for (let timeout of this.pendingEvents.values())
      clearTimeout(timeout);
    this.pendingEvents.clear();
    for (let watcher of this.watchersByDir.values())
      watcher.close();
    this.watchersByDir.clear(), this.watching = !1;
  }
  /**
   * Map raw fs.watch events to LSP-style FileChangeType before broadcasting.
   *
   * Fs.watch reports atomic saves (sed -i, editors) as `rename` → we classify as `created` (file
   * exists after rename). But an IDE/LSP would report an atomic save of an _existing_ file as
   * `Changed`, not `Created`.
   *
   * We reclassify here so that onFilesChanged stays 1:1 with Volar Kit.
   */
  handleFileEvent(filePath, type) {
    if (type === "created") {
      for (let project of this.configProjects.values())
        if (project.hasSourceFile(filePath)) {
          type = "changed";
          break;
        }
      type === "created" && this.inferredProject?.hasSourceFile(filePath) && (type = "changed");
    }
    let basename3 = path3.basename(filePath);
    if (rootTsConfigNames.includes(basename3)) {
      this.onConfigChanged(filePath, type);
      return;
    }
    this.onFilesChanged([{ filePath, type }]);
  }
  dispose() {
    this.stopWatching();
    for (let project of this.configProjects.values())
      project.dispose();
    this.inferredProject?.dispose(), this.configProjects.clear(), this.inferredProject = void 0, this.fsFileSnapshots.clear(), this.searchedDirs.clear(), this.rootTsConfigs.clear();
  }
};
function sortTSConfigs(file, a, b) {
  let inA = isFileInDir(file, path3.dirname(a)), inB = isFileInDir(file, path3.dirname(b));
  if (inA !== inB)
    return (inB ? 1 : 0) - (inA ? 1 : 0);
  let aLength = a.split("/").length, bLength = b.split("/").length;
  if (aLength === bLength) {
    let aWeight = path3.basename(a) === "tsconfig.json" ? 1 : 0;
    return (path3.basename(b) === "tsconfig.json" ? 1 : 0) - aWeight;
  }
  return bLength - aLength;
}
function isFileInDir(fileName, dir) {
  let relative3 = path3.relative(dir, fileName);
  return !!relative3 && !relative3.startsWith("..") && !path3.isAbsolute(relative3);
}

// src/componentManifest/generateCodeSnippet.ts
import { types as t2 } from "storybook/internal/babel";
function getCodeSnippet(csf, storyName, componentName) {
  let storyDeclaration = csf._storyDeclarationPath[storyName], metaObj = csf._metaNode;
  if (!storyDeclaration) {
    let message = "Expected story to be a function or variable declaration";
    throw csf._storyPaths[storyName]?.buildCodeFrameError(message) ?? message;
  }
  let storyPath;
  if (storyDeclaration.isFunctionDeclaration())
    storyPath = storyDeclaration;
  else if (storyDeclaration.isVariableDeclarator()) {
    let init = storyDeclaration.get("init");
    invariant(
      init.isExpression(),
      () => storyDeclaration.buildCodeFrameError("Expected story initializer to be an expression").message
    ), storyPath = init;
  } else
    throw storyDeclaration.buildCodeFrameError(
      "Expected story to be a function or variable declaration"
    );
  let normalizedPath = storyPath;
  if (storyPath.isCallExpression()) {
    let callee = storyPath.get("callee");
    if (callee.isMemberExpression()) {
      let obj = callee.get("object"), prop = callee.get("property"), isBind = prop.isIdentifier() && prop.node.name === "bind" || t2.isStringLiteral(prop.node) && prop.node.value === "bind";
      if (obj.isIdentifier() && isBind) {
        let resolved = resolveIdentifierInit(storyDeclaration, obj);
        resolved && (normalizedPath = resolved);
      }
    }
    if (storyPath === normalizedPath) {
      let args = storyPath.get("arguments");
      if (args.length !== 0) {
        invariant(
          args.length === 1,
          () => storyPath.buildCodeFrameError("Could not evaluate story expression").message
        );
        let storyArg = args[0];
        invariant(
          storyArg.isExpression(),
          () => storyPath.buildCodeFrameError("Could not evaluate story expression").message
        ), normalizedPath = storyArg;
      }
    }
  }
  normalizedPath = normalizedPath.isTSSatisfiesExpression() || normalizedPath.isTSAsExpression() ? normalizedPath.get("expression") : normalizedPath;
  let storyFn;
  if (normalizedPath.isArrowFunctionExpression() || normalizedPath.isFunctionExpression() || normalizedPath.isFunctionDeclaration())
    storyFn = normalizedPath;
  else if (!normalizedPath.isObjectExpression() && !(normalizedPath.isCallExpression() && Array.isArray(normalizedPath.node.arguments) && normalizedPath.node.arguments.length === 0))
    throw normalizedPath.buildCodeFrameError(
      "Expected story to be csf factory, function or an object expression"
    );
  let storyProps = normalizedPath.isObjectExpression() ? normalizedPath.get("properties").filter((p) => p.isObjectProperty()) : [], metaPath = pathForNode(csf._file.path, metaObj), metaProps = metaPath?.isObjectExpression() ? metaPath.get("properties").filter((p) => p.isObjectProperty()) : [], getRenderPath = (object) => {
    let renderPath = object.find((p) => keyOf(p.node) === "render")?.get("value");
    if (!renderPath)
      return { kind: "missing" };
    if (renderPath.isIdentifier()) {
      let resolved = resolveIdentifierInit(storyDeclaration, renderPath);
      return resolved && (resolved.isArrowFunctionExpression() || resolved.isFunctionExpression() || resolved.isFunctionDeclaration()) ? { kind: "resolved", path: resolved } : { kind: "unresolved" };
    }
    if (!(renderPath.isArrowFunctionExpression() || renderPath.isFunctionExpression()))
      throw renderPath.buildCodeFrameError(
        "Expected render to be an arrow function or function expression"
      );
    return { kind: "resolved", path: renderPath };
  }, metaRender = getRenderPath(metaProps), storyRender = getRenderPath(storyProps);
  storyFn || (storyFn = storyRender.kind === "resolved" ? storyRender.path : storyRender.kind === "missing" && metaRender.kind === "resolved" ? metaRender.path : void 0);
  let metaArgs = metaArgsRecord(metaObj ?? null), storyArgsPath = storyProps.filter((p) => keyOf(p.node) === "args").map((p) => p.get("value")).find((v) => v.isObjectExpression()), storyArgs = argsRecordFromObjectPath(storyArgsPath), storyAssignedArgsPath = storyArgsAssignmentPath(csf._file.path, storyName), storyAssignedArgs = argsRecordFromObjectPath(storyAssignedArgsPath), merged = { ...metaArgs, ...storyArgs, ...storyAssignedArgs }, entries = Object.entries(merged).filter(([k]) => k !== "children"), validEntries = entries.filter(([k, v]) => isValidJsxAttrName(k) && v != null), invalidEntries = entries.filter(([k, v]) => !isValidJsxAttrName(k) && v != null), injectedAttrs = validEntries.map(([k, v]) => toAttr(k, v)).filter((a) => a != null);
  if (storyFn) {
    let fn = storyFn.node;
    if (t2.isArrowFunctionExpression(fn) && (t2.isJSXElement(fn.body) || t2.isJSXFragment(fn.body))) {
      let spreadRes = transformArgsSpreadsInJsx(fn.body, merged), inlineRes = inlineArgsInJsx(spreadRes.node, merged);
      if (spreadRes.changed || inlineRes.changed) {
        let newFn = t2.arrowFunctionExpression([], inlineRes.node, fn.async);
        return t2.variableDeclaration("const", [
          t2.variableDeclarator(t2.identifier(storyName), newFn)
        ]);
      }
    }
    let stmts = t2.isFunctionDeclaration(fn) || t2.isArrowFunctionExpression(fn) && t2.isBlockStatement(fn.body) || t2.isFunctionExpression(fn) && t2.isBlockStatement(fn.body) ? fn.body.body : void 0;
    if (stmts) {
      let changed = !1, newBody = stmts.map((stmt) => {
        if (t2.isReturnStatement(stmt) && stmt.argument && (t2.isJSXElement(stmt.argument) || t2.isJSXFragment(stmt.argument))) {
          let spreadRes = transformArgsSpreadsInJsx(stmt.argument, merged), inlineRes = inlineArgsInJsx(spreadRes.node, merged);
          if (spreadRes.changed || inlineRes.changed)
            return changed = !0, t2.returnStatement(inlineRes.node);
        }
        return stmt;
      });
      if (changed)
        return t2.isFunctionDeclaration(fn) ? t2.functionDeclaration(
          t2.identifier(storyName),
          [],
          t2.blockStatement(newBody),
          fn.generator,
          fn.async
        ) : t2.variableDeclaration("const", [
          t2.variableDeclarator(
            t2.identifier(storyName),
            t2.arrowFunctionExpression([], t2.blockStatement(newBody), fn.async)
          )
        ]);
    }
    return t2.isFunctionDeclaration(fn) ? t2.functionDeclaration(t2.identifier(storyName), fn.params, fn.body, fn.generator, fn.async) : t2.variableDeclaration("const", [t2.variableDeclarator(t2.identifier(storyName), fn)]);
  }
  invariant(componentName, "Could not generate snippet without component name.");
  let invalidSpread = buildInvalidSpread(invalidEntries), name = t2.jsxIdentifier(componentName), openingElAttrs = invalidSpread ? [...injectedAttrs, invalidSpread] : injectedAttrs, children = toJsxChildren(merged.children), selfClosing = children.length === 0, arrow = t2.arrowFunctionExpression(
    [],
    t2.jsxElement(
      t2.jsxOpeningElement(name, openingElAttrs, selfClosing),
      selfClosing ? null : t2.jsxClosingElement(name),
      children,
      selfClosing
    )
  );
  return t2.variableDeclaration("const", [t2.variableDeclarator(t2.identifier(storyName), arrow)]);
}
function buildInvalidSpread(entries) {
  if (entries.length === 0)
    return null;
  let objectProps = entries.map(
    ([k, v]) => t2.objectProperty(t2.stringLiteral(k), t2.isExpression(v) ? v : t2.identifier("undefined"))
  );
  return t2.jsxSpreadAttribute(t2.objectExpression(objectProps));
}
var keyOf = (p) => t2.isIdentifier(p.key) ? p.key.name : t2.isStringLiteral(p.key) ? p.key.value : null, isValidJsxAttrName = (n) => /^[A-Za-z_][A-Za-z0-9_:-]*$/.test(n), argsRecordFromObjectPath = (objPath) => objPath ? Object.fromEntries(
  objPath.get("properties").filter((p) => p.isObjectProperty()).map((p) => [keyOf(p.node), p.get("value").node]).filter((e) => !!e[0])
) : {};
function storyArgsAssignmentPath(program, storyName) {
  let found = null;
  return program.traverse({
    AssignmentExpression(p) {
      let left = p.get("left"), right = p.get("right");
      if (left.isMemberExpression()) {
        let obj = left.get("object"), prop = left.get("property"), isStoryIdent = obj.isIdentifier() && obj.node.name === storyName, isArgsProp = prop.isIdentifier() && prop.node.name === "args" && !left.node.computed || t2.isStringLiteral(prop.node) && left.node.computed && prop.node.value === "args";
        isStoryIdent && isArgsProp && right.isObjectExpression() && (found = right);
      }
    }
  }), found;
}
var argsRecordFromObjectNode = (obj) => obj ? Object.fromEntries(
  obj.properties.filter((p) => t2.isObjectProperty(p)).map((p) => [keyOf(p), p.value]).filter((e) => !!e[0])
) : {}, metaArgsRecord = (meta) => {
  if (!meta)
    return {};
  let argsProp = meta.properties.find(
    (p) => t2.isObjectProperty(p) && keyOf(p) === "args"
  );
  return argsProp && t2.isObjectExpression(argsProp.value) ? argsRecordFromObjectNode(argsProp.value) : {};
}, toAttr = (key, value) => t2.isBooleanLiteral(value) ? value.value ? t2.jsxAttribute(t2.jsxIdentifier(key), null) : t2.jsxAttribute(t2.jsxIdentifier(key), t2.jsxExpressionContainer(value)) : t2.isStringLiteral(value) ? t2.jsxAttribute(t2.jsxIdentifier(key), t2.stringLiteral(value.value)) : t2.isExpression(value) ? t2.jsxAttribute(t2.jsxIdentifier(key), t2.jsxExpressionContainer(value)) : null, toJsxChildren = (node) => node ? t2.isStringLiteral(node) ? [t2.jsxText(node.value)] : t2.isJSXElement(node) || t2.isJSXFragment(node) ? [node] : t2.isExpression(node) ? [t2.jsxExpressionContainer(node)] : [] : [];
function getArgsMemberKey(expr) {
  if (t2.isMemberExpression(expr) && t2.isIdentifier(expr.object) && expr.object.name === "args") {
    if (t2.isIdentifier(expr.property) && !expr.computed)
      return expr.property.name;
    if (t2.isStringLiteral(expr.property) && expr.computed)
      return expr.property.value;
  }
  if (t2.isOptionalMemberExpression?.(expr) && t2.isIdentifier(expr.object) && expr.object.name === "args") {
    let prop = expr.property;
    if (t2.isIdentifier(prop) && !expr.computed)
      return prop.name;
    if (t2.isStringLiteral(prop) && expr.computed)
      return prop.value;
  }
  return null;
}
function inlineArgsInJsx(node, merged) {
  let changed = !1;
  if (t2.isJSXElement(node)) {
    let opening = node.openingElement, newAttrs = opening.attributes.flatMap((a) => {
      if (!t2.isJSXAttribute(a))
        return [a];
      let name = t2.isJSXIdentifier(a.name) ? a.name.name : null;
      if (!(name && a.value && t2.isJSXExpressionContainer(a.value)))
        return [a];
      let key = getArgsMemberKey(a.value.expression);
      if (!(key && key in merged))
        return [a];
      let repl = toAttr(name, merged[key]);
      return changed = !0, repl ? [repl] : [];
    }), newChildren = node.children.flatMap((c) => {
      if (t2.isJSXElement(c) || t2.isJSXFragment(c)) {
        let res = inlineArgsInJsx(c, merged);
        return changed ||= res.changed, [res.node];
      }
      return t2.isJSXExpressionContainer(c) && getArgsMemberKey(c.expression) === "children" && merged.children ? (changed = !0, toJsxChildren(merged.children)) : [c];
    }), selfClosing = opening.selfClosing && newChildren.length === 0;
    return {
      node: t2.jsxElement(
        t2.jsxOpeningElement(opening.name, newAttrs, selfClosing),
        selfClosing ? null : node.closingElement ?? t2.jsxClosingElement(opening.name),
        newChildren,
        selfClosing
      ),
      changed
    };
  }
  let fragChildren = node.children.flatMap((c) => {
    if (t2.isJSXElement(c) || t2.isJSXFragment(c)) {
      let res = inlineArgsInJsx(c, merged);
      return changed ||= res.changed, [res.node];
    }
    return t2.isJSXExpressionContainer(c) && getArgsMemberKey(c.expression) === "children" && "children" in merged ? (changed = !0, toJsxChildren(merged.children)) : [c];
  });
  return { node: t2.jsxFragment(node.openingFragment, node.closingFragment, fragChildren), changed };
}
function transformArgsSpreadsInJsx(node, merged) {
  let changed = !1, makeInjectedPieces = (existing) => {
    let entries = Object.entries(merged).filter(([k, v]) => v != null && k !== "children"), validEntries = entries.filter(([k]) => isValidJsxAttrName(k)), invalidEntries = entries.filter(([k]) => !isValidJsxAttrName(k)), injectedAttrs = validEntries.map(([k, v]) => toAttr(k, v)).filter((a) => !!a).filter((a) => t2.isJSXIdentifier(a.name) && !existing.has(a.name.name)), invalidSpread = buildInvalidSpread(invalidEntries.filter(([k]) => !existing.has(k)));
    return invalidSpread ? [...injectedAttrs, invalidSpread] : injectedAttrs;
  };
  if (t2.isJSXElement(node)) {
    let opening = node.openingElement, attrs = opening.attributes, isArgsSpread = (a) => t2.isJSXSpreadAttribute(a) && t2.isIdentifier(a.argument) && a.argument.name === "args", sawArgsSpread = attrs.some(isArgsSpread), firstIdx = attrs.findIndex(isArgsSpread), nonArgsAttrs = attrs.filter((a) => !isArgsSpread(a)), insertionIndex = sawArgsSpread ? attrs.slice(0, firstIdx).filter((a) => !isArgsSpread(a)).length : 0, newAttrs = sawArgsSpread ? (() => {
      let existing = new Set(
        nonArgsAttrs.filter((a) => t2.isJSXAttribute(a)).flatMap((a) => t2.isJSXIdentifier(a.name) ? [a.name.name] : [])
      ), pieces = makeInjectedPieces(existing);
      return changed = !0, [
        ...nonArgsAttrs.slice(0, insertionIndex),
        ...pieces,
        ...nonArgsAttrs.slice(insertionIndex)
      ];
    })() : nonArgsAttrs, newChildren = node.children.flatMap((c) => {
      if (t2.isJSXElement(c) || t2.isJSXFragment(c)) {
        let res = transformArgsSpreadsInJsx(c, merged);
        return changed ||= res.changed, [res.node];
      }
      return [c];
    }), children = sawArgsSpread && newChildren.length === 0 && merged.children ? (changed = !0, toJsxChildren(merged.children)) : newChildren, selfClosing = children.length === 0;
    return {
      node: t2.jsxElement(
        t2.jsxOpeningElement(opening.name, newAttrs, selfClosing),
        selfClosing ? null : node.closingElement ?? t2.jsxClosingElement(opening.name),
        children,
        selfClosing
      ),
      changed
    };
  }
  let fragChildren = node.children.flatMap((c) => {
    if (t2.isJSXElement(c) || t2.isJSXFragment(c)) {
      let res = transformArgsSpreadsInJsx(c, merged);
      return changed ||= res.changed, [res.node];
    }
    return [c];
  });
  return { node: t2.jsxFragment(node.openingFragment, node.closingFragment, fragChildren), changed };
}
function resolveIdentifierInit(storyPath, identifier) {
  let programPath = storyPath.findParent((p) => p.isProgram());
  if (!programPath)
    return null;
  for (let stmt of programPath.get("body")) {
    if (stmt.isFunctionDeclaration() && stmt.node.id?.name === identifier.node.name)
      return stmt;
    if (stmt.isExportNamedDeclaration()) {
      let decl = stmt.get("declaration");
      if (decl.isFunctionDeclaration() && decl.node.id?.name === identifier.node.name)
        return decl;
    }
  }
  let match = programPath.get("body").flatMap((stmt) => {
    if (stmt.isVariableDeclaration())
      return stmt.get("declarations");
    if (stmt.isExportNamedDeclaration()) {
      let decl = stmt.get("declaration");
      if (decl && decl.isVariableDeclaration())
        return decl.get("declarations");
    }
    return [];
  }).find((d) => {
    let id = d.get("id");
    return id.isIdentifier() && id.node.name === identifier.node.name;
  });
  if (!match)
    return null;
  let init = match.get("init");
  return init && init.isExpression() ? init : null;
}
function pathForNode(program, target) {
  if (!target)
    return;
  let found;
  return program.traverse({
    enter(p) {
      p.node && p.node === target && (found = p, p.stop());
    }
  }), found;
}

// src/componentManifest/getComponentImports.ts
import { dirname as dirname8 } from "node:path";
import { babelParse as babelParse2, recast, types as t3 } from "storybook/internal/babel";
import { logger as logger7 } from "storybook/internal/node-logger";

// src/componentManifest/reactDocgenTypescript.ts
import { dirname as dirname7 } from "node:path";
import { logger as logger6 } from "storybook/internal/node-logger";
var typeScriptPromise, reactDocgenTypescriptPromise, loadTypeScript = () => typeScriptPromise ??= import("typescript"), loadReactDocgenTypescript = () => reactDocgenTypescriptPromise ??= import("react-docgen-typescript"), LARGE_NON_USER_SOURCE_THRESHOLD = 30, getPropSource = (prop) => prop.parent?.fileName ?? prop.declarations?.[0]?.fileName, getLargeNonUserPropSources = (props) => {
  let countBySource = /* @__PURE__ */ new Map();
  for (let prop of Object.values(props)) {
    let source = getPropSource(prop);
    (source?.includes("node_modules") || source?.endsWith(".d.ts")) && countBySource.set(source, (countBySource.get(source) ?? 0) + 1);
  }
  let largeNonUserSources = /* @__PURE__ */ new Set();
  for (let [source, count] of countBySource)
    count > LARGE_NON_USER_SOURCE_THRESHOLD && largeNonUserSources.add(source);
  return largeNonUserSources;
};
function findDisplayNameAssignment(typescript, sourceFile, identifierName) {
  for (let statement of sourceFile.statements) {
    if (!typescript.isExpressionStatement(statement))
      continue;
    let expr = statement.expression;
    if (typescript.isBinaryExpression(expr) && expr.operatorToken.kind === typescript.SyntaxKind.EqualsToken && typescript.isPropertyAccessExpression(expr.left) && expr.left.name.text === "displayName" && typescript.isIdentifier(expr.left.expression) && expr.left.expression.text === identifierName && typescript.isStringLiteral(expr.right))
      return expr.right.text;
  }
}
function getExportNameMap(typescript, checker, sourceFile) {
  let moduleSymbol = checker.getSymbolAtLocation(sourceFile);
  if (!moduleSymbol)
    return /* @__PURE__ */ new Map();
  let result = /* @__PURE__ */ new Map(), fileName = sourceFile.fileName.replace(/.*\//, "").replace(/\.[^.]+$/, "");
  for (let exportSymbol of checker.getExportsOfModule(moduleSymbol)) {
    let resolved = exportSymbol.flags & typescript.SymbolFlags.Alias ? checker.getAliasedSymbol(exportSymbol) : exportSymbol, declaration = resolved.valueDeclaration ?? resolved.getDeclarations()?.[0];
    if (!declaration)
      continue;
    let type = checker.getTypeOfSymbolAtLocation(resolved, declaration), isStateless = type.getCallSignatures().some((sig) => {
      let params = sig.getParameters();
      return params.length === 1 || params.length > 0 && params[0].getName() === "props";
    }), isStateful = type.getConstructSignatures().some(
      (sig) => sig.getReturnType().getProperty("props") !== void 0
    );
    if (isStateless || isStateful) {
      let exportName = exportSymbol.getName(), resolvedName = resolved.getName();
      result.set(resolvedName, exportName), exportName === "default" && result.set(fileName, "default");
      let displayNameValue = findDisplayNameAssignment(typescript, sourceFile, resolvedName);
      displayNameValue && result.set(displayNameValue, exportName);
    }
  }
  return result;
}
var cachedCompilerOptions, cachedFileNames, previousProgram, parser, cachedParserOptionsKey;
function invalidateParser() {
  parser = void 0, cachedCompilerOptions = void 0, cachedFileNames = void 0, cachedParserOptionsKey = void 0;
}
async function getParser5(userOptions) {
  let [typescript, reactDocgenTypescript] = await Promise.all([
    loadTypeScript(),
    loadReactDocgenTypescript()
  ]), optionsKey = JSON.stringify(userOptions ?? {});
  if (parser && cachedParserOptionsKey !== optionsKey && (parser = void 0), !parser) {
    let configPath = findTsconfigPath(process.cwd());
    if (cachedCompilerOptions = { noErrorTruncation: !0, strict: !0 }, configPath) {
      let { config } = typescript.readConfigFile(configPath, typescript.sys.readFile), parsed = typescript.parseJsonConfigFileContent(
        config,
        typescript.sys,
        dirname7(configPath)
      );
      cachedCompilerOptions = { ...parsed.options, noErrorTruncation: !0 }, cachedFileNames = parsed.fileNames;
    } else
      logger6.warn(
        "No tsconfig.json (or tsconfig.base.json / tsconfig.app.json) found. TypeScript component props will not be documented by react-docgen-typescript. Create a tsconfig.json in your project root to enable automatic controls."
      );
    let program = typescript.createProgram(
      cachedFileNames ?? [],
      cachedCompilerOptions,
      void 0,
      previousProgram
    );
    previousProgram = program;
    let parserOptions = {
      shouldExtractLiteralValuesFromEnum: !0,
      shouldRemoveUndefinedFromOptional: !0,
      ...userOptions,
      // Always force savePropValueAsString so default values are in a consistent format
      savePropValueAsString: !0
    };
    parser = {
      program,
      fileParser: reactDocgenTypescript.withCompilerOptions(cachedCompilerOptions, parserOptions)
    }, cachedParserOptionsKey = optionsKey;
  }
  return { ...parser, typescript };
}
function matchComponentDoc(docs, {
  importName,
  localImportName,
  componentName
}) {
  if (docs.length !== 0)
    return docs.length === 1 ? docs[0] : docs.find(
      (doc) => doc.exportName === importName || doc.exportName === localImportName || doc.displayName === importName || doc.displayName === localImportName || doc.displayName === componentName
    );
}
function getReactDocgenTypescriptError(path5, {
  importName,
  localImportName,
  componentName
}, docs) {
  return docs.length === 0 ? {
    name: "react-docgen-typescript found no component docs",
    message: [
      `File: ${path5}`,
      "react-docgen-typescript did not return any component docs for this file."
    ].join(`
`)
  } : {
    name: "react-docgen-typescript could not match component docs",
    message: [
      `File: ${path5}`,
      "react-docgen-typescript returned component docs for this file, but none matched the story's component import.",
      `Looked for: componentName=${componentName}, localImportName=${localImportName ?? "<none>"}, importName=${importName ?? "<none>"}.`
    ].join(`
`)
  };
}
var parseWithReactDocgenTypescript = asyncCache(
  async (filePath, userOptions) => {
    let { program, fileParser, typescript } = await getParser5(userOptions), checker = program.getTypeChecker(), sourceFile = program.getSourceFile(filePath), docs = fileParser.parseWithProgramProvider(filePath, () => program), exportNameMap = sourceFile ? getExportNameMap(typescript, checker, sourceFile) : /* @__PURE__ */ new Map();
    return docs.map((doc) => {
      let largeNonUserSources = getLargeNonUserPropSources(doc.props);
      return {
        ...doc,
        // Use name-based lookup: displayName is the resolved symbol name, so look it up in the
        // export map to get the public export name. Falls back to displayName when not aliased.
        exportName: exportNameMap.get(doc.displayName) ?? doc.displayName,
        // Filter out bulk props from non-user sources (React built-ins, DOM, CSS-in-JS system props)
        props: Object.fromEntries(
          Object.entries(doc.props).filter(([, prop]) => {
            let source = getPropSource(prop);
            return !source || !largeNonUserSources.has(source);
          })
        )
      };
    });
  },
  { name: "parseWithReactDocgenTypescript" }
);

// src/componentManifest/getComponentImports.ts
var baseIdentifier = (component) => component.split(".")[0] ?? component, isTypeSpecifier = (s) => t3.isImportSpecifier(s) && s.importKind === "type", importedName = (im) => t3.isIdentifier(im) ? im.name : im.value, addUniqueBy = (arr, item, eq2) => {
  arr.find(eq2) || arr.push(item);
}, getComponents = async ({
  csf,
  storyFilePath,
  typescriptOptions = {},
  docgenEngine,
  additionalComponentNames = []
}) => {
  let { reactDocgenTypescriptOptions } = typescriptOptions, program = csf._file.path, componentSet = /* @__PURE__ */ new Set(), componentDepth = /* @__PURE__ */ new Map(), localToImport = /* @__PURE__ */ new Map(), jsxDepth = 0;
  program.traverse({
    JSXElement: {
      enter() {
        jsxDepth++;
      },
      exit() {
        jsxDepth--;
      }
    },
    JSXOpeningElement(p) {
      let n = p.node.name, name;
      if (t3.isJSXIdentifier(n))
        name = n.name, name && /[A-Z]/.test(name.charAt(0)) && componentSet.add(name);
      else if (t3.isJSXMemberExpression(n)) {
        let jsxNameToString = (nm) => t3.isJSXIdentifier(nm) ? nm.name : `${jsxNameToString(nm.object)}.${jsxNameToString(nm.property)}`;
        name = jsxNameToString(n), componentSet.add(name);
      }
      if (name) {
        let depth = jsxDepth - 1, existing = componentDepth.get(name);
        (existing === void 0 || depth < existing) && componentDepth.set(name, depth);
      }
    }
  });
  let metaComp = csf._meta?.component;
  metaComp && componentSet.add(metaComp);
  for (let componentName of additionalComponentNames)
    componentSet.add(componentName);
  let components = Array.from(componentSet).sort((a, b) => a.localeCompare(b)), body = program.get("body");
  for (let stmt of body) {
    if (!stmt.isImportDeclaration())
      continue;
    let decl = stmt.node;
    if (decl.importKind === "type")
      continue;
    let specifiers = decl.specifiers ?? [];
    if (specifiers.length !== 0)
      for (let s of specifiers) {
        if (!("local" in s) || !s.local || isTypeSpecifier(s))
          continue;
        let importId = decl.source.value;
        if (t3.isImportDefaultSpecifier(s))
          localToImport.set(s.local.name, { importId, importName: "default" });
        else if (t3.isImportNamespaceSpecifier(s))
          localToImport.set(s.local.name, { importId, importName: "*" });
        else if (t3.isImportSpecifier(s)) {
          let imported = importedName(s.imported);
          localToImport.set(s.local.name, { importId, importName: imported });
        }
      }
  }
  let isLocallyDefinedWithoutImport = (base2) => {
    let binding = program.scope.getBinding(base2);
    return binding ? !!!(binding.path.isImportSpecifier?.() || binding.path.isImportDefaultSpecifier?.() || binding.path.isImportNamespaceSpecifier?.()) : !1;
  }, filteredComponents = components.filter(
    (c) => !isLocallyDefinedWithoutImport(baseIdentifier(c))
  );
  return (await Promise.all(
    filteredComponents.map(async (c) => {
      let depth = componentDepth.get(c), dot = c.indexOf("."), component = dot !== -1 ? (() => {
        let ns = c.slice(0, dot), mem = c.slice(dot + 1), direct = localToImport.get(ns);
        return direct ? direct.importName === "*" ? {
          componentName: c,
          localImportName: ns,
          importId: direct.importId,
          importName: mem,
          namespace: ns,
          member: mem,
          jsxDepth: depth
        } : {
          componentName: c,
          localImportName: ns,
          importId: direct.importId,
          importName: direct.importName,
          member: mem,
          jsxDepth: depth
        } : { componentName: c, member: mem, jsxDepth: depth };
      })() : (() => {
        let direct = localToImport.get(c);
        return direct ? {
          componentName: c,
          localImportName: c,
          importId: direct.importId,
          importName: direct.importName,
          jsxDepth: depth
        } : { componentName: c, jsxDepth: depth };
      })(), path5, isPackage = !1;
      try {
        component.importId && storyFilePath && (path5 = cachedResolveImport(matchPath(component.importId, dirname8(storyFilePath)), {
          basedir: dirname8(storyFilePath)
        }));
      } catch (e) {
        logger7.debug(e);
      }
      try {
        component.importId && !component.importId.startsWith(".") && storyFilePath && (cachedResolveImport(component.importId, { basedir: dirname8(storyFilePath) }), isPackage = !0);
      } catch {
      }
      let componentWithPackage = { ...component, isPackage };
      if (path5) {
        if (docgenEngine === "react-docgen-typescript") {
          let reactDocgenTypescript, reactDocgenTypescriptError;
          try {
            let docs = await parseWithReactDocgenTypescript(path5, reactDocgenTypescriptOptions);
            reactDocgenTypescript = matchComponentDoc(docs, component), reactDocgenTypescript || (reactDocgenTypescriptError = getReactDocgenTypescriptError(path5, component, docs));
          } catch (e) {
            let message = e instanceof Error ? e.message : String(e);
            logger7.debug(`react-docgen-typescript failed for ${path5}: ${message}`), reactDocgenTypescriptError = {
              name: "react-docgen-typescript parse error",
              message: `File: ${path5}
${message}`
            };
          }
          let importOverride = reactDocgenTypescript ? getImportTag(reactDocgenTypescript) : void 0;
          return {
            ...componentWithPackage,
            path: path5,
            ...reactDocgenTypescript ? { reactDocgenTypescript } : {},
            ...reactDocgenTypescriptError ? { reactDocgenTypescriptError } : {},
            importOverride
          };
        }
        if (docgenEngine === "react-docgen") {
          let reactDocgen = getReactDocgen(path5, componentWithPackage);
          return {
            ...componentWithPackage,
            path: path5,
            reactDocgen,
            importOverride: reactDocgen.type === "success" ? getImportTag(reactDocgen.data) : void 0
          };
        }
        if (docgenEngine === "react-component-meta")
          return {
            ...componentWithPackage,
            path: path5
          };
      }
      return componentWithPackage;
    })
  )).sort((a, b) => a.componentName.localeCompare(b.componentName));
}, getImports = ({
  components,
  packageName
}) => {
  let withSource = components.filter((c) => !!c.importId).map((c, idx) => {
    let importId = c.importId, overrideSource = (() => {
      if (c.importOverride)
        try {
          let src = babelParse2(c.importOverride).program.body.find((n) => t3.isImportDeclaration(n))?.source?.value;
          return typeof src == "string" ? src : void 0;
        } catch {
          return;
        }
    })(), rewritten = overrideSource !== void 0 ? overrideSource : (
      // only rewrite to the package name it the import id is not already a valid package
      // tsconfig paths such as ~/components/Button and components/Button are not seen as packages
      packageName && !c.isPackage ? packageName : importId
    );
    return { c, src: t3.stringLiteral(rewritten), key: rewritten, ord: idx };
  }), orderOfSource = {};
  for (let w of withSource)
    orderOfSource[w.key] === void 0 && (orderOfSource[w.key] = w.ord);
  let buckets = /* @__PURE__ */ new Map(), ensureBucket = (key, src) => {
    let prev = buckets.get(key);
    if (prev)
      return prev;
    let b = {
      source: src,
      defaults: [],
      namespaces: [],
      named: [],
      order: orderOfSource[key] ?? 0
    };
    return buckets.set(key, b), b;
  };
  for (let { c, src, key } of withSource) {
    let b = ensureBucket(key, src), rewritten = src.value !== c.importId, overrideSpec = (() => {
      if (c.importOverride)
        try {
          let decl = babelParse2(c.importOverride).program.body.find((n) => t3.isImportDeclaration(n));
          if (!decl)
            return;
          let spec = (decl.specifiers ?? []).find((s) => !isTypeSpecifier(s));
          return spec ? t3.isImportNamespaceSpecifier(spec) ? { kind: "namespace", local: spec.local.name } : t3.isImportDefaultSpecifier(spec) ? { kind: "default" } : t3.isImportSpecifier(spec) ? { kind: "named", imported: t3.isIdentifier(spec.imported) ? spec.imported.name : spec.imported.value } : void 0 : void 0;
        } catch {
          return;
        }
    })();
    if (overrideSpec) {
      if (overrideSpec.kind === "namespace") {
        let ns = t3.identifier(overrideSpec.local);
        addUniqueBy(b.namespaces, ns, (n) => n.name === ns.name);
        continue;
      }
      if (!c.localImportName)
        continue;
      if (overrideSpec.kind === "default") {
        let id = t3.identifier(c.localImportName);
        addUniqueBy(b.defaults, id, (d) => d.name === id.name);
        continue;
      }
      if (overrideSpec.kind === "named") {
        let local = t3.identifier(c.localImportName), imported = t3.identifier(overrideSpec.imported);
        addUniqueBy(
          b.named,
          t3.importSpecifier(local, imported),
          (n) => n.local.name === local.name && importedName(n.imported) === imported.name
        );
        continue;
      }
    }
    if (c.namespace) {
      if (rewritten) {
        if (!c.importName)
          continue;
        let member = c.importName, id = t3.identifier(member);
        addUniqueBy(
          b.named,
          t3.importSpecifier(id, id),
          (n) => n.local.name === member && importedName(n.imported) === member
        );
      } else {
        let ns = t3.identifier(c.namespace);
        addUniqueBy(b.namespaces, ns, (n) => n.name === ns.name);
      }
      continue;
    }
    if (c.importName === "default") {
      if (!c.localImportName)
        continue;
      if (rewritten) {
        let id = t3.identifier(c.localImportName);
        addUniqueBy(
          b.named,
          t3.importSpecifier(id, id),
          (n) => n.local.name === id.name && importedName(n.imported) === id.name
        );
      } else {
        let id = t3.identifier(c.localImportName);
        addUniqueBy(b.defaults, id, (d) => d.name === id.name);
      }
      continue;
    }
    if (c.importName) {
      if (!c.localImportName)
        continue;
      let local = t3.identifier(c.localImportName), imported = t3.identifier(c.importName);
      addUniqueBy(
        b.named,
        t3.importSpecifier(local, imported),
        (n) => n.local.name === local.name && importedName(n.imported) === imported.name
      );
      continue;
    }
  }
  let merged = [], printDecl = (specs, src) => {
    let node = t3.importDeclaration(specs, src), code = recast.print(node, {}).code;
    merged.push(code);
  }, sortedBuckets = Array.from(buckets.values()).sort((a, b) => a.order - b.order);
  for (let bucket of sortedBuckets) {
    let { source, defaults, namespaces, named } = bucket;
    if (!(defaults.length === 0 && namespaces.length === 0 && named.length === 0))
      if (namespaces.length > 0) {
        let firstSpecs = [];
        defaults[0] && firstSpecs.push(t3.importDefaultSpecifier(defaults[0])), firstSpecs.push(t3.importNamespaceSpecifier(namespaces[0])), printDecl(firstSpecs, source), named.length > 0 && printDecl(named, source);
        for (let d of defaults.slice(1))
          printDecl([t3.importDefaultSpecifier(d)], source);
        for (let ns of namespaces.slice(1))
          printDecl([t3.importNamespaceSpecifier(ns)], source);
      } else {
        if (defaults.length > 0 || named.length > 0) {
          let specs = [];
          defaults[0] && specs.push(t3.importDefaultSpecifier(defaults[0])), specs.push(...named), printDecl(specs, source);
        }
        for (let d of defaults.slice(1))
          printDecl([t3.importDefaultSpecifier(d)], source);
      }
  }
  return merged;
};

// src/componentManifest/subcomponents.ts
import { types as t4 } from "storybook/internal/babel";
function findExactComponentMatch(components, componentName) {
  if (componentName)
    return components.find((component) => component.componentName === componentName);
}
function extractDeclaredSubcomponents(csf) {
  let rawSubcomponents = unwrapSubcomponentNode(
    csf._metaAnnotations.subcomponents,
    csf._ast.program
  );
  return !rawSubcomponents || !t4.isObjectExpression(rawSubcomponents) ? [] : rawSubcomponents.properties.flatMap((property) => {
    if (!t4.isObjectProperty(property))
      return [];
    let name = getObjectKeyName(property.key), directComponentName = getComponentExpressionName(property.value), componentExpression = unwrapSubcomponentNode(property.value, csf._ast.program), componentName = getComponentExpressionName(componentExpression) ?? directComponentName;
    return name && componentName ? [{ name, componentName }] : [];
  });
}
function findVariableInitialization(identifier, program) {
  for (let node of program.body) {
    let declaration = (t4.isVariableDeclaration(node) ? node.declarations : t4.isExportNamedDeclaration(node) && t4.isVariableDeclaration(node.declaration) ? node.declaration.declarations : void 0)?.find(
      (decl) => t4.isVariableDeclarator(decl) && t4.isIdentifier(decl.id) && decl.id.name === identifier
    );
    if (declaration?.init && t4.isExpression(declaration.init))
      return declaration.init;
  }
}
function unwrapSubcomponentNode(node, program, visitedIdentifiers = /* @__PURE__ */ new Set()) {
  let current2 = node;
  for (; current2; ) {
    if (t4.isIdentifier(current2)) {
      if (visitedIdentifiers.has(current2.name))
        return;
      visitedIdentifiers.add(current2.name), current2 = findVariableInitialization(current2.name, program);
      continue;
    }
    if (t4.isParenthesizedExpression(current2) || t4.isTSAsExpression(current2) || t4.isTSSatisfiesExpression(current2) || t4.isTSNonNullExpression(current2)) {
      current2 = current2.expression;
      continue;
    }
    return current2;
  }
}
function getObjectKeyName(key) {
  if (t4.isIdentifier(key))
    return key.name;
  if (t4.isStringLiteral(key))
    return key.value;
}
function getComponentExpressionName(node) {
  if (node) {
    if (t4.isIdentifier(node))
      return node.name;
    if (t4.isMemberExpression(node) && !node.computed) {
      let objectName = getComponentExpressionName(node.object), propertyName = getComponentExpressionName(node.property);
      return objectName && propertyName ? `${objectName}.${propertyName}` : void 0;
    }
  }
}

// src/componentManifest/generator.ts
var componentMetaManager;
async function createComponentMetaManager(watch2) {
  if (componentMetaManager && watch2)
    return componentMetaManager;
  try {
    let ts = await import("typescript"), manager = new ComponentMetaManager(ts);
    return watch2 && (componentMetaManager = manager), manager;
  } catch {
    logger8.debug(
      "[reactComponentMeta] TypeScript not available, skipping component meta extraction"
    );
  }
}
function isAttachedDocsEntry(entry) {
  return entry.type === "docs" && entry.tags?.includes(Tag.ATTACHED_MDX) === !0 && entry.storiesImports.length > 0;
}
function selectComponentEntries(manifestEntries) {
  let entriesByComponentId = /* @__PURE__ */ new Map();
  return manifestEntries.filter(
    (entry) => entry.type === "story" && entry.subtype === "story" || // Attached docs entries are the only docs entries that can contribute to a
    // component manifest, because they point back to a story file through storiesImports.
    isAttachedDocsEntry(entry)
  ).forEach((entry) => {
    let componentId = entry.id.split("--")[0], existingEntry = entriesByComponentId.get(componentId);
    if (!existingEntry) {
      entriesByComponentId.set(componentId, entry);
      return;
    }
    existingEntry.type === "docs" && entry.type === "story" && entriesByComponentId.set(componentId, entry);
  }), [...entriesByComponentId.values()];
}
function findMatchingComponent(components, componentName, title) {
  let exactMatch = findExactComponentMatch(components, componentName);
  if (exactMatch)
    return exactMatch;
  let trimmedTitle = title.replace(/\s+/g, ""), matches = components.filter(
    (it) => trimmedTitle.includes(it.componentName) || it.localImportName && trimmedTitle.includes(it.localImportName) || it.importName && trimmedTitle.includes(it.importName)
  );
  if (matches.length <= 1)
    return matches[0];
  let best = matches[0];
  for (let cur of matches) {
    if (cur.jsxDepth === 0)
      return cur;
    (cur.jsxDepth ?? 1 / 0) < (best.jsxDepth ?? 1 / 0) && (best = cur);
  }
  return best;
}
function getPackageInfo(componentPath, fallbackPath) {
  let nearestPkg = cachedFindUp("package.json", {
    cwd: path.dirname(componentPath ?? fallbackPath)
  });
  try {
    if (!nearestPkg)
      return;
    let parsed = JSON.parse(cachedReadTextFileSync(nearestPkg));
    return typeof parsed == "object" && parsed && "name" in parsed && typeof parsed.name == "string" ? parsed.name : void 0;
  } catch {
    return;
  }
}
function getFallbackImport(packageName, componentName) {
  let exportName = componentName?.split(".").at(-1);
  return packageName && exportName ? `import { ${exportName} } from "${packageName}";` : "";
}
function getComponentDocgenData(component, docgenEngine) {
  let reactDocgen, reactDocgenTypescript, reactComponentMeta, docgenDescription, docgenJsDocTags, docgenError;
  if (docgenEngine === "react-docgen") {
    let result = component?.reactDocgen;
    reactDocgen = result?.type === "success" ? result.data : void 0, docgenDescription = reactDocgen?.description, docgenError = result?.type === "error" ? result.error : void 0;
  } else docgenEngine === "react-docgen-typescript" ? (reactDocgenTypescript = component?.reactDocgenTypescript, docgenDescription = reactDocgenTypescript?.description, docgenError = component?.reactDocgenTypescriptError) : (reactComponentMeta = component?.reactComponentMeta, docgenDescription = reactComponentMeta?.description, docgenJsDocTags = component?.componentJsDocTags);
  return {
    docgenDescription,
    docgenError,
    docgenJsDocTags,
    reactComponentMeta,
    reactDocgen,
    reactDocgenTypescript
  };
}
function createSubcomponentManifest({
  component,
  declaredName,
  docgenEngine,
  packageName,
  storyFilePath
}) {
  let imports = getImports({ components: component ? [component] : [], packageName }).join(`
`).trim() || getFallbackImport(packageName, component?.componentName), {
    reactDocgen,
    reactDocgenTypescript,
    reactComponentMeta,
    docgenDescription,
    docgenJsDocTags,
    docgenError
  } = getComponentDocgenData(component, docgenEngine), { description, summary, jsDocTags } = extractComponentDescription(
    void 0,
    docgenDescription,
    docgenJsDocTags
  );
  return {
    name: declaredName,
    path: component?.path ?? storyFilePath,
    description,
    summary,
    import: imports || void 0,
    jsDocTags,
    reactDocgen,
    reactDocgenTypescript,
    reactComponentMeta,
    error: docgenError ?? (component ? void 0 : {
      name: "No component import found",
      message: `No component file found for the "${declaredName}" subcomponent.`
    })
  };
}
function extractStories(csf, componentName, manifestEntries) {
  let manifestEntryIds = new Set(manifestEntries.map((entry) => entry.id));
  return Object.entries(csf._stories).filter(
    ([, story]) => (
      // Only include stories that are in the list of entries already filtered for the 'manifest' tag
      manifestEntryIds.has(story.id)
    )
  ).map(([storyExport, story]) => {
    try {
      let jsdocComment = extractDescription(csf._storyStatements[storyExport]), { tags = {}, description } = jsdocComment ? extractJSDocInfo(jsdocComment) : {}, finalDescription = (tags?.describe?.[0] || tags?.desc?.[0]) ?? description;
      return {
        id: story.id,
        name: story.name ?? storyNameFromExport(storyExport),
        snippet: recast2.print(getCodeSnippet(csf, storyExport, componentName)).code,
        description: finalDescription?.trim(),
        summary: tags.summary?.[0]
      };
    } catch (e) {
      return invariant(e instanceof Error), {
        id: story.id,
        name: story.name ?? storyNameFromExport(storyExport),
        error: { name: e.name, message: e.message }
      };
    }
  });
}
function extractComponentDescription(metaJsDoc, docgenDescription, docgenJsDocTags) {
  let jsdocComment = metaJsDoc || docgenDescription, extracted = jsdocComment ? extractJSDocInfo(jsdocComment) : void 0, tags = docgenJsDocTags ?? extracted?.tags ?? {}, description = extracted?.description;
  return {
    description: ((tags?.describe?.[0] || tags?.desc?.[0]) ?? description)?.trim(),
    summary: tags.summary?.[0],
    jsDocTags: tags
  };
}
var manifests = async (existingManifests = {}, options) => {
  let { manifestEntries, presets, watch: watch2 } = options, typescriptOptions = await presets?.apply("typescript", {}) ?? {}, docgenEngine = (await presets?.apply("features", {}))?.experimentalReactComponentMeta ? "react-component-meta" : typescriptOptions.reactDocgen || "react-docgen";
  invalidateCache(), invalidateParser();
  let startTime = performance.now(), manager = docgenEngine === "react-component-meta" ? await createComponentMetaManager(watch2) : null;
  try {
    let entriesByUniqueComponent = selectComponentEntries(manifestEntries), resolvedEntries = await Promise.all(
      entriesByUniqueComponent.map(async (entry) => {
        let storyFilePath = entry.type === "story" ? entry.importPath : (
          // For attached docs entries, storiesImports[0] points to the stories file being attached to
          entry.storiesImports[0]
        ), storyPath = path.join(process.cwd(), storyFilePath), storyFile = cachedReadTextFileSync(storyPath), csf = loadCsf(storyFile, {
          makeTitle: () => entry.title
        }).parse(), componentName = csf._meta?.component, declaredSubcomponents = extractDeclaredSubcomponents(csf), allComponents = await getComponents({
          additionalComponentNames: declaredSubcomponents.map(
            (subcomponent) => subcomponent.componentName
          ),
          csf,
          storyFilePath: storyPath,
          typescriptOptions,
          docgenEngine
        }), component = findMatchingComponent(allComponents, componentName, entry.title), subcomponents = declaredSubcomponents.map((declaredSubcomponent) => ({
          component: findExactComponentMatch(allComponents, declaredSubcomponent.componentName),
          name: declaredSubcomponent.name
        }));
        return {
          storyPath,
          component,
          entry,
          storyFilePath,
          storyFile,
          csf,
          componentName,
          allComponents,
          subcomponents
        };
      })
    );
    docgenEngine === "react-component-meta" && manager && manager.batchExtract(
      resolvedEntries.flatMap(({ storyPath, component, subcomponents }) => [
        ...component ? [{ storyPath, component }] : [],
        ...subcomponents.filter(
          (subcomponent) => subcomponent.component !== void 0
        ).map((subcomponent) => ({
          storyPath,
          component: subcomponent.component
        }))
      ])
    );
    let components = resolvedEntries.map(
      ({
        storyPath,
        component,
        entry,
        storyFilePath,
        storyFile,
        csf,
        componentName,
        allComponents,
        subcomponents
      }) => {
        let id = entry.id.split("--")[0], title = entry.title.split("/").at(-1).replace(/\s+/g, ""), packageName = getPackageInfo(component?.path, storyPath), fallbackImport = getFallbackImport(packageName, componentName), imports = getImports({ components: allComponents, packageName }).join(`
`).trim() || fallbackImport, stories = extractStories(csf, component?.componentName, manifestEntries), base2 = {
          id,
          name: componentName ?? title,
          path: storyFilePath,
          stories,
          import: imports,
          jsDocTags: {}
        }, {
          reactDocgen,
          reactDocgenTypescript,
          reactComponentMeta,
          docgenDescription,
          docgenJsDocTags,
          docgenError
        } = getComponentDocgenData(component, docgenEngine);
        if (!reactDocgen && !reactDocgenTypescript && !reactComponentMeta) {
          let error = csf._meta?.component ? {
            name: "No component import found",
            message: `No component file found for the "${csf.meta.component}" component.`
          } : {
            name: "No component found",
            message: "We could not detect the component from your story file. Specify meta.component."
          };
          return {
            ...base2,
            error: docgenError ?? {
              name: error.name,
              message: (csf._metaStatementPath?.buildCodeFrameError(error.message).message ?? error.message) + `

${entry.importPath}:
${storyFile}`
            }
          };
        }
        let metaJsDoc = extractDescription(csf._metaStatement) || void 0, { description, summary, jsDocTags } = extractComponentDescription(
          metaJsDoc,
          docgenDescription,
          docgenJsDocTags
        ), subcomponentEntries = Object.fromEntries(
          subcomponents.map((subcomponent) => [
            subcomponent.name,
            createSubcomponentManifest({
              component: subcomponent.component,
              declaredName: subcomponent.name,
              docgenEngine,
              packageName,
              storyFilePath
            })
          ])
        );
        return {
          ...base2,
          description,
          summary,
          import: imports,
          reactDocgen,
          reactDocgenTypescript,
          reactComponentMeta,
          jsDocTags,
          ...Object.keys(subcomponentEntries).length > 0 ? { subcomponents: subcomponentEntries } : {},
          error: docgenError
        };
      }
    ).filter((component) => component !== void 0);
    manager && watch2 && manager.startWatching();
    let durationMs = Math.round(performance.now() - startTime);
    return {
      ...existingManifests,
      components: {
        v: 0,
        components: Object.fromEntries(components.map((component) => [component.id, component])),
        meta: {
          docgen: docgenEngine,
          durationMs
        }
      }
    };
  } finally {
    manager && !watch2 && manager.dispose();
  }
};

// src/enrichCsf.ts
import { recast as recast3, types as t5 } from "storybook/internal/babel";
import { getPrettier } from "storybook/internal/common";
var enrichCsf = async (input, options) => {
  if ((await options.presets.apply("features")).experimentalCodeExamples)
    return async (csf, csfSource) => {
      let promises = Object.keys(csf._stories).map(async (key) => {
        if (!csfSource._meta?.component)
          return;
        let { format: format3 } = await getPrettier(), node, snippet;
        try {
          node = getCodeSnippet(csfSource, key, csfSource._meta?.component);
        } catch (e) {
          if (!(e instanceof Error))
            return;
          snippet = e.message;
        }
        try {
          !snippet && node && (snippet = await format3(recast3.print(node).code, {
            filepath: join(process.cwd(), "component.tsx")
          }));
        } catch (e) {
          if (!(e instanceof Error))
            return;
          snippet = e.message;
        }
        if (!snippet)
          return;
        let originalParameters = t5.memberExpression(
          csf._metaIsFactory ? t5.memberExpression(t5.identifier(key), t5.identifier("input")) : t5.identifier(key),
          t5.identifier("parameters")
        ), docsParameter = t5.optionalMemberExpression(
          originalParameters,
          t5.identifier("docs"),
          !1,
          !0
        );
        csf._ast.program.body.push(
          t5.expressionStatement(
            t5.assignmentExpression(
              "=",
              originalParameters,
              t5.objectExpression([
                t5.spreadElement(originalParameters),
                t5.objectProperty(
                  t5.identifier("docs"),
                  t5.objectExpression([
                    t5.spreadElement(docsParameter),
                    t5.objectProperty(
                      t5.identifier("source"),
                      t5.objectExpression([
                        t5.objectProperty(t5.identifier("code"), t5.stringLiteral(snippet)),
                        t5.spreadElement(
                          t5.optionalMemberExpression(
                            docsParameter,
                            t5.identifier("source"),
                            !1,
                            !0
                          )
                        )
                      ])
                    )
                  ])
                )
              ])
            )
          )
        );
      });
      await Promise.all(promises);
    };
};

// src/preset.ts
var addons = [
  import.meta.resolve("@storybook/react-dom-shim/preset")
], previewAnnotations = async (input = [], options) => {
  let [docsConfig, features] = await Promise.all([
    options.presets.apply("docs", {}, options),
    options.presets.apply("features", {}, options)
  ]), docsEnabled = Object.keys(docsConfig).length > 0, experimentalRSC = features?.experimentalRSC;
  return [].concat(input).concat([
    fileURLToPath2(import.meta.resolve("@storybook/react/entry-preview")),
    fileURLToPath2(import.meta.resolve("@storybook/react/entry-preview-argtypes"))
  ]).concat(
    docsEnabled ? [fileURLToPath2(import.meta.resolve("@storybook/react/entry-preview-docs"))] : []
  ).concat(
    experimentalRSC ? [fileURLToPath2(import.meta.resolve("@storybook/react/entry-preview-rsc"))] : []
  );
}, resolvedReact = async (existing) => {
  try {
    return {
      ...existing,
      react: resolvePackageDir("react"),
      reactDom: resolvePackageDir("react-dom")
    };
  } catch {
    return existing;
  }
};
async function internal_getArgTypesData(_input, options) {
  let { componentFilePath, componentExportName, presets } = options ?? {};
  if (!componentFilePath)
    return null;
  let typescriptOptions = {};
  if (presets)
    try {
      typescriptOptions = await presets.apply("typescript", {});
    } catch {
    }
  let { reactDocgen = "react-docgen", reactDocgenTypescriptOptions } = typescriptOptions;
  if (reactDocgen === !1)
    return null;
  let resolvedFilePath = path4.isAbsolute(componentFilePath) ? componentFilePath : join6(getProjectRoot2(), componentFilePath), argTypesData;
  return reactDocgen === "react-docgen-typescript" ? argTypesData = await extractArgTypesFromDocgenTypescript({
    componentFilePath: resolvedFilePath,
    componentExportName,
    reactDocgenTypescriptOptions
  }) : argTypesData = extractArgTypesFromDocgen({
    componentFilePath: resolvedFilePath,
    componentExportName
  }), argTypesData;
}
var optimizeViteDeps = ["react-dom/test-utils"];
export {
  addons,
  enrichCsf as experimental_enrichCsf,
  manifests as experimental_manifests,
  internal_getArgTypesData,
  optimizeViteDeps,
  previewAnnotations,
  resolvedReact
};
