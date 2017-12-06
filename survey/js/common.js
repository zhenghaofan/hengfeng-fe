String.prototype.jstpl_format = function(ns) {
  function fn(w, g) {
    if (g in ns) {
      return ns[g];
    } else {
      return '';
    }
  };
  return this.replace(/%\(([A-Za-z0-9_|.]+)\)/g, fn);
};

$('.back').click(function() {
  history.go(-1)
})
