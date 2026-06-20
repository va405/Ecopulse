"""
Comprehensive Unit Tests for Database Module

Tests all database models, CRUD operations, and edge cases.
Ensures data integrity and proper error handling.
"""

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timedelta
from database import Base, User, ImpactRecord, Challenge, get_db

# Test database setup
TEST_DATABASE_URL = "sqlite:///./test_ecopulse.db"


@pytest.fixture(scope="function")
def test_engine():
    """Create test database engine"""
    engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)
    yield engine
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def test_session(test_engine):
    """Create test database session"""
    TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)
    session = TestSessionLocal()
    yield session
    session.close()


# ============================================================================
# USER MODEL TESTS
# ============================================================================

class TestUserModel:
    """Test User database model"""
    
    def test_create_user_with_all_fields(self, test_session):
        """Should create user with all required fields"""
        user = User(
            email="test@example.com",
            name="Test User"
        )
        test_session.add(user)
        test_session.commit()
        
        assert user.id is not None
        assert user.email == "test@example.com"
        assert user.name == "Test User"
        assert user.created_at is not None
        assert isinstance(user.created_at, datetime)
    
    def test_create_user_minimal_fields(self, test_session):
        """Should create user with only email"""
        user = User(email="minimal@example.com")
        test_session.add(user)
        test_session.commit()
        
        assert user.id is not None
        assert user.email == "minimal@example.com"
        assert user.created_at is not None
    
    def test_user_email_uniqueness(self, test_session):
        """Should enforce unique email constraint"""
        user1 = User(email="duplicate@example.com", name="User 1")
        test_session.add(user1)
        test_session.commit()
        
        user2 = User(email="duplicate@example.com", name="User 2")
        test_session.add(user2)
        
        with pytest.raises(Exception):  # IntegrityError
            test_session.commit()
    
    def test_user_created_at_auto_generated(self, test_session):
        """Should automatically set created_at timestamp"""
        before = datetime.utcnow()
        user = User(email="timestamp@example.com", name="Test")
        test_session.add(user)
        test_session.commit()
        after = datetime.utcnow()
        
        assert before <= user.created_at <= after
    
    def test_query_user_by_email(self, test_session):
        """Should retrieve user by email"""
        user = User(email="query@example.com", name="Query User")
        test_session.add(user)
        test_session.commit()
        
        found = test_session.query(User).filter(User.email == "query@example.com").first()
        assert found is not None
        assert found.name == "Query User"
    
    def test_query_user_by_id(self, test_session):
        """Should retrieve user by ID"""
        user = User(email="id@example.com", name="ID User")
        test_session.add(user)
        test_session.commit()
        user_id = user.id
        
        found = test_session.query(User).filter(User.id == user_id).first()
        assert found is not None
        assert found.email == "id@example.com"
    
    def test_update_user_name(self, test_session):
        """Should update user name"""
        user = User(email="update@example.com", name="Old Name")
        test_session.add(user)
        test_session.commit()
        
        user.name = "New Name"
        test_session.commit()
        
        updated = test_session.query(User).filter(User.id == user.id).first()
        assert updated.name == "New Name"
    
    def test_delete_user(self, test_session):
        """Should delete user"""
        user = User(email="delete@example.com", name="Delete Me")
        test_session.add(user)
        test_session.commit()
        user_id = user.id
        
        test_session.delete(user)
        test_session.commit()
        
        deleted = test_session.query(User).filter(User.id == user_id).first()
        assert deleted is None
    
    def test_query_all_users(self, test_session):
        """Should retrieve all users"""
        users = [
            User(email=f"user{i}@example.com", name=f"User {i}")
            for i in range(5)
        ]
        test_session.add_all(users)
        test_session.commit()
        
        all_users = test_session.query(User).all()
        assert len(all_users) == 5
    
    def test_user_with_special_characters_in_name(self, test_session):
        """Should handle special characters in name"""
        user = User(email="special@example.com", name="Test-User_123 (Admin)")
        test_session.add(user)
        test_session.commit()
        
        assert user.name == "Test-User_123 (Admin)"


# ============================================================================
# IMPACT RECORD MODEL TESTS
# ============================================================================

