import {
  UniversalStore,
  isJSON,
  parse,
  stringify
} from "../_browser-chunks/chunk-MOVZJCSM.js";
import {
  InvalidChannelPageError
} from "../_browser-chunks/chunk-6N2DC7ON.js";
import {
  invariant
} from "../_browser-chunks/chunk-IWQGIXJS.js";
import {
  Channel,
  clearChannel,
  ensureChannel,
  getChannel,
  installNoopChannel,
  requireChannel,
  setChannel
} from "../_browser-chunks/chunk-KK3JJ3E4.js";
import "../_browser-chunks/chunk-MI5GWNNC.js";
import "../_browser-chunks/chunk-LKJ5WGKT.js";
import "../_browser-chunks/chunk-3LY4VQVK.js";
import "../_browser-chunks/chunk-IMSF75WX.js";

// src/channels/postmessage/index.ts
import { logger as logger2, pretty } from "storybook/internal/client-logger";
import * as EVENTS from "storybook/internal/core-events";

// src/shared/utils/local-hosts.ts
var LOOPBACK_HOSTNAMES = ["localhost", "*.localhost", "127.0.0.1"], matchesHostname = (hostname, patterns) => patterns.some(
  (pattern) => pattern.startsWith("*.") ? hostname.endsWith(pattern.slice(1)) : hostname === pattern
);

// src/channels/postmessage/getEventSourceUrl.ts
import { logger } from "storybook/internal/client-logger";
var pickFrameByRefId = (candidates, refId) => {
  if (candidates.length === 1)
    return candidates[0];
  if (!(candidates.length === 0 || !refId))
    return candidates.find(
      (el) => (el.getAttribute("src") ?? "").includes(`refId=${encodeURIComponent(refId)}`)
    );
}, getEventSourceUrl = (event, refId) => {
  let candidates = Array.from(
    document.querySelectorAll("iframe[data-is-storybook]")
  ).filter((element) => {
    try {
      return element.contentWindow?.location.origin === event.source.location.origin && element.contentWindow?.location.pathname === event.source.location.pathname;
    } catch {
    }
    try {
      return element.contentWindow === event.source;
    } catch {
    }
    let src2 = element.getAttribute("src"), origin;
    try {
      if (!src2)
        return !1;
      ({ origin } = new URL(src2, document.location.toString()));
    } catch {
      return !1;
    }
    return origin === event.origin;
  }), src = pickFrameByRefId(candidates, refId)?.getAttribute("src");
  if (src) {
    let { protocol, host, pathname } = new URL(src, document.location.toString());
    return `${protocol}//${host}${pathname}`;
  }
  return candidates.length > 1 && logger.error("found multiple candidates for event source"), null;
};

