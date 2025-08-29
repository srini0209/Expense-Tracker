'use client'
import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, DollarSign, ShoppingCart, Car, Home, Coffee, Heart, Gamepad2, Plane, Briefcase, TrendingUp, TrendingDown, Gift } from 'lucide-react';

const Categories = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('expense'); // 'income' or 'expense'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ 
    name: '', 
    color: '#3B82F6', 
    icon: 'DollarSign', 
    type: 'expense' 
  });

  // Sample categories data with type classification
  const [categories, setCategories] = useState([
    // Expense Categories
    { id: 1, name: 'Food & Dining', color: '#EF4444', icon: 'Coffee', type: 'expense', expenses: 45, totalAmount: 1250.50 },
    { id: 2, name: 'Transportation', color: '#10B981', icon: 'Car', type: 'expense', expenses: 23, totalAmount: 850.75 },
    { id: 3, name: 'Shopping', color: '#F59E0B', icon: 'ShoppingCart', type: 'expense', expenses: 31, totalAmount: 2100.25 },
    { id: 4, name: 'Housing', color: '#8B5CF6', icon: 'Home', type: 'expense', expenses: 12, totalAmount: 3200.00 },
    { id: 5, name: 'Entertainment', color: '#EC4899', icon: 'Gamepad2', type: 'expense', expenses: 18, totalAmount: 650.30 },
    { id: 6, name: 'Healthcare', color: '#06B6D4', icon: 'Heart', type: 'expense', expenses: 8, totalAmount: 420.15 },
    { id: 7, name: 'Travel', color: '#84CC16', icon: 'Plane', type: 'expense', expenses: 5, totalAmount: 1800.00 },
    
    // Income Categories
    { id: 8, name: 'Salary', color: '#059669', icon: 'Briefcase', type: 'income', expenses: 12, totalAmount: 15000.00 },
    { id: 9, name: 'Freelancing', color: '#7C3AED', icon: 'DollarSign', type: 'income', expenses: 8, totalAmount: 3500.00 },
    { id: 10, name: 'Investments', color: '#DC2626', icon: 'TrendingUp', type: 'income', expenses: 4, totalAmount: 1200.00 },
    { id: 11, name: 'Side Business', color: '#EA580C', icon: 'ShoppingCart', type: 'income', expenses: 6, totalAmount: 2800.00 },
    { id: 12, name: 'Gifts & Bonuses', color: '#BE185D', icon: 'Gift', type: 'income', expenses: 3, totalAmount: 800.00 }
  ]);

  const iconMap = {
    DollarSign, ShoppingCart, Car, Home, Coffee, Heart, Gamepad2, Plane, Briefcase, TrendingUp, TrendingDown, Gift
  };

  const iconOptions = ['DollarSign', 'ShoppingCart', 'Car', 'Home', 'Coffee', 'Heart', 'Gamepad2', 'Plane', 'Briefcase', 'TrendingUp', 'Gift'];
  const colorOptions = ['#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16', '#3B82F6', '#059669', '#7C3AED', '#DC2626', '#EA580C'];

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    category.type === activeTab
  );

  const incomeCategories = categories.filter(cat => cat.type === 'income');
  const expenseCategories = categories.filter(cat => cat.type === 'expense');

  const totalIncome = incomeCategories.reduce((sum, cat) => sum + cat.totalAmount, 0);
  const totalExpenses = expenseCategories.reduce((sum, cat) => sum + cat.totalAmount, 0);

  const handleAddCategory = () => {
    if (newCategory.name.trim()) {
      const category = {
        id: categories.length + 1,
        name: newCategory.name,
        color: newCategory.color,
        icon: newCategory.icon,
        type: newCategory.type,
        expenses: 0,
        totalAmount: 0
      };
      setCategories([...categories, category]);
      setNewCategory({ name: '', color: '#3B82F6', icon: 'DollarSign', type: 'expense' });
      setIsAddModalOpen(false);
    }
  };

  const handleEditCategory = () => {
    if (selectedCategory && newCategory.name.trim()) {
      setCategories(categories.map(cat =>
        cat.id === selectedCategory.id
          ? { ...cat, name: newCategory.name, color: newCategory.color, icon: newCategory.icon, type: newCategory.type }
          : cat
      ));
      setIsEditModalOpen(false);
      setSelectedCategory(null);
      setNewCategory({ name: '', color: '#3B82F6', icon: 'DollarSign', type: 'expense' });
    }
  };

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);
    setNewCategory({
      name: category.name,
      color: category.color,
      icon: category.icon,
      type: category.type
    });
    setIsEditModalOpen(true);
  };

  const CategoryIcon = ({ iconName, className, style }) => {
    const Icon = iconMap[iconName] || DollarSign;
    return <Icon className={className} style={style} />;
  };

  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Categories</h1>
              <p className="text-gray-600">Organize your income and expenses by category</p>
            </div>
            <button
              onClick={() => {
                setNewCategory({ ...newCategory, type: activeTab });
                setIsAddModalOpen(true);
              }}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add {activeTab === 'income' ? 'Income' : 'Expense'} Category
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Income</p>
                <p className="text-2xl font-bold text-green-600">${totalIncome.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">${totalExpenses.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${totalIncome - totalExpenses >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                <DollarSign className={`w-6 h-6 ${totalIncome - totalExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Net Balance</p>
                <p className={`text-2xl font-bold ${totalIncome - totalExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${Math.abs(totalIncome - totalExpenses).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Categories</p>
                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex bg-white rounded-lg p-1 shadow-md border border-gray-200">
              <button
                onClick={() => setActiveTab('expense')}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeTab === 'expense'
                    ? 'bg-red-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-red-500 hover:bg-red-50'
                }`}
              >
                <TrendingDown className="w-4 h-4" />
                Expenses ({expenseCategories.length})
              </button>
              <button
                onClick={() => setActiveTab('income')}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeTab === 'income'
                    ? 'bg-green-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-green-500 hover:bg-green-50'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Income ({incomeCategories.length})
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={`Search ${activeTab} categories...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-72 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className={`bg-white rounded-xl p-6 shadow-lg border-l-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                category.type === 'income' ? 'border-l-green-500 bg-gradient-to-br from-green-50 to-white' : 'border-l-red-500 bg-gradient-to-br from-red-50 to-white'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <CategoryIcon 
                    iconName={category.icon} 
                    className="w-6 h-6"
                    style={{ color: category.color }}
                  />
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEditModal(category)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-semibold text-gray-900">{category.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  category.type === 'income' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {category.type === 'income' ? '+' : '-'}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Transactions:</span>
                  <span className="font-medium text-gray-900">{category.expenses}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Amount:</span>
                  <span className={`font-medium ${category.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {category.type === 'income' ? '+' : '-'}${category.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ 
                      backgroundColor: category.color,
                      width: `${Math.min((category.totalAmount / (category.type === 'income' ? 20000 : 3500)) * 100, 100)}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No {activeTab} categories found</h3>
            <p className="text-gray-600">Try adjusting your search or create a new {activeTab} category.</p>
          </div>
        )}
      </div>

      {/* Add Category Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={`Add New ${newCategory.type === 'income' ? 'Income' : 'Expense'} Category`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category Type</label>
            <div className="flex gap-2">
              <button
                onClick={() => setNewCategory({ ...newCategory, type: 'expense' })}
                className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                  newCategory.type === 'expense'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <TrendingDown className="w-4 h-4" />
                Expense
              </button>
              <button
                onClick={() => setNewCategory({ ...newCategory, type: 'income' })}
                className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                  newCategory.type === 'income'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Income
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter category name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
            <div className="grid grid-cols-4 gap-2">
              {iconOptions.map((iconName) => {
                const Icon = iconMap[iconName];
                return (
                  <button
                    key={iconName}
                    onClick={() => setNewCategory({ ...newCategory, icon: iconName })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      newCategory.icon === iconName
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5 mx-auto" />
                  </button>
                );
              })}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
            <div className="grid grid-cols-6 gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  onClick={() => setNewCategory({ ...newCategory, color })}
                  className={`w-10 h-10 rounded-lg border-4 transition-all ${
                    newCategory.color === color ? 'border-gray-400 scale-110' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddCategory}
              className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${
                newCategory.type === 'income' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              Add Category
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Category"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category Type</label>
            <div className="flex gap-2">
              <button
                onClick={() => setNewCategory({ ...newCategory, type: 'expense' })}
                className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                  newCategory.type === 'expense'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <TrendingDown className="w-4 h-4" />
                Expense
              </button>
              <button
                onClick={() => setNewCategory({ ...newCategory, type: 'income' })}
                className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                  newCategory.type === 'income'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Income
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter category name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
            <div className="grid grid-cols-4 gap-2">
              {iconOptions.map((iconName) => {
                const Icon = iconMap[iconName];
                return (
                  <button
                    key={iconName}
                    onClick={() => setNewCategory({ ...newCategory, icon: iconName })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      newCategory.icon === iconName
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5 mx-auto" />
                  </button>
                );
              })}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
            <div className="grid grid-cols-6 gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  onClick={() => setNewCategory({ ...newCategory, color })}
                  className={`w-10 h-10 rounded-lg border-4 transition-all ${
                    newCategory.color === color ? 'border-gray-400 scale-110' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleEditCategory}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Categories;