class TestImpactRecordModel:
    """Test ImpactRecord database model"""
    
    def test_create_impact_record(self, test_session):
        """Should create impact record with all fields"""
        record = ImpactRecord(
            user_id=1,
            carbon=250.5,
            water=1500.0,
            score=75.5
        )
        test_session.add(record)
        test_session.commit()
        
        assert record.id is not None
        assert record.user_id == 1
        assert record.carbon == 250.5
        assert record.water == 1500.0
        assert record.score == 75.5
        assert record.created_at is not None
    
    def test_impact_record_with_zero_values(self, test_session):
        """Should accept zero values for emissions"""
        record = ImpactRecord(user_id=1, carbon=0.0, water=0.0, score=100.0)
        test_session.add(record)
        test_session.commit()
        
        assert record.carbon == 0.0
        assert record.water == 0.0
        assert record.score == 100.0
    
    def test_impact_record_with_negative_values(self, test_session):
        """Should allow negative values (carbon offsets)"""
        record = ImpactRecord(user_id=1, carbon=-50.0, water=1000.0, score=85.0)
        test_session.add(record)
        test_session.commit()
        
        assert record.carbon == -50.0
    
    def test_impact_record_with_large_values(self, test_session):
        """Should handle very large emission values"""
        record = ImpactRecord(
            user_id=1,
            carbon=999999.99,
            water=9999999.99,
            score=0.0
        )
        test_session.add(record)
        test_session.commit()
        
        assert record.carbon == 999999.99
        assert record.water == 9999999.99
    
    def test_query_impact_records_by_user(self, test_session):
        """Should retrieve all records for a user"""
        records = [
            ImpactRecord(user_id=1, carbon=100, water=1000, score=80),
            ImpactRecord(user_id=1, carbon=150, water=1200, score=75),
            ImpactRecord(user_id=2, carbon=200, water=1500, score=70),
        ]
        test_session.add_all(records)
        test_session.commit()
        
        user_records = test_session.query(ImpactRecord).filter(ImpactRecord.user_id == 1).all()
        assert len(user_records) == 2
    
    def test_query_impact_records_by_date_range(self, test_session):
        """Should filter records by date range"""
        # Create records with different timestamps
        old_record = ImpactRecord(user_id=1, carbon=100, water=1000, score=80)
        old_record.created_at = datetime.utcnow() - timedelta(days=30)
        
        recent_record = ImpactRecord(user_id=1, carbon=150, water=1200, score=75)
        recent_record.created_at = datetime.utcnow() - timedelta(days=5)
        
        test_session.add_all([old_record, recent_record])
        test_session.commit()
        
        cutoff = datetime.utcnow() - timedelta(days=10)
        recent_records = test_session.query(ImpactRecord).filter(
            ImpactRecord.created_at >= cutoff
        ).all()
        
        assert len(recent_records) == 1
        assert recent_records[0].carbon == 150
    
    def test_calculate_average_carbon_for_user(self, test_session):
        """Should calculate average carbon emissions"""
        records = [
            ImpactRecord(user_id=1, carbon=100, water=1000, score=80),
            ImpactRecord(user_id=1, carbon=200, water=1200, score=75),
            ImpactRecord(user_id=1, carbon=300, water=1500, score=70),
        ]
        test_session.add_all(records)
        test_session.commit()
        
        from sqlalchemy import func
        avg_carbon = test_session.query(func.avg(ImpactRecord.carbon)).filter(
            ImpactRecord.user_id == 1
        ).scalar()
        
        assert avg_carbon == 200.0
    
    def test_delete_impact_record(self, test_session):
        """Should delete impact record"""
        record = ImpactRecord(user_id=1, carbon=100, water=1000, score=80)
        test_session.add(record)
        test_session.commit()
        record_id = record.id
        
        test_session.delete(record)
        test_session.commit()
        
        deleted = test_session.query(ImpactRecord).filter(ImpactRecord.id == record_id).first()
        assert deleted is None
    
    def test_update_impact_record_score(self, test_session):
        """Should update record score"""
        record = ImpactRecord(user_id=1, carbon=100, water=1000, score=75)
        test_session.add(record)
        test_session.commit()
        
        record.score = 85.0
        test_session.commit()
        
        updated = test_session.query(ImpactRecord).filter(ImpactRecord.id == record.id).first()
        assert updated.score == 85.0


