// ==UserScript==
// @name         Brickset Sort Pieces
// @namespace    http://jeromedane.com/
// @version      0.1
// @author       You
// @match        https://brickset.com/inventories/*
// @icon         https://www.google.com/s2/favicons?domain=brickset.com
// @grant        none
// ==/UserScript==

(function() {
  'use strict';
   const q = (element, query) => Array.prototype.slice.call(element.querySelectorAll(query))
   const isPart = tr => q(tr, 'td')[0] && q(tr, 'td')[0].innerText.match(/^\d+$/)
   const sizeRegex = /(\d+)\s?x\s?(\d+)(\s?x\s?(2\/3|\d))?/i
   const toPart = tr => {
       const cells = q(tr, 'td'),
             text = i => cells[i].innerText,
             int = i => parseInt(text(i)),
             sizeMatch = text(6).match(sizeRegex),
             name = text(6).replace(/w\.\s?bow/i, 'WITH BOW')
                           .replace(/W\/ HALF BOW/i, 'WITH HALF BOW')
                           .replace(/W\.\sARCH/i, 'WITH ARCH')
       return {
           tr,
           id: text(0),
           image: q(cells[1], 'a')[0].href,
           qty: int(2),
           color: text(3).replace(/\.tr\b007/i, 'transparent'),
           category: text(4),
           design: text(5),
           name,
           nameWithoutSize: name
             .replace(/\ssmall/i, '')
             .replace(/PLATE (\d)X(\d) ROUND/i, 'round plate $1x$2')
             .replace('W/O PIN', '')
             .replace(/w(ith|\.|\/)\s?holder/i, 'hook')
             .replace(/w(ith|\.|\/)\s?(stick|shaft)/i, 'bar')
             .replace(/w(ith|\.|\/)\s?(stub)/i, 'hinge stub')
             .replace(/w(ith|\.|\/)\s?(gliding\s?groove|rail)/i, 'rail')
             .replace(/fork\/vertical/i, 'hinge vertical fork')
             .replace(/fork,\s?vertical/i, 'hinge vertical fork')
             .replace(/fork\vertical/i, 'hinge vertical fork')
             .replace(/w(ith|\.|\/)\s?vertical\s?(end|stub)/i, 'hinge stub')
             //.replace(/BRICK (\d+)X(\d+) W\/INSIDE BOW/i, 'BRICK W. BOW $1X$2')
             .replace(sizeRegex, ''),
           size: sizeMatch && sizeMatch[0],
           width: sizeMatch && parseInt(sizeMatch[1]),
           length: sizeMatch && parseInt(sizeMatch[2]),
           height: sizeMatch && (sizeMatch[4] == '2/3' ? 0.66 : parseInt(sizeMatch[4])),
           numSetsWithPart: int(7),
           year: int(8),
           numSetsWithDesign: int(9),
           designYear: int(10)
       }
   }
   const colorInt = color => [
       'Black',
       'Dark Stone Grey',
       'Silver Metallic',
       'Medium Stone Grey',
       'White',
       'Brick Yellow',
       'Sand Yellow',
       'Dark Brown',
       'Light Nougat',
       'Nougat',
       'Warm Gold',
       'Medium Nougat',
       'Reddish Brown',
       'Bright Red',
       'Bright Orange',
       'Bright Yellow',
       'Dark Green',
       'Bright Blue',
       'Transparent Yellow',
       'Transparent Medium Reddish Violet',
       'Transparent Green',
       'Transparent Blue',
       ].indexOf(color)
   const pad = n => isNaN(n) ? '00' : n < 10 ? '0' + n : n
   const sortStr = a => (
       a.category +
       a.nameWithoutSize +
       pad(a.width) + 'X' +
       pad(a.length) + 'X' +
       pad(a.height) +
       'color-' + pad(colorInt(a.color))).toLowerCase()
   const sortParts = (a, b) => {
       a = sortStr(a)
       b = sortStr(b)
       return a > b ? 1 : a < b ? -1 : 0
   }
   const insert = elem => elem.parentNode.insertBefore(document.querySelector('.tablesorter-header'), elem.nextSibling);
   const sortTable = () => {
       console.log('sorting table')
       const parts = q(document, '.tablesorter [role="row"]')
       .filter(isPart)
       .map(toPart)
       .sort(sortParts)

       const tableBody = document.querySelector('.tablesorter tbody')
       tableBody.innerHTML = ''
       parts.forEach(part => {
           if(part.category == 'Bricks With Bows And Arches') {
               console.log(sortStr(part), part.width, part.length, part.height)
            //   console.log(part)
           }
           part.tr.querySelectorAll('td')[6].innerHTML = part.name + '<br/> (' + sortStr(part) + ')'
           tableBody.appendChild(part.tr)
       })
   }
   setTimeout(sortTable, 1000);
   setTimeout(() => document.querySelector('h1').addEventListener('click', sortTable), 500)
 })();
