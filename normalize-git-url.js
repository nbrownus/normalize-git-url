var url = require("url")

module.exports = function normalize (u) {
  var parsed = url.parse(u, true)

  // figure out what we should check out.
  var checkout = parsed.hash && parsed.hash.substr(1) || "master"
  var strip = function (str) { return str }

  parsed.hash = ""

  // git is so tricky!
  // if the path is like ssh://foo:22/some/path then it works, but
  // it needs the ssh://
  // If the path is like ssh://foo:some/path then it works, but
  // only if you remove the ssh://
  if (parsed.protocol) {
    parsed.protocol = parsed.protocol.replace(/^git\+/, "")

    // ssh paths may be scp style, keep url.format from adding a / to the front
    if (parsed.pathname.length >= 2 && parsed.pathname[1] == ":" && u.indexOf(parsed.pathname) < 0) {
      strip = function (str) {
        return str.replace(parsed.pathname, parsed.pathname.slice(1))
      }
    }
  }

  return {
    url : strip(url.format(parsed)),
    branch : checkout
  }
}