# ============================================================================
# CHALLENGE MODEL TESTS
# ============================================================================

class TestChallengeModel:
    """Test Challenge database model"""
    
    def test_create_challenge(self, test_session):
        """Should create challenge with all fields"""
        challenge = Challenge(
            user_id=1,
            challenge_id=101,
            progress=50,
            completed=False
        )
        test_session.add(challenge)
        test_session.commit()
        
        assert challenge.id is not None
        assert challenge.user_id == 1
        assert challenge.challenge_id == 101
        assert challenge.progress == 50
        assert challenge.completed is False
        assert challenge.started_at is not None
        assert challenge.completed_at is None
    
    def test_create_challenge_with_defaults(self, test_session):
        """Should use default values for progress and completed"""
        challenge = Challenge(user_id=1, challenge_id=101)
        test_session.add(challenge)
        test_session.commit()
        
        assert challenge.progress == 0
        assert challenge.completed is False
    
    def test_complete_challenge(self, test_session):
        """Should mark challenge as completed"""
        challenge = Challenge(user_id=1, challenge_id=101, progress=100)
        test_session.add(challenge)
        test_session.commit()
        
        challenge.completed = True
        challenge.completed_at = datetime.utcnow()
        test_session.commit()
        
        assert challenge.completed is True
        assert challenge.completed_at is not None
    
    def test_update_challenge_progress(self, test_session):
        """Should update challenge progress"""
        challenge = Challenge(user_id=1, challenge_id=101, progress=0)
        test_session.add(challenge)
        test_session.commit()
        
        challenge.progress = 75
        test_session.commit()
        
        updated = test_session.query(Challenge).filter(Challenge.id == challenge.id).first()
        assert updated.progress == 75
    
    def test_query_active_challenges_for_user(self, test_session):
        """Should retrieve only active (incomplete) challenges"""
        challenges = [
            Challenge(user_id=1, challenge_id=101, completed=False),
            Challenge(user_id=1, challenge_id=102, completed=True),
            Challenge(user_id=1, challenge_id=103, completed=False),
        ]
        test_session.add_all(challenges)
        test_session.commit()
        
        active = test_session.query(Challenge).filter(
            Challenge.user_id == 1,
            Challenge.completed == False
        ).all()
        
        assert len(active) == 2
    
    def test_query_completed_challenges_for_user(self, test_session):
        """Should retrieve completed challenges"""
        challenges = [
            Challenge(user_id=1, challenge_id=101, completed=True),
            Challenge(user_id=1, challenge_id=102, completed=False),
            Challenge(user_id=1, challenge_id=103, completed=True),
        ]
        test_session.add_all(challenges)
        test_session.commit()
        
        completed = test_session.query(Challenge).filter(
            Challenge.user_id == 1,
            Challenge.completed == True
        ).all()
        
        assert len(completed) == 2
    
    def test_calculate_completion_rate(self, test_session):
        """Should calculate user's challenge completion rate"""
        challenges = [
            Challenge(user_id=1, challenge_id=101, completed=True),
            Challenge(user_id=1, challenge_id=102, completed=True),
            Challenge(user_id=1, challenge_id=103, completed=True),
            Challenge(user_id=1, challenge_id=104, completed=False),
            Challenge(user_id=1, challenge_id=105, completed=False),
        ]
        test_session.add_all(challenges)
        test_session.commit()
        
        total = test_session.query(Challenge).filter(Challenge.user_id == 1).count()
        completed_count = test_session.query(Challenge).filter(
            Challenge.user_id == 1,
            Challenge.completed == True
        ).count()
        
        completion_rate = (completed_count / total) * 100
        assert completion_rate == 60.0
    
    def test_challenge_duration(self, test_session):
        """Should calculate challenge duration"""
        started = datetime.utcnow() - timedelta(days=7)
        completed = datetime.utcnow()
        
        challenge = Challenge(user_id=1, challenge_id=101)
        challenge.started_at = started
        challenge.completed = True
        challenge.completed_at = completed
        test_session.add(challenge)
        test_session.commit()
        
        duration = challenge.completed_at - challenge.started_at
        assert duration.days == 7
    
    def test_delete_challenge(self, test_session):
        """Should delete challenge"""
        challenge = Challenge(user_id=1, challenge_id=101)
        test_session.add(challenge)
        test_session.commit()
        challenge_id = challenge.id
        
        test_session.delete(challenge)
        test_session.commit()
        
        deleted = test_session.query(Challenge).filter(Challenge.id == challenge_id).first()
        assert deleted is None


