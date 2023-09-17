// ==UserScript==
// @name         Brickset Parts DB Resort
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://brickset.com/parts/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=brickset.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const colorOrder = [
        'BLACK',
        'DARK STONE GREY',
        'MEDIUM STONE GREY',
        'WHITE',
        'BRICK YELLOW', // tan
         'SAND YELLOW',
        'LIGHT NOUGAT',
        'NOUGAT',
        'MEDIUM NOUGAT',
        'DARK ORANGE', // nougat
        'REDDISH BROWN',
        'DARK BROWN',
        'NEW DARK RED',
        'BRIGHT RED',
        'BRIGHT ORANGE',
        'FLAME YELLOWISH ORANGE',
        'BRIGHT YELLOW',
        'COOL YELLOW', // chick yellow
        'BRIGHT YELLOWISH GREEN',
        'BRIGHT GREEN',
        'DARK GREEN',
        'SAND GREEN',
        'OLIVE GREEN',
        'EARTH GREEN',
        'BRIGHT BLUISH GREEN',
        'AQUA',
        'LIGHT ROYAL BLUE',
        'MEDIUM BLUE',
        'MEDIUM AZUR',
        'DARK AZUR',
        'SAND BLUE',
        'BRIGHT BLUE',
        'EARTH BLUE',
        'VIBRANT CORAL',
        'LIGHT PURPLE',
        'BRIGHT PURPLE',
        'LAVENDER',
        'MEDIUM LAVENDER',
        'MEDIUM LILAC',
        'BRIGHT REDDISH VIOLET',
        'TITANIUM METALLIC',
        'SILVER METALLIC',
        'WARM GOLD',
        'TRANSPARENT',
        'TRANSPARENT BROWN',
        'TRANSPARENT BRIGHT ORANGE',
        'TRANSPARENT YELLOW',
        'TRANSPARENT LIGHT BLUE',
        'TRANSPARENT MEDIUM REDDISH VIOLET',
        'TRANSPARENT PINK GLITTER / TRANSPARENT MEDIUM REDDISH VIOLET GLITTER',
        'TRANSPARENT BLUISH VIOLET (GLITTER)',

    ]

    const replacements = [
        'Brick',
        'Beam'
    ]

    const getName = node => node.querySelector('h1 a').innerText.toLowerCase()
        .replace(/beam 1x1/, 'beam 1m')
        .replace(/cross blok/, 'cross block')
        .replace(/cross block 90°/, 'cross block 2m')
        .replace(/\d+m/, n => n.replace('m', '').padStart(3, '0'))
        .replace(/\d+x\d+(x\d+)?/i, n =>
            n.split('x').map(d => d.padStart(2, '0')).sort().join('x')
        )
        .replace(new RegExp(`\\b(${replacements.join('|')})\\b`, 'i'), '')
        .replace(new RegExp(`\\b(${replacements.join('|')})\\b`, 'i'), '')

    const getCategory = node => node.querySelector('.meta a[href*="category"]').innerText
    const getColor = node => node.querySelector('.meta a[href*="colour"]').innerText
    const getColorIndex = color => {
      const index = colorOrder.indexOf(color)
      return index == -1 ? 'Z' : index.toString().padStart(3, '0')
    }
    const getSort = node => getCategory(node) + ' - ' +
                            getName(node) + ' - ' +
                            getColorIndex(getColor(node)) + ' - ' +
                            getColor(node)

    const setList = document.querySelector('section.setlist')
    const pieces = Array.from(setList.querySelectorAll('article.set'))
    pieces.sort((a, b) => {
        const sortA = getSort(a)
        const sortB = getSort(b)
        if (sortA < sortB) return -1;
        if (sortA > sortB) return 1;
        return 0;
    });

    pieces.forEach(node => {
        node.parentNode.appendChild(node)
        //node.querySelector('h1 a').innerText = getName(node)
        const div = document.createElement('div')
        div.textContent = getCategory(node) + ': ' + getName(node)
        node.appendChild(div)
        console.log(getSort(node), node)
    })


})();
