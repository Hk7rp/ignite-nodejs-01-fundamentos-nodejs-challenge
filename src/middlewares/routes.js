import { randomUUID } from 'node:crypto'
import { Database } from "./database.js"
import { buildRoutePath } from '../utils/build-route-path.js'
import { taskValidator } from '../utils/task-validator.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select('tasks', search ? {
        title: search,
        description: search,
      } : null)

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks/csv'),
    handler: (req, res) => {
      console.log(req)
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      const validation = taskValidator({ title, description })

      if (validation.length > 0) {
        return res.writeHead(400).end(
          JSON.stringify(`Os seguintes campos estão incompletos: ${validation.join(', ')}`)
        )
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date()
      }

      database.insert('tasks', task)

      return res.writeHead(201).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const { title, description } = req.body

      const validation = taskValidator({ title, description })

      if (validation.length > 0) {
        return res.writeHead(400).end(
          JSON.stringify(`Os seguintes campos estão incompletos: ${validation.join(', ')}`)
        )
      }

      const task = {
        title,
        description,
        updated_at: new Date()
      }

      const result = database.update('tasks', id, task)

      if (result) {
        return res.writeHead(204).end()
      }

      return res.writeHead(400).end(
        JSON.stringify(`Os seguintes campos estão incompletos: ${validation.join(', ')}`)
      )
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const result = database.delete('tasks', id)

      if (result) {
        return res.writeHead(204).end()
      }

      return res.writeHead(400).end(
        JSON.stringify(`Os seguintes campos estão incompletos: ${validation.join(', ')}`)
      )
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      const result = database.update('tasks', id, { completed_at: new Date() })

      if (result) {
        return res.writeHead(204).end()
      }

      return res.writeHead(400).end(
        JSON.stringify(`Os seguintes campos estão incompletos: ${validation.join(', ')}`)
      )
    }
  },
]