import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertRestaurantSchema, insertTaskSchema, insertResourceSchema, insertFeedbackSchema, insertLogSchema, insertInviteSchema, insertQuoteInteractionSchema, UserRole } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { randomBytes } from "crypto";

// Helper function for handling errors
const handleError = (res: Response, error: unknown) => {
  console.error(error);
  if (error instanceof z.ZodError) {
    return res.status(400).json({ 
      message: "Validation error", 
      details: fromZodError(error).message 
    });
  }
  return res.status(500).json({ message: "An unexpected error occurred" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      
      const user = await storage.getUserByEmail(email);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // In a real app, you would:
      // 1. Never store passwords as plain text
      // 2. Generate a JWT or session
      // 3. Not return the password to the client
      
      const { password: _, ...userWithoutPassword } = user;
      
      return res.status(200).json({ user: userWithoutPassword });
    } catch (error) {
      return handleError(res, error);
    }
  });
  
  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password, ...userWithoutPassword } = user;
      
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      return handleError(res, error);
    }
  });
  
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(userData.email);
      
      if (existingUser) {
        return res.status(409).json({ message: "User with this email already exists" });
      }
      
      const newUser = await storage.createUser(userData);
      const { password, ...userWithoutPassword } = newUser;
      
      return res.status(201).json(userWithoutPassword);
    } catch (error) {
      return handleError(res, error);
    }
  });
  
  app.put("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const userData = insertUserSchema.partial().parse(req.body);
      const updatedUser = await storage.updateUser(id, userData);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password, ...userWithoutPassword } = updatedUser;
      
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      return handleError(res, error);
    }
  });
  
  app.delete("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const deleted = await storage.deleteUser(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "User not found" });
      }
      
      return res.status(204).end();
    } catch (error) {
      return handleError(res, error);
    }
  });
  
  app.get("/api/restaurants/:restaurantId/users", async (req, res) => {
    try {
      const restaurantId = parseInt(req.params.restaurantId);
      
      if (isNaN(restaurantId)) {
        return res.status(400).json({ message: "Invalid restaurant ID" });
      }
      
      const users = await storage.getUsersByRestaurant(restaurantId);
      const usersWithoutPasswords = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      
      return res.status(200).json(usersWithoutPasswords);
    } catch (error) {
      return handleError(res, error);
    }
  });
  
  // Restaurant routes
  app.get("/api/restaurants/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid restaurant ID" });
      }
      
      const restaurant = await storage.getRestaurant(id);
      
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
      
      return res.status(200).json(restaurant);
    } catch (error) {
      return handleError(res, error);
    }
  });
  
  app.post("/api/restaurants", async (req, res) => {
    try {
      const restaurantData = insertRestaurantSchema.parse(req.body);
      const newRestaurant = await storage.createRestaurant(restaurantData);
      
      return res.status(201).json(newRestaurant);
    } catch (error) {
      return handleError(res, error);
    }
  });
  
  app.put("/api/restaurants/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid restaurant ID" });
      }
      
      const restaurantData = insertRestaurantSchema.partial().parse(req.body);
      const updatedRestaurant = await storage.updateRestaurant(id, restaurantData);
      
      if (!updatedRestaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
      
      return res.status(200).json(updatedRestaurant);
    } catch (error) {
      return handleError(res, error);
    }
  });
  
  app.delete("/api/restaurants/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid restaurant ID" });
      }
      
      const deleted = await storage.deleteRestaurant(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
      
      return res.status(204).end();
    } catch (error) {
      return handleError(res, error);
    }
  });
  
  app.get("/api/users/:userId/restaurants", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const restaurants = await storage.getRestaurantsByOwner(userId);
      
      return res.status(200).json(restaurants);
    } catch (error) {
      return handleError(res, error);
    }
  });
  
  // Task routes
  app.get("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid task ID" });
      }
      
      const task = await storage.getTask(id);
      
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      return res.status(200).json(task);
    } catch (error) {
      return handleError(res, error);
    }
  });
  
  app.get("/api/restaurants/:restaurantId/tasks", async (req, res) => {
    try {
      const restaurantId = parseInt(req.params.restaurantId);
      
      if (isNaN(restaurantId)) {
        return res.status(400).json({ message: "Invalid restaurant ID" });
      }
      
      const tasks = await storage.getTasksByRestaurant(restaurantId);
      
      return res.status(200).json(tasks);
    } catch (error) {
      return handleError(res, error);
    }
  });
  
  app.get("/api/users/:userId/tasks", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const tasks = await storage.getTasksByAssignee(userId);
      
      return res.status(200).json(tasks);
    } catch (error) {
      return handleError(res, error);
    }
  });
  
  app.post("/api/tasks", async (req, res) => {
    try {
      const taskData = insertTaskSchema.parse(req.body);
      const newTask = await storage.createTask(taskData);
      
      // Create a log entry for the task creation
      await storage.createLog({
        type: "task_created",
        userId: taskData.createdBy,
        resourceId: newTask.id,
        resourceType: "task",
        details: { taskName: newTask.title },
        restaurantId: taskData.restaurantId
      });
      
      return res.status(201).json(newTask);
    } catch (error) {
      return handleError(res, error);
    }
  });
  
  app.put("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid task ID" });
      }
      
      const taskData = insertTaskSchema.partial().parse(req.body);
      const updatedTask = await storage.updateTask(id, taskData);
      
      if (!updatedTask) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      // If status was updated to completed, create a log entry
      if (taskData.status === "completed") {
        await storage.createLog({
          type: "task_completed",
          userId: updatedTask.assignedTo || updatedTask.createdBy,
          resourceId: updatedTask.id,
          resourceType: "task",
          details: { taskName: updatedTask.title },
          restaurantId: updatedTask.restaurantId
        });
      }
      
      return res.status(200).json(updatedTask);
    } catch (error) {
      return handleError(res, error);
    }
  });
  
  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid task ID" });
      }
      
      const deleted = await storage.deleteTask(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      return res.status(204).end();
    } catch (error) {
      return handleError(res, error);
    }
  });
  
  // Resource routes
  app.get("/api/resources/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid resource ID" });
      }
      
      const resource = await storage.getResource(id);
      
      if (!resource) {
        return res.status(404).json({ message: "Resource not found" });
      }
      
      return res.status(200).json(resource);
    } catch (error) {
      return handleError(res, error);
    }
  });
  
  app.get("/api/restaurants/:restaurantId/resources", async (req, res) => {
    try {
      const restaurantId = parseInt(req.params.restaurantId);
      
      if (isNaN(restaurantId)) {
        return res.status(400).json({ message: "Invalid restaurant ID" });
      }
      
      const resources = await storage.getResourcesByRestaurant(restaurantId);
      
      return res.status(200).json(resources);
    } catch (error) {
      return handleError(res, error);
    }
  });
  
  app.post("/api/resources", async (req, res) => {
    try {
      const resourceData = insertResourceSchema.parse(req.body);
      const newResource = await storage.createResource(resourceData);
      
      // Create log entry for resource upload
      await storage.createLog({
        type: "resource_uploaded",
        userId: resourceData.uploadedBy,
        resourceId: newResource.id,
        resourceType: "resource",
        details: { resourceName: newResource.title },
        restaurantId: resourceData.restaurantId
      });
      
      return res.status(201).json(newResource);
    } catch (error) {
      return handleError(res, error);
    }
  });
  
  app.put("/api/resources/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid resource ID" });
      }
      
      const resourceData = insertResourceSchema.partial().parse(req.body);
      const updatedResource = await storage.updateResource(id, resourceData);
      
      if (!updatedResource) {
        return res.status(404).json({ message: "Resource not found" });
      }
      
      return res.status(200).json(updatedResource);
    } catch (error) {
      return handleError(res, error);
    }
  });
  
  app.delete("/api/resources/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid resource ID" });
      }
      
      const deleted = await storage.deleteResource(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Resource not found" });
      }
      
      return res.status(204).end();
    } catch (error) {
      return handleError(res, error);
    }
  });
  
  // Activity log routes
  app.get("/api/restaurants/:restaurantId/logs", async (req, res) => {
    try {
      const restaurantId = parseInt(req.params.restaurantId);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      
      if (isNaN(restaurantId)) {
        return res.status(400).json({ message: "Invalid restaurant ID" });
      }
      
      if (limit !== undefined && isNaN(limit)) {
        return res.status(400).json({ message: "Invalid limit parameter" });
      }
      
      const logs = await storage.getLogsByRestaurant(restaurantId, limit);
      
      return res.status(200).json(logs);
    } catch (error) {
      return handleError(res, error);
    }
  });
  
  app.post("/api/logs", async (req, res) => {
    try {
      const logData = insertLogSchema.parse(req.body);
      const newLog = await storage.createLog(logData);
      
      return res.status(201).json(newLog);
    } catch (error) {
      return handleError(res, error);
    }
  });
  
  // Feedback routes
  app.get("/api/restaurants/:restaurantId/feedback", async (req, res) => {
    try {
      const restaurantId = parseInt(req.params.restaurantId);
      
      if (isNaN(restaurantId)) {
        return res.status(400).json({ message: "Invalid restaurant ID" });
      }
      
      const feedback = await storage.getFeedbackByRestaurant(restaurantId);
      
      return res.status(200).json(feedback);
    } catch (error) {
      return handleError(res, error);
    }
  });
  
  app.post("/api/feedback", async (req, res) => {
    try {
      const feedbackData = insertFeedbackSchema.parse(req.body);
      const newFeedback = await storage.createFeedback(feedbackData);
      
      // Create log entry for feedback submission
      await storage.createLog({
        type: "feedback_submitted",
        userId: feedbackData.userId,
        resourceId: newFeedback.id,
        resourceType: "feedback",
        details: { rating: newFeedback.rating },
        restaurantId: feedbackData.restaurantId
      });
      
      return res.status(201).json(newFeedback);
    } catch (error) {
      return handleError(res, error);
    }
  });

  // Invite routes
  app.get("/api/invites/:token", async (req, res) => {
    try {
      const { token } = req.params;
      
      if (!token) {
        return res.status(400).json({ message: "Invalid token" });
      }
      
      const invite = await storage.getInviteByToken(token);
      
      if (!invite) {
        return res.status(404).json({ message: "Invite not found" });
      }
      
      if (invite.used) {
        return res.status(410).json({ message: "This invite has already been used" });
      }
      
      if (invite.expiresAt && new Date(invite.expiresAt) < new Date()) {
        return res.status(410).json({ message: "This invite has expired" });
      }
      
      return res.status(200).json(invite);
    } catch (error) {
      return handleError(res, error);
    }
  });
  
  app.get("/api/restaurants/:restaurantId/invites", async (req, res) => {
    try {
      const restaurantId = parseInt(req.params.restaurantId);
      
      if (isNaN(restaurantId)) {
        return res.status(400).json({ message: "Invalid restaurant ID" });
      }
      
      const invites = await storage.getInvitesByRestaurant(restaurantId);
      
      return res.status(200).json(invites);
    } catch (error) {
      return handleError(res, error);
    }
  });
  
  app.post("/api/invites", async (req, res) => {
    try {
      // Generate a secure random token
      const tokenBytes = randomBytes(16);
      const token = tokenBytes.toString('hex');
      
      // Validate that the request has the required fields
      const inviteData = insertInviteSchema.parse({
        ...req.body,
        token
      });
      
      // Validate the role (only owners and GMs can create invites for GMs and staff)
      const { role } = inviteData;
      
      if (role !== UserRole.GENERAL_MANAGER && role !== UserRole.STAFF) {
        return res.status(400).json({ 
          message: "Invalid role. Invites can only be created for General Manager or Staff roles" 
        });
      }
      
      // Create the invite
      const newInvite = await storage.createInvite(inviteData);
      
      // Create a log entry for the invite creation
      await storage.createLog({
        type: "invite_created",
        userId: inviteData.createdBy,
        details: { 
          inviteRole: inviteData.role,
          inviteEmail: inviteData.email || "not specified"
        },
        restaurantId: inviteData.restaurantId
      });
      
      return res.status(201).json(newInvite);
    } catch (error) {
      return handleError(res, error);
    }
  });
  
  app.post("/api/register-with-invite", async (req, res) => {
    try {
      const { token, user } = req.body;
      
      if (!token || !user) {
        return res.status(400).json({ message: "Token and user data are required" });
      }
      
      // Validate the token
      const invite = await storage.getInviteByToken(token);
      
      if (!invite) {
        return res.status(404).json({ message: "Invalid invite token" });
      }
      
      if (invite.used) {
        return res.status(410).json({ message: "This invite has already been used" });
      }
      
      if (invite.expiresAt && new Date(invite.expiresAt) < new Date()) {
        return res.status(410).json({ message: "This invite has expired" });
      }
      
      // Validate user data
      const userData = insertUserSchema.parse({
        ...user,
        role: invite.role,
        restaurantId: invite.restaurantId
      });
      
      // Check if email is already registered
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(409).json({ message: "Email is already registered" });
      }
      
      // Create the user
      const newUser = await storage.createUser(userData);
      
      // Mark the invite as used
      await storage.markInviteAsUsed(token);
      
      // Create a log entry for user registration
      await storage.createLog({
        type: "user_registered",
        userId: newUser.id,
        details: { role: newUser.role },
        restaurantId: invite.restaurantId
      });
      
      // Return user data without password
      const { password, ...userWithoutPassword } = newUser;
      
      return res.status(201).json({ user: userWithoutPassword });
    } catch (error) {
      return handleError(res, error);
    }
  });

  // Quote interaction routes
  app.post("/api/quote-interactions", async (req, res) => {
    try {
      const interactionData = insertQuoteInteractionSchema.parse(req.body);
      const newInteraction = await storage.recordQuoteInteraction(interactionData);
      
      return res.status(201).json(newInteraction);
    } catch (error) {
      return handleError(res, error);
    }
  });
  
  app.get("/api/quote-interactions", async (req, res) => {
    try {
      const interactions = await storage.getQuoteInteractions();
      return res.status(200).json(interactions);
    } catch (error) {
      return handleError(res, error);
    }
  });
  
  app.get("/api/restaurants/:restaurantId/quote-interactions", async (req, res) => {
    try {
      const restaurantId = parseInt(req.params.restaurantId);
      
      if (isNaN(restaurantId)) {
        return res.status(400).json({ message: "Invalid restaurant ID" });
      }
      
      const interactions = await storage.getQuoteInteractionsByRestaurant(restaurantId);
      return res.status(200).json(interactions);
    } catch (error) {
      return handleError(res, error);
    }
  });
  
  app.get("/api/quote-interactions/top", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      
      if (limit !== undefined && isNaN(limit)) {
        return res.status(400).json({ message: "Invalid limit parameter" });
      }
      
      const interactions = await storage.getTopQuoteInteractions(limit);
      return res.status(200).json(interactions);
    } catch (error) {
      return handleError(res, error);
    }
  });

  const httpServer = createServer(app);
  
  return httpServer;
}
