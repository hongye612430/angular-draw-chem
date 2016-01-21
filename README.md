### aim of the project
The aim of this project is to create a light-weight, AngularJS-based editor for producing structural formulas.
The editor is from the beginning designed to be svg-based, thus enabling the drawing of good-looking, scalable structures.

### examples
<img src="https://mmmalik.github.io/angular-draw-chem/svg/benzyl-methyl-ether.svg" alt="benzyl methyl ether" width="30%" height="30%" border="10" />
<div style="max-width:30%;" markdown="1">
	![ex1][struc1]
    [struc1]: https://mmmalik.github.io/angular-draw-chem/svg/benzyl-methyl-ether.svg "benzyl methyl ether"
</div>
![ex2][struc2]
![ex3][struc3]


[struc2]: https://mmmalik.github.io/angular-draw-chem/svg/tmeda.svg "tmeda"
[struc3]: https://mmmalik.github.io/angular-draw-chem/svg/complicated.svg "complicated"

### possible usage

1. By adding `mmAngularDrawChem` module to your project, making it available for the users of your website, so they can interact with it and make their own structures.
2. You can use it on the project website, make structures that you need, grab the `svg` and place it within your `html`.

### components
The project consists of the following components:

1. `drawChemEditor` directive - the directive for interaction between the user and the editor,
2. `DrawChem` factory - the main entry point for the use in a custom `controller`,
3. `DrawChemConstants` factory - contains constant values, such as bond length, bond width, etc.,
4. `DrawChemStructures` factory - defines basic structures, such as single bond, basic molecules (benzene, cyclohexane, etc.),
5. `DrawChemShapes` factory - contains key functionalities for transforming a `Structure` object into `Shape` object (see terminology),
6. `DrawChemCache` factory - caching service for Structure objects,
7. `DCShape` factory - defteines `Shape` class, which encapsulates svg-relevant data,
8. `DCAtom` factory - defines `Atom` class, which encapsulates data about a single atom,
9. `DCStructure` factory - defines `Structure` class, which encapsulates a structure tree (how the atoms are connected with each other),
10. `DCStructureCluster` factory - defines `StructureCluster` class, which enables grouping of multiple `Structure` objects; used for predefined structures,
11. `DrawChemConst` factory - contains all constants, e.g. BOND_LENGTH, BOND_WIDTH, etc.

### terminology
**`Shape`** vs **`Structure`**

`Structure` object contains name of the structure and the structure itself as an array of `atoms`.
Each `atom` is an object containing coordinates of the atom and a `bonds` array with all `atoms` it is connected with.

`Shape` object contains the desired structure as a set of `svg` elements (paths, circles, etc.).

### license
MIT