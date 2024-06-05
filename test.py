from pyvis.network import Network
import json

# Load the JSON data
with open('graphData.json') as f:
    data = json.load(f)

# Initialize Pyvis Network
net = Network(notebook=True, height='750px', width='100%', bgcolor='#222222', font_color='white')

# Add nodes with descriptions as titles
for node in data['nodes']:
    net.add_node(node['id'], label=node['description'], title=node['description'])

# Add edges with labels as titles
for link in data['links']:
    net.add_edge(link['source'], link['target'], title=link.get('content', ''))

# Generate and show the network
net.show('knowledge_graph.html')
