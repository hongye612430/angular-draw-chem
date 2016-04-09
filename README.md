newest stable release: v1.0.0

current:

[![Build Status](https://travis-ci.org/MMMalik/angular-draw-chem.svg?branch=master)](https://travis-ci.org/MMMalik/angular-draw-chem)

aim of the project
------
The aim of this project is to create a light-weight, AngularJS-based editor for producing structural formulas.
The editor is from the beginning designed to support `svg`, thus enabling the drawing of good-looking, scalable structures.

examples
------
Visit AngularDrawChem [page](http://mmmalik.github.io/angular-draw-chem/)!

possible usage
------
1. By adding `mmAngularDrawChem` module to your project, making it available for the users of your website, so they can interact with it and make their own structures.
2. You can use it on the project website, make structures that you need, grab the `svg` and place it within your `html`.
3. Download:
  * [Github](https://github.com/MMMalik/angular-draw-chem/releases)
  * npm `npm i angular-draw-chem`
  * bower `bower install angular-draw-chem`

features
------
#### The following features have been already implemented:

&#10004; open/close editor,

&#10004; transfer svg,

&#10004; clear canvas,

&#10004; go one structure forward/back,

&#10004; select/deselect all structures,

&#10004; move selected structure with arrows/mouse,

&#10004; align selected structures up/down/left/right,

&#10004; delete selected structures,

&#10004; erase single atom,

&#10004; basic reaction arrows,

&#10004; cyclic structures (from three- to nine-membered rings),

&#10004; bonds (single, double, triple, dash, wedge),

&#10004; predefined labels,

&#10004; removing labels,

&#10004; custom labels.

#### Still to do:

&#8722; fix issues with transferring: labels have to be taken into account, no 'hover' effects,

&#8722; make different cache 'instances',

&#8722; add possibility to copy structures,

&#8722; add 'align middle' tools (vertical and horizontal),

&#8722; fix positioning of some labels,

&#8722; enable adding text elements (e.g. for comments or adding reaction conditions over an arrow),

&#8722; add a new bond type for showing undefined stereochemistry,

&#8722; add possibility to select and change bonds,

&#8722; add user manual.

components
------
The project consists of the following components:

#### editor directive
1. `drawChemEditor` `directive` - the directive for interaction between the user and the editor,
2. `DrawChemDirectiveMouseActions` `factory` - helper service with all mouse actions for `drawChemEditor` directive,
3. `DrawChemDirectiveUtils` `factory` - helper service with some utility functions for `drawChemEditor` directive,
4. `DrawChemDirectiveFlags` `factory` - helper service containing info about currently selected tools; keeps track of mouse-related stuff.

#### svg rendering services
1. `DrawChem` `factory` - the main entry point for the use in a custom `controller`,
2. `DrawChemSvgRenderer` `factory` - contains key functionalities for transforming a `Structure` object into `svg`.

#### structure modify services
1. `DrawChemModStructure` - contains utilities for modifying a `Structure` object (adding new bonds, etc.)

#### helper services
1. `DrawChemConstants` `factory` - contains constant values, such as bond length, bond width, etc.,
2. `DrawChemCache` `factory` - caching service for `Structure` objects,
3. `DrawChemUtils` `factory` - various utilities, e.g. for vectors (addition, subtraction, etc.).

#### keyboard shortcuts
1. `dcShortcuts` `directive` - the directive binding `keydown` and `keyup` event listeners,
2. `DCShortcutsStorage` `factory` - service that enables registering of new keyboard shortcuts; it also keeps track of keys pushed and released, in order to fire a suitable event.

#### paths provider
1. `DrawChemPaths` `provider` - enables to configure paths to some static resources related to the editor (`templateUrl` for `drawChemEditor` directive, svgs used in the UI).

#### menu items
1. `DrawChemActions` `factory` - contains all actions available under `Actions` menu,
2. `DrawChemEdits` `factory` - contains all actions available under `Edit` menu,
3. `DrawChemArrows` `factory` - contains all arrows available under `Arrows` menu,
4. `DrawChemGeomShapes` `factory` - contains all geometrical shapes available under `Shapes` menu,
5. `DrawChemStructures` `factory` - defines basic structures, such as single bond, basic molecules (benzene, cyclohexane, etc.), available under `Structures` menu,
6. `DrawChemLabels` `factory` - defines basic labels, such as oxygen, sulfur, etc., available under `Labels` menu.

#### classes
1. `DCSvg` `factory` - defines `Svg` class, which encapsulates svg-relevant data,
2. `DCAtom` `factory` - defines `Atom` class, which encapsulates data about a single atom,
3. `DCBond` `factory` - defines `Bond` class, which encapsulates data about a single bond,
4. `DCStructure` `factory` - defines `Structure` class, which encapsulates data about thw hole structure and some tools (selection, alignment),
5. `DCStructureCluster` `factory` - defines `StructureCluster` class, which enables grouping of multiple `Structure` objects; used for predefined structures,
6. `DCLabel` `factory` - defines `Label` class, which encapsulates data about a label,
7. `DCArrow` `factory` - defines `Arrow` class, which encapsulates data about an arrow,
8. `DCArrowCluster` `factory` - defines `ArrowCluster` class, which enables grouping of multiple `Arrow` objects,
9. `DCCyclicStructure` - defines `CyclicStructure` which encapsulates data about cyclic structures,
10. `DCBondStructure` - defines `BondStructure` which encapsulates data about non-cyclic structures (only bonds for now).

license
------
MIT
