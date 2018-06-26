﻿/*
 AngularJS v1.4.7
 (c) 2010-2015 Google, Inc. http://angularjs.org
 License: MIT
*/
(function (p, c, C) {
    'use strict'; function v(r, h, g) {
        return {
            restrict: "ECA", terminal: !0, priority: 400, transclude: "element", link: function (a, f, b, d, y) {
                function z() { k && (g.cancel(k), k = null); l && (l.$destroy(), l = null); m && (k = g.leave(m), k.then(function () { k = null }), m = null) } function x() {
                    var b = r.current && r.current.locals; if (c.isDefined(b && b.$template)) {
                        var b = a.$new(), d = r.current; m = y(b, function (b) { g.enter(b, null, m || f).then(function () { !c.isDefined(t) || t && !a.$eval(t) || h() }); z() }); l = d.scope = b; l.$emit("$viewContentLoaded");
                        l.$eval(w)
                    } else z()
                } var l, m, k, t = b.autoscroll, w = b.onload || ""; a.$on("$routeChangeSuccess", x); x()
            }
        }
    } function A(c, h, g) { return { restrict: "ECA", priority: -400, link: function (a, f) { var b = g.current, d = b.locals; f.html(d.$template); var y = c(f.contents()); b.controller && (d.$scope = a, d = h(b.controller, d), b.controllerAs && (a[b.controllerAs] = d), f.data("$ngControllerController", d), f.children().data("$ngControllerController", d)); y(a) } } } p = c.module("ngRoute", ["ng"]).provider("$route", function () {
        function r(a, f) {
            return c.extend(Object.create(a),
            f)
        } function h(a, c) { var b = c.caseInsensitiveMatch, d = { originalPath: a, regexp: a }, g = d.keys = []; a = a.replace(/([().])/g, "\\$1").replace(/(\/)?:(\w+)([\?\*])?/g, function (a, c, b, d) { a = "?" === d ? d : null; d = "*" === d ? d : null; g.push({ name: b, optional: !!a }); c = c || ""; return "" + (a ? "" : c) + "(?:" + (a ? c : "") + (d && "(.+?)" || "([^/]+)") + (a || "") + ")" + (a || "") }).replace(/([\/$\*])/g, "\\$1"); d.regexp = new RegExp("^" + a + "$", b ? "i" : ""); return d } var g = {}; this.when = function (a, f) {
            var b = c.copy(f); c.isUndefined(b.reloadOnSearch) && (b.reloadOnSearch = !0);
            c.isUndefined(b.caseInsensitiveMatch) && (b.caseInsensitiveMatch = this.caseInsensitiveMatch); g[a] = c.extend(b, a && h(a, b)); if (a) { var d = "/" == a[a.length - 1] ? a.substr(0, a.length - 1) : a + "/"; g[d] = c.extend({ redirectTo: a }, h(d, b)) } return this
        }; this.caseInsensitiveMatch = !1; this.otherwise = function (a) { "string" === typeof a && (a = { redirectTo: a }); this.when(null, a); return this }; this.$get = ["$rootScope", "$location", "$routeParams", "$q", "$injector", "$templateRequest", "$sce", function (a, f, b, d, h, p, x) {
            function l(b) {
                var e = s.current;
                (v = (n = k()) && e && n.$$route === e.$$route && c.equals(n.pathParams, e.pathParams) && !n.reloadOnSearch && !w) || !e && !n || a.$broadcast("$routeChangeStart", n, e).defaultPrevented && b && b.preventDefault()
            } function m() {
                var u = s.current, e = n; if (v) u.params = e.params, c.copy(u.params, b), a.$broadcast("$routeUpdate", u); else if (e || u) w = !1, (s.current = e) && e.redirectTo && (c.isString(e.redirectTo) ? f.path(t(e.redirectTo, e.params)).search(e.params).replace() : f.url(e.redirectTo(e.pathParams, f.path(), f.search())).replace()), d.when(e).then(function () {
                    if (e) {
                        var a =
                        c.extend({}, e.resolve), b, f; c.forEach(a, function (b, e) { a[e] = c.isString(b) ? h.get(b) : h.invoke(b, null, null, e) }); c.isDefined(b = e.template) ? c.isFunction(b) && (b = b(e.params)) : c.isDefined(f = e.templateUrl) && (c.isFunction(f) && (f = f(e.params)), c.isDefined(f) && (e.loadedTemplateUrl = x.valueOf(f), b = p(f))); c.isDefined(b) && (a.$template = b); return d.all(a)
                    }
                }).then(function (f) { e == s.current && (e && (e.locals = f, c.copy(e.params, b)), a.$broadcast("$routeChangeSuccess", e, u)) }, function (b) {
                    e == s.current && a.$broadcast("$routeChangeError",
                    e, u, b)
                })
            } function k() { var a, b; c.forEach(g, function (d, g) { var q; if (q = !b) { var h = f.path(); q = d.keys; var l = {}; if (d.regexp) if (h = d.regexp.exec(h)) { for (var k = 1, m = h.length; k < m; ++k) { var n = q[k - 1], p = h[k]; n && p && (l[n.name] = p) } q = l } else q = null; else q = null; q = a = q } q && (b = r(d, { params: c.extend({}, f.search(), a), pathParams: a }), b.$$route = d) }); return b || g[null] && r(g[null], { params: {}, pathParams: {} }) } function t(a, b) {
                var d = []; c.forEach((a || "").split(":"), function (a, c) {
                    if (0 === c) d.push(a); else {
                        var f = a.match(/(\w+)(?:[?*])?(.*)/),
                        g = f[1]; d.push(b[g]); d.push(f[2] || ""); delete b[g]
                    }
                }); return d.join("")
            } var w = !1, n, v, s = { routes: g, reload: function () { w = !0; a.$evalAsync(function () { l(); m() }) }, updateParams: function (a) { if (this.current && this.current.$$route) a = c.extend({}, this.current.params, a), f.path(t(this.current.$$route.originalPath, a)), f.search(a); else throw B("norout"); } }; a.$on("$locationChangeStart", l); a.$on("$locationChangeSuccess", m); return s
        }]
    }); var B = c.$$minErr("ngRoute"); p.provider("$routeParams", function () { this.$get = function () { return {} } });
    p.directive("ngView", v); p.directive("ngView", A); v.$inject = ["$route", "$anchorScroll", "$animate"]; A.$inject = ["$compile", "$controller", "$route"]
})(window, window.angular);
//# sourceMappingURL=angular-route.min.js.map