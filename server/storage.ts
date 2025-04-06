import { 
  users, type User, type InsertUser,
  restaurants, type Restaurant, type InsertRestaurant,
  tasks, type Task, type InsertTask,
  tools, type Tool, type InsertTool,
  logs, type Log, type InsertLog,
  feedback, type Feedback, type InsertFeedback,
  resources, type Resource, type InsertResource,
  invites, type Invite, type InsertInvite,
  quoteInteractions, type QuoteInteraction, type InsertQuoteInteraction,
  TaskStatus, UserRole
} from "@shared/schema";

// Storage interface with CRUD operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByAuthId(authId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  getUsersByRestaurant(restaurantId: number): Promise<User[]>;
  
  // Restaurant operations
  getRestaurant(id: number): Promise<Restaurant | undefined>;
  getRestaurantsByOwner(ownerId: number): Promise<Restaurant[]>;
  createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant>;
  updateRestaurant(id: number, restaurant: Partial<InsertRestaurant>): Promise<Restaurant | undefined>;
  deleteRestaurant(id: number): Promise<boolean>;
  
  // Task operations
  getTask(id: number): Promise<Task | undefined>;
  getTasksByRestaurant(restaurantId: number): Promise<Task[]>;
  getTasksByAssignee(assigneeId: number): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
  
  // Tool operations
  getTool(id: number): Promise<Tool | undefined>;
  getToolsByRestaurant(restaurantId: number): Promise<Tool[]>;
  createTool(tool: InsertTool): Promise<Tool>;
  updateTool(id: number, tool: Partial<InsertTool>): Promise<Tool | undefined>;
  deleteTool(id: number): Promise<boolean>;
  
  // Invite operations
  createInvite(invite: InsertInvite): Promise<Invite>;
  getInviteByToken(token: string): Promise<Invite | undefined>;
  getInvitesByRestaurant(restaurantId: number): Promise<Invite[]>;
  markInviteAsUsed(token: string): Promise<boolean>;
  
  // Log operations
  createLog(log: InsertLog): Promise<Log>;
  getLogsByRestaurant(restaurantId: number, limit?: number): Promise<Log[]>;
  
  // Feedback operations
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
  getFeedbackByRestaurant(restaurantId: number): Promise<Feedback[]>;
  
  // Resource operations
  getResource(id: number): Promise<Resource | undefined>;
  getResourcesByRestaurant(restaurantId: number): Promise<Resource[]>;
  createResource(resource: InsertResource): Promise<Resource>;
  updateResource(id: number, resource: Partial<InsertResource>): Promise<Resource | undefined>;
  deleteResource(id: number): Promise<boolean>;
  
  // Quote interaction operations
  recordQuoteInteraction(interaction: InsertQuoteInteraction): Promise<QuoteInteraction>;
  getQuoteInteractions(): Promise<QuoteInteraction[]>;
  getQuoteInteractionsByRestaurant(restaurantId: number): Promise<QuoteInteraction[]>;
  getTopQuoteInteractions(limit?: number): Promise<QuoteInteraction[]>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private restaurants: Map<number, Restaurant>;
  private tasks: Map<number, Task>;
  private tools: Map<number, Tool>;
  private logs: Map<number, Log>;
  private feedbacks: Map<number, Feedback>;
  private resources: Map<number, Resource>;
  private invites: Map<number, Invite>;
  private quoteInteractions: Map<number, QuoteInteraction>;
  
  private userIdCounter: number;
  private restaurantIdCounter: number;
  private taskIdCounter: number;
  private toolIdCounter: number;
  private logIdCounter: number;
  private feedbackIdCounter: number;
  private resourceIdCounter: number;
  private inviteIdCounter: number;
  private quoteInteractionIdCounter: number;

  constructor() {
    this.users = new Map();
    this.restaurants = new Map();
    this.tasks = new Map();
    this.tools = new Map();
    this.logs = new Map();
    this.feedbacks = new Map();
    this.resources = new Map();
    this.invites = new Map();
    this.quoteInteractions = new Map();
    
    this.userIdCounter = 1;
    this.restaurantIdCounter = 1;
    this.taskIdCounter = 1;
    this.toolIdCounter = 1;
    this.logIdCounter = 1;
    this.feedbackIdCounter = 1;
    this.resourceIdCounter = 1;
    this.inviteIdCounter = 1;
    this.quoteInteractionIdCounter = 1;
    
    // Add a default super admin user
    this.createUser({
      email: "admin@dishwasher.guide",
      username: "Super Admin",
      password: "adminpass", // In a real app, this would be hashed
      role: UserRole.SUPER_ADMIN
    });
    
    // Add a sample restaurant
    const restaurantId = this.restaurantIdCounter;
    this.createRestaurant({
      name: "Pasta Paradise",
      email: "info@pastaparadise.com",
      phone: "(555) 123-4567",
      address: "123 Main St, Anytown, CA 12345",
      description: "Pasta Paradise is a family-owned Italian restaurant specializing in authentic pasta dishes made from scratch daily.",
      ownerId: 1
    });
    
    // Add a sample user for the restaurant
    const userId = this.userIdCounter;
    this.createUser({
      email: "manager@pastaparadise.com",
      username: "John Smith",
      password: "password", // In a real app, this would be hashed
      role: UserRole.GENERAL_MANAGER,
      restaurantId
    });
    
    // Add some sample tasks
    this.createTask({
      title: "Inventory check - Dry goods",
      description: "Perform a complete inventory check of all dry goods and update the stock list.",
      assignedTo: userId,
      priority: "medium",
      status: TaskStatus.PENDING,
      dueDate: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 hours from now
      restaurantId,
      createdBy: 1
    });
    
    this.createTask({
      title: "Staff meeting - New menu items",
      description: "Conduct a staff meeting to introduce the new seasonal menu items and discuss serving suggestions.",
      assignedTo: userId,
      priority: "high",
      status: TaskStatus.PENDING,
      dueDate: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
      restaurantId,
      createdBy: 1
    });
    
    this.createTask({
      title: "Equipment maintenance - Dishwasher",
      description: "Perform routine maintenance on the main kitchen dishwasher.",
      assignedTo: userId,
      priority: "medium",
      status: TaskStatus.COMPLETED,
      dueDate: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      restaurantId,
      createdBy: 1
    });
    
    this.createTask({
      title: "Clean and sanitize prep area",
      description: "Thoroughly clean and sanitize the food preparation area according to health standards.",
      assignedTo: userId,
      priority: "low",
      status: TaskStatus.PENDING,
      dueDate: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
      restaurantId,
      createdBy: 1
    });
    
    // Add some sample activity logs
    this.createLog({
      type: "task_assigned",
      userId: 1,
      resourceId: 1,
      resourceType: "task",
      details: { taskName: "Inventory check - Dry goods", assignedTo: "Maria L." },
      restaurantId
    });
    
    this.createLog({
      type: "task_completed",
      userId: userId,
      resourceId: 3,
      resourceType: "task",
      details: { taskName: "Equipment maintenance - Dishwasher" },
      restaurantId
    });
    
    this.createLog({
      type: "schedule_update",
      userId: 1,
      details: { event: "Staff meeting", time: "3:30 PM" },
      restaurantId
    });
    
    this.createLog({
      type: "issue_reported",
      userId: userId,
      details: { issue: "Refrigerator temperature issue" },
      restaurantId
    });
    
    // Add some sample resources
    this.createResource({
      title: "Employee Handbook",
      description: "Comprehensive guide for all employees covering policies and procedures.",
      fileUrl: "/resources/employee_handbook.pdf",
      fileType: "pdf",
      fileSize: 2457600, // 2.4 MB
      visibleTo: ["all"],
      restaurantId,
      uploadedBy: 1
    });
    
    this.createResource({
      title: "Kitchen Training Guide",
      description: "Training materials for kitchen staff covering food safety and preparation techniques.",
      fileUrl: "/resources/kitchen_training.docx",
      fileType: "docx",
      fileSize: 1843200, // 1.8 MB
      visibleTo: ["kitchen"],
      restaurantId,
      uploadedBy: 1
    });
    
    this.createResource({
      title: "Safety Procedures Video",
      description: "Video demonstration of safety procedures and protocols for all staff.",
      fileUrl: "/resources/safety_video.mp4",
      fileType: "mp4",
      fileSize: 47185920, // 45 MB
      visibleTo: ["all"],
      restaurantId,
      uploadedBy: 1
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }
  
  async getUserByAuthId(authId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.authId === authId);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    // Ensure all required fields have values
    const newUser: User = { 
      ...user, 
      id, 
      createdAt: now,
      role: user.role || UserRole.STAFF,
      authId: user.authId || null,
      avatar: user.avatar || null,
      restaurantId: user.restaurantId || null
    };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.users.delete(id);
  }

  async getUsersByRestaurant(restaurantId: number): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => user.restaurantId === restaurantId);
  }

  // Restaurant operations
  async getRestaurant(id: number): Promise<Restaurant | undefined> {
    return this.restaurants.get(id);
  }

  async getRestaurantsByOwner(ownerId: number): Promise<Restaurant[]> {
    return Array.from(this.restaurants.values()).filter(restaurant => restaurant.ownerId === ownerId);
  }

  async createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant> {
    const id = this.restaurantIdCounter++;
    const now = new Date();
    const newRestaurant: Restaurant = { 
      ...restaurant, 
      id, 
      createdAt: now,
      email: restaurant.email || null,
      phone: restaurant.phone || null,
      address: restaurant.address || null,
      description: restaurant.description || null
    };
    this.restaurants.set(id, newRestaurant);
    return newRestaurant;
  }

  async updateRestaurant(id: number, restaurantData: Partial<InsertRestaurant>): Promise<Restaurant | undefined> {
    const restaurant = this.restaurants.get(id);
    if (!restaurant) return undefined;
    
    const updatedRestaurant = { ...restaurant, ...restaurantData };
    this.restaurants.set(id, updatedRestaurant);
    return updatedRestaurant;
  }

  async deleteRestaurant(id: number): Promise<boolean> {
    return this.restaurants.delete(id);
  }

  // Task operations
  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async getTasksByRestaurant(restaurantId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.restaurantId === restaurantId);
  }

  async getTasksByAssignee(assigneeId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.assignedTo === assigneeId);
  }

  async createTask(task: InsertTask): Promise<Task> {
    const id = this.taskIdCounter++;
    const now = new Date();
    const newTask: Task = { 
      ...task, 
      id, 
      createdAt: now,
      status: task.status || TaskStatus.PENDING,
      description: task.description || null,
      assignedTo: task.assignedTo || null,
      priority: task.priority || "medium",
      dueDate: task.dueDate || null
    };
    this.tasks.set(id, newTask);
    return newTask;
  }

  async updateTask(id: number, taskData: Partial<InsertTask>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    const updatedTask = { ...task, ...taskData };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }

  // Tool operations
  async getTool(id: number): Promise<Tool | undefined> {
    return this.tools.get(id);
  }

  async getToolsByRestaurant(restaurantId: number): Promise<Tool[]> {
    return Array.from(this.tools.values()).filter(tool => tool.restaurantId === restaurantId);
  }

  async createTool(tool: InsertTool): Promise<Tool> {
    const id = this.toolIdCounter++;
    const now = new Date();
    const newTool: Tool = { 
      ...tool, 
      id, 
      createdAt: now,
      description: tool.description || null
    };
    this.tools.set(id, newTool);
    return newTool;
  }

  async updateTool(id: number, toolData: Partial<InsertTool>): Promise<Tool | undefined> {
    const tool = this.tools.get(id);
    if (!tool) return undefined;
    
    const updatedTool = { ...tool, ...toolData };
    this.tools.set(id, updatedTool);
    return updatedTool;
  }

  async deleteTool(id: number): Promise<boolean> {
    return this.tools.delete(id);
  }

  // Log operations
  async createLog(log: InsertLog): Promise<Log> {
    const id = this.logIdCounter++;
    const now = new Date();
    const newLog: Log = { 
      ...log, 
      id, 
      createdAt: now,
      details: log.details || null,
      resourceId: log.resourceId || null,
      resourceType: log.resourceType || null
    };
    this.logs.set(id, newLog);
    return newLog;
  }

  async getLogsByRestaurant(restaurantId: number, limit?: number): Promise<Log[]> {
    const logs = Array.from(this.logs.values())
      .filter(log => log.restaurantId === restaurantId)
      .sort((a, b) => {
        const aTime = a.createdAt?.getTime() || 0;
        const bTime = b.createdAt?.getTime() || 0;
        return bTime - aTime;
      });
    
    return limit ? logs.slice(0, limit) : logs;
  }

  // Feedback operations
  async createFeedback(feedbackData: InsertFeedback): Promise<Feedback> {
    const id = this.feedbackIdCounter++;
    const now = new Date();
    const newFeedback: Feedback = { 
      ...feedbackData, 
      id, 
      createdAt: now,
      rating: feedbackData.rating || null
    };
    this.feedbacks.set(id, newFeedback);
    return newFeedback;
  }

  async getFeedbackByRestaurant(restaurantId: number): Promise<Feedback[]> {
    return Array.from(this.feedbacks.values())
      .filter(feedback => feedback.restaurantId === restaurantId)
      .sort((a, b) => {
        const aTime = a.createdAt?.getTime() || 0;
        const bTime = b.createdAt?.getTime() || 0;
        return bTime - aTime;
      });
  }

  // Resource operations
  async getResource(id: number): Promise<Resource | undefined> {
    return this.resources.get(id);
  }

  async getResourcesByRestaurant(restaurantId: number): Promise<Resource[]> {
    return Array.from(this.resources.values()).filter(resource => resource.restaurantId === restaurantId);
  }

  async createResource(resource: InsertResource): Promise<Resource> {
    const id = this.resourceIdCounter++;
    const now = new Date();
    const newResource: Resource = { 
      ...resource, 
      id, 
      createdAt: now, 
      updatedAt: now,
      description: resource.description || null,
      fileUrl: resource.fileUrl || null,
      fileType: resource.fileType || null,
      fileSize: resource.fileSize || null,
      visibleTo: resource.visibleTo || ["all"]
    };
    this.resources.set(id, newResource);
    return newResource;
  }

  async updateResource(id: number, resourceData: Partial<InsertResource>): Promise<Resource | undefined> {
    const resource = this.resources.get(id);
    if (!resource) return undefined;
    
    const now = new Date();
    const updatedResource = { ...resource, ...resourceData, updatedAt: now };
    this.resources.set(id, updatedResource);
    return updatedResource;
  }

  async deleteResource(id: number): Promise<boolean> {
    return this.resources.delete(id);
  }

  // Invite operations
  async createInvite(invite: InsertInvite): Promise<Invite> {
    const id = this.inviteIdCounter++;
    const now = new Date();
    const newInvite: Invite = { 
      ...invite, 
      id, 
      createdAt: now, 
      used: false,
      email: invite.email || null,
      role: invite.role || UserRole.STAFF,
      expiresAt: invite.expiresAt || null
    };
    this.invites.set(id, newInvite);
    return newInvite;
  }

  async getInviteByToken(token: string): Promise<Invite | undefined> {
    return Array.from(this.invites.values()).find(invite => invite.token === token);
  }

  async getInvitesByRestaurant(restaurantId: number): Promise<Invite[]> {
    return Array.from(this.invites.values())
      .filter(invite => invite.restaurantId === restaurantId)
      .sort((a, b) => {
        const aTime = a.createdAt?.getTime() || 0;
        const bTime = b.createdAt?.getTime() || 0;
        return bTime - aTime;
      });
  }

  async markInviteAsUsed(token: string): Promise<boolean> {
    const invite = await this.getInviteByToken(token);
    if (!invite) return false;
    
    invite.used = true;
    this.invites.set(invite.id, invite);
    return true;
  }

  // Quote interaction operations
  async recordQuoteInteraction(interaction: InsertQuoteInteraction): Promise<QuoteInteraction> {
    const id = this.quoteInteractionIdCounter++;
    const now = new Date();
    
    // First, check if we have an existing interaction with this quote and user
    const existingInteraction = Array.from(this.quoteInteractions.values()).find(
      qi => qi.quoteIndex === interaction.quoteIndex && qi.userId === interaction.userId
    );
    
    if (existingInteraction) {
      // Update the existing interaction
      const updatedInteraction: QuoteInteraction = { 
        ...existingInteraction, 
        interactionCount: existingInteraction.interactionCount + 1,
        lastInteractedAt: now
      };
      this.quoteInteractions.set(existingInteraction.id, updatedInteraction);
      return updatedInteraction;
    } else {
      // Create a new interaction
      const newInteraction: QuoteInteraction = { 
        id, 
        quoteIndex: interaction.quoteIndex,
        quoteText: interaction.quoteText,
        userId: interaction.userId || null,
        restaurantId: interaction.restaurantId || null,
        createdAt: now,
        lastInteractedAt: now,
        interactionCount: 1
      };
      this.quoteInteractions.set(id, newInteraction);
      return newInteraction;
    }
  }

  async getQuoteInteractions(): Promise<QuoteInteraction[]> {
    return Array.from(this.quoteInteractions.values());
  }

  async getQuoteInteractionsByRestaurant(restaurantId: number): Promise<QuoteInteraction[]> {
    return Array.from(this.quoteInteractions.values())
      .filter(interaction => interaction.restaurantId === restaurantId)
      .sort((a, b) => {
        const aTime = a.lastInteractedAt?.getTime() || 0;
        const bTime = b.lastInteractedAt?.getTime() || 0;
        return bTime - aTime;
      });
  }

  async getTopQuoteInteractions(limit: number = 10): Promise<QuoteInteraction[]> {
    return Array.from(this.quoteInteractions.values())
      .sort((a, b) => b.interactionCount - a.interactionCount)
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
