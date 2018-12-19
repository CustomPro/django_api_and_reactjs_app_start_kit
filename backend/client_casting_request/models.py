from django.db import models

from datetime import datetime, timedelta
from client.models import Client
from authentication.models import User

STATUS_CHOICES = (
    ('Draft', 'Draft'),
    ('Requested', 'Requested'),
    ('Reviewing', 'Reviewing'),
    ('In Progress', 'In Progress'),
    ('Accepted', 'Accepted'),
    ('Declined', 'Declined'),
    ('Canceled', 'Canceled'),
)




class ClientCastingRequest(models.Model):
    # Relation with user
    client = models.ForeignKey(Client, related_name='client_casting_requests', on_delete=models.CASCADE)
    # general info
    casting_request_name = models.CharField(blank=False, default='', max_length=100)
    ship_name = models.CharField(blank=False, default='', max_length=100)
    employment_start_date = models.DateTimeField(blank=False)
    employment_end_date = models.DateTimeField(blank=False)
    talent_join_date = models.DateTimeField(blank=False)
    rehearsal_start_date = models.DateTimeField(blank=False)
    rehearsal_end_date = models.DateTimeField(blank=False)
    performance_start_date = models.DateTimeField(blank=False)
    performance_end_date = models.DateTimeField(blank=False)
    visa_requirements = models.TextField(blank=False, default='')
    comments = models.TextField(blank=False, default='')
    status = models.CharField(choices=STATUS_CHOICES, default='Draft', max_length=10)
    saved = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        """
        Returns a string representation of this `ClientCastingRequest`.
        This string is used when a `ClientCastingRequest` is printed in the console.
        """
        return self.client.user.username + '(' + self.client.user.email + '), ' + 'ship: ' + self.ship_name + ', ' +    'casting_request: ' + self.casting_request_name

    class Meta:
        db_table = "client_casting_request"
        ordering = ('id', 'client', 'created')
        managed = True
