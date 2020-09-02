/******/ (function(modules) { // webpackBootstrap
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var chunk = require("./" + "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest() {
/******/ 		try {
/******/ 			var update = require("./" + "" + hotCurrentHash + ".hot-update.json");
/******/ 		} catch (e) {
/******/ 			return Promise.resolve();
/******/ 		}
/******/ 		return Promise.resolve(update);
/******/ 	}
/******/
/******/ 	//eslint-disable-next-line no-unused-vars
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "799428a3c933367588f3";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_selfInvalidated: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 			invalidate: function() {
/******/ 				this._selfInvalidated = true;
/******/ 				switch (hotStatus) {
/******/ 					case "idle":
/******/ 						hotUpdate = {};
/******/ 						hotUpdate[moduleId] = modules[moduleId];
/******/ 						hotSetStatus("ready");
/******/ 						break;
/******/ 					case "ready":
/******/ 						hotApplyInvalidatedModule(moduleId);
/******/ 						break;
/******/ 					case "prepare":
/******/ 					case "check":
/******/ 					case "dispose":
/******/ 					case "apply":
/******/ 						(hotQueuedInvalidatedModules =
/******/ 							hotQueuedInvalidatedModules || []).push(moduleId);
/******/ 						break;
/******/ 					default:
/******/ 						// ignore requests in error states
/******/ 						break;
/******/ 				}
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash, hotQueuedInvalidatedModules;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus(hotApplyInvalidatedModules() ? "ready" : "idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "main";
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 		return hotApplyInternal(options);
/******/ 	}
/******/
/******/ 	function hotApplyInternal(options) {
/******/ 		hotApplyInvalidatedModules();
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (
/******/ 					!module ||
/******/ 					(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 				)
/******/ 					continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted &&
/******/ 				// removed self-accepted modules should not be required
/******/ 				appliedUpdate[moduleId] !== warnUnexpectedRequire &&
/******/ 				// when called invalidate self-accepting is not possible
/******/ 				!installedModules[moduleId].hot._selfInvalidated
/******/ 			) {
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					parents: installedModules[moduleId].parents.slice(),
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		if (hotUpdateNewHash !== undefined) {
/******/ 			hotCurrentHash = hotUpdateNewHash;
/******/ 			hotUpdateNewHash = undefined;
/******/ 		}
/******/ 		hotUpdate = undefined;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = item.parents;
/******/ 			hotCurrentChildModule = moduleId;
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		if (hotQueuedInvalidatedModules) {
/******/ 			return hotApplyInternal(options).then(function(list) {
/******/ 				outdatedModules.forEach(function(moduleId) {
/******/ 					if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 				});
/******/ 				return list;
/******/ 			});
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	function hotApplyInvalidatedModules() {
/******/ 		if (hotQueuedInvalidatedModules) {
/******/ 			if (!hotUpdate) hotUpdate = {};
/******/ 			hotQueuedInvalidatedModules.forEach(hotApplyInvalidatedModule);
/******/ 			hotQueuedInvalidatedModules = undefined;
/******/ 			return true;
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApplyInvalidatedModule(moduleId) {
/******/ 		if (!Object.prototype.hasOwnProperty.call(hotUpdate, moduleId))
/******/ 			hotUpdate[moduleId] = modules[moduleId];
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/webpack/hot/log-apply-result.js":
/*!*****************************************!*\
  !*** (webpack)/hot/log-apply-result.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/*\n\tMIT License http://www.opensource.org/licenses/mit-license.php\n\tAuthor Tobias Koppers @sokra\n*/\nmodule.exports = function(updatedModules, renewedModules) {\n\tvar unacceptedModules = updatedModules.filter(function(moduleId) {\n\t\treturn renewedModules && renewedModules.indexOf(moduleId) < 0;\n\t});\n\tvar log = __webpack_require__(/*! ./log */ \"./node_modules/webpack/hot/log.js\");\n\n\tif (unacceptedModules.length > 0) {\n\t\tlog(\n\t\t\t\"warning\",\n\t\t\t\"[HMR] The following modules couldn't be hot updated: (They would need a full reload!)\"\n\t\t);\n\t\tunacceptedModules.forEach(function(moduleId) {\n\t\t\tlog(\"warning\", \"[HMR]  - \" + moduleId);\n\t\t});\n\t}\n\n\tif (!renewedModules || renewedModules.length === 0) {\n\t\tlog(\"info\", \"[HMR] Nothing hot updated.\");\n\t} else {\n\t\tlog(\"info\", \"[HMR] Updated modules:\");\n\t\trenewedModules.forEach(function(moduleId) {\n\t\t\tif (typeof moduleId === \"string\" && moduleId.indexOf(\"!\") !== -1) {\n\t\t\t\tvar parts = moduleId.split(\"!\");\n\t\t\t\tlog.groupCollapsed(\"info\", \"[HMR]  - \" + parts.pop());\n\t\t\t\tlog(\"info\", \"[HMR]  - \" + moduleId);\n\t\t\t\tlog.groupEnd(\"info\");\n\t\t\t} else {\n\t\t\t\tlog(\"info\", \"[HMR]  - \" + moduleId);\n\t\t\t}\n\t\t});\n\t\tvar numberIds = renewedModules.every(function(moduleId) {\n\t\t\treturn typeof moduleId === \"number\";\n\t\t});\n\t\tif (numberIds)\n\t\t\tlog(\n\t\t\t\t\"info\",\n\t\t\t\t\"[HMR] Consider using the NamedModulesPlugin for module names.\"\n\t\t\t);\n\t}\n};\n\n\n//# sourceURL=webpack:///(webpack)/hot/log-apply-result.js?");

/***/ }),

/***/ "./node_modules/webpack/hot/log.js":
/*!****************************!*\
  !*** (webpack)/hot/log.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var logLevel = \"info\";\n\nfunction dummy() {}\n\nfunction shouldLog(level) {\n\tvar shouldLog =\n\t\t(logLevel === \"info\" && level === \"info\") ||\n\t\t([\"info\", \"warning\"].indexOf(logLevel) >= 0 && level === \"warning\") ||\n\t\t([\"info\", \"warning\", \"error\"].indexOf(logLevel) >= 0 && level === \"error\");\n\treturn shouldLog;\n}\n\nfunction logGroup(logFn) {\n\treturn function(level, msg) {\n\t\tif (shouldLog(level)) {\n\t\t\tlogFn(msg);\n\t\t}\n\t};\n}\n\nmodule.exports = function(level, msg) {\n\tif (shouldLog(level)) {\n\t\tif (level === \"info\") {\n\t\t\tconsole.log(msg);\n\t\t} else if (level === \"warning\") {\n\t\t\tconsole.warn(msg);\n\t\t} else if (level === \"error\") {\n\t\t\tconsole.error(msg);\n\t\t}\n\t}\n};\n\n/* eslint-disable node/no-unsupported-features/node-builtins */\nvar group = console.group || dummy;\nvar groupCollapsed = console.groupCollapsed || dummy;\nvar groupEnd = console.groupEnd || dummy;\n/* eslint-enable node/no-unsupported-features/node-builtins */\n\nmodule.exports.group = logGroup(group);\n\nmodule.exports.groupCollapsed = logGroup(groupCollapsed);\n\nmodule.exports.groupEnd = logGroup(groupEnd);\n\nmodule.exports.setLogLevel = function(level) {\n\tlogLevel = level;\n};\n\nmodule.exports.formatError = function(err) {\n\tvar message = err.message;\n\tvar stack = err.stack;\n\tif (!stack) {\n\t\treturn message;\n\t} else if (stack.indexOf(message) < 0) {\n\t\treturn message + \"\\n\" + stack;\n\t} else {\n\t\treturn stack;\n\t}\n};\n\n\n//# sourceURL=webpack:///(webpack)/hot/log.js?");

/***/ }),

/***/ "./node_modules/webpack/hot/poll.js?100":
/*!*********************************!*\
  !*** (webpack)/hot/poll.js?100 ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* WEBPACK VAR INJECTION */(function(__resourceQuery) {/*\n\tMIT License http://www.opensource.org/licenses/mit-license.php\n\tAuthor Tobias Koppers @sokra\n*/\n/*globals __resourceQuery */\nif (true) {\n\tvar hotPollInterval = +__resourceQuery.substr(1) || 10 * 60 * 1000;\n\tvar log = __webpack_require__(/*! ./log */ \"./node_modules/webpack/hot/log.js\");\n\n\tvar checkForUpdate = function checkForUpdate(fromUpdate) {\n\t\tif (module.hot.status() === \"idle\") {\n\t\t\tmodule.hot\n\t\t\t\t.check(true)\n\t\t\t\t.then(function(updatedModules) {\n\t\t\t\t\tif (!updatedModules) {\n\t\t\t\t\t\tif (fromUpdate) log(\"info\", \"[HMR] Update applied.\");\n\t\t\t\t\t\treturn;\n\t\t\t\t\t}\n\t\t\t\t\t__webpack_require__(/*! ./log-apply-result */ \"./node_modules/webpack/hot/log-apply-result.js\")(updatedModules, updatedModules);\n\t\t\t\t\tcheckForUpdate(true);\n\t\t\t\t})\n\t\t\t\t.catch(function(err) {\n\t\t\t\t\tvar status = module.hot.status();\n\t\t\t\t\tif ([\"abort\", \"fail\"].indexOf(status) >= 0) {\n\t\t\t\t\t\tlog(\"warning\", \"[HMR] Cannot apply update.\");\n\t\t\t\t\t\tlog(\"warning\", \"[HMR] \" + log.formatError(err));\n\t\t\t\t\t\tlog(\"warning\", \"[HMR] You need to restart the application!\");\n\t\t\t\t\t} else {\n\t\t\t\t\t\tlog(\"warning\", \"[HMR] Update failed: \" + log.formatError(err));\n\t\t\t\t\t}\n\t\t\t\t});\n\t\t}\n\t};\n\tsetInterval(checkForUpdate, hotPollInterval);\n} else {}\n\n/* WEBPACK VAR INJECTION */}.call(this, \"?100\"))\n\n//# sourceURL=webpack:///(webpack)/hot/poll.js?");

/***/ }),

/***/ "./src/api/authenticate.ts":
/*!*********************************!*\
  !*** ./src/api/authenticate.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\n/**\n * Check the login details\n *\n * @param username\n * @param password\n */\nexports.default = (username, password) => new Promise(resolve => resolve(username === \"username\" && password === \"password\"));\n\n\n//# sourceURL=webpack:///./src/api/authenticate.ts?");

/***/ }),

/***/ "./src/api/country.ts":
/*!****************************!*\
  !*** ./src/api/country.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst country_1 = __importDefault(__webpack_require__(/*! ../configs/country */ \"./src/configs/country.ts\"));\n/**\n * API to get the countries, sometimes this fails.\n *\n */\nexports.default = () => new Promise((resolve, reject) => {\n    setTimeout(() => (Math.round(Math.random()) === 0 ? resolve(country_1.default) : reject()), 100);\n});\n\n\n//# sourceURL=webpack:///./src/api/country.ts?");

/***/ }),

/***/ "./src/configs/country.ts":
/*!********************************!*\
  !*** ./src/configs/country.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\n// Do not use this file directly, \n// please use the default export from src/api/country.ts\nexports.default = [\n    {\n        name: \"AFGHANISTAN\",\n        code: \"afg\",\n        population: 241394\n    },\n    {\n        name: \"ALBANIA\",\n        code: \"alb\",\n        population: 896028\n    },\n    {\n        name: \"ALGERIA\",\n        code: \"alg\",\n        population: 117046\n    },\n    {\n        name: \"AMERICAN SAMOA\",\n        code: \"asa\",\n        population: 732160\n    },\n    {\n        name: \"ANDORRA\",\n        code: \"and\",\n        population: 997936\n    },\n    {\n        name: \"ANGOLA\",\n        code: \"ang\",\n        population: 702524\n    },\n    {\n        name: \"ANTIGUA AND BARBUDA\",\n        code: \"ant\",\n        population: 502926\n    },\n    {\n        name: \"ARGENTINA\",\n        code: \"arg\",\n        population: 784\n    },\n    {\n        name: \"ARMENIA\",\n        code: \"arm\",\n        population: 980521\n    },\n    {\n        name: \"ARUBA\",\n        code: \"aru\",\n        population: 819221\n    },\n    {\n        name: \"AUSTRALIA\",\n        code: \"aus\",\n        population: 983385\n    },\n    {\n        name: \"AUSTRIA\",\n        code: \"aut\",\n        population: 400775\n    },\n    {\n        name: \"AZERBAIJAN\",\n        code: \"aze\",\n        population: 711697\n    },\n    {\n        name: \"BAHAMAS\",\n        code: \"bah\",\n        population: 351666\n    },\n    {\n        name: \"BAHRAIN\",\n        code: \"brn\",\n        population: 937813\n    },\n    {\n        name: \"BANGLADESH\",\n        code: \"ban\",\n        population: 833358\n    },\n    {\n        name: \"BARBADOS\",\n        code: \"bar\",\n        population: 206573\n    },\n    {\n        name: \"BELARUS\",\n        code: \"blr\",\n        population: 211381\n    },\n    {\n        name: \"BELGIUM\",\n        code: \"bel\",\n        population: 135183\n    },\n    {\n        name: \"BELIZE\",\n        code: \"biz\",\n        population: 786189\n    },\n    {\n        name: \"BENIN\",\n        code: \"ben\",\n        population: 810766\n    },\n    {\n        name: \"BERMUDA\",\n        code: \"ber\",\n        population: 564040\n    },\n    {\n        name: \"BHUTAN\",\n        code: \"bhu\",\n        population: 756145\n    },\n    {\n        name: \"BOLIVIA\",\n        code: \"bol\",\n        population: 5450\n    },\n    {\n        name: \"BOSNIA AND HERZEGOVINA\",\n        code: \"bih\",\n        population: 90065\n    },\n    {\n        name: \"BOTSWANA\",\n        code: \"bot\",\n        population: 469157\n    },\n    {\n        name: \"BRAZIL\",\n        code: \"bra\",\n        population: 114142\n    },\n    {\n        name: \"BRUNEI DARUSSALAM\",\n        code: \"bru\",\n        population: 669358\n    },\n    {\n        name: \"BULGARIA\",\n        code: \"bul\",\n        population: 469515\n    },\n    {\n        name: \"BURKINA FASO\",\n        code: \"bur\",\n        population: 970068\n    },\n    {\n        name: \"BURUNDI\",\n        code: \"bdi\",\n        population: 938420\n    },\n    {\n        name: \"CAMBODIA\",\n        code: \"cam\",\n        population: 923351\n    },\n    {\n        name: \"CAMEROON\",\n        code: \"cmr\",\n        population: 728258\n    },\n    {\n        name: \"CANADA\",\n        code: \"can\",\n        population: 911597\n    },\n    {\n        name: \"CAPE VERDE\",\n        code: \"cpv\",\n        population: 631544\n    },\n    {\n        name: \"CAYMAN ISLANDS\",\n        code: \"cay\",\n        population: 570561\n    },\n    {\n        name: \"CENTRAL AFRICAN REPUBLIC\",\n        code: \"caf\",\n        population: 642907\n    },\n    {\n        name: \"CHAD\",\n        code: \"cha\",\n        population: 918904\n    },\n    {\n        name: \"CHILE\",\n        code: \"chi\",\n        population: 142171\n    },\n    {\n        name: \"CHINESE TAIPEI\",\n        code: \"tpe\",\n        population: 618908\n    },\n    {\n        name: \"COLOMBIA\",\n        code: \"col\",\n        population: 507328\n    },\n    {\n        name: \"COMOROS\",\n        code: \"com\",\n        population: 683571\n    },\n    {\n        name: \"CONGO\",\n        code: \"cgo\",\n        population: 125854\n    },\n    {\n        name: \"COOK ISLANDS\",\n        code: \"cok\",\n        population: 989099\n    },\n    {\n        name: \"COSTA RICA\",\n        code: \"crc\",\n        population: 205562\n    },\n    {\n        name: \"CÔTE D'IVOIRE\",\n        code: \"civ\",\n        population: 211137\n    },\n    {\n        name: \"CROATIA\",\n        code: \"cro\",\n        population: 468989\n    },\n    {\n        name: \"CUBA\",\n        code: \"cub\",\n        population: 51824\n    },\n    {\n        name: \"CYPRUS\",\n        code: \"cyp\",\n        population: 727423\n    },\n    {\n        name: \"CZECH REPUBLIC\",\n        code: \"cze\",\n        population: 455443\n    },\n    {\n        name: \"DEMOCRATIC PEOPLE'S REPUBLIC OF KOREA\",\n        code: \"prk\",\n        population: 952007\n    },\n    {\n        name: \"DEMOCRATIC REPUBLIC OF THE CONGO\",\n        code: \"cod\",\n        population: 285603\n    },\n    {\n        name: \"DENMARK\",\n        code: \"den\",\n        population: 634107\n    },\n    {\n        name: \"DJIBOUTI\",\n        code: \"dji\",\n        population: 899040\n    },\n    {\n        name: \"DOMINICAN REPUBLIC\",\n        code: \"dom\",\n        population: 120633\n    },\n    {\n        name: \"DOMINIQUE\",\n        code: \"dma\",\n        population: 884341\n    },\n    {\n        name: \"ECUADOR\",\n        code: \"ecu\",\n        population: 997972\n    },\n    {\n        name: \"EGYPT\",\n        code: \"egy\",\n        population: 293051\n    },\n    {\n        name: \"EL SALVADOR\",\n        code: \"esa\",\n        population: 993771\n    },\n    {\n        name: \"EQUATORIAL GUINEA\",\n        code: \"geq\",\n        population: 572028\n    },\n    {\n        name: \"ERITREA\",\n        code: \"eri\",\n        population: 317754\n    },\n    {\n        name: \"ESTONIA\",\n        code: \"est\",\n        population: 321258\n    },\n    {\n        name: \"ESWATINI\",\n        code: \"swz\",\n        population: 943107\n    },\n    {\n        name: \"ETHIOPIA\",\n        code: \"eth\",\n        population: 49985\n    },\n    {\n        name: \"FEDERATED STATES OF MICRONESIA\",\n        code: \"fsm\",\n        population: 350948\n    },\n    {\n        name: \"FIJI\",\n        code: \"fij\",\n        population: 558140\n    },\n    {\n        name: \"FINLAND\",\n        code: \"fin\",\n        population: 208988\n    },\n    {\n        name: \"FRANCE\",\n        code: \"fra\",\n        population: 569157\n    },\n    {\n        name: \"GABON\",\n        code: \"gab\",\n        population: 231338\n    },\n    {\n        name: \"GAMBIA\",\n        code: \"gam\",\n        population: 921370\n    },\n    {\n        name: \"GEORGIA\",\n        code: \"geo\",\n        population: 708057\n    },\n    {\n        name: \"GERMANY\",\n        code: \"ger\",\n        population: 582313\n    },\n    {\n        name: \"GHANA\",\n        code: \"gha\",\n        population: 589603\n    },\n    {\n        name: \"GREAT BRITAIN\",\n        code: \"gbr\",\n        population: 442346\n    },\n    {\n        name: \"GREECE\",\n        code: \"gre\",\n        population: 629884\n    },\n    {\n        name: \"GRENADA\",\n        code: \"grn\",\n        population: 179610\n    },\n    {\n        name: \"GUAM\",\n        code: \"gum\",\n        population: 984764\n    },\n    {\n        name: \"GUATEMALA\",\n        code: \"gua\",\n        population: 319275\n    },\n    {\n        name: \"GUINEA\",\n        code: \"gui\",\n        population: 522026\n    },\n    {\n        name: \"GUINEA-BISSAU\",\n        code: \"gbs\",\n        population: 769014\n    },\n    {\n        name: \"GUYANA\",\n        code: \"guy\",\n        population: 103662\n    },\n    {\n        name: \"HAITI\",\n        code: \"hai\",\n        population: 40085\n    },\n    {\n        name: \"HONDURAS\",\n        code: \"hon\",\n        population: 770559\n    },\n    {\n        name: \"HONG KONG, CHINA\",\n        code: \"hkg\",\n        population: 28208\n    },\n    {\n        name: \"HUNGARY\",\n        code: \"hun\",\n        population: 952069\n    },\n    {\n        name: \"ICELAND\",\n        code: \"isl\",\n        population: 993031\n    },\n    {\n        name: \"INDIA\",\n        code: \"ind\",\n        population: 17370\n    },\n    {\n        name: \"INDONESIA\",\n        code: \"ina\",\n        population: 854035\n    },\n    {\n        name: \"IRAQ\",\n        code: \"irq\",\n        population: 563508\n    },\n    {\n        name: \"IRELAND\",\n        code: \"irl\",\n        population: 391828\n    },\n    {\n        name: \"ISLAMIC REPUBLIC OF IRAN\",\n        code: \"iri\",\n        population: 369685\n    },\n    {\n        name: \"ISRAEL\",\n        code: \"isr\",\n        population: 956347\n    },\n    {\n        name: \"ITALY\",\n        code: \"ita\",\n        population: 151486\n    },\n    {\n        name: \"JAMAICA\",\n        code: \"jam\",\n        population: 52482\n    },\n    {\n        name: \"JAPAN\",\n        code: \"jpn\",\n        population: 858183\n    },\n    {\n        name: \"JORDAN\",\n        code: \"jor\",\n        population: 604369\n    },\n    {\n        name: \"KAZAKHSTAN\",\n        code: \"kaz\",\n        population: 79500\n    },\n    {\n        name: \"KENYA\",\n        code: \"ken\",\n        population: 284173\n    },\n    {\n        name: \"KIRIBATI\",\n        code: \"kir\",\n        population: 895184\n    },\n    {\n        name: \"KOSOVO\",\n        code: \"kos\",\n        population: 982016\n    },\n    {\n        name: \"KUWAIT\",\n        code: \"kuw\",\n        population: 814903\n    },\n    {\n        name: \"KYRGYZSTAN\",\n        code: \"kgz\",\n        population: 690875\n    },\n    {\n        name: \"LAO PEOPLE'S DEMOCRATIC REPUBLIC\",\n        code: \"lao\",\n        population: 396707\n    },\n    {\n        name: \"LATVIA\",\n        code: \"lat\",\n        population: 716395\n    },\n    {\n        name: \"LEBANON\",\n        code: \"lbn\",\n        population: 318242\n    },\n    {\n        name: \"LESOTHO\",\n        code: \"les\",\n        population: 735484\n    },\n    {\n        name: \"LIBERIA\",\n        code: \"lbr\",\n        population: 902040\n    },\n    {\n        name: \"LIBYA\",\n        code: \"lba\",\n        population: 350869\n    },\n    {\n        name: \"LIECHTENSTEIN\",\n        code: \"lie\",\n        population: 555070\n    },\n    {\n        name: \"LITHUANIA\",\n        code: \"ltu\",\n        population: 89210\n    },\n    {\n        name: \"LUXEMBOURG\",\n        code: \"lux\",\n        population: 581372\n    },\n    {\n        name: \"MADAGASCAR\",\n        code: \"mad\",\n        population: 576158\n    },\n    {\n        name: \"MALAWI\",\n        code: \"maw\",\n        population: 48979\n    },\n    {\n        name: \"MALAYSIA\",\n        code: \"mas\",\n        population: 133058\n    },\n    {\n        name: \"MALDIVES\",\n        code: \"mdv\",\n        population: 254244\n    },\n    {\n        name: \"MALI\",\n        code: \"mli\",\n        population: 964697\n    },\n    {\n        name: \"MALTA\",\n        code: \"mlt\",\n        population: 373191\n    },\n    {\n        name: \"MARSHALL ISLANDS\",\n        code: \"mhl\",\n        population: 699020\n    },\n    {\n        name: \"MAURITANIA\",\n        code: \"mtn\",\n        population: 118685\n    },\n    {\n        name: \"MAURITIUS\",\n        code: \"mri\",\n        population: 759078\n    },\n    {\n        name: \"MEXICO\",\n        code: \"mex\",\n        population: 580413\n    },\n    {\n        name: \"MONACO\",\n        code: \"mon\",\n        population: 128231\n    },\n    {\n        name: \"MONGOLIA\",\n        code: \"mgl\",\n        population: 727136\n    },\n    {\n        name: \"MONTENEGRO\",\n        code: \"mne\",\n        population: 845166\n    },\n    {\n        name: \"MOROCCO\",\n        code: \"mar\",\n        population: 992513\n    },\n    {\n        name: \"MOZAMBIQUE\",\n        code: \"moz\",\n        population: 668772\n    },\n    {\n        name: \"MYANMAR\",\n        code: \"mya\",\n        population: 599371\n    },\n    {\n        name: \"NAMIBIA\",\n        code: \"nam\",\n        population: 115047\n    },\n    {\n        name: \"NAURU\",\n        code: \"nru\",\n        population: 581694\n    },\n    {\n        name: \"NEPAL\",\n        code: \"nep\",\n        population: 191297\n    },\n    {\n        name: \"NETHERLANDS\",\n        code: \"ned\",\n        population: 370219\n    },\n    {\n        name: \"NEW ZEALAND\",\n        code: \"nzl\",\n        population: 82681\n    },\n    {\n        name: \"NICARAGUA\",\n        code: \"nca\",\n        population: 724040\n    },\n    {\n        name: \"NIGER\",\n        code: \"nig\",\n        population: 986828\n    },\n    {\n        name: \"NIGERIA\",\n        code: \"ngr\",\n        population: 849954\n    },\n    {\n        name: \"NORWAY\",\n        code: \"nor\",\n        population: 367766\n    },\n    {\n        name: \"OMAN\",\n        code: \"oma\",\n        population: 793201\n    },\n    {\n        name: \"PAKISTAN\",\n        code: \"pak\",\n        population: 183329\n    },\n    {\n        name: \"PALAU\",\n        code: \"plw\",\n        population: 372174\n    },\n    {\n        name: \"PALESTINE\",\n        code: \"ple\",\n        population: 90307\n    },\n    {\n        name: \"PANAMA\",\n        code: \"pan\",\n        population: 290335\n    },\n    {\n        name: \"PAPUA NEW GUINEA\",\n        code: \"png\",\n        population: 666879\n    },\n    {\n        name: \"PARAGUAY\",\n        code: \"par\",\n        population: 870102\n    },\n    {\n        name: \"PEOPLE'S REPUBLIC OF CHINA\",\n        code: \"chn\",\n        population: 508102\n    },\n    {\n        name: \"PERU\",\n        code: \"per\",\n        population: 238093\n    },\n    {\n        name: \"PHILIPPINES\",\n        code: \"phi\",\n        population: 19509\n    },\n    {\n        name: \"POLAND\",\n        code: \"pol\",\n        population: 617320\n    },\n    {\n        name: \"PORTUGAL\",\n        code: \"por\",\n        population: 635563\n    },\n    {\n        name: \"PUERTO RICO\",\n        code: \"pur\",\n        population: 451641\n    },\n    {\n        name: \"QATAR\",\n        code: \"qat\",\n        population: 110914\n    },\n    {\n        name: \"REPUBLIC OF KOREA\",\n        code: \"kor\",\n        population: 427165\n    },\n    {\n        name: \"REPUBLIC OF MOLDOVA\",\n        code: \"mda\",\n        population: 943505\n    },\n    {\n        name: \"ROMANIA\",\n        code: \"rou\",\n        population: 715225\n    },\n    {\n        name: \"RUSSIAN FEDERATION\",\n        code: \"rus\",\n        population: 995788\n    },\n    {\n        name: \"RWANDA\",\n        code: \"rwa\",\n        population: 819645\n    },\n    {\n        name: \"SAINT KITTS AND NEVIS\",\n        code: \"skn\",\n        population: 259373\n    },\n    {\n        name: \"SAINT LUCIA\",\n        code: \"lca\",\n        population: 688599\n    },\n    {\n        name: \"SAMOA (UNTIL 1996 WESTERN SAMOA)\",\n        code: \"sam\",\n        population: 819047\n    },\n    {\n        name: \"SAN MARINO\",\n        code: \"smr\",\n        population: 972658\n    },\n    {\n        name: \"SAO TOME AND PRINCIPE\",\n        code: \"stp\",\n        population: 279285\n    },\n    {\n        name: \"SAUDI ARABIA\",\n        code: \"ksa\",\n        population: 879365\n    },\n    {\n        name: \"SENEGAL\",\n        code: \"sen\",\n        population: 374859\n    },\n    {\n        name: \"SERBIA\",\n        code: \"srb\",\n        population: 448449\n    },\n    {\n        name: \"SEYCHELLES\",\n        code: \"sey\",\n        population: 574624\n    },\n    {\n        name: \"SIERRA LEONE\",\n        code: \"sle\",\n        population: 539502\n    },\n    {\n        name: \"SINGAPORE\",\n        code: \"sgp\",\n        population: 218137\n    },\n    {\n        name: \"SLOVAKIA\",\n        code: \"svk\",\n        population: 814790\n    },\n    {\n        name: \"SLOVENIA\",\n        code: \"slo\",\n        population: 639660\n    },\n    {\n        name: \"SOLOMON ISLANDS\",\n        code: \"sol\",\n        population: 441846\n    },\n    {\n        name: \"SOMALIA\",\n        code: \"som\",\n        population: 880686\n    },\n    {\n        name: \"SOUTH AFRICA\",\n        code: \"rsa\",\n        population: 256175\n    },\n    {\n        name: \"SOUTH SUDAN\",\n        code: \"ssd\",\n        population: 418184\n    },\n    {\n        name: \"SPAIN\",\n        code: \"esp\",\n        population: 273510\n    },\n    {\n        name: \"SRI LANKA\",\n        code: \"sri\",\n        population: 27299\n    },\n    {\n        name: \"ST VINCENT AND THE GRENADINES\",\n        code: \"vin\",\n        population: 787644\n    },\n    {\n        name: \"SUDAN\",\n        code: \"sud\",\n        population: 211574\n    },\n    {\n        name: \"SURINAME\",\n        code: \"sur\",\n        population: 122337\n    },\n    {\n        name: \"SWEDEN\",\n        code: \"swe\",\n        population: 241901\n    },\n    {\n        name: \"SWITZERLAND\",\n        code: \"sui\",\n        population: 684600\n    },\n    {\n        name: \"SYRIAN ARAB REPUBLIC\",\n        code: \"syr\",\n        population: 806008\n    },\n    {\n        name: \"TAJIKISTAN\",\n        code: \"tjk\",\n        population: 38452\n    },\n    {\n        name: \"THAILAND\",\n        code: \"tha\",\n        population: 396062\n    },\n    {\n        name: \"THE FORMER YUGOSLAV REPUBLIC OF MACEDONIA\",\n        code: \"mkd\",\n        population: 591710\n    },\n    {\n        name: \"TIMOR-LESTE\",\n        code: \"tls\",\n        population: 493348\n    },\n    {\n        name: \"TOGO\",\n        code: \"tog\",\n        population: 542375\n    },\n    {\n        name: \"TONGA\",\n        code: \"tga\",\n        population: 158704\n    },\n    {\n        name: \"TRINIDAD AND TOBAGO\",\n        code: \"tto\",\n        population: 356719\n    },\n    {\n        name: \"TUNISIA\",\n        code: \"tun\",\n        population: 405004\n    },\n    {\n        name: \"TURKEY\",\n        code: \"tur\",\n        population: 907098\n    },\n    {\n        name: \"TURKMENISTAN\",\n        code: \"tkm\",\n        population: 480433\n    },\n    {\n        name: \"TUVALU\",\n        code: \"tuv\",\n        population: 92544\n    },\n    {\n        name: \"UGANDA\",\n        code: \"uga\",\n        population: 251971\n    },\n    {\n        name: \"UKRAINE\",\n        code: \"ukr\",\n        population: 187184\n    },\n    {\n        name: \"UNITED ARAB EMIRATES\",\n        code: \"uae\",\n        population: 171586\n    },\n    {\n        name: \"UNITED REPUBLIC OF TANZANIA\",\n        code: \"tan\",\n        population: 357157\n    },\n    {\n        name: \"UNITED STATES OF AMERICA\",\n        code: \"usa\",\n        population: 342114\n    },\n    {\n        name: \"URUGUAY\",\n        code: \"uru\",\n        population: 39271\n    },\n    {\n        name: \"UZBEKISTAN\",\n        code: \"uzb\",\n        population: 332063\n    },\n    {\n        name: \"VANUATU\",\n        code: \"van\",\n        population: 435125\n    },\n    {\n        name: \"VENEZUELA\",\n        code: \"ven\",\n        population: 345055\n    },\n    {\n        name: \"VIETNAM\",\n        code: \"vie\",\n        population: 180757\n    },\n    {\n        name: \"VIRGIN ISLANDS, BRITISH\",\n        code: \"ivb\",\n        population: 516762\n    },\n    {\n        name: \"VIRGIN ISLANDS, US\",\n        code: \"isv\",\n        population: 656338\n    },\n    {\n        name: \"YEMEN\",\n        code: \"yem\",\n        population: 150376\n    },\n    {\n        name: \"ZAMBIA\",\n        code: \"zam\",\n        population: 323162\n    },\n    {\n        name: \"ZIMBABWE\",\n        code: \"zim\",\n        population: 967858\n    }\n];\n\n\n//# sourceURL=webpack:///./src/configs/country.ts?");

/***/ }),

/***/ "./src/controllers/authController.ts":
/*!*******************************************!*\
  !*** ./src/controllers/authController.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.login = void 0;\nconst authenticate_1 = __importDefault(__webpack_require__(/*! ../api/authenticate */ \"./src/api/authenticate.ts\"));\nconst redisClient = __webpack_require__(/*! ../storage/redis */ \"./src/storage/redis.ts\");\n/**\n * @api {POST} /api/auth/login User Login\n * @apiDescription This api will authenticate the user\n * @apiExample {js} Example usage:\n *     /api/auth/login\n *\n * @apiBody {String} username\n * @apiBody {String} password\n *\n */\nexports.login = async (req, res) => {\n    try {\n        const { username, password } = req.body;\n        if (!username)\n            return res.status(400).json({ message: `username is required`, success: false });\n        if (!password)\n            return res.status(400).json({ message: `password is required`, success: false });\n        const isAuthorizedUser = await authenticate_1.default(username, password);\n        if (!isAuthorizedUser) {\n            await redisClient.set('isAuthorized', 'false');\n            return res\n                .status(401)\n                .json({ message: 'Invalid Authentication Credentials', success: false });\n        }\n        await redisClient.set('isAuthorized', 'true');\n        return res.status(200).send({\n            message: 'Successful Authentication',\n            success: true,\n        });\n    }\n    catch (err) {\n        return res.status(500).json({ message: err.message });\n    }\n};\n\n\n//# sourceURL=webpack:///./src/controllers/authController.ts?");

/***/ }),

