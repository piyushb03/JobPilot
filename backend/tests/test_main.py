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

