var debugging = location.hostname === 'localhost';
(function ($) {
  var nodes = document.querySelectorAll('p, li, h1, h2, h3, h4, h5, h6, header, a, button, small');
  _.each(nodes, function (node) {
    var prevNode = node.previousElementSibling;
    if (!prevNode) {
      return;
    }
    if (isTranslationResult(node, prevNode)) {
      var $prevNode = $(prevNode);
      var $node = $(node);
      if (isPureEnglish($prevNode.text()) && !$prevNode.hasClass('nav-list-item')) {
        $node.attr('id', prevNode.id);
        $node.addClass('translated');
        $node.addClass('translated-cn');
        if (!$node.attr('title')) {
          $node.attr('title', '点击译文可显示/隐藏原文；点击原文可隐藏原文');
        }
        $prevNode.removeAttr('id');
        $prevNode.addClass('original-english');
        if (!debugging) {
          $prevNode.addClass('hidden');
        }
        if (node.tagName !== 'A' && node.tagName !== 'BUTTON') {
          $node.on('click', function () {
            $prevNode.toggleClass('hidden');
          });
          $prevNode.on('click', function () {
            $prevNode.addClass('hidden');
          });
        }
        $node.after($prevNode);
      }
    }
  });

  function isPureEnglish(text) {
    // accept &mdash; , quotes and façade too.
    return /^[\1-\255—’“”ç]*$/.test(text);
  }

  function attributesToString(node) {
    return _.chain(node.attributes)
      .map(function (value) {
        if (value.name === 'id') {
          return '';
        } else {
          return value.name + '=' + value.value;
        }
      })
      .sortBy()
      .value()
      .join(';');
  }

  function isClonedNode(node1, node2) {
    return node1.tagName === node2.tagName &&
      attributesToString(node1) === attributesToString(node2);
  }

  function indexOfSameType(node) {
    var i = 0;
    var aNode = node.parentNode.firstChild;
    while (aNode !== node) {
      ++i;
      if (aNode.tagName !== node.tagName) {
        i = 0;
      }
      aNode = aNode.nextElementSibling;
    }
    return i;
  }

  function isTranslationResult(node, prevNode) {
    return indexOfSameType(node) % 2 === 1 && isClonedNode(node, prevNode) && isPureEnglish(prevNode.innerText);
  }
})(angular.element);
