newest stable release: v1.0.0

current: [![Build Status](https://travis-ci.org/MMMalik/angular-draw-chem.svg?branch=master)](https://travis-ci.org/MMMalik/angular-draw-chem)

aim of the project
------
The aim of this project is to create a light-weight, AngularJS-based editor for producing structural formulas.
The editor is from the beginning designed to be svg-based, thus enabling the drawing of good-looking, scalable structures.

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

components
------
The project consists of the following components:

#### editor directive
1. `drawChemEditor` `directive` - the directive for interaction between the user and the editor,
2. `DrawChemDirectiveMouseActions` `factory` - helper service with all mouse actions for `drawChemEditor` directive,
3. `DrawChemDirectiveUtils` `factory` - helper service with some utility functions for `drawChemEditor` directive.

#### rendering services
1. `DrawChem` `factory` - the main entry point for the use in a custom `controller`,
2. `DrawChemShapes` `factory` - contains key functionalities for transforming a `Structure` object into `Shape` object.

#### helper services
1. `DrawChemConstants` `factory` - contains constant values, such as bond length, bond width, etc.,
2. `DrawChemCache` `factory` - caching service for Structure objects.

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
5. `DrawChemStructures` `factory` - defines basic structures, such as single bond, basic molecules (benzene, cyclohexane, etc.), available under `Structures`, and predefined atom labels (`Labels` menu).

#### classes
1. `DCShape` `factory` - defines `Shape` class, which encapsulates svg-relevant data,
2. `DCAtom` `factory` - defines `Atom` class, which encapsulates data about a single atom,
3. `DCBond` `factory` - defines `Bond` class, which encapsulates data about a single bond,
4. `DCStructure` `factory` - defines `Structure` class, which encapsulates a structure tree (how the atoms are connected with each other),
5. `DCStructureCluster` `factory` - defines `StructureCluster` class, which enables grouping of multiple `Structure` objects; used for predefined structures,
6. `DCLabel` `factory` - defines `Label` class, which encapsulates data about a label,
7. `DCArrow` `factory` - defines `Arrow` class, which encapsulates data about an arrow,
8. `DCArrowCluster` `factory` - defines `ArrowCluster` class, which enables grouping of multiple `Arrow` objects.

license
------
MIT