// src/channels/postmessage/index.ts
var { document: document2, location } = globalThis, KEY = "storybook-channel", CHANNEL_OPTIONS = globalThis.CHANNEL_OPTIONS || {}, defaultEventOptions = { maxDepth: 25 }, getReferrerOrigin = () => {
  try {
    let origin = document2?.referrer && new URL(document2.referrer).origin;
    return origin && origin !== "null" ? origin : null;
  } catch {
    return null;
  }
}, isOnInitialBlankDocument = (frame) => {
  try {
    return frame.location.href === "about:blank";
  } catch {
    return !1;
  }
}, getOriginValidator = () => {
  let own = location?.origin;
  return globalThis.CONFIG_TYPE !== "DEVELOPMENT" || !own || own === "null" ? null : (origin) => {
    if (origin === own)
      return !0;
    try {
      return matchesHostname(new URL(origin).hostname, LOOPBACK_HOSTNAMES);
    } catch {
      return !1;
    }
  };
}, PostMessageTransport = class {
  constructor(config) {
    this.config = config;
    this.connected = !1;
    this.rejectedOrigins = /* @__PURE__ */ new Set();
    if (this.buffer = [], this.originValidator = getOriginValidator(), this.insecureIframeMessaging = globalThis.INSECURE_IFRAME_MESSAGING === !0, this.pinsTargetOrigin = globalThis.CONFIG_TYPE === "DEVELOPMENT" && !this.insecureIframeMessaging, typeof globalThis.addEventListener == "function" && globalThis.addEventListener("message", this.handleEvent.bind(this), !1), config.page !== "manager" && config.page !== "preview")
      throw new InvalidChannelPageError({ page: config.page });
  }
  setHandler(handler) {
    this.handler = (...args) => {
      handler.apply(this, args), !this.connected && this.getLocalFrame().length && (this.flush(), this.connected = !0);
    };
  }
  /**
   * Sends `event` to the associated window. If the window does not yet exist the event will be
   * stored in a buffer and sent when the window exists.
   *
   * @param event
   */
  send(event, options) {
    let {
      target,
      // telejson options
      allowRegExp,
      allowSymbol,
      allowDate,
      allowError,
      allowUndefined,
      maxDepth,
      space
    } = options || {}, eventOptions = Object.fromEntries(
      Object.entries({
        allowRegExp,
        allowSymbol,
        allowDate,
        allowError,
        allowUndefined,
        maxDepth,
        space
      }).filter(([k, v]) => typeof v < "u")
    ), stringifyOptions = {
      ...defaultEventOptions,
      ...CHANNEL_OPTIONS,
      ...eventOptions
    }, frames = this.getFrames(target), query = new URLSearchParams(location?.search || ""), data = stringify(
      {
        key: KEY,
        event,
        refId: query.get("refId")
      },
      stringifyOptions
    );
    return frames.length ? (this.buffer.length && this.flush(), frames.forEach(({ contentWindow, targetOrigin }) => {
      if (!(this.config.page === "manager" && isOnInitialBlankDocument(contentWindow)))
        try {
          contentWindow.postMessage(data, this.pinsTargetOrigin ? targetOrigin : "*");
        } catch {
          logger2.error("sending over postmessage fail");
        }
    }), Promise.resolve(null)) : new Promise((resolve, reject) => {
      this.buffer.push({ event, resolve, reject });
    });
  }
  flush() {
    let { buffer } = this;
    this.buffer = [], buffer.forEach((item) => {
      this.send(item.event).then(item.resolve).catch(item.reject);
    });
  }
  getFrames(target) {
    if (this.config.page === "manager") {
      let list = Array.from(
        document2.querySelectorAll("iframe[data-is-storybook][data-is-loaded]")
      ).flatMap((e) => {
        try {
          return e.contentWindow && e.dataset.isStorybook !== void 0 && e.id === target ? [
            { contentWindow: e.contentWindow, targetOrigin: this.getIframeTargetOrigin(e) }
          ] : [];
        } catch {
          return [];
        }
      });
      return list?.length ? list : this.getCurrentFrames();
    }
    return globalThis.parent && globalThis.parent !== globalThis.self ? [{ contentWindow: globalThis.parent, targetOrigin: this.getManagerTargetOrigin() }] : [];
  }
  getCurrentFrames() {
    return this.config.page === "manager" ? Array.from(
      document2.querySelectorAll('[data-is-storybook="true"]')
    ).flatMap(
      (e) => e.contentWindow ? [{ contentWindow: e.contentWindow, targetOrigin: this.getIframeTargetOrigin(e) }] : []
    ) : globalThis.parent ? [{ contentWindow: globalThis.parent, targetOrigin: this.getManagerTargetOrigin() }] : [];
  }
  getIframeTargetOrigin(element) {
    let src = element.getAttribute("src");
    if (src)
      try {
        let { origin } = new URL(src, document2.location.toString());
        if (origin !== "null")
          return origin;
      } catch {
      }
    return location?.origin && location.origin !== "null" ? location.origin : "*";
  }
  // In composition the manager lives on a different origin than this preview; the referrer
  // identifies which host embedded it.
  getManagerTargetOrigin() {
    let referrerOrigin = getReferrerOrigin();
    return this.originValidator ? referrerOrigin !== null && this.originValidator(referrerOrigin) ? referrerOrigin : location.origin : referrerOrigin ?? "*";
  }
  getLocalFrame() {
    return this.config.page === "manager" ? Array.from(
      document2.querySelectorAll("#storybook-preview-iframe")
    ).flatMap((e) => e.contentWindow ? [e.contentWindow] : []) : globalThis.parent ? [globalThis.parent] : [];
  }
  isAllowedSender(rawEvent) {
    return this.insecureIframeMessaging ? !0 : this.config.page === "manager" ? this.isAllowedToContactManager(rawEvent) : this.config.page === "preview" ? this.isAllowedToContactPreview(rawEvent) : !1;
  }
  // A dev-mode preview only accepts messages from its own origin and from local hosts. A built
  // preview, or one served from an opaque origin, has no validator and accepts any message.
  isAllowedToContactPreview(rawEvent) {
    return !this.originValidator || this.originValidator(rawEvent.origin) ? !0 : (this.warnOnceAboutRejectedSender(
      rawEvent,
      `Ignored Storybook channel message from unexpected origin "${rawEvent.origin}". While it runs in dev mode, this preview only accepts messages from local hosts and its own origin. To accept messages from any origin, set "security.insecureIframeMessaging" to true in the main config of the Storybook serving this preview.`
    ), !1);
  }
  // A channel message reaches the manager only from a preview iframe it rendered itself: the local
  // preview or a composed ref. `event.source` is set by the browser and cannot be forged, but it
  // survives navigation, so in dev mode the message must also come from the origin the iframe was given.
  isAllowedToContactManager(rawEvent) {
    let senderFrame = rawEvent.source ? Array.from(document2.querySelectorAll("iframe")).find(
      (frame) => frame.contentWindow === rawEvent.source
    ) : void 0;
    if (senderFrame?.hasAttribute("data-is-storybook")) {
      if (!this.pinsTargetOrigin)
        return !0;
      let expectedOrigin = this.getIframeTargetOrigin(senderFrame);
      return expectedOrigin === "*" || expectedOrigin === rawEvent.origin ? !0 : (this.warnOnceAboutRejectedSender(
        rawEvent,
        `Ignored Storybook channel message from a registered preview iframe that is on origin "${rawEvent.origin}" instead of "${expectedOrigin}". While it runs in dev mode, the manager only accepts channel messages from the origin each preview iframe was given, so a page the iframe navigated to cannot send them. To accept messages from any origin, set "security.insecureIframeMessaging" to true.`
      ), !1);
    }
    return senderFrame?.hasAttribute("data-is-storybook-thumbnail") || this.warnOnceAboutRejectedSender(
      rawEvent,
      `Ignored Storybook channel message from a window that is not a registered preview iframe (origin "${rawEvent.origin}"). The manager only accepts channel messages from its own preview and composed Storybook iframes, never from a page that embeds it. To accept messages from any window, set "security.insecureIframeMessaging" to true.`
    ), !1;
  }
  warnOnceAboutRejectedSender(rawEvent, message) {
    (typeof rawEvent.data == "string" ? rawEvent.data.includes(KEY) : rawEvent.data?.key === KEY) && !this.rejectedOrigins.has(rawEvent.origin) && (this.rejectedOrigins.add(rawEvent.origin), logger2.warn(message));
  }
  handleEvent(rawEvent) {
    try {
      if (!this.isAllowedSender(rawEvent))
        return;
      let { data } = rawEvent, { key, event, refId } = typeof data == "string" && isJSON(data) ? parse(data, CHANNEL_OPTIONS) : data;
      if (key === KEY) {
        let pageString = this.config.page === "manager" ? '<span style="color: #37D5D3; background: black"> manager </span>' : '<span style="color: #1EA7FD; background: black"> preview </span>', eventString = Object.values(EVENTS).includes(event.type) ? `<span style="color: #FF4785">${event.type}</span>` : `<span style="color: #FFAE00">${event.type}</span>`;
        if (refId && (event.refId = refId), event.source = this.config.page === "preview" ? rawEvent.origin : getEventSourceUrl(rawEvent, refId), !event.source) {
          pretty.error(
            `${pageString} received ${eventString} but was unable to determine the source of the event`
          );
          return;
        }
        let message = `${pageString} received ${eventString} (${data.length})`;
        pretty.debug(
          location.origin !== event.source ? message : `${message} <span style="color: gray">(on ${location.origin} from ${event.source})</span>`,
          ...event.args
        ), invariant(this.handler, "ChannelHandler should be set"), this.config.page === "manager" && this.buffer.length && this.flush(), this.handler(event);
      }
    } catch (error) {
      logger2.error(error);
    }
  }
};

