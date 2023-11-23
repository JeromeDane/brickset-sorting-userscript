// ==UserScript==
// @name         Brickset Parts DB Resort
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://brickset.com/parts/*
// @match        https://brickset.com/inventories/*
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

    // Bricks With Bows And Arches - 01x03x00 - 002 - 50950
    // Bricks With Bows And Arches - 01x04x00 - 001 - 11153

    const strip = {
        'Bricks': ['Brick'],
        'Beams': ['Beam'],
        'Bricks With Bows And Arches': [
            'brick',
            'bow'
         ]
    }
    const renames = {
      3659: 'arch 1x4', // BRICK W. BOW 1X4
      4490: 'arch 1x3', // BRICK W. BOW 1X3
      6081: 'arch tab 1x4x1', // BRICK W. BOW 4X1X1 1/3
      6091: 'arch tab 1x2', // BRICK W. ARCH 1X1X1 1/3
      6191: 'outside 1x4', // BRICK 1X4X1 1/3
      6192: 'ridge 2x4', // BOWED ROOF RIDGE 2X4X1
      6215: '2x3', // BRICK 2X3 W. ARCH
      6981: 'arch 1/3 1x2x4', // brick w. bow 4x1x1 1/3
      10314: 'outside 1x4', // BRICK 1X4X1 1/3
      13965: 'arch half 1x3x3', // BRICK WITH BOW 1X3X3
      14395: 'arch half 1x5x4', // BRICK W. BOW 1X5X4
      15254: 'arch 1x6x2', // BRICK W/ INSIDE BOW 1X6X2
      15923: 'outside 1x4', //BRICK 1X4X1 1/3 "NO.1001"
      16577: 'arch 1x8x2', // BRICK W. BOW 1X8X2
      18653: 'arch inside 1x3x2', // Brick 1x3x2 w. inside bow
      24201: 'plate inverted 1x2', // PLATE W/ HALF BOW INV. 1X2X2/3
      24309: '2x3', // Brick w/half bow 2x3 w/cut
      30099: 'arch inside 1x5x4', // BRICK WITH BOW 1X5X4 INV.
      30165: 'ridge 2x2', // BRICK 2X2 W. BOW AND KNOBS
      30935: 'arch tab hollow 1x6x6', // BRICK 1X1X3 1/3, W/ ARCH
      32803: 'plate inverted 2x2', // BRICK 2X2X2/3, INVERTED BOW
      32807: 'arch tab 1x2', // 6184784: BRICK 1X1X1 1/3, W/ ARCH
      33243: 'outside 1x3x2', // BOW BRICK 1X3X2
      40296: 'arch 1x8x2', // BRICK W. BOW 1X8X2
      42918: '2x8', // BRICK 2X8,OUTSIDE BOW,W/ CUT OUT,NO. 1
      44126: '2x6', // BRICK 2 X 6 W. BOW
      49949: 'shell 6x10x4',
      49307: 'ridge 1x1', // PLATE 1X1X2/3, OUTSIDE BOW
      50950: '1x3', // Brick w/bow 1/3
      51704: 'arch 2x10x2', // BRICK 2X10X2 BOW
      61678: 'brick with bow 1X4', // Brick w. bow 1x4
      67810: 'arch tab 2x2', // BRICK W/ BOW 2X2X1 1/3
      66956: 'plate point 2x2x2', // PLATE W/ BOW 2X2X2/3, 45 DEG.
      70681: 'inside 1x3', // BRICK 1X3,OUTSIDE HALF ARCH,W/ CUTOUT
      73682: 'arch inset slope 2x2', // BRICK 1X3X3,INSIDE ARCH,W/ CUTOUT, KNOB
      76768: 'arch half 1x5x4', // BRICK W. BOW 1X5X4
      78666: 'arch inside 1x2', // BRICK 1X2, OUTSIDE HALF ARCH, NO. 1
      80543: 'arch half 1x4x3', // BRICK W/ BOW 1X4X3
      88292: 'arch half 1x3x2', // BRICK WITH BOW 1X3X2
      92950: 'arch 1x6', // BRICK 1X6 W/INSIDE BOW
      92903: 'arch tab hollow 1x3x3', // BRICK 1X3X2 W/INS AND OUTS.BOW
    }

    const trim = s => s.replace(/^\s+/, '').replace(/\s+$/, '')
    const rename = node => renames[getDesign(node)]?.toLowerCase() || getName(node)

    const resize = {
        2780: '002',
        3063: '2x2',
        3673: '002',
        4274: '001',
        4460: '1x2x3',
        6143: '2x2',
        6562: '001',
        11215: '2x5x1',
        30068: '1x1',
        32002: '001',
        32192: '125',
        30151: '2x2x2',
        43093: '001',
        61332: '002',
        89678: '001'
    }
    const getSize = part => (
        resize[getDesign(part)] ||
        part.querySelector('h1 a').innerText.toLowerCase().match(/\d+\s*x\s*\d+(\s*x\s*\d+(\/\d)?)?/)?.[0]
       )
       ?.replaceAll(' ', '')
       .replace(/(\d+)\/(\d+)/, (_, numerator, denominator) => (numerator / denominator).toFixed(2))
       .replace(/\d+x\d+(x\d+)?/i, n => {
            const sizes = n.split('x')
            if(sizes.length == 2) sizes.push('0')
            const height = sizes[2]
            return sizes.slice(0,2).map(d => d.padStart(2, '0')).sort().concat([height]).map(d => d.padStart(2, '0')).join('x')
       }) ||
       getName(part).replaceAll(',', '.')
           .match(/(\d+)(\.\d+)?/)?.[1]?.padStart(3,'0')

    const getName = part => trim(part.querySelector('h1 a').innerText.toLowerCase())

    const types = {
        'Bricks, Special': part => {
            const design = getDesign(part)
            switch(design) {
                case '11215':
                case '18671':
                case '28964':
                case '73562':
                case '76766':
                    return 'bracket'
                case '48169':
                case '48370':
                    return 'click'
            }
            const name = getName(part)
            if(name.match(/cup.+ball/)) return 'ball cup'
            if(name.match(/ball/)) return 'ball'
            if(name.match(/hinges/)) return 'hinges'
            if(name.match(/holder|grip/)) return 'hook'
            if(name.match(/(c|k)lick/)) return 'click'
            if(name.match(/fork.+stub/) || name.match(/stub.+fork/)) return 'fork stub'
            if(name.match(/fork/)) return 'fork'
            if(name.match(/angular brick/)) return 'snot 01x01x00 001 knob'
            if(name.match(/handle/)) return 'bar handle'
            if(name.match(/joint/)) return 'joint'
            if(name.match(/knob/))
                return `snot ${getSize(part)} ${name.replace('four', '4').match(/(\d+)[^\d]*knob/i)?.[1].padStart(2, '0')} knob`
            if(name.match(/mountain/)) return 'burp'
            if(name.match(/shaft/)) return 'bar shaft'
            if(name.match(/sliding|groove/)) return 'groove'
            if(name.match(/snap/)) return 'click snap'
            if(name.match(/stick/)) return 'bar stick'
            if(name.match(/stub/)) return 'stub'
        },
        'Bricks, Special Circles And Angles': part => {
            switch(getDesign(part)) {
                case '6564':
                case '6565':
                    return 'angle'
                case '6116':
                case '6143':
                case '100436':
                    return 'round 0'
                case '15797':
                case '30361':
                case '6222':
                    return 'round hole'
                case '87081': return 'round 0'
                case '16390': return 'round slope'
                case '87620': return 'facet'
            }
            const name = getName(part)
            if(name.match(/°|angle/)) return 'angle'
            if(name.match('1/4 sphere')) return 'sphere 1/4'
            if(name.match('arch')) return 'arch'
            if(name.match(/profile/)) return 'round profile'
            if(name.match('bow|curved')) return 'curved'
            if(name.match('column')) return 'column'
            if(name.match(/cone.+half|half.+cone/)) return 'cone half'
            if(name.match(/cone/)) return 'cone 0'
            if(name.match(/rocket step/)) return 'cone rocket'
            if(name.match('corner')) return 'corner'
            if(name.match('dome.+inv')) return 'dome inverted'
            if(name.match(/dome|final/)) return 'dome 0'
            if(name.match(/glass case/)) return 'dome glass case'
            if(name.match('facet')) return 'facet'
            if(name.match('roof')) return 'roof'
            if(name.match(/(round|circle).+hole/)) return 'round hole'
            if(name.match('round.+slope')) return 'round slope'
            if(name.match('round|circle')) return 'round 0'
            if(name.match(/sphere.+inv/)) return 'sphere inverted'
            if(name.match('sphere')) return 'sphere 0'
        },
        'Bricks, Special Ø4.85 Hole And Connecting Bush': part => {
            switch(getDesign(part)) {
                case '2458':
                case '44865':
                    return 'snap 01x02x00 01'
                case '53540':
                case '30526':
                    return 'snap 01x02x00 02'
                case '6232':
                case '42929':
                    return 'snap 02x02x00 01'
                case '30000': return 'snap 02x02x00 02'
                case '3700': return 'technic 01x02x00 01'
                case '32000': return 'technic 01x02x00 02'
                case '3894': return 'technic 01x06x00'
                case '3895': return 'technic 01x12x00'
                case '3703': return 'technic 01x16x00'
            }
            const name = getName(part)
            if(name.match(/ang(\.|le)/)) return 'angle'
            if(name.match('4,85')) return 'four sided'
            if(name.match('snap')) return 'snap ' + getSize(part) // must come before cross
            if(name.match('cross')) return 'cross'
            if(name.match('cutout')) return 'cutout'
            if(name.match('half beam')) return 'half beam'
            if(name.match('wing')) return 'wing' // must come before hole
            if(name.match('hole')) return 'hole'
            if(name.match('technic')) return 'technic ' + getSize(part)
        },
        'Bricks, With Slope': part => {
            switch(getDesign(part)) {
                case '35464': return 'roof ridge'
                case '28192': return 'roof cutout'
            }
            const name = getName(part)
            if(name.match('attic')) return 'roof end attic'
            if(name.match('pyramid')) return 'pyramid'
            if(name.match('ramp')) return 'ramp'
            if(name.match(/roof.+tile.+2\/3/)) return 'roof 00'
            if(name.match(/corner.+inside/)) return 'roof corner inside'
            if(name.match(/corner.+outs|outs.+corner/)) return 'roof corner outside 01'
            if(name.match(/corner/)) return 'roof corner outside 01'
            if(name.match(/end ridged tile/)) return 'roof end'
            if(name.match(/doub.+(roof.+inv|inv.+roof)/)) return 'roof inverted double'
            if(name.match(/roof.+inv|inv.+roof/) && name.match('corn')) return 'roof inverted corner'
            if(name.match(/roof.+inv|inv.+roof/)) return 'roof inverted'
            if(name.match(/roof.+tile.+plate/)) return 'roof plate'
            if(name.match(/roof.+tile.+bot/)) return 'roof corner outside 00'
            if(name.match(/ridged.+tile.+25/)) return 'roof ridge'
            if(name.match(/ridged.+tile.+45/)) return 'roof ridge'
            if(name.match(/roof.+tile.+45/)) return `roof 01 ${getSize(part)} 02`
            if(name.match(/roof.+tile.+25/)) return `roof 01 ${getSize(part)} 01`
            if(name.match(/roof.+tile/)) return `roof 01 ${getSize(part)} 00`
            if(name.match(/ridged.+tile/)) return `roof 01 ${getSize(part)} 00`
        },
        'Connectors': part => {
            switch(getDesign(part)) {
                case '2566': return 'shaft assembly'
                case '3628': return 'holder 3 shaft'
                case '10197': return 'axle beam 002'
                case '27940': return 'axle beam 001'
                case '32002': return 'peg'
                case '32187': return 'gear middle ring 000'
                case '42610': return 'gear hub'
                case '10288':
                case '49155':
                    return 'angle element branched'
                case '61903': return 'universal joint'
                case '72869': return 'holder 90 deg'
                case '99008': return 'axle krydskaksel'
                case '43093':
                case '6562':
                case '65249':
                case '11214':
                case '11214':
                case '18651':
                    return 'peg axle'
                case '89678': return 'peg'
            }
            const name = getName(part)
            if(name.match(/branch.+axle/)) return 'axle branched'
            if(name.match(/axle.+extension/)) return 'cross axle extension'
            if(name.match(/axle.+end.+stop/)) return 'axle end stop'
            if(name.match(/axle.+stop/)) return 'axle stop'
            if(name.match(/axle.+knob/)) return 'axle knob'
            if(name.match(/axle.+snap/)) return 'peg axle'
            if(name.match(/axle.+ball|ball.+axle/)) return 'axle ball'
            if(name.match(/axle.+beam|beam.+axle/)) return 'axle beam 00'
            if(name.match(/shaft.+ball/)) return 'shaft ball'
            if(name.match(/shaft.+cross.+hole/)) return 'shaft cross hole'
            if(name.match(/cross.+hole.+double/)) return 'cross hole double'
            if(name.match(/ball.+fork/)) return 'fork ball coupling'
            if(name.match(/claw.+fork/)) return 'fork claw'
            if(name.match(/link.+fork.+stump/)) return 'link fork stump'
            if(name.match(/shaft.+hole/)) return 'shaft hole'
            if(name.match(/angle.+element/)) return 'angle element'
            if(name.match(/con.+bush/)) return 'peg'
            if(name.match(/ball.+snap/)) return 'peg ball'
            if(name.match(/hole.+holder/)) return 'holder hole'
            if(name.match(/stick.+holder/)) return 'holder stick'
            if(name.match(/double.+snap/)) return 'peg double'
            if(name.match(/module.+bush/)) return 'peg module'
            if(name.match('holder')) return 'holder'
            if(name.match(/bush.+friction/)) return 'snap'
            if(name.match(/bush.+tube/)) return 'snap tube'
            if(name.match(/stub.+bush/)) return 'link stub peg'
            if(name.match(/snap.+cross.+hole/)) return 'peg bush'
            if(name.match(/combi.+hub.+stick/)) return 'shaft cross hole 00'
            if(name.match('fork')) return 'link fork'
            if(name.match('stump')) return 'link stump'
            if(name.match('peg')) return 'peg'
            if(name.match('bush')) return 'bush'
            if(name.match('axle')) return 'axle'
            if(name.match('snap')) return 'snap'
            if(name.match('shaft')) return 'shaft'
        },
        'Decoration Elements': part => {
            switch(getDesign(part)) {
                case '15070': return 'teeth 000'
                case '15208': return 'teeth 002'
                case '15209': return 'teeth 003'
            }
            const name = getName(part)
            if(name.match('screen')) return 'screen'
            if(name.match(/plate.+tooth/)) return 'teeth 001'
        },
        'Fences And Ladders': part => {
            switch(getDesign(part)) {
                case '32932': return 'fence asian'
                case '15332':
                case '21229':
                    return 'fence bar'
                case '33303': return 'fence picket'
                case '30095': return 'ladder grating'
                case '6020': return 'ladder lattice'
            }
            const name = getName(part)
            if(name.match(/iron.+fence/)) return 'fence iron'
            if(name.match('fence')) return 'fence'
            if(name.match('hanger')) return 'hanger'
        },
        'Frames, Windows, Walls And Doors': part => {
            const name = getName(part)
            if(name.match(/(for|f\.).+frame/)) return 'frame z insert'
            if(name.match(/frame.+tripartite/)) return 'frame tripartite'
            if(name.match(/frame.+train/)) return 'frame train'
            if(name.match(/window.+frame/)) return 'frame window'
            if(name.match('frame')) return 'frame'
            if(name.match(/wall.+(circle|round)/)) return 'wall circle'
            if(name.match(/wall.+double/)) return 'wall ' + getSize(part) + ' double'
            if(name.match(/wall.+window/)) return 'wall ' + getSize(part) + ' window'
            if(name.match(/wall.+slit/)) return 'wall ' + getSize(part) + ' slit'
            if(name.match('wall')) return 'wall ' + getSize(part)
        },
        'Functional Elements': part => {
            switch(getDesign(part)) {
                case '98286':
                case '98285':
                    return 'hinge plate'
            }
            const name = getName(part)
            if(name.match(/magasine.+ball/)) return 'ball magazine'
            if(name.match('arrow')) return 'arrow'
            if(name.match('cardan')) return 'cardan'
            if(name.match(/drum.*holder/)) return 'drum holder'
            if(name.match('drum')) return 'drum'
            if(name.match(/hinge.*plate|plate.*hinge/)) return 'hinge plate'
            if(name.match('hinge')) return 'hinge'
            if(name.match('shock')) return 'shock'
            if(name.match('shooter')) return 'shooter'
            if(name.match(/steering.*gear.+module|track.+rod/)) return 'track rod'
            if(name.match('turntable')) return 'turntable'
        },
        'Functional Elements, Gear Wheels And Racks': part => {
            switch(getDesign(part)) {
                case '6589':
                case '87407':
                    return 'gear bevel'
            }
            const name = getName(part)
            if(name.match('block')) return 'block'
            if(name.match(/bevel.+(gear|wheel)|(gear|wheel).+bevel/)) return 'gear bevel'
            if(name.match(/worm.+(gear|wheel)|(gear|wheel).+worm/)) return 'gear worm'
            if(name.match(/(gear|wheel).+(angled|conical)|(angled|conical).+(gear|wheel)/)) return 'gear angled'
            if(name.match(/(gear|wheel).+z12/)) return 'gear z12'
            if(name.match('(gear|wheel)')) return 'gear'
        },
        'Gates And Roofs': part => {
            switch(getDesign(part)) {
                case '4219': return 'garage panel'
            }
            const name = getName(part)
            if(name.match('door')) return 'door'
        },
        'Half Beams': part => {
            const name = getName(part)
            if(name.match('lever')) return 'lever'
        },
        'Interior': part => {
            const name = getName(part)
            if(name.match('tub')) return 'tub'
        },
        'Plates': part => {
            const name = getName(part)
            if(name.match(/plate.+tr\./)) return 'plate'
            if(name.match('corner')) return 'plate corner'
            if(name.match('frame')) return 'plate frame'
            if(name.match('knob')) return 'plate knob'
            if(name.match('tile')) return 'plate tile'
        }
    }

    const getType = node => types[getCategory(node)] && types[getCategory(node)](node) ||

        trim((rename(node))

        // bricks special
        .replace(/^(.+)knobs?/i, 'knob $1')
        .replace(/\d\s?grip/, 'holder horizontal')
        .replace(/^(.+)h(o|0)lder.+hor/i, 'holder horizontal $1')
        .replace(/^(.+)h(o|0)lder.+ver/i, 'holder vertical $1')

        .replaceAll(',', '')
        .replaceAll('w.', '')
        .replaceAll('w/', '')
        .replaceAll('with', '')

        // Bricks With Bows And Arches
        .replace(/(.+)\bow.+shell/, 'shell $1')
        .replace(/(.+)\bow.+bottom/, 'shell bottom $1')

        .replace(new RegExp(`\\b(${strip[getCategory(node)]?.join('|')})\\b`, 'i'), '')
        .replace(new RegExp(`\\b(${strip[getCategory(node)]?.join('|')})\\b`, 'i'), '')
        .replace(/(.+)\sinv(\.|erted)?/, 'inverted $1')
        .replace(/(.+)\srev(\.|ersed)?/, 'inverted $1')
        .replace(/(.+)\arch/, 'arch $1')
        .replace(/(.+)\outside/, 'outside $1')
        .replace(/(right|left) plate/, 'plate $1')
        .replace(/beam 1x1/, 'beam 1m')
        .replace(/cross block 90°/, 'cross block 2m')
        .replace(/\d+m/, n => n.replace('m', '').padStart(3, '0'))
        .replace(/\d+x\d+(x\d+)?/i, '') // strip size
        //.replace(/\d+x\d+(x\d+)?/i, n => {
        //    const sizes = n.split('x')
        //    if(sizes.length == 2) sizes.push('0')
        //    const height = sizes[2]
        //    return sizes.slice(0,2).map(d => d.padStart(2, '0')).sort().concat([height]).map(d => d.padStart(2, '0')).join('x')
        //})
    )

    const getCategory = node => trim(node.querySelector('a[href*="category"]').innerText)
    const getColor = node => trim(node.querySelector('a[href*="colour"]').innerText.toUpperCase())
    const getDesign = node => trim(node.querySelector('a[href*="/design-"]')
        .href?.match(/\d+/)?.[0])
    const getColorIndex = color => {
      const index = colorOrder.indexOf(color)
      return index == -1 ? 'Z' : index.toString().padStart(3, '0')
    }
    const getSort = node => (getCategory(node) + ' - ' +
                            getType(node) + ' - ' +
                            getSize(node) + ' - ' +
                            getColorIndex(getColor(node))
                            ).toLowerCase()
                            //.replaceAll(',', '')
                            //.replaceAll('  ', ' ').replaceAll('  ', ' ')
                            //.replaceAll(' ', '_')

    const setList = document.location.toString().match('inventories')
        ? document.querySelector('.tablesorter')
        : document.querySelector('section.setlist')
    const articleSet = setList.querySelectorAll('article.set')
    const itemInfo = setList.querySelectorAll('.iteminfo')
    const pieceNodes = document.location.toString().match('inventories')
          ? setList.querySelectorAll('tbody tr')
          : articleSet.length ? articleSet : itemInfo

    const pieces = Array.from(pieceNodes).sort(
        (a, b) => getSort(a).localeCompare(getSort(b), undefined, { sensitivity: 'base' })
    )

    const renderedDesigns = {}

    pieces.forEach(node => {
        const div = document.createElement('div')
        div.textContent = `${getType(node)} ${getSize(node)}: ${getDesign(node)}`
        node.appendChild(div)
        const design = getDesign(node)
        if(true || !renderedDesigns[design]) { // show all or just design?
            renderedDesigns[design] = true
            node.parentNode.appendChild(node)
            console.log(getSort(node))
        }
        else node.parentNode.removeChild(node)
    })


})();
