from google.cloud import firestore

db = firestore.Client()

def save_memory(user_id, data):
    doc = db.collection("memories").document(user_id)
    doc.set(data)

def get_memory(user_id):
    doc = db.collection("memories").document(user_id).get()
    return doc.to_dict()
    
def load_memory(user_id):
    doc = db.collection("memories").document(user_id).get()
    return doc.to_dict()