/***/ "./src/controllers/countryController.ts":
/*!**********************************************!*\
  !*** ./src/controllers/countryController.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.countryController = void 0;\nconst country_1 = __importDefault(__webpack_require__(/*! ../api/country */ \"./src/api/country.ts\"));\nconst redisClient = __webpack_require__(/*! ../storage/redis */ \"./src/storage/redis.ts\");\nclass CountryController {\n    constructor() {\n        this.initializeCountries();\n    }\n    async initializeCountries() {\n        try {\n            const countries = await country_1.default();\n            await redisClient.set('countries', JSON.stringify(countries));\n        }\n        catch (err) {\n            console.log('Error occurred during country initialization: ', err);\n        }\n    }\n    /**\n    * @api {GET} /api/countries Get Countries\n    * @apiDescription Get Countries\n    * @apiExample {js} Example usage:\n    *     /api/countries\n    *     /api/countries?sort=population&order=DESC\n    *\n    * @apiQueryParam {String} sort Field to sort\n    * @apiQueryParam {String=['ASC','DESC']} order Sort order\n    *\n    */\n    async getAllCountries(req, res) {\n        try {\n            const orderOptions = ['ASC', 'DESC'];\n            let order = req.query.order ? String(req.query.order) : 'ASC';\n            order = order.toUpperCase();\n            if (!orderOptions.includes(order))\n                return res.status(400).json({ message: `order must be ${orderOptions.join(' or ')}`, success: false });\n            let countries = JSON.parse(await redisClient.get('countries'));\n            // Sort countries by population if sort is defined as 'population'\n            if (req.query.sort === 'population') {\n                countries = countries.sort((a, b) => {\n                    const sortOrder = order === 'ASC' ? 1 : -1;\n                    return a.population < b.population ? -sortOrder : sortOrder;\n                });\n            }\n            return res\n                .status(200)\n                .json({\n                data: countries,\n                success: true\n            });\n        }\n        catch (err) {\n            return res\n                .status(500)\n                .json({\n                message: err.message,\n                success: false\n            });\n        }\n    }\n    /**\n   * @api {GET} /api/countries/:code Get Country\n   * @apiDescription This api will fetch specific Country based on the given code\n   * @apiExample {js} Example usage:\n   *     /api/countries/usa\n   *\n   * @apiParam {String} code\n   *\n   */\n    async getCountry(req, res) {\n        try {\n            const { code } = req.params;\n            const countries = JSON.parse(await redisClient.get('countries'));\n            const existingCountry = (countries.filter((country) => country.code === code))[0];\n            if (existingCountry) {\n                return res\n                    .status(200)\n                    .json({\n                    data: existingCountry,\n                    success: true\n                });\n            }\n            else {\n                return res\n                    .status(404)\n                    .json({\n                    message: `Country doesn't exist!`,\n                    success: false,\n                });\n            }\n        }\n        catch (err) {\n            return res\n                .status(500)\n                .json({\n                message: err.message,\n                success: false\n            });\n        }\n    }\n    /**\n    * @api {PUT} /api/countries/:code Update Country\n    * @apiDescription This api will update Country based on the given code and new data\n    * @apiExample {js} Example usage:\n    *     /api/countries/aus\n    *\n    * @apiParam {String} code\n    *\n    * @apiBody {String} code\n    * @apiBody {String} name\n    * @apiBody {Number} population\n    *\n    */\n    async updateCountry(req, res) {\n        try {\n            const { code } = req.params;\n            const payload = req.body;\n            const countries = JSON.parse(await redisClient.get('countries'));\n            const existingCountry = (countries.filter((country) => country.code === code))[0];\n            if (existingCountry) {\n                const updatedCountries = countries.map((country) => {\n                    if (country.code === code)\n                        country = { ...country, ...payload };\n                    return country;\n                });\n                await redisClient.set('countries', JSON.stringify(updatedCountries));\n                return res\n                    .status(200)\n                    .json({\n                    message: `Country ${existingCountry.name} has been successfully updated.`,\n                    success: true\n                });\n            }\n            else {\n                res\n                    .status(404)\n                    .json({\n                    message: `Country doesn't exist!`,\n                    success: false,\n                });\n            }\n        }\n        catch (err) {\n            return res\n                .status(500)\n                .json({\n                message: err.message,\n                success: false\n            });\n        }\n    }\n    /**\n    * @api {DELETE} /api/countries/:code Delete Country\n    * @apiDescription This api will delete Country based on the given code\n    * @apiExample {js} Example usage:\n    *     /api/countries/usa\n    *\n    * @apiParam {String} code\n    *\n    */\n    async deleteCountry(req, res) {\n        try {\n            const { code } = req.params;\n            const countries = JSON.parse(await redisClient.get('countries'));\n            const existingCountry = (countries.filter((country) => country.code === code))[0];\n            if (existingCountry) {\n                const newCountries = countries.filter((country) => country.code !== code);\n                await redisClient.set('countries', JSON.stringify(newCountries));\n                return res\n                    .status(200)\n                    .json({\n                    message: `Country ${existingCountry.name} has been successfully deleted.`,\n                    success: true\n                });\n            }\n            else {\n                return res\n                    .status(404)\n                    .json({\n                    message: `Country doesn't exist!`,\n                    success: false,\n                });\n            }\n        }\n        catch (err) {\n            return res\n                .status(500)\n                .json({\n                message: err.message,\n                success: false\n            });\n        }\n    }\n}\nexports.countryController = new CountryController();\n\n\n//# sourceURL=webpack:///./src/controllers/countryController.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });\n}) : (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    o[k2] = m[k];\n}));\nvar __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {\n    Object.defineProperty(o, \"default\", { enumerable: true, value: v });\n}) : function(o, v) {\n    o[\"default\"] = v;\n});\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (k !== \"default\" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);\n    __setModuleDefault(result, mod);\n    return result;\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst cors_1 = __importDefault(__webpack_require__(/*! cors */ \"cors\"));\nconst express_1 = __importDefault(__webpack_require__(/*! express */ \"express\"));\nconst dotenv = __importStar(__webpack_require__(/*! dotenv */ \"dotenv\"));\nconst helmet_1 = __importDefault(__webpack_require__(/*! helmet */ \"helmet\"));\nconst morgan_1 = __importDefault(__webpack_require__(/*! morgan */ \"morgan\"));\nconst countryService_1 = __importDefault(__webpack_require__(/*! ./services/countryService */ \"./src/services/countryService.ts\"));\nconst authService_1 = __importDefault(__webpack_require__(/*! ./services/authService */ \"./src/services/authService.ts\"));\ndotenv.config();\nif (!process.env.PORT) {\n    console.log(`Error in getting port.`);\n    process.exit(1);\n}\nconst PORT = parseInt(process.env.PORT, 10);\nconst app = express_1.default();\napp.use(helmet_1.default());\napp.use(cors_1.default());\napp.use(morgan_1.default('tiny'));\napp.use(express_1.default.json());\napp.use('/api/countries', countryService_1.default);\napp.use('/api/auth', authService_1.default);\nconst server = app.listen(PORT, () => {\n    console.log(`Server is listening on port ${PORT}.`);\n});\n\n\n//# sourceURL=webpack:///./src/index.ts?");

