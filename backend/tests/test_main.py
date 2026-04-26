def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_register_login(client):
    # Test register
    register_response = client.post("/api/auth/register", json={
        "email": "newuser@example.com",
        "password": "newpassword123",
        "name": "New User"
    })
    assert register_response.status_code == 200
    assert "id" in register_response.json()
    
    # Test login
    login_response = client.post("/api/auth/login", data={
        "username": "newuser@example.com",
        "password": "newpassword123"
    })
    assert login_response.status_code == 200
    assert "access_token" in login_response.json()

def test_job_crud(client, user_token_headers):
    # Create job
    job_data = {
        "company": "Test Company",
        "role": "Software Engineer",
        "description": "Test description",
    }
    response = client.post("/api/jobs", json=job_data, headers=user_token_headers)
    assert response.status_code == 201
    job_id = response.json()["id"]
    
    # Read jobs
    response = client.get("/api/jobs", headers=user_token_headers)
    assert response.status_code == 200
    assert len(response.json()) > 0
    
    # Update job
    job_data["company"] = "Updated Company"
    response = client.put(f"/api/jobs/{job_id}", json=job_data, headers=user_token_headers)
    assert response.status_code == 200
    assert response.json()["company"] == "Updated Company"

def test_application_flow(client, user_token_headers):
    # Create job first
    job_data = {
        "company": "Google",
        "role": "Backend Developer",
    }
    r = client.post("/api/jobs", json=job_data, headers=user_token_headers)
    job_id = r.json()["id"]
    
    # Create application
    app_data = {
        "job_id": job_id,
        "notes": "Found on LinkedIn"
    }
    response = client.post("/api/applications", json=app_data, headers=user_token_headers)
    assert response.status_code == 201
    app_id = response.json()["id"]
    
    # Get history
    history_resp = client.get(f"/api/applications/{app_id}/history", headers=user_token_headers)
    assert history_resp.status_code == 200
    assert len(history_resp.json()) == 1
    
    # Update status
    status_update = {
        "status": "Interview",
        "note": "Got an interview!"
    }
    r2 = client.post(f"/api/applications/{app_id}/status", json=status_update, headers=user_token_headers)
    assert r2.status_code == 200
    
    history_resp = client.get(f"/api/applications/{app_id}/history", headers=user_token_headers)
    assert len(history_resp.json()) == 2
    
def test_ai_mock_generation(client, user_token_headers):
    # Ensure a job and app exists
    job_data = {"company": "Test Co", "role": "Dev"}
    r = client.post("/api/jobs", json=job_data, headers=user_token_headers)
    job_id = r.json()["id"]
    r2 = client.post("/api/applications", json={"job_id": job_id}, headers=user_token_headers)
    app_id = r2.json()["id"]
    
    # Test generation (will use mock in test env)
    r_ai = client.post(f"/api/applications/{app_id}/ai/generate-cover-letter", headers=user_token_headers)
    assert r_ai.status_code == 200
    draft = r_ai.json()
    assert draft["type"] == "cover_letter"
    assert "Test Co" in draft["contents"]
