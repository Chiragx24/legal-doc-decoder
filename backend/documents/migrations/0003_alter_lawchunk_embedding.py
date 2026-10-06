from django.db import migrations
from pgvector.django import VectorField


class Migration(migrations.Migration):

    dependencies = [
        ('documents', '0002_enable_pgvector'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='lawchunk',
            name='embedding',
        ),
        migrations.AddField(
            model_name='lawchunk',
            name='embedding',
            field=VectorField(dimensions=384, null=True, blank=True),
        ),
    ]