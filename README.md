### aim of the project
The aim of this project is to create an AngularJS-based editor for producing structural formulas.
The editor is from the beginning designed to be svg-based, thus enabling the drawing of good-looking, scalable structures.

### possible usage
It will be possible to use it in two ways:

1. By adding `mmAngularDrawChem` module to your project, making it available for the users of your website, so they can interact with it and make their own structures.
2. You can use it on the project website, make structures that you need, grab the `svg` and place it within your `html`.

### components
The project consists of the following components:

1. `drawChemEditor` directive - the directive for interaction between the user and the editor,
2. `DrawChem` factory - the main entry point for the use in a custom `controller`,
3. `DrawChemConstants` factory - contains constant values, such as bond length, bond width, etc.,
4. `DrawChemStructures` factory - defines basic structures, such as single bond, basic molecules (benzene, cyclohexane, etc.),
5. `DrawChemShapes` factory - contains key functionalities for transforming a `Structure` object into `Shape` object (see terminology),
6. `DCShape` factory - defines `Shape` class,
7. `DCStructure` factory - defines `Structure` class.

### terminology
**`Shape`** vs **`Structure`**

`Structure` object contains name of the structure and the structure itself as an array of `atoms`.
Each `atom` is an object containing coordinates of the atom and a `bonds` array with all `atoms` it is connected with.

`Shape` object contains the desired structure as a set of `svg` elements (paths, circles, etc.).

### License
MIT