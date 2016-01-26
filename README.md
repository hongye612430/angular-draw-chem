### aim of the project
The aim of this project is to create a light-weight, AngularJS-based editor for producing structural formulas.
The editor is from the beginning designed to be svg-based, thus enabling the drawing of good-looking, scalable structures.

### examples
Visit AngularDrawChem [page](http://mmmalik.github.io/angular-draw-chem/)!

### possible usage

1. By adding `mmAngularDrawChem` module to your project, making it available for the users of your website, so they can interact with it and make their own structures.
2. You can use it on the project website, make structures that you need, grab the `svg` and place it within your `html`.

### components
The project consists of the following components:

## directive and its services
1. `drawChemEditor` directive - the directive for interaction between the user and the editor,
2. `DrawChemDirectiveActions` - helper service with all actions available in the `drawChemEditor` directive,
3. `DrawChemDirectiveUtils` - helper service with some utility functions for `drawChemEditor` directive.

## common services
1. `DrawChem` factory - the main entry point for the use in a custom `controller`,
2. `DrawChemConstants` factory - contains constant values, such as bond length, bond width, etc.,
3. `DrawChemStructures` factory - defines basic structures, such as single bond, basic molecules (benzene, cyclohexane, etc.),
4. `DrawChemShapes` factory - contains key functionalities for transforming a `Structure` object into `Shape` object (see terminology),
5. `DrawChemCache` factory - caching service for Structure objects,
6. `DrawChemPaths` provider - enables to configure paths to some static resources related to the editor (`templateUrl` for `drawChemEditor` directive, svgs used in the UI).

## classes
1. `DCShape` factory - defines `Shape` class, which encapsulates svg-relevant data,
2. `DCAtom` factory - defines `Atom` class, which encapsulates data about a single atom,
3. `DCBond` factory - defines `Bond` class, which encapsulates data about a single bond,
4. `DCStructure` factory - defines `Structure` class, which encapsulates a structure tree (how the atoms are connected with each other),
5. `DCStructureCluster` factory - defines `StructureCluster` class, which enables grouping of multiple `Structure` objects; used for predefined structures,
6. `DCLabel` factory - defines `Label` class, which encapsulates data about a label

### terminology
**`Shape`** vs **`Structure`**

`Structure` object contains name of the structure and the structure itself as an array of `atoms`.
Each `atom` is an object containing coordinates of the atom and a `bonds` array with all `atoms` it is connected with.

`Shape` object contains the desired structure as a set of `svg` elements (paths, circles, etc.).

### license
MIT