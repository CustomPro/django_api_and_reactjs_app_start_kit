# -*- coding: utf-8 -*-
# Generated by Django 1.11.4 on 2018-07-10 15:49
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0002_auto_20180710_1549'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='user',
            options={'managed': True},
        ),
    ]
