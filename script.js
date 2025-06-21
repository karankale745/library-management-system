// Data storage
let books = JSON.parse(localStorage.getItem('libraryBooks')) || [
    { id: 1, title: 'JavaScript: The Good Parts', author: 'Douglas Crockford', isbn: '978-0596517748', quantity: 5, available: 5 },
    { id: 2, title: 'Eloquent JavaScript', author: 'Marijn Haverbeke', isbn: '978-1593279509', quantity: 3, available: 3 },
    { id: 3, title: 'You Don\'t Know JS', author: 'Kyle Simpson', isbn: '978-1491904240', quantity: 4, available: 4 }
];

let students = JSON.parse(localStorage.getItem('libraryStudents')) || [
    { id: 'S1001', name: 'John Doe', email: 'john@example.com', password: 'student123', borrowedBooks: [] },
    { id: 'S1002', name: 'Jane Smith', email: 'jane@example.com', password: 'student123', borrowedBooks: [] }
];

let transactions = JSON.parse(localStorage.getItem('libraryTransactions')) || [];

// Current user
let currentUser = null;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the login page
    if (document.getElementById('adminLoginForm')) {
        // Login page event listeners
        document.getElementById('adminLoginForm').addEventListener('submit', adminLogin);
        document.getElementById('studentLoginForm').addEventListener('submit', studentLogin);
        document.getElementById('registerForm').addEventListener('submit', registerStudent);
    }

    // Check if we're on the admin page
    if (document.getElementById('logoutBtn')) {
        document.getElementById('logoutBtn').addEventListener('click', logout);
        loadAdminData();
    }

    // Check if we're on the student page
    if (document.getElementById('studentLogoutBtn')) {
        document.getElementById('studentLogoutBtn').addEventListener('click', logout);
        loadStudentData();
    }
});

// Tab functions
function openTab(tabName) {
    const tabs = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('active');
    }
    
    const tabButtons = document.getElementsByClassName('tab-btn');
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove('active');
    }
    
    document.getElementById(tabName).classList.add('active');
    event.currentTarget.classList.add('active');
}

function openAdminTab(tabName) {
    const tabs = document.getElementsByClassName('admin-tab-content');
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('active');
    }
    
    const tabButtons = document.getElementsByClassName('admin-tab-btn');
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove('active');
    }
    
    document.getElementById(tabName).classList.add('active');
    event.currentTarget.classList.add('active');
    
    // Refresh data when switching tabs
    if (tabName === 'books') {
        displayBooks();
    } else if (tabName === 'students') {
        displayStudents();
    } else if (tabName === 'transactions') {
        displayTransactions();
    }
}

function openStudentTab(tabName) {
    const tabs = document.getElementsByClassName('student-tab-content');
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('active');
    }
    
    const tabButtons = document.getElementsByClassName('student-tab-btn');
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove('active');
    }
    
    document.getElementById(tabName).classList.add('active');
    event.currentTarget.classList.add('active');
    
    // Refresh data when switching tabs
    if (tabName === 'available') {
        displayAvailableBooks();
    } else if (tabName === 'borrowed') {
        displayBorrowedBooks();
    }
}

// Login functions
function adminLogin(e) {
    e.preventDefault();
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    if (username === 'admin' && password === 'admin123') {
        currentUser = { role: 'admin' };
        window.location.href = 'admin.html';
    } else {
        alert('Invalid admin credentials');
    }
}

