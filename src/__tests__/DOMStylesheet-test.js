/**
 * @copyright 2015 Prometheus Research, LLC
 */

import assert from 'power-assert';
import * as DOMStylesheet from '../DOMStylesheet';

function assertCSS(css, ...expectations) {
  assert(css.length === expectations.length);
  expectations.forEach((expectation, idx) => {
    let pattern = new RegExp(`^${expectation.replace(/UNIQ/g, '\\d+')}$`);
    assert(pattern.exec(css[idx]));
  });
}

function assertClassName(className, ...expectations) {
  expectations = expectations.map(expectation =>
    expectation.replace(/UNIQ/g, '\\d+'));
  let pattern = new RegExp(`^${expectations.join(' ')}$`);
  assert(pattern.exec(className));
}

describe('DOMStylesheet', function() {

  it('compiles style representation to CSS', function() {
    let style = DOMStylesheet.create({
      width: 10,
      color: 'red',
    }, 'style');
    assertCSS(style.css,
      '.Style_styleUNIQ { box-sizing:border-box;width:10px;color:red;-moz-box-sizing:border-box; }'
    );
    assertClassName(style.asClassName(),
      'Style_styleUNIQ'
    );
  });

  it('lift values to CSS with toCSS() method call', function() {
    class Width {
      toCSS() {
        return 42;
      }
    }
    class Color {
      toCSS() {
        return 'white';
      }
    }
    assertCSS(
      DOMStylesheet.create({
        color: ['red', new Color()],
        width: new Width(),
      }, 'style').css,
      '.Style_styleUNIQ { box-sizing:border-box;color:red;color:white;width:42px;-moz-box-sizing:border-box; }'
    );
  });

  it('compiles arrays into multiple values', function() {
    assertCSS(
      DOMStylesheet.create({
        color: ['red', 'white'],
        width: [1, 10],
      }, 'style').css,
      '.Style_styleUNIQ { box-sizing:border-box;color:red;color:white;width:1px;width:10px;-moz-box-sizing:border-box; }'
    );
    assertCSS(
      DOMStylesheet.create({
        color: [],
        width: [1, 10],
      }, 'style').css,
      '.Style_styleUNIQ { box-sizing:border-box;color:;width:1px;width:10px;-moz-box-sizing:border-box; }'
    );
  });

  it('compiles pseudo classes', function() {
    let style = DOMStylesheet.create({
      focus: {
        color: 'red',
      }
    }, 'style');
    assertCSS(style.css,
      '.Style_styleUNIQ { box-sizing:border-box;-moz-box-sizing:border-box; }',
      '.Style_styleUNIQ--focus, .Style_styleUNIQ:focus { color:red; }'
    );
    assertClassName(style.asClassName(),
      'Style_styleUNIQ'
    );
    assertClassName(style.asClassName({focus: true}),
      'Style_styleUNIQ',
      'Style_styleUNIQ--focus'
    );
    assertClassName(style.asClassName({focus: false}),
      'Style_styleUNIQ'
    );
  });

  it('compiles arbitrary variant classes', function() {
    let style = DOMStylesheet.create({
      x: {
        color: 'red',
      }
    }, 'style');
    assertCSS(style.css,
      '.Style_styleUNIQ { box-sizing:border-box;-moz-box-sizing:border-box; }',
      '.Style_styleUNIQ--x { color:red; }',
    );
    assertClassName(style.asClassName(),
      'Style_styleUNIQ',
    );
    assertClassName(style.asClassName({x: true}),
      'Style_styleUNIQ',
      'Style_styleUNIQ--x',
    );
  });

  it('compiles arbitrary variant classes with nested variants', function() {
    let style = DOMStylesheet.create({
      x: {
        color: 'red',
        y: {
          color: 'white'
        }
      }
    }, 'style');
    assertCSS(style.css,
      '.Style_styleUNIQ { box-sizing:border-box;-moz-box-sizing:border-box; }',
      '.Style_styleUNIQ--x { color:red; }',
      '.Style_styleUNIQ--x--y { color:white; }',
    );
    assertClassName(style.asClassName(),
      'Style_styleUNIQ'
    );
    assertClassName(style.asClassName({x: true}),
      'Style_styleUNIQ',
      'Style_styleUNIQ--x',
    );
    assertClassName(style.asClassName({x: true, y: true}),
      'Style_styleUNIQ',
      'Style_styleUNIQ--x',
      'Style_styleUNIQ--x--y',
    );
    assertClassName(style.asClassName({y: true}),
      'Style_styleUNIQ',
    );
  });

  it('compiles nested pseudoclasses variants', function() {
    let style = DOMStylesheet.create({
      firstChild: {
        color: 'red',
        hover: {
          color: 'white'
        }
      }
    }, 'style');
    assertCSS(style.css,
      '.Style_styleUNIQ { box-sizing:border-box;-moz-box-sizing:border-box; }',
      '.Style_styleUNIQ--firstChild, .Style_styleUNIQ:first-child { color:red; }',
      '.Style_styleUNIQ--firstChild--hover, .Style_styleUNIQ:first-child:hover, .Style_styleUNIQ--firstChild:hover { color:white; }',
    );
    assertClassName(style.asClassName(),
      'Style_styleUNIQ'
    );
    assertClassName(style.asClassName({firstChild: true}),
      'Style_styleUNIQ',
      'Style_styleUNIQ--firstChild',
    );
    assertClassName(style.asClassName({firstChild: true, hover: true}),
      'Style_styleUNIQ',
      'Style_styleUNIQ--firstChild',
      'Style_styleUNIQ--firstChild--hover',
    );
    assertClassName(style.asClassName({y: true}),
      'Style_styleUNIQ',
    );
  });

  it('compiles arbitrary variant classes with pseudoclasses', function() {
    let style = DOMStylesheet.create({
      x: {
        color: 'red',
        hover: {
          color: 'white'
        }
      }
    }, 'style');
    assertCSS(style.css,
      '.Style_styleUNIQ { box-sizing:border-box;-moz-box-sizing:border-box; }',
      '.Style_styleUNIQ--x { color:red; }',
      '.Style_styleUNIQ--x--hover, .Style_styleUNIQ--x:hover { color:white; }',
    );
    assertClassName(style.asClassName(),
      'Style_styleUNIQ'
    );
    assertClassName(style.asClassName({x: true}),
      'Style_styleUNIQ',
      'Style_styleUNIQ--x',
    );
    assertClassName(style.asClassName({x: true, hover: true}),
      'Style_styleUNIQ',
      'Style_styleUNIQ--x',
      'Style_styleUNIQ--x--hover',
    );
    assertClassName(style.asClassName({hover: true}),
      'Style_styleUNIQ',
    );
  });

  it('can be overriden with style spec', function() {
    let style = DOMStylesheet.create({
      background: 'white',
      color: 'black',
      x: {
        color: 'red',
      },
      y: {
        color: 'white',
      }
    }, 'style');

    assertCSS(style.css,
      '.Style_styleUNIQ { box-sizing:border-box;background:white;color:black;-moz-box-sizing:border-box; }',
      '.Style_styleUNIQ--x { color:red; }',
      '.Style_styleUNIQ--y { color:white; }',
    );

    let overriden = style.override({
      color: 'yellow',
      x: {
        color: 'x',
        fontSize: '12pt',
      },
      z: {
        x: 12
      },
    }, 'style');

    assertCSS(overriden.css,
      '.Style_styleUNIQ { box-sizing:border-box;background:white;color:yellow;-moz-box-sizing:border-box; }',
      '.Style_styleUNIQ--x { color:x;font-size:12pt; }',
      '.Style_styleUNIQ--y { color:white; }',
      '.Style_styleUNIQ--z { x:12px; }',
    );
  });

});