// src/channels/websocket/index.ts
import * as EVENTS2 from "storybook/internal/core-events";
var HEARTBEAT_INTERVAL = 15e3, HEARTBEAT_MAX_LATENCY = 5e3, SERVER_CHANNEL_PATH = "/storybook-server-channel", CHANNEL_OPTIONS2 = globalThis.CHANNEL_OPTIONS || {}, WebsocketTransport = class {
  constructor({
    url,
    onError,
    page,
    createSocket,
    enableHeartbeat = !0
  }) {
    this.buffer = [];
    this.isReady = !1;
    this.isClosed = !1;
    this.pingTimeout = 0;
    this.heartbeatPaused = !1;
    this.enableHeartbeat = !0;
    this.enableHeartbeat = enableHeartbeat, this.socket = createSocket ? createSocket(url) : new WebSocket(url), this.socket.onopen = () => {
      this.isReady = !0, this.heartbeat(), this.flush();
    }, this.socket.onmessage = ({ data }) => {
      let event = typeof data == "string" && isJSON(data) ? parse(data) : data;
      if (invariant(this.handler, "WebsocketTransport handler should be set"), this.heartbeat(), event.type === "ping") {
        this.send({ type: "pong" });
        return;
      }
      this.handler(event);
    }, this.socket.onerror = (e) => {
      onError && onError(e);
    }, this.socket.onclose = (ev) => {
      invariant(this.handler, "WebsocketTransport handler should be set"), this.handler({
        type: EVENTS2.CHANNEL_WS_DISCONNECT,
        args: [{ reason: ev.reason, code: ev.code }],
        from: page || "preview"
      }), this.isClosed = !0, clearTimeout(this.pingTimeout);
    };
  }
  heartbeat() {
    clearTimeout(this.pingTimeout), !(!this.enableHeartbeat || this.heartbeatPaused || this.isClosed) && (this.pingTimeout = setTimeout(() => {
      this.socket.close(3008, "timeout");
    }, HEARTBEAT_INTERVAL + HEARTBEAT_MAX_LATENCY));
  }
  pauseHeartbeat() {
    this.heartbeatPaused = !0, clearTimeout(this.pingTimeout);
  }
  resumeHeartbeat() {
    this.heartbeatPaused = !1, this.isReady && this.heartbeat();
  }
  setHandler(handler) {
    this.handler = handler;
  }
  send(event) {
    this.isClosed || (this.isReady ? this.sendNow(event) : this.sendLater(event));
  }
  sendLater(event) {
    this.buffer.push(event);
  }
  sendNow(event) {
    let data = stringify(event, {
      maxDepth: 15,
      ...CHANNEL_OPTIONS2
    });
    this.socket.send(data);
  }
  flush() {
    let { buffer } = this;
    this.buffer = [], buffer.forEach((event) => this.send(event));
  }
};