/***/ }),

/***/ "./src/middlewares/verifyAuth.ts":
/*!***************************************!*\
  !*** ./src/middlewares/verifyAuth.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst redisClient = __webpack_require__(/*! ../storage/redis */ \"./src/storage/redis.ts\");\nexports.default = async (req, res, next) => {\n    const isAuthenticated = (await redisClient.get('isAuthorized')) === 'true';\n    if (!isAuthenticated) {\n        return res\n            .status(401)\n            .json({ message: 'Unauthorized Access. You must login your valid credentials first.', success: false });\n    }\n    return next();\n};\n\n\n//# sourceURL=webpack:///./src/middlewares/verifyAuth.ts?");

/***/ }),

/***/ "./src/services/authService.ts":
/*!*************************************!*\
  !*** ./src/services/authService.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst express_1 = __importDefault(__webpack_require__(/*! express */ \"express\"));\nconst authController_1 = __webpack_require__(/*! ../controllers/authController */ \"./src/controllers/authController.ts\");\nconst authRouter = express_1.default.Router();\nauthRouter.post('/login', authController_1.login);\nexports.default = authRouter;\n\n\n//# sourceURL=webpack:///./src/services/authService.ts?");

/***/ }),

/***/ "./src/services/countryService.ts":
/*!****************************************!*\
  !*** ./src/services/countryService.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst express_1 = __importDefault(__webpack_require__(/*! express */ \"express\"));\nconst countryController_1 = __webpack_require__(/*! ../controllers/countryController */ \"./src/controllers/countryController.ts\");\nconst { getAllCountries, getCountry, updateCountry, deleteCountry } = countryController_1.countryController;\n// the purpose of this middleware is to ensure that the request is coming from authenticated user\nconst verifyAuth_1 = __importDefault(__webpack_require__(/*! ../middlewares/verifyAuth */ \"./src/middlewares/verifyAuth.ts\"));\nconst countryRouter = express_1.default.Router();\ncountryRouter.get('/', verifyAuth_1.default, getAllCountries);\ncountryRouter.get('/:code', verifyAuth_1.default, getCountry);\ncountryRouter.put('/:code', verifyAuth_1.default, updateCountry);\ncountryRouter.delete('/:code', verifyAuth_1.default, deleteCountry);\nexports.default = countryRouter;\n\n\n//# sourceURL=webpack:///./src/services/countryService.ts?");

