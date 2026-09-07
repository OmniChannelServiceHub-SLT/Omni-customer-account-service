/**
 * STUB — minimal, in-memory implementations of the three still-required
 * TMF666 resources: BillFormat, BillPresentationMedia, BillingCycleSpecification.
 *
 * These are NOT persisted to your real DB and NOT built following the
 * project's usual route/controller/service split — this is a deliberately
 * throwaway, single-file stand-in so the CTK has something to talk to.
 * Delete this file (and its require/app.use line in app.js) once real
 * implementations replace it.
 *
 * Each resource only needs the flat shape: @type, href, id, name — no
 * nested objects, unlike BillingAccount.
 */
const express = require('express');
const crypto = require('crypto');

const router = express.Router();
const BASE = 'http://localhost:3002/tmf-api/accountManagement/v4';

function makeStore(resourceName) {
  const store = new Map();

  function applyFields(resource, fieldsParam) {
    if (!fieldsParam) return resource;
    const requested = fieldsParam.split(',').map((f) => f.trim());
    const keep = new Set(['@type', 'id', 'href', ...requested]);
    const out = {};
    for (const k of Object.keys(resource)) if (keep.has(k)) out[k] = resource[k];
    return out;
  }

  return {
    create(body) {
      const id = body.id || crypto.randomUUID();
      const resource = {
        id,
        href: `${BASE}/${resourceName}/${id}`,
        '@type': resourceName,
        '@baseType': body['@baseType'],
        '@schemaLocation': body['@schemaLocation'],
        name: body.name,
        description: body.description,
        ...body,
      };
      resource.id = id; // don't let ...body overwrite the generated id
      store.set(id, resource);
      return resource;
    },
    list(query) {
      let results = Array.from(store.values());
      if (query.name) results = results.filter((r) => r.name === query.name);
      return results.map((r) => applyFields(r, query.fields));
    },
    get(id, fields) {
      const resource = store.get(id);
      if (!resource) return null;
      return applyFields(resource, fields);
    },
    update(id, body) {
      const existing = store.get(id);
      if (!existing) return null;
      const merged = { ...existing, ...body, id: existing.id, href: existing.href };
      store.set(id, merged);
      return merged;
    },
    remove(id) {
      return store.delete(id);
    },
  };
}

function registerStubRoutes(resourceName) {
  const store = makeStore(resourceName);
  const path = `${BASE.replace('http://localhost:3002', '')}/${resourceName}`;

  router.post(path, (req, res) => {
    res.status(201).json(store.create(req.body || {}));
  });

  router.get(path, (req, res) => {
    res.status(200).json(store.list(req.query));
  });

  router.get(`${path}/:id`, (req, res) => {
    const resource = store.get(req.params.id, req.query.fields);
    if (!resource) {
      return res.status(404).json({ code: 'NOT_FOUND', message: `${resourceName} ${req.params.id} not found` });
    }
    res.status(200).json(resource);
  });

  router.patch(`${path}/:id`, (req, res) => {
    const updated = store.update(req.params.id, req.body || {});
    if (!updated) {
      return res.status(404).json({ code: 'NOT_FOUND', message: `${resourceName} ${req.params.id} not found` });
    }
    res.status(200).json(updated);
  });

  router.delete(`${path}/:id`, (req, res) => {
    const deleted = store.remove(req.params.id);
    if (!deleted) {
      return res.status(404).json({ code: 'NOT_FOUND', message: `${resourceName} ${req.params.id} not found` });
    }
    res.status(204).send();
  });
}

registerStubRoutes('billFormat');
registerStubRoutes('billPresentationMedia');
registerStubRoutes('billingCycleSpecification');

module.exports = router;