// src/channels/index.ts
var channels_default = Channel;
function createBrowserChannel({ page, extraTransports = [] }) {
  let transports = [new PostMessageTransport({ page }), ...extraTransports];
  if (globalThis.CONFIG_TYPE === "DEVELOPMENT") {
    let protocol = window.location.protocol === "http:" ? "ws" : "wss", { hostname, port } = window.location, { wsToken } = globalThis.CHANNEL_OPTIONS || {}, channelUrl = `${protocol}://${hostname}:${port}${SERVER_CHANNEL_PATH}?token=${wsToken}&page=${page}`;
    transports.push(new WebsocketTransport({ url: channelUrl, onError: () => {
    }, page }));
  }
  let channel = new Channel({ transports });
  return UniversalStore.__prepare(
    channel,
    page === "manager" ? UniversalStore.Environment.MANAGER : UniversalStore.Environment.PREVIEW
  ), channel;
}
export {
  Channel,
  HEARTBEAT_INTERVAL,
  HEARTBEAT_MAX_LATENCY,
  PostMessageTransport,
  SERVER_CHANNEL_PATH,
  WebsocketTransport,
  clearChannel,
  createBrowserChannel,
  channels_default as default,
  ensureChannel,
  getChannel,
  installNoopChannel,
  requireChannel,
  setChannel
};