# ============================================================================
# DATABASE UTILITY TESTS
# ============================================================================

class TestDatabaseUtilities:
    """Test database utility functions"""
    
    def test_get_db_generator(self, test_engine):
        """Should yield database session and close it"""
        from database import SessionLocal
        
        gen = get_db()
        db = next(gen)
        
        assert db is not None
        assert hasattr(db, 'query')
        
        # Should close on completion
        try:
            next(gen)
        except StopIteration:
            pass  # Expected behavior
    
    def test_multiple_sessions_independent(self, test_session):
        """Should handle multiple independent sessions"""
        # Create user in first session
        user1 = User(email="session1@example.com", name="Session 1")
        test_session.add(user1)
        test_session.commit()
        
        # Verify in same session
        found = test_session.query(User).filter(User.email == "session1@example.com").first()
        assert found is not None
        assert found.name == "Session 1"


# ============================================================================
# EDGE CASE AND STRESS TESTS
# ============================================================================

class TestEdgeCases:
    """Test edge cases and boundary conditions"""
    
    def test_empty_string_email(self, test_session):
        """Should handle empty string email"""
        user = User(email="", name="Empty Email")
        test_session.add(user)
        test_session.commit()
        
        assert user.email == ""
    
    def test_very_long_email(self, test_session):
        """Should handle very long email"""
        long_email = "a" * 200 + "@example.com"
        user = User(email=long_email, name="Long Email")
        test_session.add(user)
        test_session.commit()
        
        assert user.email == long_email
    
    def test_very_long_name(self, test_session):
        """Should handle very long name"""
        long_name = "Name" * 100
        user = User(email="longname@example.com", name=long_name)
        test_session.add(user)
        test_session.commit()
        
        assert user.name == long_name
    
    def test_unicode_characters_in_name(self, test_session):
        """Should handle Unicode characters"""
        user = User(email="unicode@example.com", name="测试用户 🌍")
        test_session.add(user)
        test_session.commit()
        
        assert user.name == "测试用户 🌍"
    
    def test_sql_injection_attempt(self, test_session):
        """Should be safe from SQL injection"""
        malicious_email = "test@example.com'; DROP TABLE users; --"
        user = User(email=malicious_email, name="Hacker")
        test_session.add(user)
        test_session.commit()
        
        # Table should still exist and user should be stored safely
        all_users = test_session.query(User).all()
        assert len(all_users) == 1
        assert all_users[0].email == malicious_email
    
    def test_bulk_insert_performance(self, test_session):
        """Should handle bulk inserts efficiently"""
        import time
        
        users = [
            User(email=f"bulk{i}@example.com", name=f"Bulk User {i}")
            for i in range(1000)
        ]
        
        start = time.time()
        test_session.add_all(users)
        test_session.commit()
        duration = time.time() - start
        
        # Should complete in reasonable time
        assert duration < 5.0  # 5 seconds max for 1000 inserts
        
        count = test_session.query(User).count()
        assert count == 1000
    
    def test_float_precision_in_impact_records(self, test_session):
        """Should maintain float precision"""
        record = ImpactRecord(
            user_id=1,
            carbon=123.456789,
            water=9876.543210,
            score=87.654321
        )
        test_session.add(record)
        test_session.commit()
        
        retrieved = test_session.query(ImpactRecord).filter(ImpactRecord.id == record.id).first()
        assert abs(retrieved.carbon - 123.456789) < 0.000001
        assert abs(retrieved.water - 9876.543210) < 0.000001


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