function studentLogin(e) {
    e.preventDefault();
    const studentId = document.getElementById('studentId').value;
    const password = document.getElementById('studentPassword').value;
    
    const student = students.find(s => s.id === studentId && s.password === password);
    
    if (student) {
        currentUser = { 
            role: 'student',
            id: student.id,
            name: student.name
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        window.location.href = 'student.html';
    } else {
        alert('Invalid student ID or password');
    }
}

function registerStudent(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const id = document.getElementById('regId').value;
    const password = document.getElementById('regPassword').value;
    
    // Check if student ID already exists
    if (students.some(s => s.id === id)) {
        alert('Student ID already exists');
        return;
    }
    
    // Add new student
    const newStudent = {
        id,
        name,
        email,
        password,
        borrowedBooks: []
    };
    
    students.push(newStudent);
    localStorage.setItem('libraryStudents', JSON.stringify(students));
    
    alert('Registration successful! Please login with your credentials.');
    document.getElementById('registerForm').reset();
    openTab('student');
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Admin functions
function loadAdminData() {
    displayBooks();
    displayStudents();
    displayTransactions();
    
    // Add book form submission
    document.getElementById('addBookForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addBook();
    });
}

function displayBooks() {
    const booksList = document.getElementById('booksList');
    booksList.innerHTML = '';
    
    books.forEach(book => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td>${book.available}</td>
            <td>${book.quantity}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editBook(${book.id})">Edit</button>
                <button class="action-btn delete-btn" onclick="deleteBook(${book.id})">Delete</button>
            </td>
        `;
        
        booksList.appendChild(row);
    });
}

function addBook() {
    const title = document.getElementById('bookTitle').value;
    const author = document.getElementById('bookAuthor').value;
    const isbn = document.getElementById('bookIsbn').value;
    const quantity = parseInt(document.getElementById('bookQuantity').value);
    
    // Generate new ID
    const newId = books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1;
    
    const newBook = {
        id: newId,
        title,
        author,
        isbn,
        quantity,
        available: quantity
    };
    
    books.push(newBook);
    localStorage.setItem('libraryBooks', JSON.stringify(books));
    
    document.getElementById('addBookForm').reset();
    displayBooks();
}

function editBook(id) {
    const book = books.find(b => b.id === id);
    if (!book) return;
    
    const newTitle = prompt('Enter new title:', book.title);
    if (newTitle === null) return;
    
    const newAuthor = prompt('Enter new author:', book.author);
    if (newAuthor === null) return;
    
    const newIsbn = prompt('Enter new ISBN:', book.isbn);
    if (newIsbn === null) return;
    
    const newQuantity = prompt('Enter new quantity:', book.quantity);
    if (newQuantity === null) return;
    
    // Calculate new available count
    const borrowedCount = book.quantity - book.available;
    const newAvailable = Math.max(0, parseInt(newQuantity) - borrowedCount);
    
    book.title = newTitle;
    book.author = newAuthor;
    book.isbn = newIsbn;
    book.quantity = parseInt(newQuantity);
    book.available = newAvailable;
    
    localStorage.setItem('libraryBooks', JSON.stringify(books));
    displayBooks();
}

function deleteBook(id) {
    if (confirm('Are you sure you want to delete this book?')) {
        books = books.filter(b => b.id !== id);
        localStorage.setItem('libraryBooks', JSON.stringify(books));
        displayBooks();
    }
}

function displayStudents() {
    const studentsList = document.getElementById('studentsList');
    studentsList.innerHTML = '';
    
    students.forEach(student => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.borrowedBooks.length}</td>
            <td>
                <button class="action-btn delete-btn" onclick="deleteStudent('${student.id}')">Delete</button>
            </td>
        `;
        
        studentsList.appendChild(row);
    });
}

function deleteStudent(id) {
    if (confirm('Are you sure you want to delete this student?')) {
        // Return all books borrowed by this student
        const student = students.find(s => s.id === id);
        if (student) {
            student.borrowedBooks.forEach(bookId => {
                const book = books.find(b => b.id === bookId);
                if (book) {
                    book.available += 1;
                }
            });
        }
        
        students = students.filter(s => s.id !== id);
        localStorage.setItem('libraryStudents', JSON.stringify(students));
        localStorage.setItem('libraryBooks', JSON.stringify(books));
        displayStudents();
        displayBooks();
    }
}

