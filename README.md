# How to Implement rrweb on Our Website?

## Overview

This guide provides instructions for integrating `rrweb` into your website to enable session recording. Follow the steps below to set up `rrweb` and configure the necessary JavaScript for recording and saving session events to your backend server.

## Prerequisites

- Basic knowledge of HTML, JavaScript, and API interactions.
- A backend service configured to handle API requests for saving and deleting session data.

## Integration Steps

### 1. Include `rrweb` Script in HTML

Add the following script tag to your HTML file to include the `rrweb` library:

```html
<script src="https://cdn.jsdelivr.net/npm/rrweb@latest/dist/rrweb-all.min.js"></script>
```
#Place this script tag within the <head> section of your HTML document.

### 2. Get `rrweb_impl.js` Code

To obtain the `rrweb_impl.js` code, follow these steps:

1. **Clone the Repository**: Start by cloning the GitHub repository where `rrweb_impl.js` is located. Use the following command:

   ```bash
   git clone https://github.com/aakash88888/Documentation/blob/main/rrweb_impl.js
   ```
2. **Navigate to the Directory** : 

   Once you have cloned the repository, navigate to the directory containing `rrweb_impl.js`. You can do this using the command line or by browsing through the repository structure. For example:

   ```bash
   cd YourRepositoryName/path/to/directory
   ```
Alternatively, you can view or download the file directly from the GitHub web interface:

1. **Obtain the File:**

   You can view or download the file directly from the GitHub web interface:

   - Navigate to the file in the GitHub repository.
   - Click on the file to view it.
   - Click the "Raw" button to download it to your local machine.

2. **Include `rrweb_impl.js` in Your Project:**

   Ensure that the `rrweb_impl.js` file is placed in your project’s directory where your HTML file can access it. You may need to update your HTML file to include this script. For example:

   ```html
   <script src="path/to/rrweb_impl.js"></script>
   ```

   Replace path/to/rrweb_impl.js with the relative path to where you placed the file in your project directory.
### 3. Backend Setup

  To set up the backend for handling rrweb data, download and configure the backend code from the following repository:
    
  [Backend Repository link](https://github.com/aakash88888/CloudExpress_Backend)

### 4. Testing

#### Deploy the HTML File

Ensure your HTML file with the `rrweb` script is hosted on your server.

#### Verify JavaScript Integration

Check that `rrweb_impl.js` is correctly linked and loaded by examining network requests in your browser's developer tools.

#### Backend Integration

Test the integration by interacting with your website and verifying that session events are recorded and sent to the backend.

### 5. Troubleshooting

#### Events Not Being Sent

- Ensure the backend server is running and accessible at the specified `serverURL`.
- Check for network errors or issues with API endpoints.

#### Errors in Console

- Check error messages in the browser console for issues.
- Common problems include incorrect API URLs or server errors.


### JavaScript Functions in `rrweb_impl.js`

The `rrweb_impl.js` file includes several key functions and configurations for handling session recording and interacting with the backend. Here’s a breakdown of each function and its purpose:


#### 1. `window.cronyWidget(customConfig)`

**Purpose**: Initializes and configures `rrweb` to record user interactions and periodically send recorded events to the backend.

**Parameters**:
- `customConfig`: An object that may contain configuration details such as `token` and `apiServer`. 

**Functionality**:
- **Sets up `rrweb`**: Configures `rrweb` to start recording user interactions on the page.
- **Stores recorded events**: Events are accumulated in the `events` array.
- **Periodically sends recorded events**: Every 10 seconds, the `saveEvents()` function is called to send the recorded events to the backend.
- **Logs events and errors**: Outputs recorded events and any errors encountered during the process to the console for debugging.

#### 2. `deleteFolder()`

**Purpose**: Sends a request to delete a folder on the backend server.

**Functionality**:
- Makes a `DELETE` request to `${serverURL}/api/delete-folder`.
- If the request is successful, updates the UI by calling `fetchFolderList()` (assumed to be another function in your code).
- Logs any errors encountered during the request to the console.

#### 3. `window.onload`

**Purpose**: Executes the `deleteFolder()` function when the window loads.