/***/ }),

/***/ "./src/storage/redis.ts":
/*!******************************!*\
  !*** ./src/storage/redis.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nconst redis = __webpack_require__(/*! redis */ \"redis\");\nconst { promisify } = __webpack_require__(/*! util */ \"util\");\nconst client = redis.createClient(process.env.REDIS_URL || 'redis://localhost:6379');\nmodule.exports = {\n    ...client,\n    get: promisify(client.get).bind(client),\n    set: promisify(client.set).bind(client),\n    keys: promisify(client.keys).bind(client),\n    mget: promisify(client.mget).bind(client),\n    del: promisify(client.del).bind(client),\n};\n\n\n//# sourceURL=webpack:///./src/storage/redis.ts?");

/***/ }),

/***/ 0:
/*!*************************************************!*\
  !*** multi webpack/hot/poll?100 ./src/index.ts ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! webpack/hot/poll?100 */\"./node_modules/webpack/hot/poll.js?100\");\nmodule.exports = __webpack_require__(/*! ./src/index.ts */\"./src/index.ts\");\n\n\n//# sourceURL=webpack:///multi_webpack/hot/poll?");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"cors\");\n\n//# sourceURL=webpack:///external_%22cors%22?");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"dotenv\");\n\n//# sourceURL=webpack:///external_%22dotenv%22?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express\");\n\n//# sourceURL=webpack:///external_%22express%22?");

/***/ }),

/***/ "helmet":
/*!*************************!*\
  !*** external "helmet" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"helmet\");\n\n//# sourceURL=webpack:///external_%22helmet%22?");

/***/ }),

/***/ "morgan":
/*!*************************!*\
  !*** external "morgan" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"morgan\");\n\n//# sourceURL=webpack:///external_%22morgan%22?");

/***/ }),

/***/ "redis":
/*!************************!*\
  !*** external "redis" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"redis\");\n\n//# sourceURL=webpack:///external_%22redis%22?");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"util\");\n\n//# sourceURL=webpack:///external_%22util%22?");

/***/ })

/******/ });