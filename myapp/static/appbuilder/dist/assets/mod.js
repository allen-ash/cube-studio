/**
 * Sea.js 3.0.3 | seajs.org/LICENSE.md
 */
(function(global, undefined) {

  // Avoid conflicting when `sea.js` is loaded multiple times
  if (global.seajs) {
    return
  }
  
  var seajs = global.seajs = {
    // The current version of Sea.js being used
    version: "3.0.3"
  }
  
  var data = seajs.data = {}
  
  
  /**
   * util-lang.js - The minimal language enhancement
   */
  
  function isType(type) {
    return function(obj) {
      return {}.toString.call(obj) == "[object " + type + "]"
    }
  }
  
  var isObject = isType("Object")
  var isString = isType("String")
  var isArray = Array.isArray || isType("Array")
  var isFunction = isType("Function")
  var isUndefined = isType("Undefined")
  
  var _cid = 0
  function cid() {
    return _cid++
  }
  
  /**
   * util-events.js - The minimal events support
   */
  
  var events = data.events = {}
  
  // Bind event
  seajs.on = function(name, callback) {
    var list = events[name] || (events[name] = [])
    list.push(callback)
    return seajs
  }
  
  // Remove event. If `callback` is undefined, remove all callbacks for the
  // event. If `event` and `callback` are both undefined, remove all callbacks
  // for all events
  seajs.off = function(name, callback) {
    // Remove *all* events
    if (!(name || callback)) {
      events = data.events = {}
      return seajs
    }
  
    var list = events[name]
    if (list) {
      if (callback) {
        for (var i = list.length - 1; i >= 0; i--) {
          if (list[i] === callback) {
            list.splice(i, 1)
          }
        }
      }
      else {
        delete events[name]
      }
    }
  
    return seajs
  }
  
  // Emit event, firing all bound callbacks. Callbacks receive the same
  // arguments as `emit` does, apart from the event name
  var emit = seajs.emit = function(name, data) {
    var list = events[name]
  
    if (list) {
      // Copy callback lists to prevent modification
      list = list.slice()
  
      // Execute event callbacks, use index because it's the faster.
      for(var i = 0, len = list.length; i < len; i++) {
        list[i](data)
      }
    }
  
    return seajs
  }
  
  /**
   * util-path.js - The utilities for operating path such as id, uri
   */
  
  var DIRNAME_RE = /[^?#]*\//
  
  var DOT_RE = /\/\.\//g
  var DOUBLE_DOT_RE = /\/[^/]+\/\.\.\//
  var MULTI_SLASH_RE = /([^:/])\/+\//g
  
  // Extract the directory portion of a path
  // dirname("a/b/c.js?t=123#xx/zz") ==> "a/b/"
  // ref: http://jsperf.com/regex-vs-split/2
  function dirname(path) {
    return path.match(DIRNAME_RE)[0]
  }
  
  // Canonicalize a path
  // realpath("http://test.com/a//./b/../c") ==> "http://test.com/a/c"
  function realpath(path) {
    // /a/b/./c/./d ==> /a/b/c/d
    path = path.replace(DOT_RE, "/")
  
    /*
      @author wh1100717
      a//b/c ==> a/b/c
      a///b/////c ==> a/b/c
      DOUBLE_DOT_RE matches a/b/c//../d path correctly only if replace // with / first
    */
    path = path.replace(MULTI_SLASH_RE, "$1/")
  
    // a/b/c/../../d  ==>  a/b/../d  ==>  a/d
    while (path.match(DOUBLE_DOT_RE)) {
      path = path.replace(DOUBLE_DOT_RE, "/")
    }
  
    return path
  }
  
  // Normalize an id
  // normalize("path/to/a") ==> "path/to/a.js"
  // NOTICE: substring is faster than negative slice and RegExp
  function normalize(path) {
    var last = path.length - 1
    var lastC = path.charCodeAt(last)
  
    // If the uri ends with `#`, just return it without '#'
    if (lastC === 35 /* "#" */) {
      return path.substring(0, last)
    }
  
    return (path.substring(last - 2) === ".js" ||
        path.indexOf("?") > 0 ||
        lastC === 47 /* "/" */) ? path : path + ".js"
  }
  
  
  var PATHS_RE = /^([^/:]+)(\/.+)$/
  var VARS_RE = /{([^{]+)}/g
  
  function parseAlias(id) {
    var alias = data.alias
    return alias && isString(alias[id]) ? alias[id] : id
  }
  
  function parsePaths(id) {
    var paths = data.paths
    var m
  
    if (paths && (m = id.match(PATHS_RE)) && isString(paths[m[1]])) {
      id = paths[m[1]] + m[2]
    }
  
    return id
  }
  
  function parseVars(id) {
    var vars = data.vars
  
    if (vars && id.indexOf("{") > -1) {
      id = id.replace(VARS_RE, function(m, key) {
        return isString(vars[key]) ? vars[key] : m
      })
    }
  
    return id
  }
  
  function parseMap(uri) {
    var map = data.map
    var ret = uri
  
    if (map) {
      for (var i = 0, len = map.length; i < len; i++) {
        var rule = map[i]
  
        ret = isFunction(rule) ?
            (rule(uri) || uri) :
            uri.replace(rule[0], rule[1])
  
        // Only apply the first matched rule
        if (ret !== uri) break
      }
    }
  
    return ret
  }
  
  
  var ABSOLUTE_RE = /^\/\/.|:\//
  var ROOT_DIR_RE = /^.*?\/\/.*?\//
  
  function addBase(id, refUri) {
    var ret
    var first = id.charCodeAt(0)
  
    // Absolute
    if (ABSOLUTE_RE.test(id)) {
      ret = id
    }
    // Relative
    else if (first === 46 /* "." */) {
      ret = (refUri ? dirname(refUri) : data.cwd) + id
    }
    // Root
    else if (first === 47 /* "/" */) {
      var m = data.cwd.match(ROOT_DIR_RE)
      ret = m ? m[0] + id.substring(1) : id
    }
    // Top-level
    else {
      ret = data.base + id
    }
  
    // Add default protocol when uri begins with "//"
    if (ret.indexOf("//") === 0) {
      ret = location.protocol + ret
    }
  
    return realpath(ret)
  }
  
  function id2Uri(id, refUri) {
    if (!id) return ""
  
    id = parseAlias(id)
    id = parsePaths(id)
    id = parseAlias(id)
    id = parseVars(id)
    id = parseAlias(id)
    id = normalize(id)
    id = parseAlias(id)
  
    var uri = addBase(id, refUri)
    uri = parseAlias(uri)
    uri = parseMap(uri)
  
    return uri
  }
  
  // For Developers
  seajs.resolve = id2Uri
  
  // Check environment
  var isWebWorker = typeof window === 'undefined' && typeof importScripts !== 'undefined' && isFunction(importScripts)
  
  // Ignore about:xxx and blob:xxx
  var IGNORE_LOCATION_RE = /^(about|blob):/
  var loaderDir
  // Sea.js's full path
  var loaderPath
  // Location is read-only from web worker, should be ok though
  var cwd = (!location.href || IGNORE_LOCATION_RE.test(location.href)) ? '' : dirname(location.href)
  
  if (isWebWorker) {
    // Web worker doesn't create DOM object when loading scripts
    // Get sea.js's path by stack trace.
    var stack
    try {
      var up = new Error()
      throw up
    } catch (e) {
      // IE won't set Error.stack until thrown
      stack = e.stack.split('\n')
    }
    // First line is 'Error'
    stack.shift()
  
    var m
    // Try match `url:row:col` from stack trace line. Known formats:
    // Chrome:  '    at http://localhost:8000/script/sea-worker-debug.js:294:25'
    // FireFox: '@http://localhost:8000/script/sea-worker-debug.js:1082:1'
    // IE11:    '   at Anonymous function (http://localhost:8000/script/sea-worker-debug.js:295:5)'
    // Don't care about older browsers since web worker is an HTML5 feature
    var TRACE_RE = /.*?((?:http|https|file)(?::\/{2}[\w]+)(?:[\/|\.]?)(?:[^\s"]*)).*?/i
    // Try match `url` (Note: in IE there will be a tailing ')')
    var URL_RE = /(.*?):\d+:\d+\)?$/
    // Find url of from stack trace.
    // Cannot simply read the first one because sometimes we will get:
    // Error
    //  at Error (native) <- Here's your problem
    //  at http://localhost:8000/_site/dist/sea.js:2:4334 <- What we want
    //  at http://localhost:8000/_site/dist/sea.js:2:8386
    //  at http://localhost:8000/_site/tests/specs/web-worker/worker.js:3:1
    while (stack.length > 0) {
      var top = stack.shift()
      m = TRACE_RE.exec(top)
      if (m != null) {
        break
      }
    }
    var url
    if (m != null) {
      // Remove line number and column number
      // No need to check, can't be wrong at this point
      var url = URL_RE.exec(m[1])[1]
    }
    // Set
    loaderPath = url
    // Set loaderDir
    loaderDir = dirname(url || cwd)
    // This happens with inline worker.
    // When entrance script's location.href is a blob url,
    // cwd will not be available.
    // Fall back to loaderDir.
    if (cwd === '') {
      cwd = loaderDir
    }
  }
  else {
    var doc = document
    var scripts = doc.scripts
  
    // Recommend to add `seajsnode` id for the `sea.js` script element
    var loaderScript = doc.getElementById("seajsnode") ||
      scripts[scripts.length - 1]
  
    function getScriptAbsoluteSrc(node) {
      return node.hasAttribute ? // non-IE6/7
        node.src :
        // see http://msdn.microsoft.com/en-us/library/ms536429(VS.85).aspx
        node.getAttribute("src", 4)
    }
    loaderPath = getScriptAbsoluteSrc(loaderScript)
    // When `sea.js` is inline, set loaderDir to current working directory
    loaderDir = dirname(loaderPath || cwd)
  }
  
  
  var interactiveScript
  
  function getCurrentScript() {
    if (currentlyAddingScript) {
      return currentlyAddingScript
    }
  
    // For IE6-9 browsers, the script onload event may not fire right
    // after the script is evaluated. Kris Zyp found that it
    // could query the script nodes and the one that is in "interactive"
    // mode indicates the current script
    // ref: http://goo.gl/JHfFW
    if (interactiveScript && interactiveScript.readyState === "interactive") {
      return interactiveScript
    }
  
    var scripts = head.getElementsByTagName("script")
  
    for (var i = scripts.length - 1; i >= 0; i--) {
      var script = scripts[i]
      if (script.readyState === "interactive") {
        interactiveScript = script
        return interactiveScript
      }
    }
  }
  
  /**
   * util-deps.js - The parser for dependencies
   * ref: tests/research/parse-dependencies/test.html
   * ref: https://github.com/seajs/crequire
   */
  
  var REQUIRE_RE = /"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|\/\*[\S\s]*?\*\/|\/(?:\\\/|[^\/\r\n])+\/(?=[^\/])|\/\/.*|\.\s*require|(?:^|[^$])\brequire\s*\(\s*(["'])(.+?)\1\s*\)/g
  var SLASH_RE = /\\\\/g
  
  function parseDependencies(code) {
    var ret = []
  
    code.replace(SLASH_RE, "")
        .replace(REQUIRE_RE, function(m, m1, m2) {
          if (m2) {
            ret.push(m2)
          }
        })
  
    return ret
  }
  
  
  /**
   * module.js - The core of module loader
   */
  
  var cachedMods = seajs.cache = {}
  var anonymousMeta
  
  var fetchingList = {}
  var fetchedList = {}
  var callbackList = {}
  
  var STATUS = Module.STATUS = {
    // 1 - The `module.uri` is being fetched
    FETCHING: 1,
    // 2 - The meta data has been saved to cachedMods
    SAVED: 2,
    // 3 - The `module.dependencies` are being loaded
    LOADING: 3,
    // 4 - The module are ready to execute
    LOADED: 4,
    // 5 - The module is being executed
    EXECUTING: 5,
    // 6 - The `module.exports` is available
    EXECUTED: 6,
    // 7 - 404
    ERROR: 7
  }
  
  
  function Module(uri, deps) {
    this.uri = uri
    this.dependencies = deps || []
    this.deps = {} // Ref the dependence modules
    this.status = 0
  
    this._entry = []
  }
  
  // Resolve module.dependencies
  Module.prototype.resolve = function() {
    var mod = this
    var ids = mod.dependencies
    var uris = []
  
    for (var i = 0, len = ids.length; i < len; i++) {
      uris[i] = Module.resolve(ids[i], mod.uri)
    }
    return uris
  }
  
  
  // Call this method when module is loaded
  Module.prototype.onload = function() {
    var mod = this
    mod.status = STATUS.LOADED
    // When sometimes cached in IE, exec will occur before onload, make sure len is an number
    for (var i = 0, len = (mod._entry || []).length; i < len; i++) {
      var entry = mod._entry[i]
      if (--entry.remain === 0) {
        entry.callback()
      }
    }
  
    delete mod._entry
  }
  
  
  // Execute a module
  Module.prototype.exec = function () {
    var mod = this
  
    // When module is executed, DO NOT execute it again. When module
    // is being executed, just return `module.exports` too, for avoiding
    // circularly calling
    if (mod.status >= STATUS.EXECUTING) {
      return mod.exports
    }
  
    mod.status = STATUS.EXECUTING
  
    if (mod._entry && !mod._entry.length) {
      delete mod._entry
    }
  
    //non-cmd module has no property factory and exports
    if (!mod.hasOwnProperty('factory')) {
      mod.non = true
      return
    }
  
    // Create require
    var uri = mod.uri
  
    function require(id) {
      var m = mod.deps[id] || Module.get(require.resolve(id))
      if (m.status == STATUS.ERROR) {
        throw new Error('module was broken: ' + m.uri)
      }
      return m.exec()
    }
  
    require.resolve = function(id) {
      return Module.resolve(id, uri)
    }
  
    require.async = function(ids, callback) {
      Module.use(ids, callback, uri + "_async_" + cid())
      return require
    }
  
    // Exec factory
    var factory = mod.factory
  
    var exports = isFunction(factory) ?
      factory.call(mod.exports = {}, require, mod.exports, mod) :
      factory
  
    if (exports === undefined) {
      exports = mod.exports
    }
  
    // Reduce memory leak
    delete mod.factory
  
    mod.exports = exports
    mod.status = STATUS.EXECUTED
  
    // Emit `exec` event
    emit("exec", mod)
  
    return mod.exports
  }
  
  // Resolve id to uri
  Module.resolve = function(id, refUri) {
    // Emit `resolve` event for plugins such as text plugin
    var emitData = { id: id, refUri: refUri }
    emit("resolve", emitData)
  
    return emitData.uri || seajs.resolve(emitData.id, refUri)
  }
  
  // Define a module
  Module.define = function (id, deps, factory) {
    var argsLen = arguments.length
  
    // define(factory)
    if (argsLen === 1) {
      factory = id
      id = undefined
    }
    else if (argsLen === 2) {
      factory = deps
  
      // define(deps, factory)
      if (isArray(id)) {
        deps = id
        id = undefined
      }
      // define(id, factory)
      else {
        deps = undefined
      }
    }
  
    // Parse dependencies according to the module factory code
    if (!isArray(deps) && isFunction(factory)) {
      deps = typeof parseDependencies === "undefined" ? [] : parseDependencies(factory.toString())
    }
  
    var meta = {
      id: id,
      uri: Module.resolve(id),
      deps: deps,
      factory: factory
    }
  
    // Try to derive uri in IE6-9 for anonymous modules
    if (!isWebWorker && !meta.uri && doc.attachEvent && typeof getCurrentScript !== "undefined") {
      var script = getCurrentScript()
  
      if (script) {
        meta.uri = script.src
      }
  
      // NOTE: If the id-deriving methods above is failed, then falls back
      // to use onload event to get the uri
    }
  
    // Emit `define` event, used in nocache plugin, seajs node version etc
    emit("define", meta)
  
    meta.uri ? Module.save(meta.uri, meta) :
      // Save information for "saving" work in the script onload event
      anonymousMeta = meta
  }
  
  // Save meta data to cachedMods
  Module.save = function(uri, meta) {
    var mod = Module.get(uri)
  
    // Do NOT override already saved modules
    if (mod.status < STATUS.SAVED) {
      mod.id = meta.id || uri
      mod.dependencies = meta.deps || []
      mod.factory = meta.factory
      mod.status = STATUS.SAVED
  
      emit("save", mod)
    }
  }
  
  // Get an existed module or create a new one
  Module.get = function(uri, deps) {
    return cachedMods[uri] || (cachedMods[uri] = new Module(uri, deps))
  }
  
  // Use function is equal to load a anonymous module
  Module.use = function (ids, callback, uri) {
    var mod = Module.get(uri, isArray(ids) ? ids : [ids])
    mod._entry.push(mod)
    mod.history = {}
    mod.remain = 1
  
    mod.callback = function() {
      var exports = []
      var uris = mod.resolve()
  
      for (var i = 0, len = uris.length; i < len; i++) {
        if(cachedMods[uris[i]] && cachedMods[uris[i]].exec) {
          exports[i] = cachedMods[uris[i]].exec();
        }
      }
  
      if (callback) {
        callback.apply(global, exports)
      }
  
      delete mod.callback
      delete mod.history
      delete mod.remain
      delete mod._entry
    }
  
    setTimeout(() => mod.onload(), 100);
  }
  
  
  // Public API
  
  seajs.use = function(ids, callback) {
    Module.use(ids, callback, data.cwd + "_use_" + cid())
    return seajs
  }
  
  Module.define.cmd = {}
  global.define = Module.define
  
  
  // For Developers
  
  seajs.Module = Module
  data.fetchedList = fetchedList
  data.cid = cid
  
  seajs.require = function(id) {
    var mod = Module.get(Module.resolve(id))
    if (mod.status < STATUS.EXECUTING) {
      mod.onload()
      mod.exec()
    }
    return mod.exports
  }
  
  /**
   * config.js - The configuration for the loader
   */
  
  // The root path to use for id2uri parsing
  data.base = loaderDir
  
  // The loader directory
  data.dir = loaderDir
  
  // The loader's full path
  data.loader = loaderPath
  
  // The current working directory
  data.cwd = cwd
  
  // The charset for requesting files
  data.charset = "utf-8"
  
  // @Retention(RetentionPolicy.SOURCE)
  // The CORS options, Don't set CORS on default.
  //
  //data.crossorigin = undefined
  
  // data.alias - An object containing shorthands of module id
  // data.paths - An object containing path shorthands in module id
  // data.vars - The {xxx} variables in module id
  // data.map - An array containing rules to map module uri
  // data.debug - Debug mode. The default value is false
  
  seajs.config = function(configData) {
  
    for (var key in configData) {
      var curr = configData[key]
      var prev = data[key]
  
      // Merge object config such as alias, vars
      if (prev && isObject(prev)) {
        for (var k in curr) {
          prev[k] = curr[k]
        }
      }
      else {
        // Concat array config such as map
        if (isArray(prev)) {
          curr = prev.concat(curr)
        }
        // Make sure that `data.base` is an absolute path
        else if (key === "base") {
          // Make sure end with "/"
          if (curr.slice(-1) !== "/") {
            curr += "/"
          }
          curr = addBase(curr)
        }
  
        // Set config
        data[key] = curr
      }
    }
  
    emit("config", configData)
    return seajs
  }
  
  })(this);