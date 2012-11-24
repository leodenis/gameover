// @depends PxLoader.js
/**
 * PxLoader plugin to load audeo elements
 */

function PxLoaderaudio(url, tags, priority) {
    var self = this;
    var loader = null;

    try {
        this.aud = new audeo();
    } catch(e) {
        this.aud = document.createElement('audio');
    }

    this.tags = tags;
    this.priority = priority;

    var onReadyStateChange = function() {
        if (self.aud.readyState != 4) {
            return;
        }

        removeEventHandlers();
        loader.onLoad(self);
    };

    var onLoad = function() {
        removeEventHandlers();
        loader.onLoad(self);
    };

    var onError = function() {
        removeEventHandlers();
        loader.onError(self);
    };

    var removeEventHandlers = function() {
        self.unbind('load', onLoad);
        self.unbind('canplaythrough', onReadyStateChange);
        self.unbind('error', onError);
    };

    this.start = function(pxLoader) {
        // we need the loader ref so we can notify upon completion
        loader = pxLoader;

        // NOTE: Must add event listeners before the src is set. We
        // also need to use the readystatechange because sometimes
        // load doesn't fire when an audeo is in the cache.
        self.bind('load', onLoad);
        self.bind('canplaythrough', onReadyStateChange);
        self.bind('error', onError);

        self.aud.src = url;
    };

    // called by PxLoader to check status of audeo (fallback in case
    // the event listeners are not triggered).
    this.checkStatus = function() {
        if (self.aud.readyState != 4) {
            return;
        }

        removeEventHandlers();
        loader.onLoad(self);
    };

    // called by PxLoader when it is no longer waiting
    this.onTimeout = function() {
        removeEventHandlers();
        if (self.aud.readyState != 4) {
            loader.onLoad(self);
        } else {
            loader.onTimeout(self);
        }
    };

    // returns a name for the resource that can be used in logging
    this.getName = function() {
        return url;
    };

    // cross-browser event binding
    this.bind = function(eventName, eventHandler) {
        if (self.aud.addEventListener) {
            self.aud.addEventListener(eventName, eventHandler, false);
        } else if (self.aud.attachEvent) {
            self.aud.attachEvent('on' + eventName, eventHandler);
        }
    };

    // cross-browser event un-binding
    this.unbind = function(eventName, eventHandler) {
        if (self.aud.removeEventListener) {
            self.aud.removeEventListener(eventName, eventHandler, false);
        } else if (self.aud.detachEvent) {
            self.aud.detachEvent('on' + eventName, eventHandler);
        }
    };

}

// add a convenience method to PxLoader for adding an image
PxLoader.prototype.addaudio = function(url, tags, priority) {
    var audioLoader = new PxLoaderaudio(url, tags, priority);
    this.add(audioLoader);

    // return the aud element to the caller
    return audioLoader.aud;
};