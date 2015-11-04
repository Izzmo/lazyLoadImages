define([], function () {
  'use strict';

  function isAboveTheFold(node) {
    if ('object' !== typeof node) return;

    var w = window.innerWidth,
        h = window.innerHeight,
        x = node.x,
        y = node.y,
        scrollX = window.scrollX,
        scrollY = window.scrollY;

    if (undefined === w || undefined === h) return;
    if (x === undefined || y === undefined) {
      x = node.offsetLeft;
      y = node.offsetTop;
    }
    if (scrollX === undefined || scrollY === undefined) {
      scrollX = document.documentElement.scrollLeft;
      scrollY = document.documentElement.scrollTop;
    }

    if (node.style.display === 'none') return false;

    return (x <= (w + scrollX) && y <= (h + scrollY));
  }
  
  function setScrollEventHandler() {
    if (window.hasLazyLoad) return;
    window.addEventListener('scroll', lazyLoadImages);
    window.addEventListener('resize', lazyLoadImages);
    window.hasLazyLoad = true;
  }

  function lazyLoadImages() {
    var imgs = document.querySelectorAll('img[data-src]');
    Array.prototype.forEach.call(imgs, function lazyLoadLoop(img) {
      var attr = img.getAttribute('data-src');
      if (null !== attr && isAboveTheFold(img)) {
        img.setAttribute('src', attr);
        img.removeAttribute('data-src');
      }
    });
  }
  
  function setBodyMutationObserver() {
    var ob = new MutationObserver(lazyLoadImages);
    ob.observe(document.querySelector('body'), { attributes: false, childList: true, characterData: true });
  }

  return function () {  
    lazyLoadImages();
    setScrollEventHandler();
    setBodyMutationObserver();
  };
});
