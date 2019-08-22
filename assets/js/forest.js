var cellEnum = {
  BEAR: 0,
  JACK: 1,
  SAPLING: 2,
  TREE: 3,
  ELDER: 4,
  DIRT: 5
}

var colourMap = {
  0: "#D2691E",
  1: "#DC143C",
  2: "#7CFC00",
  3: "#228B22",
  4: "#006400",
  5: "#FAFAD2",
}

var moveMap = {
  0 : [-1, 0],
  1 : [0, -1],
  2 : [1, 0],
  3 : [0, 1],
}

var Grid = function(cell_size, num_cells, cnv, div){
  this.canvas = cnv;
  this.ctx = this.canvas.getContext("2d");
  this.div = div;

  this.cell_size = cell_size;
  this.num_cells = num_cells;
  this.area = this.cell_size * this.num_cells;
  this.forest = [];
  this.covered_values = [];

  this.min_x = (this.canvas.width - this.num_cells*this.cell_size)/2;
  this.min_y = (this.canvas.height - this.num_cells*this.cell_size)/2;
  this.max_x = this.min_x + this.num_cells*this.cell_size;
  this.max_y = this.min_y + this.num_cells*this.cell_size;
}

Grid.prototype.inGrid = function(x, y) {
  return x < this.num_cells && x >= 0 && y < this.num_cells && y >= 0;
}