function displayTransactions() {
    const transactionsList = document.getElementById('transactionsList');
    transactionsList.innerHTML = '';
    
    transactions.forEach(trans => {
        const book = books.find(b => b.id === trans.bookId);
        const student = students.find(s => s.id === trans.studentId);
        
        if (book && student) {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${trans.id}</td>
                <td>${book.title}</td>
                <td>${student.name}</td>
                <td>${new Date(trans.borrowDate).toLocaleDateString()}</td>
                <td>${trans.returnDate ? new Date(trans.returnDate).toLocaleDateString() : 'Not returned'}</td>
                <td>${trans.returnDate ? 'Returned' : 'Borrowed'}</td>
            `;
            
            transactionsList.appendChild(row);
        }
    });
}

// Student functions
function loadStudentData() {
    // Get current user from localStorage if page is refreshed
    if (!currentUser) {
        currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }
    
    if (currentUser && currentUser.name) {
        document.getElementById('studentNameDisplay').textContent = Welcome, $currentUser.name}
;
    }
    
    displayAvailableBooks();
    displayBorrowedBooks();


function displayAvailableBooks() {
    const availableBooksList = document.getElementById('availableBooksList');
    availableBooksList.innerHTML = '';
    
    books.filter(book => book.available > 0).forEach(book => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.available}</td>
            <td>
                <button class="action-btn borrow-btn" onclick="borrowBook(${book.id})">Borrow</button>
            </td>
        `;
        
        availableBooksList.appendChild(row);
    });
}

function displayBorrowedBooks() {
    const borrowedBooksList = document.getElementById('borrowedBooksList');
    borrowedBooksList.innerHTML = '';
    
    if (!currentUser) return;
    
    const student = students.find(s => s.id === currentUser.id);
    if (!student) return;
    
    student.borrowedBooks.forEach(bookId => {
        const book = books.find(b => b.id === bookId);
        if (book) {
            const transaction = transactions.find(t => 
                t.bookId === bookId && 
                t.studentId === currentUser.id && 
                !t.returnDate
            );
            
            if (transaction) {
                const row = document.createElement('tr');
                const borrowDate = new Date(transaction.borrowDate);
                const dueDate = new Date(borrowDate);
                dueDate.setDate(borrowDate.getDate() + 14); // 2 weeks due date
                
                row.innerHTML = `
                    <td>${book.id}</td>
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>${borrowDate.toLocaleDateString()}</td>
                    <td>${dueDate.toLocaleDateString()}</td>
                    <td>
                        <button class="action-btn return-btn" onclick="returnBook(${book.id})">Return</button>
                    </td>
                `;
                
                borrowedBooksList.appendChild(row);
            }
        }
    });
}

function searchBooks() {
    const searchTerm = document.getElementById('bookSearch').value.toLowerCase();
    const availableBooksList = document.getElementById('availableBooksList');
    availableBooksList.innerHTML = '';
    
    books.filter(book => 
        book.available > 0 && 
        (book.title.toLowerCase().includes(searchTerm) || 
         book.author.toLowerCase().includes(searchTerm))
    ).forEach(book => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.available}</td>
            <td>
                <button class="action-btn borrow-btn" onclick="borrowBook(${book.id})">Borrow</button>
            </td>
        `;
        
        availableBooksList.appendChild(row);
    });
}

function borrowBook(bookId) {
    if (!currentUser) return;
    
    const book = books.find(b => b.id === bookId);
    const student = students.find(s => s.id === currentUser.id);
    
    if (book && student) {
        if (book.available > 0) {
            // Update book availability
            book.available -= 1;
            
            // Add to student's borrowed books
            student.borrowedBooks.push(bookId);
            
            // Create transaction
            const newTransId = transactions.length > 0 ? Math.max(...transactions.map(t => t.id)) + 1 : 1;
            const newTransaction = {
                id: newTransId,
                bookId,
                studentId: currentUser.id,
                borrowDate: new Date().toISOString(),
                returnDate: null
            };
            transactions.push(newTransaction);
            
            // Save to localStorage
            localStorage.setItem('libraryBooks', JSON.stringify(books));
            localStorage.setItem('libraryStudents', JSON.stringify(students));
            localStorage.setItem('libraryTransactions', JSON.stringify(transactions));
            
            // Refresh displays
            displayAvailableBooks();
            displayBorrowedBooks();
            
            alert('Book borrowed successfully!');
        } else {
            alert('No copies available');
        }
    }
}

function returnBook(bookId) {
    if (!currentUser) return;
    
    const book = books.find(b => b.id === bookId);
    const student = students.find(s => s.id === currentUser.id);
    
    if (book && student) {
        // Update book availability
        book.available += 1;
        
        // Remove from student's borrowed books
        student.borrowedBooks = student.borrowedBooks.filter(id => id !== bookId);
        
        // Update transaction
        const transaction = transactions.find(t => 
            t.bookId === bookId && 
            t.studentId === currentUser.id && 
            !t.returnDate
        );
        
        if (transaction) {
            transaction.returnDate = new Date().toISOString();
        }
        
        // Save to localStorage
        localStorage.setItem('libraryBooks', JSON.stringify(books));
        localStorage.setItem('libraryStudents', JSON.stringify(students));
        localStorage.setItem('libraryTransactions', JSON.stringify(transactions));
        
        // Refresh displays
        displayAvailableBooks();
        displayBorrowedBooks();
        
        alert('Book returned successfully!');
    }
}