/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var match = require('./match.model');
var steam_key = process.env.STEAM_KEY;

// Get list of things
exports.index = function(req, res) {
  match.find(function (err, things) {
    if(err) { return handleError(res, err); }
    return res.json(200, things);
  });
};

// Get a single match
exports.show = function(req, res) {
  match.findById(req.params.id, function (err, match) {
    if(err) { return handleError(res, err); }
    if(!match) { return res.send(404); }
    return res.json(match);
  });
};

// Creates a new match in the DB.
exports.create = function(req, res) {
  match.create(req.body, function(err, match) {
    if(err) { return handleError(res, err); }
    return res.json(201, match);
  });
};

// Updates an existing match in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  match.findById(req.params.id, function (err, match) {
    if (err) { return handleError(res, err); }
    if(!match) { return res.send(404); }
    var updated = _.merge(match, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, match);
    });
  });
};

// Deletes a match from the DB.
exports.destroy = function(req, res) {
  match.findById(req.params.id, function (err, match) {
    if(err) { return handleError(res, err); }
    if(!match) { return res.send(404); }
    match.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}