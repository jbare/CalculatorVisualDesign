pack.circles <- function(rfix, xfix, 
  size=c(100, 100), max.iter=10, overlap=0 ) {
  #
  # Simple circle packing algorithm based on inverse size weighted repulsion
  #
  # config   - matrix with two cols: radius, N
  # size     - width and height of bounding rectangle
  # max.iter - maximum number of iterations to try
  # overlap  - allowable overlap expressed as proportion of joint radii

  # ============================================================================
  #  Global constants
  # ============================================================================
  # round-off tolerance
  TOL <- 0.0001

  # convert overlap to proportion of radius
  if (overlap < 0 | overlap >= 1) {
    stop("overlap should be in the range [0, 1)")
  }
  PRADIUS <- 1 - overlap

  NCIRCLES <- length(rfix)
  # ============================================================================
  #  Helper function - Draw a circle
  # ============================================================================
  draw.circle <- function(x, y, r, col) { 
    lines( cos(seq(0, 2*pi, pi/180)) * r + x, sin(seq(0, 2*pi, pi/180)) * r + y , col=col )
  }


  # ============================================================================
  #  Helper function - Move two circles apart. The proportion of the required
  #  distance moved by each circle is proportional to the size of the other 
  #  circle. For example, If a c1 with radius r1 overlaps c2 with radius r2,
  #  and the movement distance required to separate them is ds, then c1 will
  #  move ds * r2 / (r1 + r2) while c2 will move ds * r1 / (r1 + r2). Thus,
  #  when a big circle overlaps a little one, the little one moves a lot while
  #  the big one moves a little.
  # ============================================================================
  repel <- function(xyr, c0, c1) {
    dx <- xyr[c1, 1] - xyr[c0, 1]
    dy <- xyr[c1, 2] - xyr[c0, 2]
    d <- sqrt(dx*dx + dy*dy)
    r <- xyr[c1, 3] + xyr[c0, 3]
    w0 <- xyr[c1, 3] / r
    w1 <- xyr[c0, 3] / r

    if (d < r - TOL) {
      p <- (r - d) / d
      # xyr[c1, 1] <<- toroid(xyr[c1, 1] + p*dx*w1, 1)
      xyr[c1, 2] <<- toroid(xyr[c1, 2] + p*dy*w1, 2)
      # xyr[c0, 1] <<- toroid(xyr[c0, 1] - p*dx*w0, 1)
      xyr[c0, 2] <<- toroid(xyr[c0, 2] - p*dy*w0, 2)

      return(TRUE)
    }

    return(FALSE)
  }


  # ============================================================================
  #  Helper function - Adjust a coordinate such that if it is distance d beyond
  #  an edge (ie. outside the area) it is moved to be distance d inside the 
  #  opposite edge. This has the effect of treating the area as a toroid.
  # ============================================================================
  toroid <- function(coord, axis) {
    tcoord <- coord

    if (coord < 0) {
      tcoord <- coord + size[axis]
    } else if (coord >= size[axis]) {
      tcoord <- coord - size[axis]
    }

    tcoord
  }


  # ============================================================================
  #  Main program
  # ============================================================================

  # ------------------------------------------
  # create a random initial layout
  # ------------------------------------------
  xyr <- matrix(0, NCIRCLES, 3)

  # generate random y axis 
  all_y <- runif(NCIRCLES, size[2] * 0.3, size[2] * 0.7)
  # arrange y axis so larger dot in the middle
  generated.rank <- order(abs(all_y - size[2] / 2), decreasing = TRUE)
  data.rank <- order(rfix)

  for (i in 1:length(rfix)) {
    # rearranging x axis to new size
    xyr[i, 1] <- (xfix[i] - min(xfix))/(max(xfix) - min(xfix)) * size[1]
    xyr[data.rank[i], 2] <- all_y[generated.rank[i]]
    xyr[i, 3] <- rfix[i] * PRADIUS
  }

  # ------------------------------------------
  # iteratively adjust the layout
  # ------------------------------------------
  for (iter in 1:max.iter) {
    moved <- FALSE
    for (i in 1:(NCIRCLES-1)) {
      for (j in (i+1):NCIRCLES) {
        if (repel(xyr, i, j)) {
          moved <- TRUE
        }
      }
    }
    cat(".")
    if (!moved) break
  }

  cat(paste(iter, "iterations\n"));
  
  # ------------------------------------------
  # draw the layout
  # ------------------------------------------
  plot(0, type="n", xlab="x", xlim=c(0,size[1]), ylab="y", ylim=c(0, size[2]))

  xyr[, 3] <- xyr[, 3] / PRADIUS
  for (i in 1:nrow(xyr)) {
    draw.circle(xyr[i, 1], xyr[i, 2], xyr[i, 3], "gray")
  }

  # ------------------------------------------
  # return the layout
  # ------------------------------------------
  colnames(xyr) <- c("x", "y", "radius")
  invisible(xyr) 
}