Grid.prototype.clear = function() {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

Grid.prototype.indexToPositionX = function(xIndex) {
  return this.min_x + xIndex*this.cell_size;
}

Grid.prototype.indexToPositionY = function(yIndex) {
  return this.min_y + yIndex*this.cell_size;
}

Grid.prototype.colourCell = function(leftX, topY, colour, overall=true) {
  if (this.inGrid(leftX, topY)){
    this.ctx.beginPath();
    this.ctx.fillStyle = colour;
    this.ctx.fillRect(this.indexToPositionX(leftX), this.indexToPositionY(topY), this.cell_size, this.cell_size);
    this.ctx.closePath();
  }
}

Grid.prototype.colourGrid = function() {
  for (var coords_string in this.forest) {
    coords_string = coords_string.split(',');
    var coords = [parseInt(coords_string[0], 10), parseInt(coords_string[1], 10)];
    this.colourCell(coords[0], coords[1], colourMap[this.forest[coords_string]]);
  }
}

Grid.prototype.initialiseForest = function(initial_bears, initial_jacks, initial_saplings, initial_trees, initial_elders,
  prob_bear_moves, prob_jack_moves, prob_sap_matures, prob_tree_matures, prob_tree_seeds_sapling) {
  total_cells = this.num_cells*this.num_cells;

  var numBears = Math.floor(initial_bears*total_cells);
  var numJacks = Math.floor(initial_jacks*total_cells);
  var numSaplings = Math.floor(initial_saplings*total_cells);
  var numTrees = Math.floor(initial_trees*total_cells);
  var numElders = Math.floor(initial_elders*total_cells);
  var numDirt = total_cells - (numBears + numJacks + numSaplings + numTrees + numElders);

  var initial_numbers = [numBears, numJacks, numSaplings, numTrees, numElders, numDirt];

  this.prob_bear_moves = prob_bear_moves;
  this.prob_jack_moves = prob_jack_moves;
  this.prob_sap_matures = prob_sap_matures;
  this.prob_tree_matures = prob_tree_matures;
  this.prob_tree_seeds_sapling = prob_tree_seeds_sapling;

  // we need to go and randomly assign these
  // put both values (t and t-1) as the same thing at the start
  // as if everything had been stationary for one month

  for (var i=0; i<this.num_cells; i++){
    for (var j=0; j<this.num_cells; j++){
      // we are colouring cell[i][j]
      var n = 0;
      while (n == 0){
        var r = Math.random();
        if (r < initial_bears) r = cellEnum.BEAR;
        else if (r < initial_bears + initial_jacks) r = cellEnum.JACK;
        else if (r < initial_bears + initial_jacks + initial_saplings) r = cellEnum.SAPLING;
        else if (r < initial_bears + initial_jacks + initial_saplings + initial_trees) r = cellEnum.TREE;
        else if (r < initial_bears + initial_jacks + initial_saplings + initial_trees + initial_elders) r = cellEnum.ELDER;
        else r = cellEnum.DIRT;
        n = initial_numbers[r];
      }
      // now r referes to the type of cell to populate
      this.forest[[i, j]] = r;

      if (r === cellEnum.JACK || r === cellEnum.BEAR) {
        this.covered_values[[i, j]] = cellEnum.DIRT;
      }

      initial_numbers[r]--;
    }
  }
  this.colourGrid();
}

Grid.prototype.iterateBear = function(x, y) {
  if (Math.random() < this.prob_bear_moves) {
    var move = moveMap[randInt(4)];
    var dx = move[0];
    var dy = move[1];

    if (this.inGrid(x+dx, y+dy)) {
      var destination = this.forest[[x+dx, y+dy]];
      if (destination == cellEnum.BEAR) return;

      this.forest[[x, y]] = this.covered_values[[x, y]];
      delete this.covered_values[[x, y]];

      if (destination === cellEnum.JACK) {
        // gobbled
        this.covered_values[[x+dx, y+dy]] = cellEnum.DIRT;
      }
      else this.covered_values[[x+dx, y+dy]] = this.forest[[x+dx, y+dy]];

      this.forest[[x+dx, y+dy]] = cellEnum.BEAR;
    }
  }
}

Grid.prototype.iterateJack = function(x, y) {
  if (Math.random() < this.prob_jack_moves) {
    var move = moveMap[randInt(4)];
    var dx = move[0];
    var dy = move[1];

    if (this.inGrid(x+dx, y+dy)) {
      var destination = this.forest[[x+dx, y+dy]];
      if (destination == cellEnum.JACK || destination == cellEnum.BEAR) return;

      this.forest[[x, y]] = this.covered_values[[x, y]];
      delete this.covered_values[[x, y]];

      if (destination === cellEnum.TREE || destination === cellEnum.ELDER) {
        // cut down
        this.covered_values[[x+dx, y+dy]] = cellEnum.DIRT;
      }
      else this.covered_values[[x+dx, y+dy]] = this.forest[[x+dx, y+dy]];

      this.forest[[x+dx, y+dy]] = cellEnum.JACK;
    }
  }
}

Grid.prototype.iterateSapling = function(x, y) {
  if (Math.random() < this.prob_sap_matures) {
    this.forest[[x, y]] = cellEnum.TREE;
  }
}

Grid.prototype.seedSapling = function(x, y) {
  var move = moveMap[randInt(4)];
  var dx = move[0];
  var dy = move[1];

  if (this.inGrid(x+dx, y+dy)) {
    var destination = this.forest[[x+dx, y+dy]];
    if (destination == cellEnum.DIRT) {
      this.forest[[x+dx, y+dy]] = cellEnum.SAPLING;
    }
  }
}

Grid.prototype.iterateTree = function(x, y) {
  if (Math.random() < this.prob_tree_matures) {
    this.forest[[x, y]] = cellEnum.ELDER;
  }
  else if (Math.random() < this.prob_tree_seeds_sapling) this.seedSapling(x, y);
}

Grid.prototype.iterateElder = function(x, y) {
  if (Math.random() < this.prob_tree_seeds_sapling) this.seedSapling(x, y);
}

Grid.prototype.iterateForest = function() {
  for (var coords_string in this.forest) {
    coords_string = coords_string.split(',');
    var coords = [parseInt(coords_string[0], 10), parseInt(coords_string[1], 10)];
    if (this.forest[coords_string] === cellEnum.BEAR) {
      this.iterateBear(coords[0], coords[1]);
    }
    else if (this.forest[coords_string] === cellEnum.JACK) {
      this.iterateJack(coords[0], coords[1]);
    }
    else if (this.forest[coords_string] === cellEnum.SAPLING) {
      this.iterateSapling(coords[0], coords[1]);
    }
    else if (this.forest[coords_string] === cellEnum.TREE) {
      this.iterateTree(coords[0], coords[1]);
    }
    else if (this.forest[coords_string] === cellEnum.ELDER) {
      this.iterateElder(coords[0], coords[1]);
    }
  }
  this.colourGrid();
}

Grid.prototype.evolveForest = function(seconds_per_iteration) {
  var t = this;
  setInterval(function(){t.iterateForest();}, 1000*seconds_per_iteration);
}


function randInt(n) {
  // return a random int in range(0, n)
  return Math.floor(Math.random()*(n-0.01));
}

// ----------------------------------------------------------------------
// MAIN CODE

var main_div = document.getElementById("main-canvas-div");
var main_canvas = document.getElementById("main-canvas");
var gridForest = new Grid(10, 90, main_canvas, main_div);

var months = 10;

var initial_bears = 0.001;
var initial_jacks = 0.02;
var initial_saplings = 0.1;
var initial_trees = 0.3;
var initial_elders = 0.1;

var prob_bear_moves = 0.4;
var prob_jack_moves = 0.2;
var prob_sap_matures = 0.1;
var prob_tree_matures = 0.01;
var prob_tree_seeds_sapling = 0.01;

var lumber_collected;
var jacks_eaten;

gridForest.initialiseForest(initial_bears, initial_jacks, initial_saplings, initial_trees, initial_elders,
  prob_bear_moves, prob_jack_moves, prob_sap_matures, prob_tree_matures, prob_tree_seeds_sapling);
gridForest.evolveForest(0.01);
