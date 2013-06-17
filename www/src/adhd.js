

var adhd = angular.module('adhd', [
  'ui.bootstrap'
]);


var skope = null;

function AdhdCtrl($scope, $timeout) {

    $scope.meow = '/adhd/';
     
    $scope.force = null
    $scope.vis = null

    $scope.w = innerWidth
    $scope.h = innerHeight

    $scope.node
    $scope.link
    $scope.root


    $scope.create = function() {
      skope = $scope

      $timeout(function(){ 

        $scope.force = d3.layout.force()
          .on("tick", $scope.tick)
          .charge(function(d) { return - Math.sqrt( d.size ) ; })
          .linkDistance(function(d) { return d.children ? Math.sqrt(d.target.size) : 30 ; })
          .size([$scope.w, $scope.h - 160]);

        $scope.vis = d3.select("body").append("svg:svg")
          .attr("class", 'panel')
          .attr("width", '100%')
          .attr("height", '100%');

        d3.json("adhd.json", function(json) {
          $scope.root = json;
          //$scope.root.fixed = true;
          $scope.root.x = $scope.w / 2;
          $scope.root.y = $scope.h / 2 - 80;
          $scope.update();
        });
  
      },0);

    }



    $scope.update = function() {
      $timeout(function(){ 
        var nodes = $scope.flatten(),
            links = d3.layout.tree().links(nodes);

        // Restart the force layout.
      
        $scope.force
          .nodes(nodes)
          .links(links)
          .start();


        link = $scope.vis.selectAll("line.link")
            .data(links, function(d) { return d.target.id; });

        link.enter().insert("svg:line", ".node")
            .attr("class", "link")
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        link.exit().remove();



        node = $scope.vis.selectAll("circle.node")
            .data(nodes, function(d) { return d.id; })
            .style("fill", $scope.color);

        node.transition()
            .attr("r", function(d) { return d.children ? 4.5 : Math.sqrt(d.size) / 10; });

        n = node.enter().append("svg:circle")
            .attr("class", "node")
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
            .attr("r", function(d) { return d.children ? 4.5 : Math.sqrt(d.size) / 10; })
            .style("fill", $scope.color)
            .on("click", $scope.click)
            .call($scope.force.drag)


        n.append("text")
          .attr("dx", 12)
          .attr("dy", ".35em")
          .attr("x", function(d) { return d.x; })
          .attr("y", function(d) { return d.y; })
          .text(function(d) { return d.name })
          .style("fill", $scope.color)
          .on("click", $scope.click)


        // var nx = node
        //   .enter().append("g")
        //   .attr("class", "node")
        //   .attr("cx", function(d) { return d.x; })
        //   .attr("cy", function(d) { return d.y; })
        //   .call($scope.force.drag)

      // nx.append("image")
      //     .attr("xlink:href", "https://github.com/favicon.ico")
      //     .attr("width", 16)
      //     .attr("height", 16);

        // nx.append("text")
        //   .attr("dx", 12)
        //   .attr("dy", ".35em")
        //   // .attr("x", function(d) { return d.x; })
        //   // .attr("y", function(d) { return d.y; })
        //   .text(function(d) { return d.name })
        //   .style("fill", $scope.color)
        //   .on("click", $scope.click)

          //nx.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

        node.exit().remove();

      },0);
    }

    $scope.flatten = function() {
      var nodes = [], i = 0;

      function recurse(node) {
        if (node.children) node.size = node.children.reduce(function(p, v) { return p + recurse(v); }, 0);
        if (!node.id) node.id = ++i;
        nodes.push(node);
        return node.size;
      }

      $scope.root.size = recurse($scope.root);
      return nodes;
    }



    $scope.tick = function() {
      link.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      node.attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
    }


    $scope.colors = {
      X: "#CC3300",
      A: "#0066CC",
      a: "#33CCFF",
      H: "#FF9900",
      h: "#FFCC00",
      I: "#33CC33",
      i: "#66FF66",
    }

    $scope.color = function(d) {
      return $scope.colors[d.type]
    }


    $scope.click = function(d) {
      console.log(d)
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      $scope.update();
    }

    

    $scope.closeup = function() {
      var nodes = [], i = 0;

      function recurse(node) {
        if (node.children) {
          node.children.forEach(function(d,i) { 
            recurse(d); 
            if (d.children) {
              d._children = d.children;
              d.children = null;
            }
          })
              // node._children = node.children;
              // node.children = null;
        }
      }

      $scope.root.size = recurse($scope.root);
      $scope.update()

    }


}


AdhdCtrl.$inject = ['$scope','$timeout'];




